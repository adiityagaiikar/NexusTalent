import React, { useState } from 'react';
import { PieChart, Megaphone, Target, Zap, Users, Globe } from '../constants/icons';

function Strategy() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // Dynamic state for pricing

  return (
    <div className="animate-in max-w-5xl mx-auto pb-20 mt-10">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Business Strategy</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          How we scale, sustain, and capture the modern freelance and employment market.
        </p>
      </div>

      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><PieChart size={28} /></div>
            <h2 className="text-3xl font-bold text-gray-900">Revenue Model</h2>
          </div>
          
          {/* Dynamic Billing Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button 
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annually <span className="text-green-500 text-xs">-20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-purple-600 mb-4"><Users size={32} /></div>
            <h3 className="text-xl font-bold mb-2">Freemium Tier</h3>
            <div className="text-4xl font-extrabold mb-4">$0</div>
            <p className="text-gray-600 text-sm leading-relaxed">Basic profile creation, portfolio hosting, and standard job applications are completely free to drive user growth.</p>
          </div>

          {/* Pro Tier (Dynamic Pricing) */}
          <div className="bg-white p-8 rounded-2xl border-2 border-blue-500 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">POPULAR</div>
            <div className="text-blue-500 mb-4"><Zap size={32} /></div>
            <h3 className="text-xl font-bold mb-2">Pro Creatives</h3>
            <div className="text-4xl font-extrabold mb-4">
              ${billingCycle === 'monthly' ? '12' : '9'}<span className="text-sm text-gray-400 font-normal">/mo</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Advanced profile analytics, custom domain mapping, and priority ranking in employer searches.</p>
          </div>

          {/* Enterprise Tier (Dynamic Pricing) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-800 mb-4"><Globe size={32} /></div>
            <h3 className="text-xl font-bold mb-2">Enterprise SaaS</h3>
            <div className="text-4xl font-extrabold mb-4">
              ${billingCycle === 'monthly' ? '299' : '239'}<span className="text-sm text-gray-400 font-normal">/mo</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Companies pay to post unlimited jobs, access our internal ATS CRM, and use advanced filtering.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Megaphone size={28} /></div>
          <h2 className="text-3xl font-bold text-gray-900">Marketing Strategy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-amber-200 transition-colors">
            <div className="shrink-0 mt-1 text-amber-500"><Target size={24} /></div>
            <div>
              <h4 className="font-bold text-lg mb-2">University Partnerships</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Collaborating directly with university placement cells to onboard fresh talent, creating a baseline of high-quality candidates.</p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-amber-200 transition-colors">
            <div className="shrink-0 mt-1 text-amber-500"><Target size={24} /></div>
            <div>
              <h4 className="font-bold text-lg mb-2">Community "Buildathons"</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Hosting virtual design and coding challenges sponsored by tech companies to drive organic social media sharing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Strategy;