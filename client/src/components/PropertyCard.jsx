import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';

export default function PropertyCard({ stay }) {
  // stay data includes: title, location, price, tags (e.g. ['Beachfront', 'Ferry-free']), image
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={stay.image} 
          alt={stay.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{stay.title}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={14} />
            <span>{stay.location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {stay.tags?.map((tag, index) => (
            <span 
              key={index} 
              className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="text-xl font-black text-slate-900">
          KES {stay.price.toLocaleString()}<span className="text-gray-400 text-sm font-normal">/night</span>
        </div>

        {/* WhatsApp Button - Primary Action */}
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl font-bold text-slate-700 hover:bg-gray-50 transition-colors"
          onClick={() => window.open(`https://wa.me/254700000000?text=I'm interested in ${stay.title}`)}
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}