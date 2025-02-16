import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import '../styles/MatchCard.css';
import MatchDetailsModal from './MatchDetailsModal';

function MatchCard({ match, steamId }) {
  const [heroDetails, setHeroDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [notification, setNotification] = useState(null);
  

  useEffect(() => {
    const fetchHeroDetails = async () => {
      try {
        const heroId = match.HeroID || match.hero_id;
        
        if (!heroId) {
          return;
        }
        
        const data = await userService.getHeroDetails(heroId);
        
        if (data && data.message) {
          setHeroDetails(data.message);
        } else {
        }
      } catch (error) {
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

  const handleShowDetails = async () => {
    try {
      setIsLoadingDetails(true);
      setError(null);

      const matchId = match.MatchID || match.match_id;
      
      if (!matchId || !steamId) {
        throw new Error('Match ID or Steam ID is missing');
      }

      const data = await userService.getMatchDetails(matchId, steamId);

      if (data.message === "Match or User not found") {
        setNotification("Match or User not found");
        return;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setShowDetails(true);
      setMatchDetails(data.message || data);

    } catch (error) {
      setNotification(error.message);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="match-card">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
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
        <button 
          className="details-button"
          onClick={handleShowDetails}
        >
          View Details
        </button>
        {showDetails && (
          <MatchDetailsModal 
            matchDetails={matchDetails}
            isLoading={isLoadingDetails}
            error={error}
            onClose={() => {
              setShowDetails(false);
              setMatchDetails(null);
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default MatchCard;
