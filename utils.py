def classify_question(question):
    q = question.lower()

    if "how many" in q and "node" in q:
        return "count_nodes"
    elif "relationships" in q:
        return "relationships"
    elif "connected to" in q or "neighbors" in q:
        return "neighbors"
    elif "connection between" in q or "path between" in q:
        return "path"
    elif "custom" in q:
        return "custom"

    return "unknown"