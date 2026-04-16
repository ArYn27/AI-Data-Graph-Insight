import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

uri = os.getenv("NEO4J_URI")
username = os.getenv("NEO4J_USERNAME")
password = os.getenv("NEO4J_PASSWORD")
database = os.getenv("NEO4J_DATABASE", "neo4j")

try:
    driver = GraphDatabase.driver(uri, auth=(username, password))
    with driver.session(database=database) as session:
        result = session.run("CALL apoc.meta.schema()")
        print([r.data() for r in result])
except Exception as e:
    print(f"APOC failed: {e}")
    with driver.session(database=database) as session:
        result = session.run("CALL db.schema.visualization()")
        for record in result:
            print("Nodes:", record["nodes"])
            print("Rels:", record["relationships"])
