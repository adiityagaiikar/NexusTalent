import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Sparkles, Eye, Heart } from '../constants/icons';

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/trending')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-in fade-in pb-20">
      <header className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm mb-6 font-medium">
          <Sparkles size={16} /> The future of work
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Get more <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">creative.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">
          The commission-free creative network, connecting you with top talent.
        </p>
        
        <div className="relative w-full max-w-2xl shadow-xl shadow-gray-200/50 rounded-full">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-14 pr-32 py-5 border border-gray-200 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Discover 1.5M+ creatives..."
          />
          <button className="absolute right-3 top-3 bottom-3 px-6 bg-black text-white rounded-full font-medium">
            Search
          </button>
        </div>
      </header>

      <section className="mt-8">
        <h3 className="text-2xl font-bold mb-8">Trending Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold rounded-full shadow-sm">#{project.tag}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-xl mb-6">{project.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{project.author}</span>
                  <div className="flex gap-3 text-gray-400 text-sm">
                    <span className="flex items-center gap-1"><Eye size={16} /> {project.views}</span>
                    <span className="flex items-center gap-1"><Heart size={16} /> {project.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;