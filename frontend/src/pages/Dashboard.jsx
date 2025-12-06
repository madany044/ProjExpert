import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="card mb-8">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-400">Manage your projects, track submissions, and view AI insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-hover cursor-pointer">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-gray-400 text-sm">View your project statistics and analytics</p>
        </div>
        <Link to="/tasks" className="card-hover">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold mb-2">My Tasks</h3>
          <p className="text-gray-400 text-sm">View and manage all your projects</p>
        </Link>
        <div className="card-hover cursor-pointer">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Goals</h3>
          <p className="text-gray-400 text-sm">Track your project deadlines and milestones</p>
        </div>
      </div>

      <div className="mt-12 card">
        <h3 className="text-2xl font-bold mb-6">Getting Started</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-proj-purple rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white">Create a New Task</h4>
              <p className="text-gray-400 text-sm">Go to My Tasks and click "New Task" to get started</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-proj-purple rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white">Upload Files</h4>
              <p className="text-gray-400 text-sm">Drag and drop or click to attach files to your project</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-proj-purple rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white">Submit & Track</h4>
              <p className="text-gray-400 text-sm">Submit your task and track progress with AI insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
