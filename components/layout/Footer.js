import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <LocationOnIcon
                  className="text-accent"
                  style={{ fontSize: 24 }}
                />
              </div>
              <span className="text-xl font-bold">CurbAid</span>
            </Link>
            <p className="text-secondary-400 max-w-sm mb-6">
              Help at the roadside, without the stress. Professional roadside
              assistance when you need it most.
            </p>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-300 transition-colors font-semibold"
            >
              <PhoneIcon style={{ fontSize: 20 }} />
              (555) 123-4567
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                "Flat Tire",
                "Jump Start",
                "Lockout",
                "Fuel Delivery",
                "Basic Tow",
                "Winch Out",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/rescue"
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@curbaid.com"
                  className="flex items-center gap-2 text-secondary-400 hover:text-white transition-colors"
                >
                  <EmailIcon style={{ fontSize: 18 }} />
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-2 text-secondary-400 hover:text-white transition-colors"
                >
                  <PhoneIcon style={{ fontSize: 18 }} />
                  Call Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 text-sm">
            © {new Date().getFullYear()} CurbAid. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#"
              className="text-secondary-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-secondary-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
