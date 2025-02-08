import React from "react";

const WinLoseBar = ({ win, lose }) => {
  const totalGames = win + lose;
  const winPercentage = totalGames > 0 ? (win / totalGames) * 100 : 0;

  return (
    <div className="win-lose-container">
      <div className="win-lose-text">
        <span>Wins: {win}</span>
        <span>Loses: {lose}</span>
      </div>
      <div className="progress-bar">
        <div className="win-bar" style={{ width: `${winPercentage}%` }}></div>
      </div>
      <p className="win-percentage">Win Rate: {winPercentage.toFixed(2)}%</p>
    </div>
  );
};

export default WinLoseBar;
