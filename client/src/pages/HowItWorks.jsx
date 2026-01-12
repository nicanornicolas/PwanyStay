import { CheckCircle2, MessageSquare, MapPin, BarChart3, Image } from 'lucide-react';

export default function HowItWorks() {
  const features = [
    { icon: <CheckCircle2 />, title: "Dedicated listing page" },
    { icon: <Image />, title: "Photo gallery" },
    { icon: <MessageSquare />, title: "WhatsApp booking button" },
    { icon: <MapPin />, title: "Google Maps pin" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4">How It Works</h1>
        <p className="text-xl text-gray-500">Get your property live in three simple steps. WhatsApp-first onboarding.</p>
      </div>

      {/* 3-Step Process */}
      <div className="grid md:grid-cols-3 gap-12 mb-24">
        {[
          { id: 1, t: "Submit property details & photos", d: "Tell us about your property with basic info and images" },
          { id: 2, t: "Pay KES 1,000", d: "Simple, transparent pricing. No hidden fees ever." },
          { id: 3, t: "Listing goes live within 24 hours", d: "Your property is discoverable & ready for guests" }
        ].map(step => (
          <div key={step.id} className="relative">
            <div className="w-12 h-12 bg-[#007EA7] text-white rounded-full flex items-center justify-center text-xl font-black mb-6">
              {step.id}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.t}</h3>
            <p className="text-gray-600 leading-relaxed">{step.d}</p>
          </div>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-xl text-center max-w-lg mx-auto">
        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-4">Per Listing Per Month</p>
        <div className="text-6xl font-black text-slate-900 mb-4">KES 1,000</div>
        <p className="text-gray-500 mb-8">No commission, cancel anytime</p>
        <button className="w-full py-4 bg-[#007EA7] text-white rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform">
          Start Listing
        </button>
      </div>
    </div>
  );
}