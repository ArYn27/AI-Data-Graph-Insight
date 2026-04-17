import logging

class GraphBuilder:
    def __init__(self, connector):
        self.connector = connector

    def populate_from_schema(self, schema: dict):
        """
        Populates Neo4j with tables, columns, and relationships defined in the schema dict.
        """
        with self.connector.driver.session() as session:
            # 1. Create Tables and Columns
            for table in schema.get("tables", []):
                table_name = table["name"]
                
                # Create Table Node
                session.execute_write(self._create_table, table_name)
                
                # Create Column Nodes and link them to Table
                for column_name in table.get("columns", []):
                    session.execute_write(self._create_column, table_name, column_name)
            
            # 2. Create Foreign Key Relationships
            for rel in schema.get("relationships", []):
                session.execute_write(self._create_relationship, rel)

    @staticmethod
    def _create_table(tx, table_name):
        tx.run("MERGE (t:Table {name: $name})", name=table_name)

    @staticmethod
    def _create_column(tx, table_name, column_name):
        tx.run(
            """
            MATCH (t:Table {name: $table})
            MERGE (c:Column {name: $column, table: $table})
            MERGE (t)-[:HAS_COLUMN]->(c)
            """,
            table=table_name,
            column=column_name
        )

    @staticmethod
    def _create_relationship(tx, rel):
        tx.run(
            """
            MATCH (a:Table {name: $from_table})
            MATCH (b:Table {name: $to_table})
            MERGE (a)-[:REFERENCES {
                from_column: $from_column,
                to_column: $to_column
            }]->(b)
            """,
            from_table=rel["from_table"],
            to_table=rel["to_table"],
            from_column=rel["from_column"],
            to_column=rel["to_column"]
        )
