import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { authAPI } from '../api';
import api from '../api';
import ReviewStats from './ReviewStats';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  BriefcaseIcon, 
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  LinkIcon,
  PencilIcon,
  CalendarIcon,
  StarIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  AtSymbolIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const { user: authUser } = useAuth();
  const { darkMode } = useDarkMode();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const profileUser = profile?.user || authUser || {};
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [reviewStats, setReviewStats] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    skills: '',
    hourly_rate: '',
    portfolio: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      let response;
      let profileData;
      let user;
      
      if (userId) {
        // Viewing another user's profile
        setIsOwnProfile(false);
        response = await authAPI.getPublicProfile(userId);
        profileData = response.data;
        user = {
          id: profileData.user?.id || userId,
          username: profileData.user?.username || profileData.name,
          first_name: profileData.user?.first_name || profileData.name,
          last_name: profileData.user?.last_name || '',
          email: profileData.user?.email || '',
          role: profileData.user?.role || 'freelancer'
        };
      } else {
        // Viewing own profile
        setIsOwnProfile(true);
        response = await authAPI.getProfile();
        profileData = response.data;
        user = response.data.user || {};
      }
      
      console.log('Profile data received:', profileData);
      console.log('Skills from API:', profileData.skills);
      console.log('Skills type:', typeof profileData.skills);
      console.log('Skills is array?', Array.isArray(profileData.skills));
      
      // Handle skills - could be string, array, or undefined
      let skillsString = '';
      let processedSkills = [];
      
      if (profileData.skills) {
        if (typeof profileData.skills === 'string') {
          skillsString = profileData.skills;
          processedSkills = profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        } else if (Array.isArray(profileData.skills)) {
          processedSkills = profileData.skills.map(skill => 
            typeof skill === 'string' ? skill.trim() : (skill.name || skill)
          ).filter(skill => skill);
          skillsString = processedSkills.join(', ');
        }
      }
      
      console.log('Processed skills:', processedSkills);
      console.log('Skills string:', skillsString);
      
      // Update profile with processed skills for display
      setProfile({
        ...profileData,
        skills: processedSkills.length > 0 ? processedSkills : profileData.skills
      });
      
      setFormData({
        first_name: authUser?.first_name || user.first_name || '',
        last_name: authUser?.last_name || user.last_name || '',
        email: authUser?.email || user.email || '',
        bio: response.data.bio || '',
        skills: skillsString,
        hourly_rate: response.data.hourly_rate || '',
        portfolio: response.data.portfolio || '',
        experience: response.data.experience || ''
      });
      
      console.log('Form data initialized with skills:', skillsString);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 403) {
        navigate('/dashboard');
      } else {
        setError('Failed to load profile');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!authUser && !userId) {
        navigate('/login');
        return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, userId]);

  useEffect(() => {
    const loadReviewStats = async () => {
      const targetId = profile?.user?.id || authUser?.id;
      const targetRole = profile?.user?.role || authUser?.role;
      if (!targetId || targetRole !== 'freelancer') return;
      try {
        const response = await api.get(`/reviews/user/${targetId}/stats/`);
        setReviewStats(response.data);
      } catch {
        setReviewStats(null);
      }
    };

    loadReviewStats();
  }, [profile, authUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    console.log('Form data skills:', formData.skills);

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };

      const profileData = {
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        bio: formData.bio
      };
      
      if (formData.hourly_rate) {
        profileData.hourly_rate = parseFloat(formData.hourly_rate);
      }
      if (formData.experience) {
        profileData.experience = parseInt(formData.experience);
      }
      if (formData.portfolio) {
        profileData.portfolio = formData.portfolio;
      }
      if (formData.availability) {
        profileData.availability = formData.availability;
      }
      
      // Process skills - resolve skill names to skill IDs
      if (formData.skills) {
        const skillNames = typeof formData.skills === 'string' 
          ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
          : Array.isArray(formData.skills) ? formData.skills : [];
        
        console.log('Processing skill names:', skillNames);
        
        // Get existing skills from API
        const existingSkillsResponse = await authAPI.getSkills();
        const existingSkills = existingSkillsResponse.data;
        console.log('Existing skills from API:', existingSkills);
        
        const skillIds = [];
        
        // Process each skill name
        for (const skillName of skillNames) {
          const trimmedName = skillName.trim();
          if (!trimmedName) continue;
          
          // Check if skill already exists
          const existingSkill = existingSkills.find(skill => 
            skill.skill_name.toLowerCase() === trimmedName.toLowerCase()
          );
          
          if (existingSkill) {
            skillIds.push(existingSkill.id);
            console.log(`Found existing skill: ${trimmedName} -> ID ${existingSkill.id}`);
          } else {
            // Create new skill
            try {
              const newSkillResponse = await authAPI.createSkill({ skill_name: trimmedName });
              skillIds.push(newSkillResponse.data.id);
              console.log(`Created new skill: ${trimmedName} -> ID ${newSkillResponse.data.id}`);
            } catch (skillError) {
              console.log(`Failed to create skill: ${trimmedName}`, skillError);
              // Continue with other skills even if one fails
            }
          }
        }
        
        profileData.skills = skillIds;
        console.log('Final skill IDs:', skillIds);
      } else {
        profileData.skills = [];
      }

      let profileResponse;
      let userSuccess = false, profileSuccess = false;
      let userError = null, profileError = null;
      
      console.log('User data being sent:', userData);
      console.log('Profile data being sent:', profileData);
      
      try {
        await authAPI.updateUser(userData);
        userSuccess = true;
      } catch (userErr) {
        userError = userErr;
        console.log('User update error:', userErr);
        console.log('User error response:', userErr.response);
        console.log('User error data:', userErr.response?.data);
      }
      
      try {
        profileResponse = await authAPI.updateProfile(profileData);
        profileSuccess = true;
        console.log('Profile update successful:', profileResponse.data);
      } catch (profileErr) {
        profileError = profileErr;
        console.log('Profile update error:', profileErr);
        console.log('Profile error response:', profileErr.response);
        console.log('Profile error data:', profileErr.response?.data);
        console.log('Profile error status:', profileErr.response?.status);
        console.log('Profile error statusText:', profileErr.response?.statusText);
      }
      
      if (userSuccess && profileSuccess) {
        setProfile(profileResponse.data);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        setIsEditing(false);
      } else if (userSuccess && !profileSuccess) {
        setSuccess('User details updated successfully');
        const profileErrorMsg = profileError.response?.data?.detail || 
                              profileError.response?.data?.message || 
                              profileError.response?.data?.error || 
                              `HTTP ${profileError.response?.status} error` ||
                              'Unknown error';
        setError(`Profile update failed: ${profileErrorMsg}`);
      } else if (!userSuccess && profileSuccess) {
        setSuccess('Profile updated successfully');
        const userErrorMsg = userError.response?.data?.detail || 
                            userError.response?.data?.message || 
                            userError.response?.data?.error || 
                            `HTTP ${userError.response?.status} error` ||
                            'Unknown error';
        setError(`User details update failed: ${userErrorMsg}`);
      } else {
        const userErrorMsg = userError?.response?.data?.detail || 
                            userError?.response?.data?.message || 
                            userError?.response?.data?.error || 
                            'Unknown error';
        setError(`Update failed: ${userErrorMsg}`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mx-auto mb-4 ${
            darkMode ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className={`font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const user = profile?.user || {};

  return (
    <div className={`min-h-screen py-8 bg-transparent`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header Section */}
        <div className={`rounded-2xl shadow-xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-100'
        }`}>
          <div className={`px-4 py-8 sm:px-8 sm:py-12 relative overflow-hidden ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          }`}>
            {/* Animated background elements */}
            <div className={`absolute inset-0 ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-700/20 to-gray-500/20'
                : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20'
            }`}></div>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-32 translate-x-32 ${
              darkMode ? 'bg-white/5' : 'bg-white/10'
            }`}></div>
            <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-24 -translate-x-24 ${
              darkMode ? 'bg-white/5' : 'bg-white/10'
            }`}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Enhanced Avatar */}
                <div className="relative group flex-shrink-0">
                  <div className={`p-3 rounded-full shadow-2xl h-20 w-20 sm:h-28 sm:w-28 flex items-center justify-center overflow-hidden border-4 ${
                    darkMode 
                      ? 'bg-gray-700 border-white/10' 
                      : 'bg-white border-white/20'
                  }`}>
                    <UserCircleIcon className={`h-16 w-16 sm:h-24 sm:w-24 drop-shadow-lg ${
                      darkMode ? 'text-gray-300' : 'text-blue-600'
                    }`} />
                  </div>
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center ${
                    darkMode 
                      ? 'bg-green-500 border-gray-800' 
                      : 'bg-green-500 border-white'
                  }`}>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}></div>
                  </div>
                </div>
                
                {/* Enhanced User Info */}
                <div className={`${
                  darkMode ? 'text-gray-100' : 'text-white'
                } min-w-0`}>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-1 drop-shadow-lg break-words">
                    {profileUser.first_name || profileUser.username} {profileUser.last_name || ''}
                  </h1>
                  {profileUser.role === 'freelancer' && reviewStats && (
                    <div className="flex items-center space-x-2 mb-1">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">
                        {reviewStats.average_rating.toFixed(1)}
                      </span>
                      <span className="text-xs opacity-80">
                        ({reviewStats.total_reviews} {reviewStats.total_reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                  <div className={`flex flex-wrap items-center gap-2 sm:space-x-4 ${
                    darkMode ? 'text-gray-200' : 'text-blue-100'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className={`uppercase tracking-wide text-xs sm:text-sm font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full ${
                        darkMode 
                          ? 'bg-white/10 text-white' 
                          : 'bg-white/20 text-white'
                      }`}>
                        {profileUser.role || 'User'} Account
                      </span>
                    </div>
                    {authUser?.role === 'freelancer' && profile?.hourly_rate && (
                      <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-semibold text-sm sm:text-base">₹{profile.hourly_rate}/hr</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Edit Button */}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`group relative px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isEditing 
                      ? 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/30' 
                      : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600 shadow-xl hover:shadow-2xl'
                        : 'bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                    <span className="sm:hidden">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </div>
                  {/* Button glow effect */}
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    isEditing ? 'bg-white/10' : darkMode ? 'bg-gray-600/10' : 'bg-blue-600/10'
                  } opacity-0 group-hover:opacity-100`}></div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information Card */}
            <div className={`rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100'
            }`}>
              <div className={`px-6 py-4 border-b ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' 
                  : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-100'
              }`}>
                <h3 className={`text-lg font-bold flex items-center ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  <IdentificationIcon className={`h-5 w-5 mr-2 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  Contact Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="group">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <AtSymbolIcon className={`h-4 w-4 mr-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    Username
                  </label>
                  <div className={`mt-2 flex items-center rounded-lg px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    <IdentificationIcon className={`h-5 w-5 mr-3 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className="font-medium">{profileUser.username || authUser?.username}</span>
                  </div>
                </div>
                
                <div className="group">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <EnvelopeIcon className={`h-4 w-4 mr-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    Email Address
                  </label>
                  <div className={`mt-2 flex items-center rounded-lg px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    <EnvelopeIcon className={`h-5 w-5 mr-3 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className="font-medium truncate">{profileUser.email || authUser?.email}</span>
                  </div>
                </div>
                
                <div className="group">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <BriefcaseIcon className={`h-4 w-4 mr-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    Account Type
                  </label>
                  <div className={`mt-2 flex items-center rounded-lg px-3 py-2 border ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 border-gray-600' 
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 border-blue-100'
                  }`}>
                    <BriefcaseIcon className={`h-5 w-5 mr-3 ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <span className="font-semibold capitalize">{profileUser.role || authUser?.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Stats for Freelancers */}
            {authUser?.role === 'freelancer' && profile && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <StarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Professional Stats
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {profile.hourly_rate && (
                    <div className="group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-600" />
                          Hourly Rate
                        </span>
                        <span className="text-lg font-bold text-gray-900">₹{profile.hourly_rate}</span>
                      </div>
                      <div className="mt-2 bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  )}
                  
                  {profile.experience && (
                    <div className="group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                          Experience
                        </span>
                        <span className="text-lg font-bold text-gray-900">{profile.experience} years</span>
                      </div>
                      <div className="mt-2 bg-blue-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min(profile.experience * 10, 100)}%`}}></div>
                      </div>
                    </div>
                  )}
                  
                  {console.log('Sidebar skills check:', profile.skills, 'length:', profile.skills?.length)}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="group">
                      <span className="text-sm font-medium text-gray-600 flex items-center mb-3">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-purple-600" />
                        Skills & Expertise
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 && profile.skills.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-200 cursor-pointer">
                            {typeof skill === 'string' ? skill.trim() : skill.skill_name || skill.name || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-3">
            {!isOwnProfile ? (
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <UserCircleIcon className="h-6 w-6 mr-3 text-blue-600" />
                    {profileUser.role === 'freelancer' ? 'Professional Profile' : 'Profile Information'}
                  </h3>
                  <p className="text-gray-600 mt-2">Profile details and expertise</p>
                </div>
                
                <div className="p-8">
                  {profileUser.role === 'freelancer' && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <StarIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Reviews & Ratings
                      </h4>
                      <ReviewStats userId={profileUser.id} />
                    </div>
                  )}
                  
                  {/* About Section */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                      About Me
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-6">
                      {profile.bio ? (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic">No bio provided</p>
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                          >
                            {typeof skill === 'object' ? skill.skill_name : skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills listed</p>
                      )}
                    </div>
                  </div>

                  {profileUser.role === 'freelancer' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <IdentificationIcon className="h-5 w-5 mr-2 text-gray-500" />
                          Hourly Rate
                        </h4>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-2xl font-bold text-green-700">
                            ₹{profile.hourly_rate || '0.00'} per hour
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                          Experience
                        </h4>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-xl font-semibold text-purple-700">
                            {profile.experience || '0'} years
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : isEditing ? (
              /* Enhanced Edit Form */
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <PencilIcon className="h-6 w-6 mr-3 text-blue-600" />
                    {authUser?.role === 'freelancer' ? 'Professional Profile' : 'Profile Information'}
                  </h3>
                  <p className="text-gray-600 mt-2">Update your profile information to showcase your expertise</p>
                </div>
                
                <div className="p-8">
                  {error && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl flex items-start shadow-sm">
                      <XCircleIcon className="h-6 w-6 text-red-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Update Failed</h4>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {success && (
                    <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl flex items-start shadow-sm">
                      <CheckCircleIcon className="h-6 w-6 text-green-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">Success!</h4>
                        <p className="text-green-700">{success}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <div className={`rounded-xl p-6 border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className={`text-lg font-bold mb-6 flex items-center ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        <UserCircleIcon className={`h-5 w-5 mr-2 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        Personal Information
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className={`block text-sm font-bold mb-3 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>First Name</label>
                          <div className="relative">
                            <UserCircleIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                              darkMode 
                                ? 'text-gray-500 group-focus-within:text-blue-400' 
                                : 'text-gray-400 group-focus-within:text-blue-600'
                            }`} />
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-blue-400 focus:border-blue-400' 
                                  : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                              }`}
                              placeholder="Enter your first name"
                            />
                          </div>
                        </div>
                        
                        <div className="group">
                          <label className={`block text-sm font-bold mb-3 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Last Name</label>
                          <div className="relative">
                            <UserCircleIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                              darkMode 
                                ? 'text-gray-500 group-focus-within:text-blue-400' 
                                : 'text-gray-400 group-focus-within:text-blue-600'
                            }`} />
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-blue-400 focus:border-blue-400' 
                                  : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                              }`}
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 group">
                        <label className={`block text-sm font-bold mb-3 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Email Address</label>
                        <div className="relative">
                          <EnvelopeIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                            darkMode 
                              ? 'text-gray-500 group-focus-within:text-blue-400' 
                              : 'text-gray-400 group-focus-within:text-blue-600'
                          }`} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-blue-400 focus:border-blue-400' 
                                : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                            }`}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="mt-6 group">
                        <label className={`block text-sm font-bold mb-3 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>About Me</label>
                        <div className="relative">
                          <textarea
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className={`px-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-blue-400 focus:border-blue-400' 
                                : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                            }`}
                            placeholder="Tell us about yourself, your background, and what makes you unique..."
                          />
                        </div>
                        <p className={`mt-2 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>A great bio helps others understand your expertise and personality</p>
                      </div>
                    </div>

                    {/* Professional Information Section (Freelancers Only) */}
                    {authUser?.role === 'freelancer' && (
                      <div className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
                          : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
                      }`}>
                        <h4 className={`text-lg font-bold mb-6 flex items-center ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          <BriefcaseIcon className={`h-5 w-5 mr-2 ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                          Professional Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="group">
                            <label className={`block text-sm font-bold mb-3 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Hourly Rate ($)</label>
                            <div className="relative">
                              <CurrencyDollarIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                darkMode 
                                  ? 'text-gray-500 group-focus-within:text-green-400' 
                                  : 'text-gray-400 group-focus-within:text-green-600'
                              }`} />
                              <input
                                type="number"
                                name="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-green-400 focus:border-green-400' 
                                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                                }`}
                                placeholder="75.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <p className={`mt-2 text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>Set a competitive rate based on your experience</p>
                          </div>
                          
                          <div className="group">
                            <label className={`block text-sm font-bold mb-3 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Years of Experience</label>
                            <div className="relative">
                              <CalendarIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                darkMode 
                                  ? 'text-gray-500 group-focus-within:text-blue-400' 
                                  : 'text-gray-400 group-focus-within:text-blue-600'
                              }`} />
                              <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-blue-400 focus:border-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                                }`}
                                placeholder="5"
                                min="0"
                                max="50"
                              />
                            </div>
                            <p className={`mt-2 text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>Your total years of professional experience</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="group">
                            <label className={`block text-sm font-bold mb-3 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Portfolio URL</label>
                            <div className="relative">
                              <LinkIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                darkMode 
                                  ? 'text-gray-500 group-focus-within:text-indigo-400' 
                                  : 'text-gray-400 group-focus-within:text-indigo-600'
                              }`} />
                              <input
                                type="url"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-indigo-400 focus:border-indigo-400' 
                                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                                }`}
                                placeholder="https://your-portfolio.com"
                              />
                            </div>
                            <p className={`mt-2 text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>Link to your professional portfolio or website</p>
                          </div>
                          
                          <div className="group">
                            <label className={`block text-sm font-bold mb-3 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Skills</label>
                            <div className="relative">
                              <AcademicCapIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                                darkMode 
                                  ? 'text-gray-500 group-focus-within:text-purple-400' 
                                  : 'text-gray-400 group-focus-within:text-purple-600'
                              }`} />
                              <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 focus:ring-purple-400 focus:border-purple-400' 
                                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                                }`}
                                placeholder="React, Python, UI/UX Design"
                              />
                            </div>
                            <p className={`mt-2 text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>Separate skills with commas (e.g., React, Python, Design)</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className={`px-6 py-3 font-bold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                          darkMode 
                            ? 'border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                            : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={saving}
                        className={`
                          px-6 py-3 font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105
                          ${saving 
                            ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                            : darkMode
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl'
                          }
                        `}
                      >
                        {saving ? (
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving Changes...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-5 w-5" />
                            <span>Save Changes</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Enhanced View Mode */
              <div className={`rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-100'
              }`}>
                <div className={`px-8 py-6 border-b ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-gray-200'
                }`}>
                  <h3 className={`text-2xl font-bold flex items-center ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {authUser?.role === 'freelancer' ? 
                      <><BriefcaseIcon className={`h-6 w-6 mr-3 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />Professional Profile</> : 
                      <><UserCircleIcon className={`h-6 w-6 mr-3 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />Profile Information</>
                    }
                  </h3>
                  <p className={`mt-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {authUser?.role === 'freelancer' ? 
                      'Your professional details and expertise' : 
                      'Your account information and details'
                    }
                  </p>
                </div>
                
                <div className="p-8">
                  {/* Bio Section */}
                  {profile.bio && (
                    <div className="mb-8 group">
                      <h4 className={`text-xl font-bold mb-4 flex items-center ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        <UserCircleIcon className={`h-5 w-5 mr-2 ${
                          darkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        About Me
                      </h4>
                      <div className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
                      }`}>
                        <p className={`leading-relaxed text-lg ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>{profile.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Professional Details (Freelancers Only) */}
                  {console.log('Role check - authUser:', authUser, 'role:', authUser?.role)}
                  {authUser?.role === 'freelancer' && profile && (
                    <div className="space-y-8">
                      {/* Skills Section */}
                      {console.log('Main skills check:', profile.skills, 'length:', profile.skills?.length)}
                      {profile.skills && profile.skills.length > 0 && (
                        <div className="group">
                          <h4 className={`text-xl font-bold mb-4 flex items-center ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            <AcademicCapIcon className={`h-5 w-5 mr-2 ${
                              darkMode ? 'text-purple-400' : 'text-purple-600'
                            }`} />
                            Skills & Expertise
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {profile.skills && profile.skills.length > 0 && profile.skills.map((skill, idx) => (
                              <span key={idx} className={`px-4 py-2 rounded-full font-medium border hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer ${
                                darkMode
                                  ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-purple-300 border-purple-700'
                                  : 'bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 text-purple-700 border-purple-200'
                              }`}>
                                {typeof skill === 'string' ? skill.trim() : skill.skill_name || skill.name || skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Professional Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.hourly_rate && (
                          <div className="group">
                            <h4 className={`text-lg font-bold mb-3 flex items-center ${
                              darkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              <CurrencyDollarIcon className={`h-5 w-5 mr-2 ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                              Hourly Rate
                            </h4>
                            <div className={`rounded-xl p-6 border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
                            }`}>
                              <div className={`text-3xl font-bold ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`}>₹{profile.hourly_rate}</div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>per hour</div>
                            </div>
                          </div>
                        )}
                        
                        {profile.experience && (
                          <div className="group">
                            <h4 className={`text-lg font-bold mb-3 flex items-center ${
                              darkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              <CalendarIcon className={`h-5 w-5 mr-2 ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                              Experience
                            </h4>
                            <div className={`rounded-xl p-6 border ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
                            }`}>
                              <div className={`text-3xl font-bold ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>{profile.experience}</div>
                              <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>years</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Portfolio Section */}
                      {profile.portfolio && (
                        <div className="group">
                          <h4 className={`text-lg font-bold mb-4 flex items-center ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            <GlobeAltIcon className={`h-5 w-5 mr-2 ${
                              darkMode ? 'text-indigo-400' : 'text-indigo-600'
                            }`} />
                            Portfolio
                          </h4>
                          <a 
                            href={profile.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                              darkMode
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                            }`}
                          >
                            <LinkIcon className="h-5 w-5 mr-2" />
                            View Portfolio
                            <GlobeAltIcon className="h-4 w-4 ml-2" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty States */}
                  {!profile.bio && authUser?.role !== 'freelancer' && isOwnProfile && (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <UserCircleIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h4>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">Add your bio and personal information to help others learn more about you.</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Add Profile Information
                      </button>
                    </div>
                  )}

                  {!profile.bio && (!profile.skills || profile.skills.length === 0) && !profile.hourly_rate && isOwnProfile && authUser?.role === 'freelancer' && (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <BriefcaseIcon className="h-12 w-12 text-purple-600" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Complete Your Freelancer Profile</h4>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">Add your professional details, skills, and portfolio to attract potential clients and showcase your expertise.</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Complete Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
