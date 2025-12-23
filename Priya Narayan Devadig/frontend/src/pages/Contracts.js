import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Contracts = () => {
    const { currentUser } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchContracts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchContracts = async () => {
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${params}`);
            setContracts(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteContract = async (contractId) => {
        if (!window.confirm('Mark this contract as completed?')) return;

        try {
            await axios.post(`http://127.0.0.1:8000/api/contracts/${contractId}/complete/`);
            alert('Contract marked as completed!');
            fetchContracts();
        } catch (error) {
            alert('Error completing contract: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleTerminateContract = async (contractId) => {
        if (!window.confirm('Are you sure you want to terminate this contract?')) return;

        try {
            await axios.post(`http://127.0.0.1:8000/api/contracts/${contractId}/terminate/`);
            alert('Contract terminated');
            fetchContracts();
        } catch (error) {
            alert('Error terminating contract: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>My Contracts</h1>

            {/* Filter Tabs */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                {['all', 'active', 'completed', 'terminated'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: filter === status ? '#667eea' : '#f8f9fa',
                            color: filter === status ? 'white' : '#333',
                            cursor: 'pointer',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Contracts List */}
            {contracts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                    <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>📄</p>
                    <p style={{ color: '#666' }}>No contracts found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {contracts.map(contract => (
                        <div key={contract.id} style={{
                            backgroundColor: 'white',
                            padding: '25px',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0' }}>
                                        <Link to={`/projects/${contract.project}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                                            {contract.project_title}
                                        </Link>
                                    </h3>
                                    <p style={{ margin: '5px 0', color: '#666' }}>
                                        <strong>Client:</strong> {contract.client_name}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#666' }}>
                                        <strong>Freelancer:</strong> {contract.freelancer_name}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    backgroundColor:
                                        contract.status === 'active' ? '#10b98120' :
                                            contract.status === 'completed' ? '#667eea20' : '#ef444420',
                                    color:
                                        contract.status === 'active' ? '#10b981' :
                                            contract.status === 'completed' ? '#667eea' : '#ef4444'
                                }}>
                                    {contract.status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Budget</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: '600', color: '#667eea' }}>
                                        ${contract.agreed_budget}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Start Date</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>
                                        {new Date(contract.start_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>End Date</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>
                                        {new Date(contract.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {contract.status === 'active' && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button
                                        onClick={() => handleCompleteContract(contract.id)}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Mark as Completed
                                    </button>
                                    {currentUser?.id === contract.client && (
                                        <button
                                            onClick={() => handleTerminateContract(contract.id)}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Terminate Contract
                                        </button>
                                    )}
                                </div>
                            )}

                            {contract.status === 'completed' && (
                                <Link
                                    to={`/review/${contract.id}`}
                                    style={{
                                        display: 'inline-block',
                                        marginTop: '15px',
                                        padding: '10px 20px',
                                        backgroundColor: '#f59e0b',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Leave a Review
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Contracts;