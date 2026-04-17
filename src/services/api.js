import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Fetch Neo4j schema string
  getSchema: async () => {
    const response = await api.get('/api/schema');
    return response.data;
  },

  // Submit query for Cypher translation and execution
  submitQuery: async (question) => {
    const response = await api.post('/api/query', { question });
    return response.data;
  },

  // Extract schema from SQL URI
  extractSQLSchema: async (uri) => {
    const response = await api.post('/api/extract_sql_schema', { uri });
    return response.data;
  },

  // Build graph from schema mapping
  buildGraph: async (tables, relationships) => {
    const response = await api.post('/api/build_graph', { tables, relationships });
    return response.data;
  },

  // Helper for direct Cypher/SQL execution (if needed for Query Runner)
  // Note: Backend might need an endpoint for this if not using LLM for everything
  runRawQuery: async (query) => {
    // For now, we utilize the submitQuery endpoint but we can add a direct one if necessary
    // In this specific backend, we might need to add /api/raw_query
    const response = await api.post('/api/query', { question: `EXECUTE QUERY: ${query}` });
    return response.data;
  }
};

export default api;
