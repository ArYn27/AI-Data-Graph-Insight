class GraphQueryEngine:
    def __init__(self, connector, database):
        self.connector = connector
        self.database = database

    def count_nodes_by_label(self, label):
        query = f"""
        MATCH (n:{label})
        RETURN COUNT(n) AS count
        """
        return self.connector.run_query(query, database=self.database)

    def get_all_nodes(self):
        query = "MATCH (n) RETURN labels(n) AS labels, COUNT(n) AS count"
        return self.connector.run_query(query, database=self.database)

    def get_relationships(self):
        query = """
        MATCH (a)-[r]->(b)
        RETURN type(r) AS relationship, COUNT(*) AS count
        """
        return self.connector.run_query(query, database=self.database)

    def find_connections(self, node1, node2):
        query = """
        MATCH p = shortestPath((a {name:$node1})-[*]-(b {name:$node2}))
        RETURN p
        """
        return self.connector.run_query(query, {"node1": node1, "node2": node2}, self.database)

    def get_neighbors(self, node):
        query = """
        MATCH (a {name:$node})--(b)
        RETURN b.name AS neighbor
        """
        return self.connector.run_query(query, {"node": node}, self.database)

    def run_custom_query(self, query):
        return self.connector.run_query(query, database=self.database)