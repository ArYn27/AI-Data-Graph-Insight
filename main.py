from connector import Neo4jConnector
from query_engine import GraphQueryEngine
from responder import NaturalLanguageResponder
from config import *
from utils import classify_question
import logging

logging.basicConfig(level=logging.INFO)

def main():
    connector = Neo4jConnector(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
    engine = GraphQueryEngine(connector, NEO4J_DATABASE)

    print("🔍 Graph Insight Engine Ready. Type 'exit' to quit.\n")

    while True:
        question = input("Ask a question: ")

        if question.lower() == "exit":
            break

        intent = classify_question(question)

        try:
            if intent == "count_nodes":
                label = input("Enter node label: ")
                result = engine.count_nodes_by_label(label)
                print(NaturalLanguageResponder.respond_count(label, result))

            elif intent == "relationships":
                result = engine.get_relationships()
                print(NaturalLanguageResponder.respond_relationships(result))

            elif intent == "neighbors":
                node = input("Enter node name: ")
                result = engine.get_neighbors(node)
                print(NaturalLanguageResponder.respond_neighbors(node, result))

            elif intent == "path":
                node1 = input("Node 1: ")
                node2 = input("Node 2: ")
                result = engine.find_connections(node1, node2)
                print(NaturalLanguageResponder.respond_path(node1, node2, result))

            elif intent == "custom":
                query = input("Enter Cypher query: ")
                result = engine.run_custom_query(query)
                print(NaturalLanguageResponder.respond_generic(result))

            else:
                print("Sorry, I didn't understand that question.")

        except Exception as e:
            logging.error(f"Error: {e}")

    connector.close()

if __name__ == "__main__":
    main()