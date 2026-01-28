import Head from "next/head";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SERVICE_TYPES } from "@/lib/schemas";

// MUI Icons
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Roadside Support - Roadside Assistance When You Need It</title>
        <meta
          name="description"
          content="Help at the roadside, without the stress. Fast, reliable roadside assistance for flat tires, jump starts, lockouts, fuel delivery, towing, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/RSS-logo.png" />
      </Head>

      <div className="min-h-screen bg-dark overflow-x-hidden selection:bg-accent selection:text-dark">
        <SiteHeader />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative pt-20 mobile:pt-24">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-dark">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-dark to-dark opacity-70" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

            {/* Animated Blobs */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse-soft" />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-soft"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="container-app relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Trust Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/90 text-sm font-semibold shadow-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <VerifiedIcon
                    className="text-accent"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <span>Trusted by 10,000+ Drivers</span>
                <div className="w-1 h-1 rounded-full bg-white/30 mx-1" />
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} style={{ fontSize: 14 }} />
                  ))}
                </div>
              </div>

              {/* Headline with Gradient */}
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight animate-slide-up">
                Stuck on the road?
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-200 to-accent drop-shadow-sm">
                  We'll get you moving.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
                Fast, reliable assistance for flat tires, dead batteries,
                lockouts, and more.
                <span className="text-white font-semibold">
                  {" "}
                  No membership required.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2 pt-4">
                <Link href="/rescue" className="w-full sm:w-auto">
                  <button className="w-full bg-accent text-dark font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-dark transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] text-lg group">
                    <SupportAgentIcon style={{ fontSize: 26 }} />
                    Request Service
                    <ArrowForwardIcon
                      className="group-hover:translate-x-1 transition-transform"
                      style={{ fontSize: 22 }}
                    />
                  </button>
                </Link>
                <a href="tel:+15551234567" className="w-full sm:w-auto">
                  <button className="w-full bg-white/5 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm group text-2xl">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <PhoneIcon style={{ fontSize: 22 }} />
                    </div>
                    <span>(555) 123-4567</span>
                  </button>
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 mobile:grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 pt-12 animate-slide-up stagger-3 max-w-3xl mx-auto">
                {[
                  { label: "Response Time", value: "5 min", icon: SpeedIcon },
                  {
                    label: "Availability",
                    value: "24/7",
                    icon: AccessTimeIcon,
                  },
                  { label: "Satisfaction", value: "4.9/5", icon: VerifiedIcon },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/5 rounded-2xl p-4 mobile:p-2 backdrop-blur-sm flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <stat.icon
                      className="text-accent mobile:!text-lg mb-2"
                      style={{ fontSize: 28 }}
                    />
                    <div className="text-2xl mobile:text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm mobile:text-xs text-white/50 font-medium mobile:font-normal  tracking-wider mobile:tracking-normal">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-dark to-secondary-900 pointer-events-none" />
          <div className="container-app relative z-10">
            <div className="text-center mb-16 space-y-4">
              <span className="text-accent font-bold tracking-widest uppercase text-sm">
                Our Services
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                How Can We Help You?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Professional assistance for every roadside emergency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(SERVICE_TYPES).map((service, idx) => {
                const IconComponent = serviceIcons[service.icon];
                return (
                  <Link key={service.id} href="/rescue" className="group">
                    <div className="relative h-full bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1">
                      {/* Hover Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-900/20 border border-primary-500/20 flex items-center justify-center text-primary-300 group-hover:text-accent group-hover:border-accent/30 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.2)] transition-all duration-300 mb-6">
                          {IconComponent && (
                            <IconComponent style={{ fontSize: 36 }} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                          {service.label}
                        </h3>
                        <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                          {service.description}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute bottom-8 right-8 text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                        <ArrowForwardIcon style={{ fontSize: 24 }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works - Reimagined */}
        <section className="py-24 bg-dark relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

          <div className="container-app relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <span className="text-accent font-bold tracking-widest uppercase text-sm">
                  The Process
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Help arrives in <br />
                  <span className="text-primary-300">3 simple steps.</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  Our streamlined process ensures you get the right help as fast
                  as possible. No accounts, no subscriptions, just help.
                </p>

                <Link href="/rescue">
                  <button className="bg-white/10 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm flex items-center gap-2 mt-8">
                    Start Request <ArrowForwardIcon style={{ fontSize: 20 }} />
                  </button>
                </Link>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Tell Us What's Wrong",
                      description:
                        "Select your issue, share your location, and describe your situation.",
                      icon: HelpOutlineIcon,
                      color: "bg-blue-500",
                    },
                    {
                      step: 2,
                      title: "Provide Quick Details",
                      description:
                        "Enter your vehicle info and contact details so we can reach you.",
                      icon: PhoneInTalkIcon,
                      color: "bg-accent",
                    },
                    {
                      step: 3,
                      title: "Help Is On The Way",
                      description:
                        "We dispatch the nearest technician to get you back on the road.",
                      icon: CheckCircleIcon,
                      color: "bg-green-500",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-6 bg-secondary-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${i === 1 ? "bg-accent text-dark" : "bg-primary/30 text-white"}`}
                        >
                          <item.icon style={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/50">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          </div>

          <div className="container-app relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to get back on the road?
              </h2>
              <p className="text-xl text-white/70">
                Our technicians are standing by.
              </p>
              <div className="flex flex-col mobile:items-center sm:flex-row justify-center gap-4">
                <Link href="/rescue">
                  <button className="bg-accent text-dark font-bold py-5 px-10 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-dark transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 transform duration-300 text-lg">
                    <SupportAgentIcon style={{ fontSize: 28 }} />
                    Request Assistance
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
