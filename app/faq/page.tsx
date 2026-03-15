import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">FAQ</h1>
        <p className="text-lg mb-12">
          Looking to play a romhack? See <a href="#players" className="text-blue-400 hover:underline">Players</a>. <br />
          Interested in submitting a romhack? See <a href="#creators" className="text-blue-400 hover:underline">Creators</a>.
        </p>

        {/* --- PLAYERS SECTION --- */}
        <section id="players" className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-2">Players</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">What is Pokévault?</h3>
              <p>Pokévault is a community hub for discovering and playing Pokémon ROM hacks. The platform centralizes discovery and provides an in-browser patching system to make playing hacks straightforward and accessible.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Do I need my own ROM file?</h3>
              <p>Yes. Pokévault distributes patches, not complete, pre-patched ROM files. You must provide your own legally obtained base ROM of the original Pokémon game. You'll link your base ROM once, then easily apply patches directly in your browser.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Is using Pokévault legal?</h3>
              <p>Unlike some other ROM sharing sites, Pokévault focuses on legal distribution by hosting and sharing patches rather than complete ROMs. You're responsible for obtaining your base ROMs legally. While it might feel like you're downloading a ROM, your browser is actually applying the patch to your file locally behind the scenes.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I play a ROM hack from Pokévault?</h3>
              <p>Browse the <Link href="/" className="text-blue-400 hover:underline">Discover</Link> page to find a hack that interests you. Once selected, use our built-in patching system to apply the patch to your base ROM. The process happens client-side in your browser, so no data leaves your device.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Do I need an account to browse and download patches?</h3>
              <p>No account is required to browse the Discover page and download ROM hacks.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How does Pokévault make money?</h3>
              <p>We don't. Pokévault is a labor of love for the Pokémon community. There are no ads or paid features. The code is fully open source, and we don't want to monetize fan-made content.</p>
            </div>
          </div>
        </section>

        {/* --- EMULATORS SECTION --- */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-2">Recommended Emulators</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-4 font-semibold text-white">Platform</th>
                  <th className="py-4 font-semibold text-white">GB, GBC, GBA</th>
                  <th className="py-4 font-semibold text-white">NDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                <tr>
                  <td className="py-4">Windows, Mac, Linux</td>
                  <td className="py-4">mGBA</td>
                  <td className="py-4">MelonDS</td>
                </tr>
                <tr>
                  <td className="py-4">Android</td>
                  <td className="py-4">Pizzaboy, RetroArch</td>
                  <td className="py-4">MelonDS Core</td>
                </tr>
                <tr>
                  <td className="py-4">iOS</td>
                  <td className="py-4">Delta, Ignited</td>
                  <td className="py-4">Delta, RetroArch</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --- CREATORS SECTION --- */}
        <section id="creators" className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-2">Creators</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I submit my ROM hack?</h3>
              <p>Navigate to the <Link href="/upload" className="text-blue-400 hover:underline">Submit</Link> page. You'll need to create an account before you can submit. This ensures proper attribution and allows you to update your hack later.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">What format should I submit?</h3>
              <p>We only accept <strong>.BPS</strong> patch files. Pokévault utilizes a built-in patcher that users apply to their own base ROMs. Our submission form also includes a tool to generate a BPS patch automatically if you provide your modified ROM.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Why only BPS?</h3>
              <p>BPS is the successor to IPS and UPS. It includes hash checksums for verification, ensuring the patch is linked to the correct base ROM and preventing corrupted files.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Who retains ownership of submitted hacks?</h3>
              <p>Creators retain 100% ownership of their work. Pokévault serves only as a distribution and discovery platform.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}