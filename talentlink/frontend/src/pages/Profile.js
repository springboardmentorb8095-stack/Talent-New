import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    skills: '',
    hourly_rate: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');

  // Fetch profile on component mount
  useEffect(() => {
    if (!token) {
      alert('You must login first');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/profiles/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProfile(res.data);
      setLoading(false);
    })
    .catch(err => {
      alert('Failed to fetch profile. Token may be invalid.');
      setLoading(false);
    });
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle logouts
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };
  // Handle profile update
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/profiles/', profile, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      alert('Profile updated successfully');
      setProfile(res.data);
    })
    .catch(err => {
      alert('Update failed');
    });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className='container'>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Full Name" value={profile.full_name} onChange={handleChange} /><br/>
        <input type="text" name="bio" placeholder="Bio" value={profile.bio} onChange={handleChange} /><br/>
        <input type="text" name="skills" placeholder="Skills" value={profile.skills} onChange={handleChange} /><br/>
        <input type="number" name="hourly_rate" placeholder="Hourly Rate" value={profile.hourly_rate || ''} onChange={handleChange} /><br/>
        <input type="text" name="location" placeholder="Location" value={profile.location} onChange={handleChange} /><br/>
        <button type="submit">Update Profile</button>
      </form>
      <button type="button" onClick={handleLogout} style={{ marginTop: "12px", backgroundColor: "#dc2626" }}>Logout</button>
    </div>
  );
}

