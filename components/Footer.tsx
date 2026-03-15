import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Project Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">Pokévault</h3>
            <p className="text-sm leading-relaxed">
              Your ultimate vault for ROM hacks. Manage, patch, and discover new adventures in one seamless experience.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition">Discover</Link></li>
              <li><Link href="/submit" className="hover:text-blue-400 transition">Submit</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition">Log in</Link></li>
            </ul>
          </div>

          {/* Column 3: Support & Community */}
            <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
                <li><a href="mailto:pokevault.project@gmail.com" className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
            </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 mb-8" />

        {/* Legal Disclaimer Section */}
        <div className="text-xs text-slate-500 space-y-4">
          <p>© {currentYear} Pokévault. All rights reserved.</p>
          <p>
            Pokémon, Nintendo, Game Boy, Game Boy Color, Game Boy Advance, and Nintendo DS are trademarks of their respective owners. 
            <strong> Pokévault is an independent fan project</strong> and is not affiliated with, endorsed, or sponsored by Nintendo, The Pokémon Company, or GAME FREAK. 
            Please support the official releases by purchasing their games.
          </p>
          <p className="border-l-2 border-blue-500 pl-4 italic">
            We host only patch files (.bps, .ips, .ups), never ROMs. When using our online patcher, your legally-obtained ROMs never leave your device. All patching is performed locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}