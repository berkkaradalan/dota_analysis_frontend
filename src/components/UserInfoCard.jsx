import React from 'react';
import '../styles/UserInfoCard.css';

const UserInfoCard = ({ userInfo }) => {
  console.log('UserInfo received:', userInfo); // Debug log

  if (!userInfo) return null;

  const { AccountID, PersonaName, SteamAvatar, LastLogin } = userInfo;

  if (!AccountID || !PersonaName || !SteamAvatar) {
    console.error('Missing required user info properties:', userInfo);
    return <div>Error loading user information</div>;
  }

  return (
    <div className="user-info-card">
      <div className="avatar">
        <img src={SteamAvatar} alt={`${PersonaName}'s avatar`} />
      </div>
      <div className="details">
        <h2>{PersonaName}</h2>
        <p className="account-id">Account ID: {AccountID}</p>
        <p className="last-login">
          Last Login: {LastLogin ? new Date(LastLogin).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default UserInfoCard;
