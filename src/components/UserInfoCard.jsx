import React from 'react';
import '../styles/UserInfoCard.css';

const UserInfoCard = ({ userInfo }) => {
  if (!userInfo) return null;

  const { AccountID, PersonaName, SteamAvatar, LastLogin } = userInfo.message;

  return (
    <div className="user-info-card">
      <div className="avatar">
        <img src={SteamAvatar} alt={`${PersonaName}'s avatar`} />
      </div>
      <div className="details">
        <h2>{PersonaName}</h2>
        <p className="account-id">Account ID: {AccountID}</p>
        <p className="last-login">Last Login: {new Date(LastLogin).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserInfoCard;
