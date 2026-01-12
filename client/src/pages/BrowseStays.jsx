import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { stays } from '../data/stays';

export default function BrowseStays() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Browse Coast Stays</h1>
      <p className="text-gray-500 mb-8 font-medium">Discover the best beachfront properties and coastal homes</p>

      {/* Search Bar */}
      <div className="mb-10 relative">
        <input 
          type="text" 
          placeholder="Search properties by name or location..." 
          className="w-full p-4 pl-6 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007EA7]/20 transition-all"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-8">
          
          {/* Town Filter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Town</h3>
            <div className="space-y-2">
              {['Mombasa', 'Diani', 'Kilifi', 'Watamu', 'Malindi'].map(town => (
                <button key={town} className="w-full text-left px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-[#007EA7] hover:text-white transition-all text-sm">
                  {town}
                </button>
              ))}
            </div>
          </div>

          {/* Features Filter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <div className="space-y-2">
              {['All Types', 'Beachfront', 'Ferry-free', 'Walkable'].map(feat => (
                <button key={feat} className="w-full text-left px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm">
                  {feat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
             <div className="h-1 w-full bg-[#007EA7] rounded-full relative mb-8">
                <div className="absolute right-0 -top-1.5 w-4 h-4 bg-slate-500 rounded-full border-2 border-white shadow-sm"></div>
             </div>
          </div>

          {/* Bedrooms Dropdown */}
          <div>
            <h3 className="font-bold text-lg mb-4">Bedrooms</h3>
            <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-slate-700 font-medium outline-none">
              <option value="all">All</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4+">4+ Bedrooms</option>
            </select>
          </div>
        </aside>

        {/* Property Grid */}
        <div className="flex-1 grid md:grid-cols-2 gap-8 items-start">
          {stays.map(stay => (
            <PropertyCard key={stay.id} stay={stay} />
          ))}
        </div>
      </div>
    </div>
  );
}