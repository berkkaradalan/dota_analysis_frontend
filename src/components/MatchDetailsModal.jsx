import React from 'react';
import '../styles/MatchDetailsModal.css';

function MatchDetailsModal({ matchDetails, isLoading, error, onClose }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Match Details</h2>
        
        {isLoading && (
          <div className="modal-loading">
            <p>Loading match details...</p>
          </div>
        )}
        
        {!isLoading && error && (
          <div className="modal-error">
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && matchDetails && (
          <>
            <div className="details-grid">
              <div className="detail-section">
                <h3>Performance</h3>
                <p>K/D/A: {matchDetails.Kills}/{matchDetails.Death}/{matchDetails.Assists}</p>
                <p>KDA Ratio: {matchDetails.KillDeathAssist.toFixed(2)}</p>
                <p>Level: {matchDetails.Level}</p>
              </div>

          <div className="detail-section">
            <h3>Economy</h3>
            <p>Net Worth: {matchDetails.NetWorth}</p>
            <p>GPM: {matchDetails.GoldPerMinute}</p>
            <p>XPM: {matchDetails.XPPerMinute}</p>
          </div>

          <div className="detail-section">
            <h3>Impact</h3>
            <p>Hero Damage: {matchDetails.HeroDamage}</p>
            <p>Tower Damage: {matchDetails.TowerDamage}</p>
            <p>Hero Healing: {matchDetails.HeroHealing}</p>
          </div>

          <div className="detail-section">
            <h3>Farming</h3>
            <p>Last Hits: {matchDetails.LastHits}</p>
            <p>Denies: {matchDetails.Denies}</p>
            <p>Gold Spent: {matchDetails.GoldSpent}</p>
          </div>
        </div>

            <div className="match-info">
              <p>Start Time: {formatTime(matchDetails.MatchStartTime)}</p>
              <p>Duration: {formatDuration(matchDetails.MatchDuration)}</p>
              <p>Game Mode: {matchDetails.GameMode}</p>
              <p>Result: {matchDetails.Win ? 'Victory' : 'Defeat'}</p>
            </div>
          </>
        )}
        
        {!isLoading && !error && !matchDetails && (
          <div className="modal-loading">
            <p>Waiting for match details...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchDetailsModal; 