const BASE_URL = 'http://localhost:8000'; // adjust this to your FastAPI server URL

export const userService = {
  async getUserInfo(steamId) {
    const response = await fetch(`${BASE_URL}/user/${steamId}`);
    return response.json();
  },

  async getWinLose(steamId) {
    const response = await fetch(`${BASE_URL}/user/winlose/${steamId}`);
    return response.json();
  },

  getMatches: async (steamId, limit = 10, page = 1) => {
    const response = await fetch(`${BASE_URL}/match/${steamId}?limit=${limit}&page=${page}`);
    return response.json();
  },

  async getHeroDetails(heroId) {
    const response = await fetch(`${BASE_URL}/hero/${heroId}`);
    return response.json();
  },

  async getFavoriteHeroes(steamId) {
    const response = await fetch(`${BASE_URL}/hero/favorites/${steamId}`);
    return response.json();
  }
}; 