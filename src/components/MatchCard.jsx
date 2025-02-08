import React from 'react';
import '../styles/MatchCard.css';

function MatchCard({ match }) {
  return (
    <div className="match-card">
      <h3>Match ID: {match.MatchID}</h3>
      <p><strong>Hero:</strong> {match.HeroID}</p>
      <p><strong>Kills:</strong> {match.Kills}</p>
      <p><strong>Deaths:</strong> {match.Deaths}</p>
      <p><strong>Assists:</strong> {match.Assists}</p>
      <p><strong>Duration:</strong> {Math.floor(match.Duration / 60)} min</p>
    </div>
  );
}

export default MatchCard;
