import { api } from ".";

const FetchApi = {
  
  loginUser: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  logoutUser: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  allBreedNames: async () => {
    try {
      const response = await api.get('/dogs/breeds');
      return response;
    } catch (error) {
      console.error("Error fetching dog breeds:", error.message);
      throw new Error("Failed to fetch dog breeds. Please try again.");
    }
  },

  searchDogs: async (params) => {
    try {
      const response = await api.get('/dogs/search', { params });
      return response;
    } catch (error) {
      console.error("Error fetching dogs:", error.message);
      throw new Error("Failed to fetch dogs. Please try again.");
    }
  },

  fetchDogsByIds: async (dogIds) => {
    try {
      const response = await api.post('/dogs', dogIds);
      return response;
    } catch (error) {
      console.error("Error fetching dogs:", error.message);
      throw new Error("Failed to fetch dogs. Please try again.");
    }
  },

  matchDog: async (dogIds) => {
    try {
      const response = await api.post('/dogs/match', dogIds);
      return response;
    } catch (error) {
      console.error("Error fetching matching dogs:", error.message);
      throw new Error("Failed to fetch matching dogs. Please try again.");
    }
  }
};

export default FetchApi;
