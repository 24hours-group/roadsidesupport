import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { SERVICE_TYPES } from "@/lib/schemas";

export default function SiteFooter() {
  return (
    <footer className="py-16 bg-dark border-t border-white/5">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center">
                <LocationOnIcon
                  className="text-white"
                  style={{ fontSize: 24 }}
                />
              </div>
              <span className="text-2xl font-bold text-white">
                Roadside Support
              </span>
            </Link>
            <p className="text-white/50 max-w-sm text-lg leading-relaxed">
              The modern way to get roadside assistance. Fast, transparent, and
              membership-free.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {/* {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent hover:text-dark flex items-center justify-center transition-all cursor-pointer text-white/50"
                >
                  <div className="w-4 h-4 bg-current rounded-sm" />
                </div>
              ))} */}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 tracking-wide">
              Services
            </h4>
            <ul className="space-y-4">
              {Object.values(SERVICE_TYPES)
                .slice(0, 4)
                .map((service) => (
                  <li key={service.id}>
                    <Link
                      href="/rescue"
                      className="text-white/50 hover:text-accent transition-colors"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/rescue"
                  className="text-accent hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
                >
                  View All
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+15551234567"
                  className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  <PhoneIcon style={{ fontSize: 18 }} />
                  (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:help@roadsidesupport.com"
                  className="text-white/50 hover:text-white transition-colors"
                >
                  help@roadsidesupport.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <p>© {new Date().getFullYear()} Roadside Support.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
