import React from 'react';
import MatchCard from './MatchCard';

function MatchList({ matches }) {
  return (
    <div className="match-list">
      {matches.map((match, index) => (
        <MatchCard key={index} match={match} />
      ))}
    </div>
  );
}

export default MatchList;
