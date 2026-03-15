export default function TermsPage() {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-slate-300">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">1. Service Description</h2>
            <p>Pokévault provides a platform for organizing and applying patches to user-provided files. We do not provide, host, or distribute copyrighted ROM files.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">2. User Responsibility</h2>
            <p>By using this service, you certify that you possess a legally obtained copy of the original ROM before applying any patches. Users are solely responsible for compliance with local laws regarding the use of game modifications.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">3. Patcher Functionality</h2>
            <p>Our patching tool runs entirely in your web browser. No ROM data is uploaded to our servers. The process is handled locally via JavaScript to ensure privacy and security.</p>
          </div>
        </section>
      </div>
    );
  }