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

  const handleShowDetails = async () => {
    try {
      // Önce modal'ı göster
      setShowDetails(true);
      setIsLoadingDetails(true);
      setError(null);

      // matchId'yi match objesinden al
      const matchId = match.MatchID || match.match_id;
      
      console.log('Sending request with:', { matchId, steamId, match });
      
      if (!matchId || !steamId) {
        throw new Error('Match ID or Steam ID is missing');
      }

      const data = await userService.getMatchDetails(matchId, steamId);
      console.log('Match details response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      setMatchDetails(data.message || data);

    } catch (error) {
      console.error('Error fetching match details:', error);
      setError(error.message);
    } finally {
      setIsLoadingDetails(false);
    }
  };

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
