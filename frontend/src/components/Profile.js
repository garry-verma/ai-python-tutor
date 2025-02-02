import React, { useState, useEffect } from 'react';
import './styles.css';  // You can style your profile here.

const Profile = () => {
  // States for user data, loading, error, and edit mode
  const [user, setUser] = useState(null);  // Initially, user data is null
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);  // Loading state for the API
  const [error, setError] = useState(null);  // Error state for handling API errors

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('https://ai-python-tutor-backend.onrender.com', {  // Correct API URL
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Send the JWT token in the Authorization header
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
        setNewBio(data.bio);  // Initialize newBio with fetched bio
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);  // Set loading to false when done
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array means this effect runs only once when component mounts

  // Handle saving bio updates (replace with actual API call to update user data)
  const handleSave = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/profile', {  // Update endpoint for saving user data
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: newBio }),
      });
      if (!response.ok) {
        throw new Error('Failed to save bio');
      }
      const updatedUser = await response.json(); // Assuming the updated user is returned from the API
      setUser(updatedUser);  // Update user state with the new bio
      setEditMode(false);  // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  // Loading and error handling
  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>👤 Your Profile</h1>
      <div className="profile-card">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> 
          {editMode ? (
            <input
              type="text"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            />
          ) : (
            user.bio
          )}
        </p>

        {editMode ? (
          <div>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setEditMode(false)}>❌ Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}>✏️ Edit Bio</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
