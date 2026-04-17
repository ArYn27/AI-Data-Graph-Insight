from connector import Neo4jConnector
from query_engine import GraphQueryEngine
from responder import NaturalLanguageResponder
from llm_agent import LLMAgent
from config import *
from utils import classify_question
import logging

logging.basicConfig(level=logging.INFO)

def main():
    connector = Neo4jConnector(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
    engine = GraphQueryEngine(connector, NEO4J_DATABASE)
    llm_agent = LLMAgent()

    if llm_agent.is_active():
        print(f"🔍 Graph Insight Engine Ready (Text-to-Cypher Powered by {llm_agent.provider_name}). Type 'exit' to quit.\n")
    else:
        print("🔍 Graph Insight Engine Ready (Standard Mode: No LLM API Keys found). Type 'exit' to quit.\n")

    while True:
        question = input("Ask a question: ")

        if question.lower() in ["exit", "quit"]:
            break

        try:
            if llm_agent.is_active():
                # Dynamic LLM flow
                print("Fetching schema...")
                schema_str = engine.get_schema_string()
                
                print(f"Generating query with {llm_agent.provider_name}...")
                cypher_query = llm_agent.generate_cypher(question, schema_str)
                
                if cypher_query:
                    print(f"Generated Query: {cypher_query}")
                    result = engine.run_custom_query(cypher_query)
                    
                    if result is not None:
                        print(f"Analyzing results with {llm_agent.provider_name}...")
                        response = llm_agent.generate_response(question, cypher_query, result)
                        print(f"\n💡 Answer:\n{response}\n")
                        print("-" * 50)
                    else:
                        print("Query execution failed.")
                else:
                    print("Failed to generate Cypher query.")
            else:
                # Fallback to standard classification if no API key is provided
                intent = classify_question(question)
                
                if intent == "all_nodes":
                    result = engine.count_all_nodes()
                    print(NaturalLanguageResponder.respond_all_nodes(result))

                elif intent == "count_nodes":
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

                elif intent == "total_relationships":
                    result = engine.get_total_relationships()
                    print(NaturalLanguageResponder.respond_total_relationships(result))

                elif intent == "most_connected_table":
                    result = engine.get_most_connected_table()
                    print(NaturalLanguageResponder.respond_most_connected_table(result))

                elif intent == "isolated_tables":
                    result = engine.get_isolated_tables()
                    print(NaturalLanguageResponder.respond_isolated_tables(result))

                elif intent == "relationship_chains":
                    result = engine.get_relationship_chains()
                    print(NaturalLanguageResponder.respond_relationship_chains(result))

                elif intent == "dependency_depth":
                    result = engine.get_dependency_depth()
                    print(NaturalLanguageResponder.respond_dependency_depth(result))

                elif intent == "schema_complexity":
                    result = engine.get_schema_complexity()
                    print(NaturalLanguageResponder.respond_schema_complexity(result))

                elif intent == "repeated_foreign_keys":
                    result = engine.get_repeated_foreign_keys()
                    print(NaturalLanguageResponder.respond_repeated_foreign_keys(result))

                elif intent == "clusters_of_tables":
                    result = engine.get_clusters_of_tables()
                    print(NaturalLanguageResponder.respond_clusters_of_tables(result))

                elif intent == "root_tables":
                    result = engine.get_root_tables()
                    print(NaturalLanguageResponder.respond_root_tables(result))

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