import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function ListProperty() {
  const { user } = useUserAuth();
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!propertyName.trim()) return setMessage({ type: 'error', text: 'Property title is required' });
    setLoading(true);
    try {
      const { post } = await import('../lib/api');
      let imageUrls = [];
      if (imageFiles && imageFiles.length) {
        // Client-side validation already ensured files are images
        const form = new FormData();
        imageFiles.forEach((f) => form.append('images', f));
        const uploadRes = await fetch(`${API_BASE}/api/upload/multiple`, {
          method: 'POST',
          body: form,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson && uploadJson.success) imageUrls = uploadJson.data.urls || [];
        else return setMessage({ type: 'error', text: uploadJson ? uploadJson.message : 'Image upload failed' });
      }

      const payload = { name: propertyName.trim(), description, user_id: user.id };
      if (location) payload.location = location;
      if (price && !Number.isNaN(Number(price))) payload.price = Number(price);
      if (imageUrls.length) {
        payload.images = imageUrls;
        // keep first image in `image` for backwards compatibility
        payload.image = imageUrls[0];
      }
      const data = await post('/api/resource', payload);
      if (data && data.success) {
        setMessage({ type: 'success', text: 'Listing submitted successfully' });
        setFullName('');
        setWhatsapp('');
        setPropertyName('');
        setDescription('');
        setLocation('');
        setPrice('');
        // Navigate to user dashboard
        navigate('/dashboard');
      } else {
        setMessage({ type: 'error', text: data ? data.message : 'Failed to submit' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black text-slate-900 mb-2">List Your Property</h1>
      <p className="text-gray-500 mb-10">Takes less than 5 minutes. KES 1,000/month. No commissions.</p>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Your Details Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Your Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Phone Number</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+254 700 000 000" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Property Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
              <input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} type="text" placeholder="Ocean-view Cottage" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your property..." className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Town</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="">Select a town</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Diani">Diani</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nightly Price (KES)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="3000" className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Photos</label>
              <input onChange={(e) => {
                const files = Array.from(e.target.files || []);
                // client-side mime/type validation
                const valid = files.filter((f) => f.type && f.type.startsWith('image/'));
                if (valid.length !== files.length) {
                  setMessage({ type: 'error', text: 'Only image files are allowed' });
                }
                setImageFiles(valid);
                // generate previews
                const previews = valid.map((f) => {
                  try { return URL.createObjectURL(f); } catch { return null; }
                }).filter(Boolean);
                setImagePreviews(previews);
              }} type="file" accept="image/*" multiple className="w-full" />
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {imagePreviews.map((p, i) => (
                    <img key={i} src={p} alt={`Preview ${i+1}`} className="w-32 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 text-blue-600 rounded-2xl text-center text-sm font-bold">
          After submission, we'll contact you via WhatsApp to verify details and share payment instructions!
        </div>

        {message && (
          <div className={`py-3 px-4 rounded-xl ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>
        )}

        <button disabled={loading} className="w-full py-4 bg-[#007EA7] text-white rounded-2xl font-black text-xl">
          {loading ? 'Submitting...' : 'Request Listing'}
        </button>
      </form>
    </div>
  );
}