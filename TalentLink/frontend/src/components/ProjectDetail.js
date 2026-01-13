import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, proposalAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import ProposalForm from './ProposalForm';
import ContractManager from './ContractManager';
import Chat from './Chat';
import { 
    CurrencyDollarIcon, 
    ClockIcon, 
    CalendarIcon, 
    UserIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    BriefcaseIcon,
    PencilIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myProposal, setMyProposal] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  useEffect(() => {
    fetchProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchProjectData = async () => {
    try {
      const projectRes = await projectAPI.get(id);
      setProject(projectRes.data);

      if (user) {
        try {
             // If user is client and owner, fetch all proposals
             if (user.username === projectRes.data.client) {
                 const proposalsRes = await proposalAPI.getByProject(id);
                 setProposals(proposalsRes.data);
             } 
             // If user is freelancer or not owner, check if they have a proposal
             else {
                 const proposalsRes = await proposalAPI.getByProject(id);
                 if (proposalsRes.data.length > 0) {
                     setMyProposal(proposalsRes.data[0]);
                 }
             }
        } catch (err) {
            console.error("Error fetching proposals", err);
        }
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch project details');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId, newStatus) => {
      try {
          await proposalAPI.updateStatus(proposalId, newStatus);
          // Refresh proposals
          const res = await proposalAPI.getByProject(id);
          setProposals(res.data);
      } catch (err) {
          alert("Failed to update status");
      }
  }

  const handleEditProject = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleViewFreelancerProfile = (freelancerDetails) => {
    setSelectedFreelancer(freelancerDetails);
    setShowFreelancerModal(true);
  };

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
  );
  
  if (error) return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mx-auto max-w-4xl mt-8">
          <p>{error}</p>
      </div>
  );
  
  if (!project) return <div className="p-4 text-center text-gray-500">Project not found</div>;

  const isClient = user?.username === project.client;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Project Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-brand-50 p-8 border-b border-brand-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-brand-800">
                        <UserIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Posted by {project.client}</span>
                        <span className="mx-2 text-brand-300">•</span>
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm">{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider shadow-sm ${
                        project.status === 'open' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {project.status}
                    </span>
                    {isClient && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleEditProject}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-600">
                        <CurrencyDollarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Budget</p>
                        <p className="text-lg font-bold text-gray-900">${project.budget}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-600">
                        <ClockIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Duration</p>
                        <p className="text-lg font-bold text-gray-900">${project.duration}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-600">
                        <BriefcaseIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Experience</p>
                        <p className="text-lg font-bold text-gray-900">Intermediate</p>
                    </div>
                </div>
            </div>

            <div className="prose max-w-none text-gray-600 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Project Description</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                    {project.skills_required && project.skills_required.map(skill => (
                        <span key={skill.id} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:border-brand-300 hover:text-brand-600 transition-colors cursor-default">
                            {skill.skill_name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Client View: List of Proposals */}
      {isClient && (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 px-2">Proposals ({proposals.length})</h3>
            {proposals.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                        <BriefcaseIcon />
                    </div>
                    <p className="text-gray-500 text-lg">No proposals yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {proposals.map(proposal => (
                        <div key={proposal.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                                        {proposal.freelancer[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{proposal.freelancer}</h4>
                                        <p className="text-xs text-gray-500">Applied on {new Date(proposal.created_at).toLocaleDateString()}</p>
                                        <button
                                            onClick={() => handleViewFreelancerProfile(proposal.freelancer_details)}
                                            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium mt-1"
                                        >
                                            <UserIcon className="h-3 w-3" />
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {proposal.status}
                                </span>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex gap-8 mb-2 text-sm">
                                    <div className="font-medium text-gray-900">Bid: <span className="text-green-600 font-bold">${proposal.bid_amount}</span></div>
                                    <div className="font-medium text-gray-900">Delivery: <span className="text-brand-600 font-bold">{proposal.estimated_days} days</span></div>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap mt-2">{proposal.cover_letter}</p>
                            </div>

                            {proposal.status === 'pending' && (
                                <div className="flex gap-3 justify-end">
                                    <button 
                                        onClick={() => handleStatusUpdate(proposal.id, 'accepted')}
                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm text-sm font-medium"
                                    >
                                        <CheckCircleIcon className="h-4 w-4" /> Accept Proposal
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                                        className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition shadow-sm text-sm font-medium"
                                    >
                                        <XCircleIcon className="h-4 w-4" /> Reject
                                    </button>
                                </div>
                            )}
                            
                            {proposal.status === 'accepted' && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-semibold text-gray-900">Contract Management</h5>
                                        <button
                                            onClick={() => {
                                                setShowChat(!showChat);
                                                setContractId(proposal.contract_id);
                                            }}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                                        >
                                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                            {showChat ? 'Hide Chat' : 'Show Chat'}
                                        </button>
                                    </div>
                                    <ContractManager 
                                        proposal={proposal} 
                                        onContractCreated={(contract) => {
                                            setContractId(contract.id);
                                            alert('Contract created successfully!');
                                        }}
                                    />
                                    {showChat && (
                                        <div className="mt-4">
                                            <Chat key={contractId} contractId={contractId} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* Freelancer View: Proposal Form or Status */}
      {!isClient && user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-900">Your Proposal</h3>
              </div>
              <div className="p-6">
                {user?.role === 'client' ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Client Account</p>
                      <p className="text-sm">Clients cannot submit proposals. Only freelancers can apply for projects.</p>
                    </div>
                  </div>
                ) : myProposal ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                            <h4 className="font-bold text-blue-900">Proposal Submitted</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">Bid Amount</span>
                                <span className="font-bold text-gray-900">${myProposal.bid_amount}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Status</span>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mt-1 ${
                                    myProposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    myProposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {myProposal.status}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm bg-white p-3 rounded border border-blue-100">{myProposal.cover_letter}</p>
                        
                        {myProposal.status === 'accepted' && (
                            <div className="mt-4 border-t border-blue-200 pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h5 className="font-semibold text-gray-900">Contract Management</h5>
                                    <button
                                        onClick={() => {
                                            setShowChat(!showChat);
                                            setContractId(myProposal.contract_id);
                                        }}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                                    >
                                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                        {showChat ? 'Hide Chat' : 'Show Chat'}
                                    </button>
                                </div>
                                <ContractManager 
                                    proposal={myProposal} 
                                    onContractCreated={(contract) => {
                                        setContractId(contract.id);
                                        alert('Contract updated successfully!');
                                    }}
                                />
                                {showChat && (
                                    <div className="mt-4">
                                        <Chat contractId={contractId} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : user?.role === 'freelancer' ? (
                    <ProposalForm projectId={id} onSubmitSuccess={fetchProjectData} />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Access Restricted</p>
                      <p className="text-sm">Only freelancers can submit proposals for projects.</p>
                    </div>
                  </div>
                )}
              </div>
          </div>
      )}

      {/* Freelancer Profile Modal */}
      {showFreelancerModal && selectedFreelancer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xl">
                    {selectedFreelancer.first_name?.[0]?.toUpperCase() || selectedFreelancer.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedFreelancer.first_name} {selectedFreelancer.last_name}
                    </h3>
                    <p className="text-gray-600">@{selectedFreelancer.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFreelancerModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedFreelancer.profile ? (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-700">{selectedFreelancer.profile.bio || 'No bio available'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Hourly Rate</h4>
                      <p className="text-green-600 font-bold">
                        ${selectedFreelancer.profile.hourly_rate || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-700">
                        {selectedFreelancer.profile.experience || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {selectedFreelancer.profile.skills && selectedFreelancer.profile.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFreelancer.profile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedFreelancer.profile.portfolio && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Portfolio</h4>
                      <a 
                        href={selectedFreelancer.profile.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 underline"
                      >
                        View Portfolio
                      </a>
                    </div>
                  )}
                  
                  {selectedFreelancer.profile.availability && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                      <p className="text-gray-700">{selectedFreelancer.profile.availability}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">This freelancer hasn't created a profile yet.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowFreelancerModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;