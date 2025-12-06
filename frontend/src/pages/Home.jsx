import React from 'react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white/10 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">Welcome to ProjXpert</h1>
      <p className="mb-4">Share your academic project or task, attach files, and let the admin (us) coordinate and deliver high-quality solutions enhanced by AI.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded">Post a Task</div>
        <div className="p-4 bg-white/5 rounded">Explore Projects</div>
      </div>
    </div>
  );
};

export default Home;
