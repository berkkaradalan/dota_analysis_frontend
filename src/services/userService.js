// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = process.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
console.log(BASE_URL)

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
  },

  async getMatchDetails(matchId, steamId) {
    const response = await fetch(`${BASE_URL}/match/detailed/${matchId}?steam_id=${steamId}`);
    const data = await response.json();
    console.log('Match details response:', data); // Debug log
    return data;
  },

  async getItemDetails(itemId) {
    const response = await fetch(`${BASE_URL}/game/item/${itemId}`);
    return response.json();
  },

  async getAbilityDetails(abilityId) {
    const response = await fetch(`${BASE_URL}/game/ability/${abilityId}`);
    return response.json();
  }
}; 