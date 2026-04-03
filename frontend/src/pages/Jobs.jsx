import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, ArrowUpRight, Sparkles } from '../constants/icons';

const JOBS_DATA = [
  { id: 1, title: "SDE Intern", company: "Google", cat: "Engineering", loc: "Remote", pay: "$5k/mo", tag: "Hot", color: "from-red-500 to-orange-500" },
  { id: 2, title: "Product Designer", company: "Meta", cat: "Design", loc: "Hybrid", pay: "$8k/mo", tag: "New", color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Frontend Dev", company: "Vercel", cat: "Engineering", loc: "Remote", pay: "$120k", tag: "Urgent", color: "from-gray-700 to-black" }
];

function Jobs() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="animate-in max-w-5xl mx-auto pb-20 mt-8">
      {/* Dark Search Header */}
      <div className="bg-[#0A0A0B] rounded-[2.5rem] p-12 text-white mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-blue-400 mb-6">
            <Sparkles size={14} /> 2,400 new jobs posted today
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-8">Find your next <br />great move.</h1>
          
          <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="flex-1 flex items-center px-4 gap-3 border-r border-white/10">
              <Search className="text-gray-500" size={20} />
              <input type="text" placeholder="Job title or keywords..." className="bg-transparent w-full py-4 outline-none text-white placeholder-gray-500" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20">Search Jobs</button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {['All', 'Engineering', 'Design', 'Marketing', 'Product'].map(tag => (
          <button 
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${filter === tag ? 'bg-black text-white' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {JOBS_DATA.filter(j => filter === 'All' || j.cat === filter).map(job => (
          <div key={job.id} className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-500 transition-all flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${job.color} flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-gray-200`}>
                {job.company[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{job.tag}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span className="text-gray-900">{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.loc}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0 border-gray-50">
              <div className="flex flex-col items-end">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">Est. Salary</span>
                <span className="text-xl font-black text-gray-900">{job.pay}</span>
              </div>
              <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowUpRight size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;