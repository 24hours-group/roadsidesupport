import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-secondary-200/50">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <LocationOnIcon className="text-white" style={{ fontSize: 24 }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">
                Roadside Support
              </span>
              <span className="text-xs text-secondary-600 hidden sm:block">
                Roadside Assistance
              </span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Support Number */}
            <a
              href="tel:+15551234567"
              className="hidden md:flex items-center gap-2 text-secondary-700 hover:text-primary transition-colors"
            >
              <PhoneIcon style={{ fontSize: 20 }} />
              <span className="font-semibold">(555) 123-4567</span>
            </a>

            {/* CTA Button */}
            <Link
              href="/rescue"
              className="btn-accent text-sm py-2.5 px-5 flex items-center gap-2"
            >
              <SupportAgentIcon style={{ fontSize: 20 }} />
              <span>Get Help Now</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
