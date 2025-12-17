import React from 'react'; 
import { useAuth } from './contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const Dashboard = () => { 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = async () => { 
    try { 
      await logout(); 
      navigate('/login'); 
    } catch (error) { 
      console.error('Logout failed:', error); 
    } 
  }; 

  if (!user) { 
    navigate('/login'); 
    return null; 
  } 

  // Debug: Let's see what the user object actually contains
  console.log('User object:', user);
  console.log('User fields:', Object.keys(user || {}));

  return ( 
    <div className="min-h-screen bg-gray-50"> 
      <nav className="bg-white shadow"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <div className="flex justify-between h-16"> 
            <div className="flex items-center"> 
              <h1 className="text-xl font-semibold text-gray-900"> 
                TalentLink Dashboard 
              </h1> 
            </div> 
            <div className="flex items-center"> 
              <button 
                onClick={handleLogout} 
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" 
              > 
                Logout 
              </button> 
            </div> 
          </div> 
        </div> 
      </nav> 

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> 
        <div className="px-4 py-6 sm:px-0"> 
          <div className="bg-white overflow-hidden shadow rounded-lg"> 
            <div className="px-4 py-5 sm:p-6"> 
              <h2 className="text-lg font-medium text-gray-900 mb-4"> 
                Welcome, {user.first_name} {user.last_name}! 
              </h2> 
              
              <div className="border-t border-gray-200 pt-4"> 
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2"> 
                  <div className="sm:col-span-1"> 
                    <dt className="text-sm font-medium text-gray-500"> 
                      Username 
                    </dt> 
                    <dd className="mt-1 text-sm text-gray-900"> 
                      {user.username} 
                    </dd> 
                  </div> 
                  <div className="sm:col-span-1"> 
                    <dt className="text-sm font-medium text-gray-500"> 
                      Email 
                    </dt> 
                    <dd className="mt-1 text-sm text-gray-900"> 
                      {user.email} 
                    </dd> 
                  </div> 
                  <div className="sm:col-span-1"> 
                    <dt className="text-sm font-medium text-gray-500"> 
                      Role 
                    </dt> 
                    <dd className="mt-1 text-sm text-gray-900"> 
                      {user.role} 
                    </dd> 
                  </div> 
                </dl> 
              </div> 
              
              <div className="mt-6"> 
                <p className="text-sm text-gray-600"> 
                  Your TalentLink account with username "{user.username}" with role "{user.role}" is successfully created!! 
                </p> 
              </div> 
            </div> 
          </div> 
        </div> 
      </main> 
    </div> 
  ); 
}; 

export default Dashboard;