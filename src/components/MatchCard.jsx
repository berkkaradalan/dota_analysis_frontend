import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import '../styles/MatchCard.css';

function MatchCard({ match }) {
  const [heroDetails, setHeroDetails] = useState(null);
  
  // Debug log the incoming match data
  console.log('Match data in MatchCard:', match);

  useEffect(() => {
    const fetchHeroDetails = async () => {
      try {
        const heroId = match.HeroID || match.hero_id;
        console.log('Attempting to fetch hero details with ID:', heroId);
        
        if (!heroId) {
          console.error('No hero ID found in match data:', match);
          return;
        }
        
        const data = await userService.getHeroDetails(heroId);
        console.log('Hero details response:', data);
        
        if (data && data.message) {
          setHeroDetails(data.message);
        } else {
          console.error('Invalid hero details response:', data);
        }
      } catch (error) {
        console.error('Error fetching hero details:', error);
      }
    };

    fetchHeroDetails();
  }, [match]);

  // Handle both data formats
  const matchId = match.MatchID || match.match_id || 'N/A';
  const kills = match.Kills || match.kills || 0;
  const deaths = match.Deaths || match.deaths || 0;
  const assists = match.Assists || match.assists || 0;
  const duration = match.Duration || match.duration;
  const durationInMinutes = duration ? Math.floor(Number(duration) / 60) : 'N/A';

  return (
    <div className="match-card">
      <div className="match-card-header">
        {heroDetails && (
          <>
            <img 
              src={heroDetails.HeroImageURL} 
              alt={heroDetails.HeroName} 
              className="hero-image"
            />
            <h3>{heroDetails.HeroName}</h3>
          </>
        )}
      </div>
      <div className="match-card-details">
        <p><strong>Match ID:</strong> {matchId}</p>
        <p><strong>K/D/A:</strong> {kills}/{deaths}/{assists}</p>
        <p><strong>Duration:</strong> {durationInMinutes} min</p>
        {heroDetails && (
          <p><strong>Role:</strong> {heroDetails.HeroRoles?.join(', ') || 'N/A'}</p>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
