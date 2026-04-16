class NaturalLanguageResponder:

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