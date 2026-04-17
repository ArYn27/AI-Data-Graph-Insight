from neo4j import GraphDatabase
import logging

class Neo4jConnector:
    def __init__(self, uri, username, password):
        self.driver = GraphDatabase.driver(uri, auth=(username, password))

    def close(self):
        self.driver.close()

    def run_query(self, query, params=None, database=None):
        try:
            with self.driver.session(database=database) as session:
                result = session.run(query, params or {})
                return [record.data() for record in result]
        except Exception as e:
            logging.error(f"Query failed: {e}")
            raise e