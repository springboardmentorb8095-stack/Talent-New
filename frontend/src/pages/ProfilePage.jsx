import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profiles/me/");
        setProfile(res.data || {});
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(profile).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      // Role-based cleanup
      if (user.role === "freelancer") {
        formData.delete("company_name");
        formData.delete("company_website");
      }

      if (user.role === "client") {
        formData.delete("skills");
        formData.delete("hourly_rate");
        formData.delete("availability");
      }

      // Add avatar if changed
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axiosInstance.put("/profiles/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // re-fetch profile data
      const res = await axiosInstance.get("/profiles/me/");
      setProfile(res.data || {});


      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      console.log(err.response?.data);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    await axiosInstance.post("/profiles/avatar/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };


  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="page">
        <div className="card">
    <h2 className="page-title">My Profile</h2>

    <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
        <label>Full Name</label>
        <input
            name="full_name"
            value={profile.full_name || ""}
            onChange={handleChange}
            placeholder="Full Name"
        />
          <label>Change Avatar</label>
          <img
            src={profile.avatar_url || "/static/images/default-avatar.png"}
            alt="avatar"
            style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }}
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="form-group">
        <label>Bio</label>
        <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
        />
        </div>

        <div className="form-group">
        <label>Location</label>
        <input
            name="location"
            value={profile.location || ""}
            onChange={handleChange}
            placeholder="Location"
        />
        </div>

        {user.role === "freelancer" && (
        <>
            <div className="form-group">
            <label>Skills</label>
            <input
                name="skills"
                value={profile.skills || ""}
                onChange={handleChange}
                placeholder="Comma-separated skills"
            />
            </div>

            <div className="form-group">
            <label>Hourly Rate</label>
            <input
                type="number"
                name="hourly_rate"
                value={profile.hourly_rate || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Availability</label>
            <select
                name="availability"
                value={profile.availability || ""}
                onChange={handleChange}
            >
                <option value="">Select</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="freelance">Freelance</option>
            </select>
            </div>
        </>
        )}

        {user.role === "client" && (
        <>
            <div className="form-group">
            <label>Company Name</label>
            <input
                name="company_name"
                value={profile.company_name || ""}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Company Website</label>
            <input
                type="url"
                name="company_website"
                value={profile.company_website || ""}
                onChange={handleChange}
            />
            </div>
        </>
        )}

        <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
        </button>

        {message && (
        <p className={message.includes("success") ? "success" : "error"}>
            {message}
        </p>
        )}
    </form>
    </div>
    </div>

  );
};

export default ProfilePage;
