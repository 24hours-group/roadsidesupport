import Link from "next/link";
import Image from "next/image";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function SiteHeader({ simple = false }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/RSS-logo.png"
                alt="Roadside Support Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl mobile:text-sm mobile:max-w-[100px] font-bold text-white tracking-tight font-playfair">
                Roadside Support
              </span>
              {!simple && (
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold hidden sm:block">
                  Roadside Assistance
                </span>
              )}
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <a
              href="tel:+15551234567"
              className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-dark transition-all duration-300">
                <PhoneIcon style={{ fontSize: 18 }} />
              </div>
              <span className="font-semibold group-hover:text-accent transition-colors">
                (555) 123-4567
              </span>
            </a>

            {!simple && (
              <Link
                href="/rescue"
                className="bg-accent text-dark font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-white hover:text-dark transition-all hover:shadow-lg transform hover:-translate-y-0.5 mobile:text-sm"
              >
                <SupportAgentIcon style={{ fontSize: 20 }} />
                <span>Get Help Now</span>
              </Link>
            )}

            {/* Simple Mobile Phone Button for Rescue Flow */}
            {simple && (
              <a
                href="tel:+15551234567"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-accent border border-white/10"
              >
                <PhoneIcon style={{ fontSize: 18 }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
