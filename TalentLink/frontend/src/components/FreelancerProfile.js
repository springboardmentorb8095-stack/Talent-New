import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, authAPI } from '../api';
import { 
  XMarkIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const FreelancerProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [freelancer, setFreelancer] = useState(null);
  const [skillsMap, setSkillsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFreelancerProfile();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFreelancerProfile = async () => {
    try {
      setLoading(true);
      // Get user by username, then fetch their public profile by user id
      const userRes = await userAPI.getUserByUsername(username);
      const userData = userRes.data;
      const profileRes = await authAPI.getPublicProfile(userData.id);
      const profileData = profileRes.data;
      
      // If skills might be numeric IDs, build a lookup map
      try {
        const allSkillsRes = await authAPI.getSkills();
        const map = {};
        (allSkillsRes.data || []).forEach((s) => {
          if (s && typeof s.id !== 'undefined') {
            map[s.id] = s.skill_name || String(s.id);
          }
        });
        setSkillsMap(map);
      } catch (e) {
        // Ignore skill lookup failure and fall back to raw values
      }
      
      setFreelancer({ user: userData, profile: profileData });
    } catch (err) {
      console.error('Failed to fetch freelancer profile:', err);
      setError('Failed to load freelancer profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading freelancer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Profile Not Found</h3>
            <p className="text-red-600 mb-4">{error || 'Freelancer profile could not be loaded.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = freelancer.profile?.name || `${freelancer.user?.first_name || ''} ${freelancer.user?.last_name || ''}`.trim() || freelancer.user?.username;
  const bio = freelancer.profile?.bio || 'No bio provided';
  const skills = Array.isArray(freelancer.profile?.skills) ? freelancer.profile.skills : [];
  const hourlyRate = freelancer.profile?.hourly_rate || 0;
  const experience = freelancer.profile?.experience || 0;
  const getSkillLabel = (skill) => {
    if (skill && typeof skill === 'object') {
      return skill.skill_name || skill.name || '';
    }
    if (typeof skill === 'number') {
      return skillsMap[skill] || `Skill ${skill}`;
    }
    return String(skill || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-3xl overflow-hidden">
                <span>{((freelancer.profile?.name?.[0]) || (freelancer.user?.first_name?.[0]) || (freelancer.user?.username?.[0]) || 'U').toUpperCase()}</span>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h1>
                <p className="text-gray-600">
                  @{freelancer.user?.username}
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  ${hourlyRate}/hr
                </p>
                {freelancer.user?.email && (
                  <div className="mt-2 flex items-center gap-2 text-gray-700">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{freelancer.user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="grid md:grid-cols-1 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {getSkillLabel(skill)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No skills added</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                  <p className="text-gray-600">
                    {experience} years of experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
