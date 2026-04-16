class NaturalLanguageResponder:

    @staticmethod
    def respond_all_nodes(result):
        if not result:
            return "No nodes found in the database."
        return f"There are {result[0]['count']} nodes in total."

    @staticmethod
    def respond_count(label, result):
        if not result:
            return f"No nodes found for label '{label}'."
        return f"There are {result[0]['count']} nodes labeled '{label}'."

    @staticmethod
    def respond_relationships(result):
        if not result:
            return "No relationships found."
        response = "Relationships in the graph:\n"
        for r in result:
            response += f"- {r['relationship']}: {r['count']} occurrences\n"
        return response

    @staticmethod
    def respond_neighbors(node, result):
        if not result:
            return f"No connections found for '{node}'."
        neighbors = [r["neighbor"] for r in result if r.get("neighbor")]
        return f"{node} is connected to: {', '.join(neighbors)}"

    @staticmethod
    def respond_path(node1, node2, result):
        if not result:
            return f"No path found between {node1} and {node2}."
        return f"There exists a connection path between {node1} and {node2}."

    @staticmethod
    def respond_generic(result):
        return str(result)

    @staticmethod
    def respond_total_relationships(result):
        if not result:
            return "No relationships found in the database."
        return f"There are {result[0]['count']} relationships in total."

    @staticmethod
    def respond_most_connected_table(result):
        if not result or not result[0].get('table'):
            return "Could not determine the most connected table."
        return f"The most connected table is '{result[0]['table']}' with {result[0]['connections']} connections."

    @staticmethod
    def respond_isolated_tables(result):
        if not result:
            return "No isolated tables found."
        tables = [str(r.get('table')) for r in result if r.get('table')]
        return f"Isolated tables: {', '.join(tables)}"

    @staticmethod
    def respond_relationship_chains(result):
        if not result:
            return "No relationship chains found."
        response = "Relationship Chains:\n"
        for i, r in enumerate(result):
            chain_str = " -> ".join([str(c) for c in r.get('chain', [])])
            response += f"{i+1}. {chain_str}\n"
        return response

    @staticmethod
    def respond_dependency_depth(result):
        if not result:
            return "Could not determine dependency depth."
        return f"The maximum dependency depth in the graph is {result[0]['depth']}."

    @staticmethod
    def respond_schema_complexity(result):
        if not result:
            return "Could not determine schema complexity."
        comp = result[0]
        return f"Schema Complexity Ratio (edges/nodes): {comp['complexity']:.2f} ({comp['rel_count']} relationships / {comp['node_count']} nodes)"

    @staticmethod
    def respond_repeated_foreign_keys(result):
        if not result:
            return "No repeated foreign keys found."
        response = "Repeated Foreign Keys:\n"
        for r in result:
            response += f"- Source: {r.get('source')}, Target: {r.get('target')}, Type: {r.get('rel_type')}, Count: {r.get('count')}\n"
        return response

    @staticmethod
    def respond_clusters_of_tables(result):
        if not result:
            return "No table clusters found."
        response = "Table Clusters (Neighborhoods):\n"
        for r in result:
            cluster_str = ", ".join([str(c) for c in r.get('cluster', [])])
            response += f"- {r.get('table')} is clustered with: [{cluster_str}]\n"
        return response

    @staticmethod
    def respond_root_tables(result):
        if not result:
            return "No root tables found."
        tables = [str(r.get('table')) for r in result if r.get('table')]
        return f"Root tables (only outgoing dependencies): {', '.join(tables)}"