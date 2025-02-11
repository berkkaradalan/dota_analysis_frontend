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
      console.log('Raw matchDetails:', matchDetails);
      
      if (!matchDetails?.AbilityUpgrades) {
        console.log('No ability upgrades found in:', matchDetails);
        return;
      }

      const abilityUpgrades = matchDetails.AbilityUpgrades;
      console.log('Found ability upgrades:', abilityUpgrades);

      try {
        const abilityPromises = abilityUpgrades.map(async (abilityId, index) => {
          console.log(`Attempting to fetch ability ${abilityId}`);
          try {
            const data = await userService.getAbilityDetails(abilityId);
            console.log(`Got ability data for ${abilityId}:`, data);
            
            return {
              [`Ability${index}`]: {
                AbilityID: abilityId,
                AbilityName: data.AbilityName,
                AbilityImage: data.AbilityImage
              }
            };
          } catch (error) {
            console.error(`Error fetching ability ${abilityId}:`, error);
            return null;
          }
        });

        const abilities = await Promise.all(abilityPromises);
        const abilityMap = abilities.reduce((acc, curr) => {
          if (curr) {
            return { ...acc, ...curr };
          }
          return acc;
        }, {});

        console.log('Final ability map:', abilityMap);
        setAbilityDetails(abilityMap);
      } catch (error) {
        console.error('Error in fetchAbilityDetails:', error);
      }
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
            <div className="match-stats-container">
              <div className="match-stat-card performance">
                <div className="stat-header">
                  <h3>Performance</h3>
                  <div className="stat-icon">🎯</div>
                </div>
                <div className="stat-content">
                  <div className="stat-row">
                    <span className="stat-label">K/D/A</span>
                    <span className="stat-value">{matchDetails.Kills}/{matchDetails.Death}/{matchDetails.Assists}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">KDA Ratio</span>
                    <span className="stat-value">{matchDetails.KillDeathAssist.toFixed(2)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Level</span>
                    <span className="stat-value">{matchDetails.Level}</span>
                  </div>
                </div>
              </div>

              <div className="match-stat-card economy">
                <div className="stat-header">
                  <h3>Economy</h3>
                  <div className="stat-icon">💰</div>
                </div>
                <div className="stat-content">
                  <div className="stat-row">
                    <span className="stat-label">Net Worth</span>
                    <span className="stat-value">{matchDetails.NetWorth.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">GPM</span>
                    <span className="stat-value">{matchDetails.GoldPerMinute}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">XPM</span>
                    <span className="stat-value">{matchDetails.XPPerMinute}</span>
                  </div>
                </div>
              </div>

              <div className="match-stat-card impact">
                <div className="stat-header">
                  <h3>Impact</h3>
                  <div className="stat-icon">⚔️</div>
                </div>
                <div className="stat-content">
                  <div className="stat-row">
                    <span className="stat-label">Hero Damage</span>
                    <span className="stat-value">{matchDetails.HeroDamage.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Tower Damage</span>
                    <span className="stat-value">{matchDetails.TowerDamage.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Hero Healing</span>
                    <span className="stat-value">{matchDetails.HeroHealing.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="match-stat-card farming">
                <div className="stat-header">
                  <h3>Farming</h3>
                  <div className="stat-icon">🌾</div>
                </div>
                <div className="stat-content">
                  <div className="stat-row">
                    <span className="stat-label">Last Hits</span>
                    <span className="stat-value">{matchDetails.LastHits}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Denies</span>
                    <span className="stat-value">{matchDetails.Denies}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Gold Spent</span>
                    <span className="stat-value">{matchDetails.GoldSpent.toLocaleString()}</span>
                  </div>
                </div>
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
              <h3>Ability Upgrades</h3>
              <div className="ability-row">
                {Array.from({ length: 30 }, (_, index) => {
                  const ability = abilityDetails[`Ability${index}`];
                  return (
                    <div key={index} className="ability-slot">
                      {ability ? (
                        <img 
                          src={ability.AbilityImage}
                          alt={ability.AbilityName}
                          title={`Level ${index + 1}: ${ability.AbilityName}`}
                        />
                      ) : (
                        <div className="empty-ability-slot" title={`Level ${index + 1}`} />
                      )}
                    </div>
                  );
                })}
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