import Head from "next/head";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SERVICE_TYPES } from "@/lib/schemas";
import styles from "./index.module.css";

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
import BuildIcon from "@mui/icons-material/Build";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupsIcon from "@mui/icons-material/Groups";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SecurityIcon from "@mui/icons-material/Security";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
  mechanic: BuildIcon,
  other: HelpOutlineIcon,
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

      <div className="min-h-screen bg-dark overflow-x-hidden selection:bg-primary selection:text-dark">
        <SiteHeader />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative pt-20 mobile:pt-24">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-secondary">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-secondary to-secondary opacity-70" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

            {/* Animated Blobs */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-soft" />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-soft"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="container-app relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Trust Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/90 text-sm font-semibold shadow-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <VerifiedIcon
                    className="text-primary"
                    style={{ fontSize: 14 }}
                  />
                </div>
                <span>Trusted by 10,000+ Drivers</span>
                <div className="w-1 h-1 rounded-full bg-white/30 mx-1" />
                <div className="flex text-primary">
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
                  <button className="w-full bg-primary text-dark font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-dark transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] text-lg group">
                    <SupportAgentIcon style={{ fontSize: 26 }} />
                    Request Service
                    <ArrowForwardIcon
                      className="group-hover:translate-x-1 transition-transform"
                      style={{ fontSize: 22 }}
                    />
                  </button>
                </Link>
                <a href="tel:+18886811841" className="w-full sm:w-auto">
                  <button className="w-full bg-white/5 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm group text-2xl">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <PhoneIcon style={{ fontSize: 22 }} />
                    </div>
                    <span>(888) 681-1841</span>
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
                      className="text-primary mobile:!text-lg mb-2"
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

        {/* Services Section - White Background */}
        <section className="py-24 relative bg-white">
          <div className="container-app relative z-10">
            <div className="text-center mb-16 space-y-4">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">
                Our Services
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary">
                How Can We Help You?
              </h2>
              <p className="text-secondary-500 max-w-2xl mx-auto text-lg">
                Professional assistance for every roadside emergency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(SERVICE_TYPES).map((service, idx) => {
                const IconComponent = serviceIcons[service.icon];
                return (
                  <Link
                    key={service.id}
                    href={`/rescue?service=${service.id}`}
                    className="group"
                  >
                    <div className="relative h-full bg-secondary/5 border border-secondary/10 rounded-2xl p-8 hover:bg-secondary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1">
                      {/* Hover Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center text-primary group-hover:text-primary-800 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(255,109,0,0.2)] transition-all duration-300 mb-6">
                          {IconComponent && (
                            <IconComponent style={{ fontSize: 36 }} />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                          {service.label}
                        </h3>
                        <p className="text-secondary-500 leading-relaxed group-hover:text-secondary-700 transition-colors">
                          {service.description}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute bottom-8 right-8 text-secondary/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                        <ArrowForwardIcon style={{ fontSize: 24 }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust & Experience Section */}
        <section className="py-24 mobile:pt-6 relative overflow-hidden ">
          {/* Background */}
          <div className="absolute inset-0 bg-secondary" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-5" />

          {/* Decorative Elements */}
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

          <div className="container-app relative z-10 ">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Trusted by Drivers Across the Region
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">
                Over 15 years of experience getting stranded motorists safely
                back on the road.
              </p>
            </div>

            {/* Experience Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                {
                  value: "15+",
                  label: "Years of Experience",
                  icon: WorkspacePremiumIcon,
                  description: "Serving since 2010",
                },
                {
                  value: "50K+",
                  label: "Happy Customers",
                  icon: GroupsIcon,
                  description: "And counting",
                },
                {
                  value: "50+",
                  label: "Service Vehicles",
                  icon: EngineeringIcon,
                  description: "Always nearby",
                },
                {
                  value: "24/7",
                  label: "Availability",
                  icon: AccessTimeIcon,
                  description: "Day or night",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 mobile:p-4 text-center hover:bg-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <stat.icon
                      className="text-primary mx-auto mb-4"
                      style={{ fontSize: 40 }}
                    />
                    <div className="text-4xl mobile:text-2xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg mobile:text-base font-semibold text-white/80 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm mobile:text-xs text-white/50">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="mb-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
                What Our Customers Say
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Sarah M.",
                    location: "Downtown",
                    rating: 5,
                    text: "Got a flat tire at midnight and they were there in under 20 minutes. The technician was professional and had me back on the road in no time. Absolutely lifesaving service!",
                    service: "Flat Tire Change",
                  },
                  {
                    name: "James K.",
                    location: "Westside",
                    rating: 5,
                    text: "Locked my keys in the car at a grocery store parking lot. Called them and within 15 minutes I was back in my car. Fast, professional, and reasonably priced!",
                    service: "Lockout Service",
                  },
                  {
                    name: "Maria L.",
                    location: "North District",
                    rating: 5,
                    text: "My battery died on a cold morning before work. The jump start service was incredible - the technician even checked my alternator to make sure it wouldn't happen again.",
                    service: "Jump Start",
                  },
                ].map((testimonial, i) => (
                  <div
                    key={i}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors">
                      <FormatQuoteIcon style={{ fontSize: 48 }} />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 text-primary mb-4">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <StarIcon key={i} style={{ fontSize: 20 }} />
                        ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-white/70 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-primary-500/30 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-white/50">
                          {testimonial.location} • {testimonial.service}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white/80 mb-8">
                Certified & Trusted
              </h3>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {[
                  { icon: SecurityIcon, label: "Fully Insured" },
                  { icon: VerifiedIcon, label: "Licensed Technicians" },
                  { icon: HandshakeIcon, label: "Insurance Approved" },
                  { icon: WorkspacePremiumIcon, label: "AAA Partner" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 px-6 py-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all"
                  >
                    <badge.icon
                      className="text-primary"
                      style={{ fontSize: 32 }}
                    />
                    <span className="text-white/70 text-sm font-medium">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - White Background */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none" />

          <div className="container-app relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">
                  The Process
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-secondary leading-tight">
                  Help arrives in <br />
                  <span className="text-primary">3 simple steps.</span>
                </h2>
                <p className="text-secondary-500 text-lg leading-relaxed">
                  Our streamlined process ensures you get the right help as fast
                  as possible. No accounts, no subscriptions, just help.
                </p>

                <Link href="/rescue">
                  <button className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-800 transition-all border border-primary shadow-lg flex items-center gap-2 mt-8">
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
                      color: "bg-primary",
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
                      className="flex items-start gap-6 bg-secondary/5 border border-secondary/10 p-6 rounded-2xl hover:border-primary/20 hover:bg-secondary/10 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-lg ${i === 1 ? "bg-primary text-white" : "bg-secondary text-white"}`}
                        >
                          <item.icon style={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-secondary-500">{item.description}</p>
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
                  <button className="bg-primary text-dark font-bold py-5 px-10 rounded-xl flex items-center justify-center gap-3 hover:bg-white hover:text-dark transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 transform duration-300 text-lg">
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
