from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from connector import Neo4jConnector
from query_engine import GraphQueryEngine
from llm_agent import LLMAgent
from config import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE
from sql_extractor import extract_schema
from graph_builder import GraphBuilder
import logging

logging.basicConfig(level=logging.INFO)

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

@app.post("/api/extract_sql_schema")
def api_extract_sql_schema(request: SQLSchemaRequest):
    """Integrates extraction logic to pull schema from any SQL URIs."""
    try:
        schema = extract_schema(request.uri)
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
