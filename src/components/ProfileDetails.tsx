import React from 'react';
import { useNavigate } from 'react-router-dom';
import './profileDetails.css';

interface Profile {
  name: string;
  imageUrl: string;
  email: string;
  role: string;
  joinedDate: string;
  contact: string;
}

const ProfileDetails: React.FC = () => {
  const navigate = useNavigate();

  // Updated profile data with local image
  const profile: Profile = {
    name: 'Sumit Singh',
    imageUrl: '/profile.jpg', // Reference to image in public folder
    email: 'sumit.singh@example.com',
    role: 'Admin',
    joinedDate: '2024-01-15',
    contact: '+1-234-567-890',
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-button" onClick={handleBack}>Back to Dashboard</button>
        <div className="profile-header">
          <img src={profile.imageUrl} alt="Profile" className="profile-image" />
          <h2 className="profile-name">{profile.name}</h2>
        </div>
        <div className="profile-details">
          <div className="detail-field">
            <strong>Email:</strong> {profile.email}
          </div>
          <div className="detail-field">
            <strong>Role:</strong> {profile.role}
          </div>
          <div className="detail-field">
            <strong>Joined Date:</strong> {profile.joinedDate}
          </div>
          <div className="detail-field">
            <strong>Contact:</strong> {profile.contact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;