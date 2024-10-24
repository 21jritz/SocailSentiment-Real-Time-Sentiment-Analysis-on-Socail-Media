import React from 'react';
import Dashboard from './components/Dashboard';
import { Activity } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center">
          <Activity className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">SocialSentiment</h1>
            <p className="text-sm opacity-90">Real-time social media sentiment analysis</p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;