import React from 'react';
import { BarChart3, TrendingUp, Globe, MousePointer2, ArrowUpRight, Target } from '../constants/icons';

function Insights() {
  return (
    <div className="animate-in pb-20 max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black tracking-tight">Market Insights</h1>
        <div className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 shadow-sm">
          Updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Hero Metric Card */}
        <div className="md:col-span-2 bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <TrendingUp size={16} /> Platform Growth
            </h3>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-6xl font-black">18.4%</span>
              <span className="text-green-400 font-bold mb-2 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded-lg text-sm">
                +2.4% <ArrowUpRight size={14} />
              </span>
            </div>
            <p className="text-gray-400 font-medium">Increase in successfully filled roles month-over-month.</p>
          </div>
        </div>

        {/* Small Analytics Bento */}
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-200">
          <Target size={40} className="opacity-50" />
          <div>
            <h4 className="text-3xl font-black">94%</h4>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Skill Accuracy</p>
          </div>
        </div>
      </div>

      {/* Strategy Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <BarChart3 />, title: "Category Demand", val: "Engineering (+40%)", desc: "Most requested skill is React/Node." },
          { icon: <Globe />, title: "Remote Adoption", val: "72% Adoption", desc: "Companies transitioning to hybrid." },
          { icon: <MousePointer2 />, title: "Avg. Response", val: "4.2 Hours", desc: "Top talent responds within 5 hours." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:border-blue-500 transition-all group">
            <div className="w-12 h-12 bg-gray-50 text-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              {item.icon}
            </div>
            <h5 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{item.title}</h5>
            <div className="text-xl font-black mb-2 text-gray-900">{item.val}</div>
            <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Insights;