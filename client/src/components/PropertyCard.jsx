import React, { useState } from 'react';
import { MapPin, MessageCircle } from 'lucide-react';

export default function PropertyCard({ stay }) {
  // stay can come from backend (id, name, description, created_at) or static data (title, location, price, tags, image)
  // Do not inject arbitrary defaults. Render fields conditionally when data is present.
  const title = stay.title || stay.name || null;
  const location = stay.location || null;
  const price = typeof stay.price === 'number' ? stay.price : null;
  const image = stay.image || null;
  const tags = Array.isArray(stay.tags) ? stay.tags : [];
  
  const [imgBroken, setImgBroken] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      {/* Image Container */}
      {Array.isArray(stay.images) && stay.images.length ? (
        <div className="relative h-64 overflow-hidden">
          <img
            src={stay.images[index]}
            alt={title || 'Property image'}
            onError={() => setImgBroken(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {stay.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button onClick={() => setIndex((i) => (i - 1 + stay.images.length) % stay.images.length)} className="bg-white/70 rounded-full p-2">‹</button>
              <button onClick={() => setIndex((i) => (i + 1) % stay.images.length)} className="bg-white/70 rounded-full p-2">›</button>
            </div>
          )}
        </div>
      ) : image && !imgBroken ? (
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title || 'Property image'}
            onError={() => setImgBroken(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        // subtle placeholder when image missing or broken
        <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
          <div className="text-gray-300">No image</div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          {title ? (
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          ) : (
            <h3 className="text-xl font-bold text-slate-900 text-gray-400">No title</h3>
          )}
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={14} />
            <span>{location || 'Location not specified'}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
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
          {price !== null ? (
            <>
              KES {price.toLocaleString()}<span className="text-gray-400 text-sm font-normal">/night</span>
            </>
          ) : (
            <span className="text-gray-500">Price upon request</span>
          )}
        </div>

        {/* WhatsApp Button - Primary Action */}
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl font-bold text-slate-700 hover:bg-gray-50 transition-colors"
          onClick={() => window.open(`https://wa.me/254726063889?text=I'm interested in ${stay.title}`)}
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}