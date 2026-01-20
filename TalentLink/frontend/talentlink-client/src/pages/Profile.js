import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [form, setForm] = useState({
    experience: "",
    education: "",
    certifications: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/profile/",
      getAuthHeaders()
    );
    setProfile(res.data);
    setForm({
      experience: res.data.experience || "",
      education: res.data.education || "",
      certifications: res.data.certifications || "",
    });
  };

  /* ---------- PROFILE COMPLETION ---------- */
  const completion = (() => {
    let filled = 0;
    if (form.experience) filled++;
    if (form.education) filled++;
    if (form.certifications) filled++;
    return Math.round((filled / 3) * 100);
  })();

  /* ---------- AVATAR ---------- */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    await axios.put(
      "http://127.0.0.1:8000/api/profile/",
      form,
      getAuthHeaders()
    );
    setEditMode(false);
    fetchProfile();
  };

  if (!profile) return null;

  return (
    <div className="profile-page1">
      <div className="profile-card-advanced1">

        {/* ===== HEADER ===== */}
        <div className="profile-top1">
          <div className="profile-left1">
<div className="avatar-wrapper">
  {avatarPreview ? (
    <img
      src={avatarPreview}
      alt="avatar"
      className="profile-avatar1"
    />
  ) : (
    <div className="avatar-letter">
      {profile.username.charAt(0).toUpperCase()}
    </div>
  )}

  {editMode && (
    <label className="avatar-upload">
      <input type="file" hidden onChange={handleAvatarChange} />
      ✎
    </label>
  )}
</div>


            <div>
              <h2 className="profile-name1">{profile.username}</h2>
              <span className={`role-pill ${profile.role}`}>
                {profile.role}
              </span>
            </div>
          </div>

          <button className="edit-btn" onClick={editMode ? handleSave : () => setEditMode(true)}>
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        {/* ===== PROGRESS ===== */}
        <div className="profile-progress1">
          <div
            className="profile-progress-fill11"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* ===== FORM ===== */}
        <div className="profile-group1">
          <label className="profile-label1">Username *</label>
          <input className="profile-input1" value={profile.username} disabled />
        </div>

        <div className="profile-group1">
          <label className="profile-label1">Email *</label>
          <input className="profile-input1" value={profile.email} disabled />
        </div>

        <div className="profile-group1">
          <label className="profile-label1">Experience (max 300 words)</label>
          <textarea
        className="profile-textarea1"
            value={form.experience}
            disabled={!editMode}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
          <div className="word-count">
            {form.experience.split(" ").filter(Boolean).length}/300
          </div>
        </div>

        <div className="profile-group1">
          <label className="profile-label1">Education (max 300 words)</label>
          <textarea
            className="profile-textarea1"
            value={form.education}
            disabled={!editMode}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
          />
          <div className="word-count">
            {form.education.split(" ").filter(Boolean).length}/300
          </div>
        </div>

        <div className="profile-group1">
          <label className="profile-label1">Certifications (max 300 words)</label>
          <textarea
            className="profile-textarea1"
            value={form.certifications}
            disabled={!editMode}
            onChange={(e) =>
              setForm({ ...form, certifications: e.target.value })
            }
          />
          <div className="word-count">
            {form.certifications.split(" ").filter(Boolean).length}/300
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
