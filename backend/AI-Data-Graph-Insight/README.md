# 🚀 AI-Data-Graph-Insight

An intelligent, full-stack graph analysis engine. This project transforms raw relational data into meaningful graph insights using a hybrid **Text-to-Cypher AI engine** and an automated **Relational-to-Graph ingestion pipeline**.

Built with **FastAPI**, **Neo4j**, and powered by state-of-the-art LLMs (**Groq Llama 3.3**, **Gemini 2.5 Flash**, or **xAI Grok**).

---

## 🌟 Key Capabilities

### 1. 🧠 Text-to-Cypher AI Engine
Ask questions about your data in plain English. The engine dynamically:
- Discovers your database schema.
- Translates natural language into optimized **Neo4j 5+ Cypher**.
- Executes the query and provides a conversational summary of the results.

### 2. 🔌 SQL-to-Graph Ingestion Pipeline
Bridge the gap between relational and graph databases.
- Connect any SQL database (PostgreSQL, MySQL, etc.) via SQLAlchemy.
- Automatically extract tables, columns, and foreign-key relationships.
- Instantly reconstruct the relational structure as a high-fidelity graph in Neo4j.

### 3. 🌐 RESTful API for Frontend Integration
Perfect for React/Next.js/Vue dashboards.
- Fully CORS-enabled.
- Auto-generated Swagger documentation at `/docs`.
- Clean JSON responses for raw graph data and natural language answers.

---

## 🛠 Prerequisites

- **Python 3.10+**
- **Neo4j 5+** (Local or AuraDB)
- **API Key** (Groq, Gemini, or xAI) OR local **Ollama** setup for AI features.

---

## 📦 Installation & Setup

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd AI-Data-Graph-Insight
   ```

2. **Initialize Environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Settings (`.env`):**
   ```env
   # Neo4j Connection
   NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your-password
   NEO4J_DATABASE=neo4j

   # Choose your AI Provider (Prioritized Order)
   GROQ_API_KEY=your_groq_key_here      # Uses Llama 3.3 70B (Recommended)
   GEMINI_API_KEY=your_gemini_key_here  # Uses Gemini 2.5 Flash
   XAI_API_KEY=your_xai_key_here        # Uses Grok 2
   USE_LOCAL_OLLAMA=true                # Fallback to local Llama3
   ```

---

## 🚀 Execution Guide

### Option 1: The Modern Web API (Recommended)
This starts the FastAPI server for your React frontend to connect to.
```bash
uvicorn api:app --reload --port 8000
```
- **Swagger Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Main Analysis Endpoint:** `POST /api/query`

### Option 2: The Terminal REPL
For quick data exploration directly in your shell.
```bash
python main.py
```

---

## 📚 API Reference (For React Developers)

### Analysis Queries
```javascript
// Ask the AI anything about your graph
const getInsights = async (question) => {
  const res = await fetch("http://127.0.0.1:8000/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question })
  });
  return await res.json();
};
```

### SQL Ingestion Pipeline
1. **Extract Schema:** `POST /api/extract_sql_schema` with `{ "uri": "postgresql://..." }`.
2. **Build Graph:** `POST /api/build_graph` with the resulting JSON.

---

## 🏗 Project Architecture

- **`api.py`**: The FastAPI application and REST endpoints.
- **`llm_agent.py`**: The AI brains (Text-to-Cypher & Summarization logic).
- **`sql_extractor.py`**: Relational database inspection via SQLAlchemy.
- **`graph_builder.py`**: Neo4j population logic.
- **`query_engine.py`**: Neo4j execution handler & schema discovery.
- **`main.py`**: Original CLI interactive loop.

---

## 📝 Modern Cypher Standards
This engine utilizes **Neo4j 5+** standards, prioritizing:
- `COUNT { ... }` blocks instead of deprecated `size()` on patterns.
- Explicit `WITH` clauses for complex aggregations.
- Dynamic schema mapping via `apoc.meta.schema`.
