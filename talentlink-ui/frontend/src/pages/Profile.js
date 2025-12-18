import { useEffect, useState } from "react";
import API, { getProfile } from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (error) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.reload();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await API.put("profile/", profile);
      setProfile(res.data);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card fade">
        <p>Loading profile...</p>
      </div>
    );
  }

  const role = profile.user.role;

  return (
    <div className="card fade">
      <h2>👤 My Profile</h2>

      <p><b>Username:</b> {profile.user.username}</p>
      <p><b>Email:</b> {profile.user.email}</p>
      <p><b>Role:</b> {role}</p>

      <hr />

      {/* Common fields */}
      <input
        name="title"
        placeholder="Title"
        value={profile.title || ""}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={profile.bio || ""}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        value={profile.location || ""}
        onChange={handleChange}
      />

      {/* Freelancer-specific fields */}
      {role === "FREELANCER" && (
        <>
          <input
            name="hourly_rate"
            placeholder="Hourly Rate"
            value={profile.hourly_rate || ""}
            onChange={handleChange}
          />
          <p><small>Skills can be added later</small></p>
        </>
      )}

      {/* Client-specific fields */}
      {role === "CLIENT" && (
        <>
          <input
            name="company_name"
            placeholder="Company Name"
            value={profile.company_name || ""}
            onChange={handleChange}
          />
          <input
            name="company_website"
            placeholder="Company Website"
            value={profile.company_website || ""}
            onChange={handleChange}
          />
        </>
      )}

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

export default Profile;
