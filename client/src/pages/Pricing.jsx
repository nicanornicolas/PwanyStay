import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4">Pricing</h1>
        <p className="text-xl text-gray-500">Simple, transparent pricing for listing your property</p>
      </div>

      <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xl text-center max-w-lg mx-auto">
        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-4">Per Listing Per Month</p>
        <div className="text-6xl font-black text-slate-900 mb-4">KES 1,000</div>
        <p className="text-gray-500 mb-8">No commission, cancel anytime</p>
        <button
          onClick={() => navigate('/list-property')}
          className="w-full py-4 bg-[#007EA7] text-white rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform"
        >
          Start Listing
        </button>
      </div>
    </div>
  );
}