import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import '../styles/MatchCard.css';

function MatchCard({ match }) {
  const [heroDetails, setHeroDetails] = useState(null);

  useEffect(() => {
    const fetchHeroDetails = async () => {
      try {
        const data = await userService.getHeroDetails(match.HeroID);
        setHeroDetails(data.message);
      } catch (error) {
        console.error('Error fetching hero details:', error);
      }
    };

    fetchHeroDetails();
  }, [match.HeroID]);

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
        <p><strong>Match ID:</strong> {match.MatchID}</p>
        <p><strong>K/D/A:</strong> {match.Kills}/{match.Deaths}/{match.Assists}</p>
        <p><strong>Duration:</strong> {Math.floor(match.Duration / 60)} min</p>
        {heroDetails && (
          <p><strong>Role:</strong> {heroDetails.HeroRoles.join(', ')}</p>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
