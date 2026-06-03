import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Sun,
  ArrowRight,
  Play,
  BarChart3,
  Leaf,
  TrendingDown,
  Clock,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Quote,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 mesh-bg opacity-50" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            >
              <img
                src="/favicon.svg"
                alt="EcoAudit NG"
                className="w-4 h-4 mr-2"
              />
              {/* <Leaf className="w-4 h-4 mr-2" /> */}
              AI-Powered Energy Intelligence for Nigerian SMEs
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Cut Energy Costs by </span>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              40-60%
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get a complete energy audit in under 5 minutes. Discover exactly
            where your money goes and receive AI-powered recommendations
            tailored for Nigerian businesses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/audit">
              <Button size="lg" className="group px-8 py-6 text-lg">
                Start Free Audit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-zinc-700 hover:bg-zinc-800"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "2,500+", label: "Audits Completed" },
              { value: "₦180M", label: "Customer Savings" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl" />
            <Card className="relative bg-zinc-900/80 backdrop-blur-xl border-zinc-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 text-center text-xs text-zinc-500">
                    EcoAudit Dashboard Preview
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-xs text-zinc-500 mb-2">
                      Energy Score
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">
                      78
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">Good</div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-xs text-zinc-500 mb-2">
                      Annual Cost
                    </div>
                    <div className="text-3xl font-bold text-white">₦2.4M</div>
                    <div className="text-xs text-emerald-400 mt-1">
                      -₦800K potential savings
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-xs text-zinc-500 mb-2">
                      CO₂ Emissions
                    </div>
                    <div className="text-3xl font-bold text-amber-400">
                      4.2t
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">per year</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-zinc-600" />
      </motion.div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Energy Score",
      description:
        "Get a comprehensive 0-100 efficiency score based on your appliances, usage patterns, and power sources.",
      color: "emerald",
    },
    {
      icon: Brain,
      title: "AI-Powered Reports",
      description:
        "Receive detailed, plain-English audit reports with specific recommendations and naira savings estimates.",
      color: "cyan",
    },
    {
      icon: Sun,
      title: "Solar Viability",
      description:
        "Discover if solar makes sense for your business with real pricing from verified Nigerian vendors.",
      color: "amber",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Everything you need to{" "}
            <span className="text-emerald-400">optimize</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-zinc-400 max-w-xl mx-auto"
          >
            Complete energy intelligence platform designed specifically for
            Nigerian business conditions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full glass-card-hover group">
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`w-7 h-7 text-${feature.color}-400`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Business Profile",
      description:
        "Tell us about your business type, location, and size. This helps us tailor recommendations to your specific industry.",
    },
    {
      number: "02",
      title: "Energy Setup",
      description:
        "Add your appliances, generator details, and grid hours. Our database includes 30+ common business appliances.",
    },
    {
      number: "03",
      title: "Get Results",
      description:
        "Receive your complete audit with energy score, cost breakdown, carbon footprint, and actionable savings plan.",
    },
  ];

  return (
    <section className="py-24 relative bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            How it <span className="text-emerald-400">works</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-zinc-400 max-w-xl mx-auto"
          >
            Complete your audit in under 5 minutes with our streamlined 3-step
            process.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative">
              <div className="text-6xl font-bold text-zinc-800 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-zinc-800 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Pain Points Section
function PainPointsSection() {
  const painPoints = [
    {
      icon: Wallet,
      title: "Rising Diesel Costs",
      description:
        "With diesel at ₦1,650/litre, generator costs are eating into profits.",
    },
    {
      icon: Clock,
      title: "Unreliable Grid Power",
      description:
        "Average 4-6 hours of grid power daily means heavy reliance on generators.",
    },
    {
      icon: AlertTriangle,
      title: "No Visibility",
      description:
        "Most businesses have no idea which appliances cost the most to run.",
    },
    {
      icon: TrendingDown,
      title: "Shrinking Margins",
      description:
        "Energy costs can represent 20-40% of operating expenses for SMEs.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
            >
              Built for Nigerian{" "}
              <span className="text-emerald-400">realities</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-zinc-400 mb-8 leading-relaxed"
            >
              We understand the unique challenges Nigerian SMEs face. EcoAudit
              NG is designed specifically for businesses dealing with unreliable
              grid power and high generator costs.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/audit">
                <Button size="lg" className="group">
                  Get Your Audit
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4"
          >
            {painPoints.map((point, i) => (
              <motion.div key={i} variants={scaleIn}>
                <Card className="h-full glass-card-hover">
                  <CardContent className="p-6">
                    <point.icon className="w-8 h-8 text-amber-400 mb-4" />
                    <h4 className="font-semibold text-white mb-2">
                      {point.title}
                    </h4>
                    <p className="text-sm text-zinc-400">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Solar Showcase Section
function SolarShowcaseSection() {
  const benefits = [
    "Reduce generator runtime by 60-80%",
    "Payback period as low as 18-24 months",
    "Real pricing from verified vendors",
    "Financing options available",
  ];

  return (
    <section className="py-24 relative bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="order-2 lg:order-1"
          >
            <Card className="bg-gradient-to-br from-amber-500/10 via-zinc-900/50 to-zinc-900/50 border-amber-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Solar Savings Calculator
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Real vendor pricing included
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-zinc-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="order-1 lg:order-2"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
            >
              Is solar right for your{" "}
              <span className="text-amber-400">business</span>?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-zinc-400 mb-6 leading-relaxed"
            >
              Our audit includes a complete solar viability analysis with real
              pricing from verified Nigerian vendors like Femtech Energy,
              Arnergy, GVE Projects, and SolarForce Nigeria.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-zinc-400 mb-8 leading-relaxed"
            >
              Get matched with the right system size, see estimated payback
              periods, and understand your potential monthly savings.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/audit">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  Check Solar Viability
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "EcoAudit helped us identify that our old freezer was costing us ₦45,000 monthly. We replaced it and saved 30% on our energy bill.",
      author: "Chioma Okafor",
      role: "Restaurant Owner, Lagos",
      rating: 5,
    },
    {
      quote:
        "The solar recommendation was spot on. We installed a 5kW system and reduced our generator use from 12 hours to 3 hours daily.",
      author: "Emmanuel Adeyemi",
      role: "Pharmacy Owner, Ibadan",
      rating: 5,
    },
    {
      quote:
        "Finally, a tool that understands Nigerian business realities. The audit was quick and the recommendations actually made sense.",
      author: "Fatima Ibrahim",
      role: "Salon Owner, Abuja",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Trusted by Nigerian{" "}
            <span className="text-emerald-400">businesses</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-zinc-400 max-w-xl mx-auto"
          >
            See what business owners across Nigeria are saying about their
            audits.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full glass-card-hover">
                <CardContent className="p-8 flex flex-col h-full">
                  <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />
                  <p className="text-zinc-300 mb-6 flex-1 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: "How accurate are the energy estimates?",
      answer:
        "Our calculations use standard appliance wattages from manufacturer specifications and Nigerian grid averages. For the most accurate results, enter your actual monthly fuel spend.",
    },
    {
      question: "How long does the audit take?",
      answer:
        "Most users complete the audit in 3-5 minutes. You'll need to know your business type, approximate generator usage, and have a rough idea of your major appliances.",
    },
    {
      question: "Is the solar pricing real?",
      answer:
        "Yes! We partner with verified Nigerian solar vendors including Femtech Energy, Arnergy, GVE Projects, and SolarForce Nigeria to provide actual current pricing.",
    },
    {
      question: "Can I export my audit results?",
      answer:
        "Absolutely. You can download a PDF report of your complete audit results, including all recommendations and solar matches.",
    },
    {
      question: "Is EcoAudit NG free to use?",
      answer:
        "Yes, the basic energy audit is completely free. We also offer an optional AI-powered detailed report for deeper insights.",
    },
  ];

  return (
    <section className="py-24 relative bg-zinc-950/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Frequently asked <span className="text-emerald-400">questions</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="glass-card-hover">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-white mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-16 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center">
                <img src="/favicon.svg" alt="EcoAudit NG" className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                EcoAudit <span className="text-emerald-400">NG</span>
              </span>
            </div>
            <p className="text-zinc-400 mb-6 max-w-sm">
              AI-powered energy audit platform helping Nigerian SMEs reduce
              costs and transition to sustainable power.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/Ife_abdulsamad"
                className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/ifeabdulsamad"
                className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/audit"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  Start Audit
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  Solar Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                hello@ecoaudit.ng
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4" />
                +234 911 594 1896
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4" />
                UNILORIN, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2025 EcoAudit NG. All rights reserved.
          </p>
          <p className="text-zinc-600 text-sm">
            Estimates based on standard appliance ratings and Nigerian grid
            averages.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PainPointsSection />
      <SolarShowcaseSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
