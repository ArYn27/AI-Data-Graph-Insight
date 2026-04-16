from connector import Neo4jConnector
from config import *

def test_connection():
    connector = Neo4jConnector(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)

    result = connector.run_query("RETURN 1 AS test", database=NEO4J_DATABASE)

    if result:
        print("✅ Connection successful:", result)
    else:
        print("❌ Connection failed")

    connector.close()

if __name__ == "__main__":
    test_connection()