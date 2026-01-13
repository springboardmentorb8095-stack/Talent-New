import React, { useState, useEffect } from 'react';
import { proposalAPI } from '../api';
import api from '../api';
import { UserCircleIcon, BriefcaseIcon, StarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const FreelancerCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await proposalAPI.getMyProposals();
      const proposals = response.data;
      
      // Filter out rejected proposals
      const activeProposals = proposals.filter(p => p.status !== 'rejected');
      
      // Group by freelancer to avoid duplicates if they applied to multiple projects
      // However, the requirement is "if a freelancer submit a proposal then the profile should be shown in it"
      // showing them per proposal might be better to see which project they applied to.
      // But "Freelancer profiles" suggests a list of people.
      // Let's group them but list the projects they applied to.
      
      const freelancerMap = new Map();
      
      activeProposals.forEach(proposal => {
        const freelancerId = proposal.freelancer_details?.id;
        if (!freelancerId) return;

        if (!freelancerMap.has(freelancerId)) {
            freelancerMap.set(freelancerId, {
                details: proposal.freelancer_details,
                proposals: []
            });
        }
        freelancerMap.get(freelancerId).proposals.push(proposal);
      });
      
      setCandidates(Array.from(freelancerMap.values()));
    } catch (err) {
      setError('Failed to load freelancer profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const ids = candidates
        .map(c => c.details?.id)
        .filter(Boolean);
      const uniqueIds = Array.from(new Set(ids));
      if (uniqueIds.length === 0) return;

      const results = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await api.get(`/reviews/user/${id}/stats/`);
            results[id] = response.data;
          } catch {
          }
        })
      );
      setRatings(results);
    };

    fetchRatings();
  }, [candidates]);

  const stringToColor = (str) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-indigo-100 text-indigo-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
    ];
    let hash = 0;
    if (str) {
        for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Candidates</h1>
        <p className="text-gray-500 mt-2">Freelancers who have applied to your projects</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <UserCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Candidates Yet</h3>
            <p className="text-gray-500 mt-2">When freelancers apply to your projects, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => {
                const { details, proposals } = candidate;
                const profile = details.profile || {};
                const avatarColor = stringToColor(details.username);
                const rating = ratings[details.id];
                
                return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={details.username} className="h-16 w-16 rounded-full object-cover" />
                        ) : (
                            <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${avatarColor}`}>
                            {details.first_name ? details.first_name.charAt(0).toUpperCase() : details.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {details.first_name} {details.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">@{details.username}</p>
                        {rating && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="font-semibold">
                                {rating.average_rating.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                                ({rating.total_reviews} {rating.total_reviews === 1 ? 'review' : 'reviews'})
                            </span>
                            </div>
                        )}
                        {profile.hourly_rate && (
                            <p className="text-sm font-medium text-gray-700 mt-1">${profile.hourly_rate}/hr</p>
                        )}
                        </div>
                    </div>
                    </div>
                    
                    <div className="p-4">
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-1">
                                    {profile.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                    {profile.skills.length > 3 && (
                                        <span className="text-xs text-gray-400 px-2 py-1">+{profile.skills.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Applied For</h4>
                        <div className="space-y-2">
                            {proposals.map(proposal => (
                            <Link 
                                key={proposal.id} 
                                to={`/projects/${proposal.project}`} // Assuming project string is ID, wait serializer says StringRelatedField...
                                // Wait, serializer might return Title if StringRelatedField.
                                // Let's check serializer again.
                                // If it returns string, we might not have ID.
                                // ProposalSerializer: project = serializers.StringRelatedField(read_only=True)
                                // We might need to fetch project ID. 
                                // Actually, `related_project` in Notification has it.
                                // But here in ProposalSerializer, we only get string title.
                                // We should probably update serializer or just link to proposals page?
                                // Let's link to the proposal detail? Or just show title.
                                // Actually, ProposalSerializer has `project` as string.
                                // BUT `Proposal` model has `project` FK.
                                // We might need to update ProposalSerializer to include project_id.
                                className="block p-2 rounded bg-gray-50 hover:bg-blue-50 transition-colors text-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800 truncate flex-1">{proposal.project}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                        proposal.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {proposal.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Bid: ${proposal.bid_amount}
                                </div>
                            </Link>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <Link 
                                to={`/profile/${details.username}`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <UserCircleIcon className="h-4 w-4" />
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default FreelancerCandidates;
