export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-500">Get in touch with the PwanyStay team</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <p className="text-gray-600 mb-6">Have questions about listing your property or need help? We're here to help.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#007EA7] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📧</span>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">pwanystay@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#007EA7] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📱</span>
                </div>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-gray-600">+254 726063889</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Send us a message</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea className="w-full p-3 bg-gray-50 border rounded-xl" rows="4" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-[#007EA7] text-white rounded-xl font-bold hover:bg-[#005f7d] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}