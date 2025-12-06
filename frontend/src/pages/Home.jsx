import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(state => state.auth.user);

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto text-center mb-12 fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="gradient-text">ProjXpert</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Share your academic projects, attach files, and collaborate with ease. Enhanced by AI for quality delivery.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link to="/tasks" className="btn-primary text-lg py-3 px-8 text-center">
                📋 My Tasks
              </Link>
              <Link to="/tasks" className="btn-secondary text-lg py-3 px-8 text-center">
                ➕ Post New Task
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-lg py-3 px-8 text-center">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-lg py-3 px-8 text-center">
                Register Now
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="card-hover">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="text-lg font-semibold text-white mb-2">Easy File Sharing</h3>
          <p className="text-gray-400">Upload and attach files directly to your projects with drag-and-drop support.</p>
        </div>
        <div className="card-hover">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Enhanced</h3>
          <p className="text-gray-400">Get intelligent insights and recommendations powered by cutting-edge AI.</p>
        </div>
        <div className="card-hover">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
          <p className="text-gray-400">Quick task submission and real-time collaboration with instant notifications.</p>
        </div>
      </div>

      {/* Quick Links for Authenticated Users */}
      {user && (
        <div className="max-w-2xl mx-auto mt-16 card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/tasks" className="block p-3 bg-dark-input hover:bg-dark-hover rounded-lg transition text-gray-200">
              📋 View my tasks
            </Link>
            <Link to="/profile" className="block p-3 bg-dark-input hover:bg-dark-hover rounded-lg transition text-gray-200">
              👤 Edit profile
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin/attachments" className="block p-3 bg-dark-input hover:bg-dark-hover rounded-lg transition text-gray-200">
                ⚙️ Admin: Manage files
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
