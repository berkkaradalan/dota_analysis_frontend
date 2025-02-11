import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import '../styles/MatchDetailsModal.css';

function MatchDetailsModal({ matchDetails, isLoading, error, onClose }) {
  const [itemDetails, setItemDetails] = useState({});
  const [abilityDetails, setAbilityDetails] = useState({});

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!matchDetails) return;
      
      const itemIds = [
        matchDetails.Item0,
        matchDetails.Item1,
        matchDetails.Item2,
        matchDetails.Item3,
        matchDetails.Item4,
        matchDetails.Item5
      ];

      const itemPromises = itemIds.map(async (itemId) => {
        if (itemId === 0) return null;
        try {
          const data = await userService.getItemDetails(itemId);
          return { id: itemId, ...data };
        } catch (error) {
          console.error(`Error fetching item ${itemId}:`, error);
          return null;
        }
      });

      const items = await Promise.all(itemPromises);
      const itemMap = {};
      items.forEach((item, index) => {
        itemMap[`Item${index}`] = item;
      });
      setItemDetails(itemMap);
    };

    const fetchAbilityDetails = async () => {
      if (!matchDetails?.AbilityUpgrades) return;
      
      // Create an array of 30 slots initialized to null
      const abilityMap = Array(30).fill(null);
      
      // Map each ability upgrade to its corresponding slot
      for (let i = 0; i < matchDetails.AbilityUpgrades.length; i++) {
        const abilityId = matchDetails.AbilityUpgrades[i];
        try {
          const data = await userService.getAbilityDetails(abilityId);
          abilityMap[i] = { id: abilityId, ...data };
        } catch (error) {
          console.error(`Error fetching ability ${abilityId}:`, error);
        }
      }

      // Convert array to object with Ability0, Ability1, etc. keys
      const abilityDetails = {};
      abilityMap.forEach((ability, index) => {
        abilityDetails[`Ability${index}`] = ability;
      });
      
      setAbilityDetails(abilityDetails);
    };

    fetchItemDetails();
    fetchAbilityDetails();
  }, [matchDetails]);

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

            <div className="items-section">
              <h3>Items</h3>
              <div className="item-slots">
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <div key={slot} className="item-slot">
                    {itemDetails[`Item${slot}`] ? (
                      <img 
                        src={itemDetails[`Item${slot}`].ItemImage}
                        alt={itemDetails[`Item${slot}`].ItemName}
                        title={itemDetails[`Item${slot}`].ItemName}
                      />
                    ) : (
                      <div className="empty-slot" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="abilities-section">
              <h3>Abilities</h3>
              {[0, 1, 2].map(row => (
                <div key={row} className="ability-row">
                  {Array.from({ length: 10 }, (_, i) => {
                    const index = row * 10 + i;
                    const ability = abilityDetails[`Ability${index}`];
                    return (
                      <div key={index} className="ability-slot">
                        {ability ? (
                          <img 
                            src={ability.AbilityImage}
                            alt={ability.AbilityName}
                            title={ability.AbilityName}
                          />
                        ) : (
                          <div className="empty-ability-slot" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
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