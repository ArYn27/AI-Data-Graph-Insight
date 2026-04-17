from config import *
from connector import Neo4jConnector
from query_engine import GraphQueryEngine

connector = Neo4jConnector(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
engine = GraphQueryEngine(connector, NEO4J_DATABASE)
print("SCHEMA =>", engine.get_schema_string())
connector.close()
