from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from connector import Neo4jConnector
from query_engine import GraphQueryEngine
from llm_agent import LLMAgent
from config import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE
from sql_extractor import extract_schema, fetch_table_rows
from graph_builder import GraphBuilder
import logging
import json
import os
import hashlib
import uuid
from typing import Optional

logging.basicConfig(level=logging.INFO)

# Global configuration state & Persistence
STORAGE_PATH = "storage/connection.json"
USERS_STORAGE_PATH = "storage/users.json"
CURRENT_SQL_URI = None

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_users():
    if not os.path.exists(USERS_STORAGE_PATH):
        return {}
    try:
        with open(USERS_STORAGE_PATH, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    os.makedirs(os.path.dirname(USERS_STORAGE_PATH), exist_ok=True)
    with open(USERS_STORAGE_PATH, 'w') as f:
        json.dump(users, f)

def load_persistence():
    global CURRENT_SQL_URI
    if os.path.exists(STORAGE_PATH):
        try:
            with open(STORAGE_PATH, 'r') as f:
                data = json.load(f)
                CURRENT_SQL_URI = data.get("sql_uri")
                if CURRENT_SQL_URI:
                    logging.info(f"Loaded persistent SQL URI: {CURRENT_SQL_URI[:20]}...")
        except Exception as e:
            logging.error(f"Failed to load persistence: {e}")

def save_persistence(uri):
    os.makedirs(os.path.dirname(STORAGE_PATH), exist_ok=True)
    try:
        with open(STORAGE_PATH, 'w') as f:
            json.dump({"sql_uri": uri}, f)
    except Exception as e:
        logging.error(f"Failed to save persistence: {e}")

# Initialize Backend App
app = FastAPI(title="Graph Insight Engine API", version="1.0")

# Enable CORS for React integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to your React App's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global clients
connector = None
engine = None
llm_agent = None
graph_builder = None

@app.on_event("startup")
def startup_event():
    global connector, engine, llm_agent, graph_builder
    load_persistence()
    connector = Neo4jConnector(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
    engine = GraphQueryEngine(connector, NEO4J_DATABASE)
    llm_agent = LLMAgent()
    graph_builder = GraphBuilder(connector)
    
    if not llm_agent.is_active():
        logging.warning("No LLM API keys found. Text-to-Cypher AI routes will fail.")
    else:
        logging.info(f"API Backend powered by {llm_agent.provider_name}")

@app.on_event("shutdown")
def shutdown_event():
    if connector:
        connector.close()

class QueryRequest(BaseModel):
    question: str

class SQLSchemaRequest(BaseModel):
    uri: str

class BuildGraphRequest(BaseModel):
    tables: list
    relationships: list

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/query")
def submit_query(request: QueryRequest):
    if not llm_agent or not llm_agent.is_active():
        raise HTTPException(status_code=503, detail="No LLM Provider Configured in server (.env)")
    
    question = request.question
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        # Step 1: Fetch Database mapping
        schema_str = engine.get_schema_string()

        # Step 2: Route request to Groq / Gemini / Grok
        cypher_query = llm_agent.generate_cypher(question, schema_str)
        if not cypher_query:
            raise HTTPException(status_code=500, detail="Failed to generate Cypher query.")

        # Step 3: Run generated query
        result = engine.run_custom_query(cypher_query)
        if result is None:
            raise HTTPException(status_code=500, detail="Error executing the Cypher query via Neo4j.")

        # Step 4: Natural Language Output
        response_text = llm_agent.generate_response(question, cypher_query, result)

        return {
            "success": True,
            "question": question,
            "generated_query": cypher_query,
            "answer": response_text,
            "raw_data": result
        }

    except Exception as e:
        logging.error(f"API Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/schema")
def get_database_schema():
    """Returns the literal schema string fetched from Neo4j."""
    try:
        schema_str = engine.get_schema_string()
        return {"schema": schema_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/connection_info")
def get_connection_info():
    """Returns metadata about the currently connected SQL database."""
    global CURRENT_SQL_URI
    if not CURRENT_SQL_URI:
        return {"connected": False}
    
    # Basic dialect extraction
    dialect = "SQL"
    if "://" in CURRENT_SQL_URI:
        dialect = CURRENT_SQL_URI.split("://")[0].capitalize()
    
    # Obfuscate URI (hide credentials)
    obfuscated = CURRENT_SQL_URI
    if "@" in CURRENT_SQL_URI:
        parts = CURRENT_SQL_URI.split("@")
        scheme_auth = parts[0].split("://")
        scheme = scheme_auth[0]
        host_db = parts[1]
        obfuscated = f"{scheme}://***:***@{host_db}"

    return {
        "connected": True,
        "uri": obfuscated,
        "dialect": dialect
    }

@app.get("/api/schema/structured")
def get_structured_database_schema():
    """Returns a structured JSON schema fetched from Neo4j."""
    try:
        schema = engine.get_structured_schema()
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract_sql_schema")
def api_extract_sql_schema(request: SQLSchemaRequest):
    """Integrates extraction logic to pull schema from any SQL URIs."""
    global CURRENT_SQL_URI
    try:
        schema = extract_schema(request.uri)
        CURRENT_SQL_URI = request.uri  # Store for later data fetching
        save_persistence(request.uri)  # Persist across restarts
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL Extraction Error: {str(e)}")

@app.post("/api/build_graph")
def api_build_graph(request: BuildGraphRequest):
    """Integrates graph building logic to populate Neo4j from a schema mapping."""
    try:
        # Pass the request data directly as it now matches the expected schema format
        graph_builder.populate_from_schema(request.model_dump())
        return {"success": True, "message": "Graph populated successfully in Neo4j."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Neo4j Population Error: {str(e)}")

@app.get("/api/table_data/{table_name}")
def get_table_data(table_name: str):
    """Returns sample data rows from the actual SQL table."""
    global CURRENT_SQL_URI
    if not CURRENT_SQL_URI:
        raise HTTPException(status_code=400, detail="No SQL database connected. Please connect a DB first.")
    
    try:
        rows = fetch_table_rows(CURRENT_SQL_URI, table_name)
        return {"table": table_name, "rows": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data Fetch Error: {str(e)}")

DOCS_STORAGE_PATH = "storage/documentation.json"

@app.post("/api/generate_documentation")
def api_generate_documentation():
    global engine, llm_agent
    try:
        # 1. Fetch current structured schema
        schema = engine.get_structured_schema()
        nodes = schema.get("nodes", [])
        relationships = schema.get("relationships", [])
        
        if not nodes:
            raise HTTPException(status_code=400, detail="No schema found to document. Build the graph first.")
        
        logging.info(f"Starting documentation for {len(nodes)} tables.")
        
        # 2. Load existing to avoid redundant calls if possible (optional, but good for stability)
        all_docs = {}
        if os.path.exists(DOCS_STORAGE_PATH):
            try:
                with open(DOCS_STORAGE_PATH, 'r') as f:
                    all_docs = json.load(f)
            except:
                all_docs = {}

        # 3. Document table by table
        for table in nodes:
            table_name = table['name']
            
            # Skip if already documented (or you can force refresh)
            # if table_name in all_docs: continue

            logging.info(f"Documenting table: {table_name}")
            
            # Find relationships where this table is source or target
            pertinent_rels = [
                r for r in relationships 
                if r['source'] == table_name or r['target'] == table_name
            ]
            
            # Call LLM for this specific table
            table_doc_str = llm_agent.generate_table_documentation(
                table_name, 
                table, 
                pertinent_rels
            )
            
            if table_doc_str:
                try:
                    table_doc = json.loads(table_doc_str)
                    all_docs[table_name] = table_doc
                    
                    # Periodic save for safety
                    os.makedirs(os.path.dirname(DOCS_STORAGE_PATH), exist_ok=True)
                    with open(DOCS_STORAGE_PATH, 'w') as f:
                        json.dump(all_docs, f)
                except json.JSONDecodeError as je:
                    logging.error(f"Error parsing JSON for {table_name}: {je}. Raw: {table_doc_str[:100]}")
                    # Continue to next table even if one fails
            else:
                logging.error(f"Failed to get documentation for {table_name}")

        return all_docs
        
    except Exception as e:
        logging.error(f"Documentation generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documentation")
def get_stored_documentation():
    if os.path.exists(DOCS_STORAGE_PATH):
        try:
            with open(DOCS_STORAGE_PATH, 'r') as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading documentation: {e}")
    return {}

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/signup")
def signup(request: SignupRequest):
    users = get_users()
    if request.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users[request.email] = {
        "password": hash_password(request.password),
        "name": request.name,
        "token": str(uuid.uuid4())
    }
    save_users(users)
    return {"success": True, "token": users[request.email]["token"], "user": {"email": request.email, "name": request.name}}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    users = get_users()
    user = users.get(request.email)
    if not user or user["password"] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Refresh token on each login for basic security
    user["token"] = str(uuid.uuid4())
    save_users(users)
    
    return {"success": True, "token": user["token"], "user": {"email": request.email, "name": user["name"]}}

@app.get("/api/auth/me")
def get_me(token: str):
    users = get_users()
    for email, user in users.items():
        if user.get("token") == token:
            return {"email": email, "name": user["name"]}
    raise HTTPException(status_code=401, detail="Invalid or expired session")
