import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import '../styles/FavoriteHeroes.css';

function FavoriteHeroes({ steamId }) {
  const [favoriteHeroes, setFavoriteHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteHeroes = async () => {
      try {
        const response = await userService.getFavoriteHeroes(steamId);
        if (response.error) throw new Error(response.error);

        const heroesWithDetails = await Promise.all(
          response.message.map(async (hero) => {
            const heroDetails = await userService.getHeroDetails(hero.HeroID);
            return {
              ...hero,
              details: heroDetails.message
            };
          })
        );

        setFavoriteHeroes(heroesWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (steamId) {
      fetchFavoriteHeroes();
    }
  }, [steamId]);

  const formatLastPlayed = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading favorite heroes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="favorite-heroes">
      <h2>Most Played Heroes</h2>
      <div className="favorite-heroes-grid">
        {favoriteHeroes.map((hero) => (
          <div key={hero.HeroID} className="favorite-hero-card">
            <img 
              src={hero.details?.HeroImageURL} 
              alt={hero.details?.HeroName} 
              className="hero-avatar"
            />
            <div className="hero-info">
              <h3>{hero.details?.HeroName}</h3>
              <div className="hero-stats">
                <span>{hero.Games} games</span>
                <span>{((hero.GamesWon / hero.Games) * 100).toFixed(1)}% WR</span>
                <span>Last: {formatLastPlayed(hero.LastPlayed)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteHeroes; 