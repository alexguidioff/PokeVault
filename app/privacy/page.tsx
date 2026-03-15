export default function PrivacyPage() {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-slate-300">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We only collect the email address provided during account creation via Supabase Authentication. This is used solely for managing your personal vault and submission history.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">2. ROM Data</h2>
            <p>We never see, store, or transmit your ROM files. The patching process happens in your browser's memory and is discarded immediately after the patched file is generated.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">3. Third-Party Services</h2>
            <p>We use Supabase for database management and Vercel for hosting. Please refer to their respective privacy policies for details on how they handle infrastructure data.</p>
          </div>
        </section>
      </div>
    );
  }