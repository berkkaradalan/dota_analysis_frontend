import React from 'react';
import MatchCard from './MatchCard';

function MatchList({ matches, steamId }) {
  console.log('Matches in MatchList:', matches);
  
  if (!matches || matches.length === 0) {
    return <div>No matches found</div>;
  }

  return (
    <div className="match-list">
      {matches.map((match, index) => {
        // Debug log for each match
        console.log(`Processing match ${index}:`, match);
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
