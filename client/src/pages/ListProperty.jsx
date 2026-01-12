export default function ListProperty() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-slate-900 mb-2">List Your Property</h1>
      <p className="text-gray-500 mb-10">Takes less than 5 minutes. KES 1,000/month. No commissions.</p>

      <form className="space-y-8">
        {/* Your Details Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Your Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Phone Number</label>
              <input type="text" placeholder="+254 700 000 000" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Property Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Town</label>
              <select className="w-full p-3 bg-gray-50 border rounded-xl">
                <option>Select a town</option>
                <option>Mombasa</option>
                <option>Diani</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nightly Price (KES)</label>
              <input type="number" placeholder="3000" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold">
          After submission, we'll contact you via WhatsApp to verify details and share payment instructions!
        </div>

        <button className="w-full py-4 bg-[#007EA7] text-white rounded-2xl font-black text-xl">
          Request Listing
        </button>
      </form>
    </div>
  );
}