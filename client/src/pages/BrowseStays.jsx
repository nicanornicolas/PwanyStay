import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';

export default function BrowseStays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import('../lib/api').then(({ get }) => {
      get('/api/resource')
        .then((data) => {
          if (!mounted) return;
          if (data && data.success) setStays(data.data || []);
          else setError(data ? data.message : 'Unexpected response');
        })
        .catch((err) => {
          if (!mounted) return;
          setError(err.message || 'Failed to fetch');
        })
        .finally(() => mounted && setLoading(false));
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredStays = stays.filter(stay => {
    const matchesSearch = !searchQuery ||
      (stay.title || stay.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stay.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTown = !selectedTown || stay.location === selectedTown;
    const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every(feat => (stay.tags || []).includes(feat));
    return matchesSearch && matchesTown && matchesFeatures;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Browse Coast Stays</h1>
      <p className="text-gray-500 mb-8 font-medium">Discover the best beachfront properties and coastal homes</p>

      {/* Search Bar */}
      <div className="mb-10 relative">
        <input
          type="text"
          placeholder="Search properties by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              {['Mombasa', 'Diani', 'Kilifi', 'Watamu', 'Malindi'].map((town) => (
                <button
                  key={town}
                  onClick={() => setSelectedTown(selectedTown === town ? '' : town)}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium hover:bg-[#007EA7] hover:text-white transition-all text-sm ${
                    selectedTown === town ? 'bg-[#007EA7] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>

          {/* Features Filter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <div className="space-y-2">
              {['Beachfront', 'Ferry-free', 'Walkable'].map((feat) => (
                <button
                  key={feat}
                  onClick={() => setSelectedFeatures(prev => prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat])}
                  className={`w-full text-left px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedFeatures.includes(feat) ? 'bg-[#007EA7] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#007EA7] hover:text-white'
                  }`}
                >
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
          {loading && <div>Loading properties...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && filteredStays.length === 0 && <div>No properties found.</div>}
          {!loading && !error && filteredStays.map((stay) => (
            <PropertyCard key={stay.id} stay={stay} />
          ))}
        </div>
      </div>
    </div>
  );
}