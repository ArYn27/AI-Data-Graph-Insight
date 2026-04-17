def classify_question(question):
    q = question.lower().strip()

    if "total" in q and "relationships" in q or "number of relationships" in q:
        return "total_relationships"
    elif q in ["how many nodes are there?", "how many nodes are there", "how many nodes"] or "count all nodes" in q or "number of nodes" in q:
        return "all_nodes"
    elif "how many" in q and "node" in q:
        return "count_nodes"
    elif "most connected table" in q:
        return "most_connected_table"
    elif "isolated tables" in q:
        return "isolated_tables"
    elif "relationship chains" in q:
        return "relationship_chains"
    elif "dependency depth" in q:
        return "dependency_depth"
    elif "schema complexity" in q:
        return "schema_complexity"
    elif "repeated foreign keys" in q:
        return "repeated_foreign_keys"
    elif "clusters of tables" in q:
        return "clusters_of_tables"
    elif "root tables" in q:
        return "root_tables"
    elif "relationships" in q:
        return "relationships"
    elif "connected to" in q or "neighbors" in q:
        return "neighbors"
    elif "connection between" in q or "path between" in q:
        return "path"
    elif "custom" in q:
        return "custom"

    return "unknown"