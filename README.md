# InsightGraph AI

Explainable intelligence layer for relational databases.

InsightGraph AI converts relational database schemas into interactive knowledge graphs, enabling developers to quickly understand complex data structures and relationships. By combining graph modeling with explainable AI, the system generates grounded insights without hallucination and visualizes them through an intuitive interface.

---

## Problem

Modern relational databases often lack clear documentation, making it difficult for developers and data teams to understand relationships between tables. Understanding schema structure manually is time-consuming, especially in unfamiliar or legacy systems. Traditional AI tools may generate insights but often lack grounding in real structural relationships, leading to unreliable results.

---

## Solution

InsightGraph AI connects directly to a Neon Postgres database via URI, automatically extracts schema relationships, and converts them into a knowledge graph using Neo4j. Deterministic graph queries generate structural insights, which are then explained using an AI layer grounded strictly in computed results. The final output is visualized through an interactive graph interface using React Flow.

---

## Key Features

- Direct connection to Neon Postgres database via URI
- Automatic schema extraction (tables and relationships)
- Graph-based modeling using Neo4j
- Interactive visualization using React Flow
- Explainable AI insights grounded in real data structure
- Rapid understanding of complex database architectures

---

## System Architecture

Neon Postgres → FastAPI → Neo4j Graph → Insight Engine → React Flow Visualization

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Neo4j
- Python

### Frontend
- React
- React Flow
- Axios

### Database
- Neon Postgres

### AI Layer
- LLM API (for grounded explanations)

---

## Project Structure






---

## Workflow

1. User provides Neon database URI
2. System extracts schema metadata
3. Schema converted into graph structure
4. Graph stored in Neo4j
5. Graph queries generate structural insights
6. AI explains insights without hallucination
7. React Flow visualizes graph interactively

---

## Setup Instructions

### Clone repository

git clone https://github.com/Aryn27/AI-Data-Graph-Insight

cd AI-Data-Graph-Insight

---

### Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

---

### Frontend setup
cd frontend
npm install
npm start


---

## Branch Strategy

Each team member works on a separate branch:

- frontend-graph-ui
- backend-schema-extraction
- backend-neo4j-integration
- backend-insight-engine

Branches are merged into main after feature completion.

---

## Future Improvements

- row-level relationship insights
- query optimization recommendations
- schema improvement suggestions
- data lineage tracking
- advanced graph analytics
- exportable ER diagrams

---

## Team

BitBox 6.0 Project

---

## License

MIT License
