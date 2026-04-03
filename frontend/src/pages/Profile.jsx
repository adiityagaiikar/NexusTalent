import React from 'react';
import { MapPin, GithubIcon, Award, Code, Cpu, ExternalLink } from '../constants/icons';

function Profile() {
  return (
    <div className="animate-in pb-20 max-w-6xl mx-auto mt-6">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        
        {/* Profile Card (Large 2x2) */}
        <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 ring-4 ring-gray-50">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Aditya Gaikar</h1>
            <p className="text-lg text-gray-500 font-medium mt-2">Full Stack Developer @ IIT Bombay</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">Hire Me</button>
             <button className="bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"><GithubIcon size={18} /></button>
          </div>
        </div>

        {/* Location (Small 1x1) */}
        <div className="bg-blue-600 rounded-[2rem] p-6 text-white flex flex-col justify-center items-center text-center shadow-lg shadow-blue-200">
          <MapPin size={32} className="mb-2 opacity-80" />
          <p className="font-bold">Mumbai, IN</p>
        </div>

        {/* Experience (Small 1x1) */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
          <h4 className="text-4xl font-black text-gray-900">3+</h4>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Years Coding</p>
        </div>

        {/* Skills Bento (Wide 2x1) */}
        <div className="md:col-span-2 bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <Cpu className="absolute right-6 top-6 opacity-20 text-white" size={60} />
          <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'Node.js', 'Tailwind', 'Python', 'AWS'].map(skill => (
              <span key={skill} className="bg-white/10 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold">{skill}</span>
            ))}
          </div>
        </div>

        {/* Project Feature (Wide 2x1) */}
        <div className="md:col-span-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white relative group cursor-pointer overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">TalentNexus Platform</h3>
            <p className="text-white/70 text-sm mb-4">A complete career services engine with CRM & JWT Auth.</p>
            <ExternalLink size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </div>
          <Code size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>

        {/* About (Medium 2x1) */}
        <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
            <Award size={32} />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            Building digital experiences that combine heavy technical engineering with artistic user interfaces.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;