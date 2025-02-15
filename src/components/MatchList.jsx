import React from 'react';
import MatchCard from './MatchCard';

function MatchList({ matches, steamId }) {
  
  if (!matches || matches.length === 0) {
    return <div>No matches found</div>;
  }

  return (
    <div className="match-list">
      {matches.map((match, index) => {
        return (
          <MatchCard 
            key={match.MatchID || match.match_id || index} 
            match={match}
            steamId={steamId}
          />
        );
      })}
    </div>
  );
}

export default MatchList;
