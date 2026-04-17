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

    def count_all_nodes(self):
        query = """
        MATCH (n)
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

    def get_total_relationships(self):
        query = """
        MATCH ()-[r]->()
        RETURN count(r) AS count
        """
        return self.connector.run_query(query, database=self.database)

    def get_most_connected_table(self):
        query = """
        MATCH (n)-[r]->()
        RETURN coalesce(n.name, n.id, id(n)) AS table, count(r) AS connections
        ORDER BY connections DESC LIMIT 1
        """
        return self.connector.run_query(query, database=self.database)

    def get_isolated_tables(self):
        query = """
        MATCH (n)
        WHERE NOT (n)--()
        RETURN coalesce(n.name, n.id, id(n)) AS table
        """
        return self.connector.run_query(query, database=self.database)

    def get_relationship_chains(self):
        query = """
        MATCH p=()-[*2..5]->()
        RETURN [x IN nodes(p) | coalesce(x.name, x.id, id(x))] AS chain
        LIMIT 5
        """
        return self.connector.run_query(query, database=self.database)

    def get_dependency_depth(self):
        query = """
        MATCH p=(n)-[*]->(m)
        RETURN max(length(p)) AS depth
        """
        return self.connector.run_query(query, database=self.database)

    def get_schema_complexity(self):
        query = """
        MATCH (n) WITH count(n) AS node_count
        MATCH ()-[r]->()
        RETURN node_count, count(r) AS rel_count, case when node_count > 0 then toFloat(count(r))/node_count else 0.0 end AS complexity
        """
        return self.connector.run_query(query, database=self.database)

    def get_repeated_foreign_keys(self):
        query = """
        MATCH (a)-[r]->(b)
        WITH a, b, type(r) AS rel_type, count(r) AS count
        WHERE count > 1
        RETURN coalesce(a.name, a.id, id(a)) AS source, coalesce(b.name, b.id, id(b)) AS target, rel_type, count
        """
        return self.connector.run_query(query, database=self.database)

    def get_clusters_of_tables(self):
        query = """
        MATCH (n)
        OPTIONAL MATCH (n)-[]-(m)
        RETURN coalesce(n.name, n.id, id(n)) AS table, collect(coalesce(m.name, m.id, id(m))) AS cluster
        LIMIT 10
        """
        return self.connector.run_query(query, database=self.database)

    def get_root_tables(self):
        query = """
        MATCH (n)
        WHERE NOT ()-->(n) AND (n)-->()
        RETURN coalesce(n.name, n.id, id(n)) AS table
        """
        return self.connector.run_query(query, database=self.database)

    def get_schema_string(self):
        schema_parts = []
        
        # 1. Try APOC Meta Schema
        try:
            query = "CALL apoc.meta.schema()"
            result = self.connector.run_query(query, database=self.database)
            if result:
                schema_parts.append(f"APOC Schema: {str(result)}")
        except:
            pass
        
        # 2. Try DB Schema Visualization
        try:
            query = "CALL db.schema.visualization()"
            result = self.connector.run_query(query, database=self.database)
            if result:
                schema_parts.append(f"Database Visual Schema: {str(result)}")
        except:
            pass

        # 3. Manual Fallback (Always works in standard Neo4j/Aura)
        if not schema_parts:
            try:
                # Get labels
                labels_res = self.connector.run_query("CALL db.labels()", database=self.database)
                labels = [r.get('label', r.get('name')) for r in labels_res] if labels_res else []
                
                # Get relationship types
                rels_res = self.connector.run_query("CALL db.relationshipTypes()", database=self.database)
                rels = [r.get('relationshipType', r.get('name')) for r in rels_res] if rels_res else []
                
                schema_parts.append(f"Node Labels: {', '.join(filter(None, labels))}")
                schema_parts.append(f"Relationship Types: {', '.join(filter(None, rels))}")
            except Exception as e:
                return f"Schema unavailable. Error: {str(e)}"
        
        return "\n".join(schema_parts) if schema_parts else "Schema is empty."