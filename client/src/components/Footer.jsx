import { Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 py-16 px-8 mt-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-black text-xl text-[#007EA7]">PwanyStay</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Coast-only BnB platform for Kenya's most beautiful beaches. 
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900">Company</h4>
          <ul className="text-slate-500 text-sm space-y-2">
            <li>About PwanyStay</li>
            <li>How It Works</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900">For Hosts</h4>
          <ul className="text-slate-500 text-sm space-y-2">
            <li>List Your Property</li>
            <li>Browse Listings</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900">Contact</h4>
          <div className="space-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2"><MessageCircle size={16}/> WhatsApp</div>
            <div className="flex items-center gap-2"><Mail size={16}/> Email</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 flex justify-between">
        <p>© 2025 PwanyStay. All rights reserved. </p>
        <div className="flex gap-6">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}