export default function PrivacyPage() {
    const lastUpdated = "2026-03-15"; // Update with today's date
  
    return (
      <div className="bg-slate-950 min-h-screen text-slate-300 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-12">Last updated: {lastUpdated}</p>
  
          <section className="space-y-12">
            {/* 1. Introduction */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to <strong>Pokévault</strong>. We respect your privacy and are committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR). This policy explains how we handle information when you browse our vault or create an account.
              </p>
            </div>
  
            {/* 2. Data We Collect */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Data Collection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                  <h3 className="text-blue-400 font-bold mb-2">For Visitors</h3>
                  <p className="text-sm">
                    We do not collect personally identifiable information from users who simply browse or download patches. We may use local storage to track download counts anonymously to prevent system abuse.
                  </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                  <h3 className="text-blue-400 font-bold mb-2">For Registered Users</h3>
                  <p className="text-sm">
                    When you create an account to submit hacks, we collect your <strong>email, name, and username</strong> via Supabase Auth. This is strictly for account management and attribution of your work.
                  </p>
                </div>
              </div>
            </div>
  
            {/* 3. The "No ROMs" Policy - CRITICAL */}
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6">
              <h2 className="text-xl font-bold text-white mb-2">3. Important: ROM Data Handling</h2>
              <p className="text-sm leading-relaxed">
                Pokévault <strong>never</strong> collects, uploads, or stores your ROM files. The patching process is executed entirely <strong>client-side</strong> in your browser memory. Your legally obtained game files never leave your device and are never transmitted to our servers.
              </p>
            </div>
  
            {/* 4. Cookies & Local Storage */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Storage & Cookies</h2>
              <p className="mb-4">We use strictly necessary technologies to make the site work:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Local Storage:</strong> To store your patching preferences and anonymous device tokens for download metrics.</li>
                <li><strong>Authentication Cookies:</strong> Provided by Supabase to keep you logged in. We do not use tracking or advertising cookies.</li>
              </ul>
            </div>
  
            {/* 5. Third-Party Services */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
              <p className="mb-4">Your data is processed by the following industry-standard providers:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Supabase:</strong> For database and authentication (GDPR compliant).</li>
                <li><strong>Vercel:</strong> For website hosting and performance.</li>
              </ul>
            </div>
  
            {/* 6. Your Rights */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights (GDPR)</h2>
              <p className="mb-4">You have the right to access, rectify, or delete your personal data at any time. Since we only store what is necessary for your account, you can:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Update your profile in your account settings.</li>
                <li>Request full account deletion by contacting us.</li>
              </ul>
            </div>
  
            {/* 7. Contact */}
            <div className="pt-8 border-t border-slate-800">
              <p className="text-sm">
                If you have questions regarding this policy, contact us at: <span className="text-blue-400">admin@alexguidioff.com</span> (or your preferred email).
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }