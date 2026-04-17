import json
import urllib.request
import urllib.error
import logging
from config import XAI_API_KEY, GEMINI_API_KEY, GROQ_API_KEY, USE_LOCAL_OLLAMA

class LLMAgent:
    def __init__(self):
        self.api_key = None
        self.endpoint = None
        self.model = None
        self.provider_name = None

        if GROQ_API_KEY and GROQ_API_KEY != "<your_groq_api_token_here>":
            self.api_key = GROQ_API_KEY
            self.endpoint = "https://api.groq.com/openai/v1/chat/completions"
            self.model = "llama-3.3-70b-versatile"
            self.provider_name = "Groq (Llama 3.3 70B)"
        elif GEMINI_API_KEY and GEMINI_API_KEY != "<your_gemini_api_token_here>":
            self.api_key = GEMINI_API_KEY.strip().strip('"').strip("'")
            self.endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
            self.model = "gemini-1.5-flash"
            self.provider_name = "Google Gemini"
        elif XAI_API_KEY and XAI_API_KEY != "<your_xai_grok_token_here>":
            self.api_key = XAI_API_KEY
            self.endpoint = "https://api.x.ai/v1/chat/completions"
            self.model = "grok-2-latest"
            self.provider_name = "xAI Grok"
        elif USE_LOCAL_OLLAMA:
            self.api_key = "ollama"
            self.endpoint = "http://localhost:11434/v1/chat/completions"
            self.model = "llama3"
            self.provider_name = "Local Ollama"

        if self.provider_name:
            logging.info(f"Initialized LLM Agent with {self.provider_name}.")
        else:
            logging.info("No LLM API keys found. Defaulting to standard mode.")

    def is_active(self):
        return self.endpoint is not None

    def _call_llm(self, system_prompt, user_prompt, temperature=0.0, max_tokens=2048):
        if not self.is_active():
            logging.error("No active LLM configuration.")
            return None

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }

        data = {
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "model": self.model,
            "stream": False,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        req = urllib.request.Request(
            self.endpoint,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                result_bytes = response.read()
                result_json = json.loads(result_bytes.decode("utf-8"))
                return result_json['choices'][0]['message']['content'].strip()
        except urllib.error.URLError as e:
            error_data = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
            logging.error(f"Error calling LLM API ({self.provider_name}): {error_data}")
            return None

    def generate_cypher(self, question, schema_str):
        system_prompt = (
            "You are an expert Neo4j developer. I will provide you with a database schema and a user question, "
            "and you must respond with ONLY the raw Cypher query to answer that question. "
            "Do not wrap it in markdown block quotes (e.g. ```cypher ... ```). Just output the pure query text. "
            "It must be executable. Return nothing else. "
            "IMPORTANT Neo4j 5+ RULES: \n"
            "1. Do NOT use size() for pattern expressions. Use COUNT {(a)-[:REL]->()} instead.\n"
            "2. Avoid mixing aggregation functions like COUNT() with implicit grouping expressions in RETURN. "
            "Always extract grouping and aggregations into a preceding WITH clause before calculating math. \n"
            "3. Do NOT use `CALL db.schema()`. It does not exist. Use `CALL db.labels()` instead. \n"
            "4. UNION ALL REQUIRES SAME COLUMN NAMES. If using UNION, ensure all branches have identical return keys.\n"
            "Example for multiple counts: `MATCH (n) RETURN 'Nodes' as type, count(n) as count UNION ALL MATCH ()-[r]->() RETURN 'Relationships' as type, count(r) as count`."
        )
        user_prompt = f"Schema:\n{schema_str}\n\nQuestion:\n{question}"
        
        response = self._call_llm(system_prompt, user_prompt, temperature=0.0)
        
        # Clean up in case LLM adds markdown blocks despite instructions
        if response:
            if response.startswith("```cypher"):
                response = response[len("```cypher"):].strip()
            if response.startswith("```sql"):
                response = response[len("```sql"):].strip()
            if response.startswith("```"):
                response = response[len("```"):].strip()
            if response.endswith("```"):
                response = response[:-len("```")].strip()
            
        return response

    def generate_response(self, question, query, result):
        system_prompt = (
            "You are a helpful data analyst. You are provided with a user's question, the database query used, "
            "and the raw JSON results returned by the database. Provide a clear, natural language answer "
            "to the user's question using this data."
        )
        user_prompt = (
            f"Question: {question}\n\n"
            f"Query Used: {query}\n\n"
            f"Query Results:\n{json.dumps(result, indent=2)}"
        )
        
        return self._call_llm(system_prompt, user_prompt, temperature=0.3)

    def generate_table_documentation(self, table_name, table_schema, pertinent_relationships):
        system_prompt = (
            "You are a Senior Technical Architect and Database Documentarian. "
            "Your task is to analyze the provided SQL table schema and generate professional documentation. "
            "Output MUST be a valid JSON object (no array, just the object for this table) containing: \n"
            "1. 'overview': A 2-3 sentence description of the table's purpose.\n"
            "2. 'schema_summary': A brief object with 'total_fields', 'pk', 'fk', and 'relationships_count'.\n"
            "3. 'fields': An array of objects each with 'name', 'type', 'nullable', 'key_type', and 'description'.\n"
            "4. 'relationships': An array of strings describing FK relationships.\n\n"
            "Respond ONLY with the JSON object. No conversational filler or markdown markers."
        )
        user_prompt = (
            f"Table Name: {table_name}\n"
            f"Columns: {json.dumps(table_schema, indent=2)}\n"
            f"Relationships: {json.dumps(pertinent_relationships, indent=2)}"
        )
        
        response = self._call_llm(system_prompt, user_prompt, temperature=0.2, max_tokens=2048)
        
        # Clean up any potential markdown or conversational filler
        if response:
            start_idx = response.find('{')
            end_idx = response.rfind('}')
            if start_idx != -1 and end_idx != -1:
                response = response[start_idx:end_idx + 1].strip()
                
            if response.startswith("```json"):
                response = response[len("```json"):].strip()
            if response.startswith("```"):
                response = response[len("```"):].strip()
            if response.endswith("```"):
                response = response[:-len("```")].strip()
                
        return response
