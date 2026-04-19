from sqlalchemy import create_engine, inspect
import logging

def extract_schema(db_uri: str):
    """
    Connects to a SQL database and extracts table names, columns, and foreign key relationships.
    """
    try:
        engine = create_engine(db_uri)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        table_data = []
        for table in tables:
            columns = inspector.get_columns(table)
            col_names = [col['name'] for col in columns]
            table_data.append({
                "name": table,
                "columns": col_names
            })
            
        relationships = []
        for table in tables:
            fks = inspector.get_foreign_keys(table)
            for fk in fks:
                # Assuming simple single-column foreign keys for the basic mapper
                if fk['constrained_columns'] and fk['referred_columns']:
                    relationships.append({
                        "from_table": table,
                        "from_column": fk['constrained_columns'][0],
                        "to_table": fk['referred_table'],
                        "to_column": fk['referred_columns'][0]
                    })
                    
        return {
            "tables": table_data,
            "relationships": relationships
        }
    except Exception as e:
        logging.error(f"Error extracting SQL schema: {e}")
        raise e

def fetch_table_rows(db_uri: str, table_name: str, limit: int = 50, offset: int = 0):
    """
    Fetches rows from a specific SQL table with pagination support.
    """
    try:
        from sqlalchemy import text
        engine = create_engine(db_uri)
        with engine.connect() as connection:
            query = text(f"SELECT * FROM {table_name} LIMIT {limit} OFFSET {offset}")
            result = connection.execute(query)
            rows = []
            for row in result:
                rows.append(row._asdict())
            return rows
    except Exception as e:
        logging.error(f"Error fetching rows from table {table_name}: {e}")
        raise e
