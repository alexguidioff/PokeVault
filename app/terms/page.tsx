import Link from 'next/link';

export default function TermsPage() {
  const effectiveDate = "March 15, 2026";
  const siteUrl = "https://the-pokevault.vercel.app";

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-12">
          Version 1.0.0 • Effective: {effectiveDate} • Canonical URL: {siteUrl}/terms
        </p>

        <div className="bg-red-900/20 border-l-4 border-red-500 p-6 mb-12">
          <h2 className="text-lg font-bold text-white mb-2">Important Notices</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Nothing in this document constitutes legal advice.</li>
            <li>Pokévault does not provide, host, or distribute copyrighted ROM files.</li>
            <li>Users are solely responsible for how they use the tools provided.</li>
          </ul>
        </div>

        <section className="space-y-10">
          {/* 1. Acceptance */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Pokévault (the "Service"), you agree to these Terms of Service and our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>. If you do not agree, do not use the Service.
            </p>
          </div>

          {/* 2. Definitions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">2. Definitions</h2>
            <p><strong>"User Content":</strong> files (.bps, .png) and text uploaded by users.</p>
            <p><strong>"Creators":</strong> users who upload patches, screenshots, or descriptions.</p>
            <p><strong>"Users":</strong> consumers who browse, download, or apply patches locally.</p>
          </div>

          {/* 4. ROMs and Patching - THE MOST IMPORTANT SECTION */}
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">3. ROMs and Patching Policy</h2>
            <p className="mb-4 font-semibold text-red-400">ROM files are strictly prohibited from being uploaded to Pokévault servers.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do not post, upload, or link to ROMs or ROM extracts.</li>
              <li>Patching occurs <strong>locally</strong> on your device using your own legally obtained ROMs.</li>
              <li>ROMs never leave your device and are never transmitted to our infrastructure.</li>
              <li>Do not upload decryption keys or materials designed to circumvent copyright protection.</li>
            </ul>
          </div>

          {/* 5. User Content */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">4. User Content & Licensing</h2>
            <p>Creators retain ownership of their content. By uploading, you grant Pokévault a worldwide, non-exclusive license to host, store, and display your content solely to operate the Service. You represent that you have the necessary rights to share the material provided.</p>
          </div>

          {/* 8. Prohibited Conduct */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">5. Prohibited Conduct</h2>
            <p>Users and Creators agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Use automated tools (bots, scrapers) to download content systematically.</li>
              <li>Upload malware or malicious code.</li>
              <li>Redistribute patch files from this Service on commercial platforms without authorization.</li>
              <li>Engage in hateful, harassing, or illegal conduct.</li>
            </ul>
          </div>

          {/* 11. Disclaimers */}
          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">6. Disclaimers & Limitation of Liability</h2>
            <p className="italic text-sm">
              THE SERVICE IS PROVIDED "AS IS." POKÉVAULT DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT SHALL POKÉVAULT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </div>

          {/* 17. Contact */}
          <div className="pt-10 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
            <p>For legal inquiries or DMCA notices, please contact us at: <span className="text-blue-400">pokevault.project@gmail.com</span></p>
          </div>
        </section>
      </div>
    </div>
  );
}