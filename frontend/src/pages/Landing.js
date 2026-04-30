import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, TrendingUp, Shield, Users, BarChart3, Globe,
  ArrowRight, DollarSign, Zap, Award, CheckCircle
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Green Investments',
      description: 'Fund solar farms, urban gardens, and renewable energy projects in your community.',
      color: '#10B981'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-grade encryption, JWT authentication, and secure payment processing.',
      color: '#3B82F6'
    },
    {
      icon: TrendingUp,
      title: 'Competitive Returns',
      description: 'Earn attractive interest rates while making a positive environmental impact.',
      color: '#F59E0B'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track your portfolio performance with real-time analytics and insights.',
      color: '#8B5CF6'
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Get personalized project suggestions based on your preferences and goals.',
      color: '#EC4899'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Join a community of eco-conscious investors making a difference worldwide.',
      color: '#14B8A6'
    }
  ];

  const stats = [
    { label: 'Projects Funded', value: '500+' },
    { label: 'Community Members', value: '2,000+' },
    { label: 'Total Invested', value: '$1.2M+' },
    { label: 'CO₂ Reduced', value: '50+ tons' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-green-600">
              <Leaf size={28} />
              Eco-Lender
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
              <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-green-600 transition-colors">How It Works</a>
              <a href="#impact" className="hover:text-green-600 transition-colors">Impact</a>
              <Link to="/blogs" className="hover:text-green-600 transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-green-600 transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-green-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-white" />

        {/* Aurora animated overlay */}
        <div className="hero-aurora" />

        {/* Drifting clouds */}
        {[1,2,3].map(n => (
          <div key={`cloud-${n}`} className={`hero-cloud hero-cloud--${n}`}>
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
              <ellipse cx="60" cy="25" rx="55" ry="15" fill="rgba(148,163,184,0.25)" />
              <ellipse cx="40" cy="20" rx="30" ry="18" fill="rgba(148,163,184,0.2)" />
              <ellipse cx="80" cy="18" rx="28" ry="16" fill="rgba(148,163,184,0.2)" />
            </svg>
          </div>
        ))}

        {/* ── Ecosystem landscape SVG at bottom ── */}
        <div className="hero-ecosystem">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sun with glow */}
            <g className="eco-sun">
              <circle cx="1300" cy="30" r="22" fill="rgba(251,191,36,0.3)" />
              <circle cx="1300" cy="30" r="14" fill="rgba(251,191,36,0.5)" />
            </g>

            {/* Birds */}
            <g className="eco-bird" style={{ transformOrigin: '1200px 25px' }}>
              <path d="M1200 25 Q1205 18 1210 25" stroke="rgba(75,85,99,0.4)" strokeWidth="1.5" fill="none" />
              <path d="M1210 25 Q1215 18 1220 25" stroke="rgba(75,85,99,0.4)" strokeWidth="1.5" fill="none" />
            </g>
            <g className="eco-bird eco-bird--2" style={{ transformOrigin: '1100px 40px' }}>
              <path d="M1100 40 Q1104 34 1108 40" stroke="rgba(75,85,99,0.3)" strokeWidth="1.2" fill="none" />
              <path d="M1108 40 Q1112 34 1116 40" stroke="rgba(75,85,99,0.3)" strokeWidth="1.2" fill="none" />
            </g>
            <g className="eco-bird eco-bird--3" style={{ transformOrigin: '1350px 35px' }}>
              <path d="M1350 35 Q1353 30 1356 35" stroke="rgba(75,85,99,0.35)" strokeWidth="1" fill="none" />
              <path d="M1356 35 Q1359 30 1362 35" stroke="rgba(75,85,99,0.35)" strokeWidth="1" fill="none" />
            </g>

            {/* Back hills */}
            <path d="M0 140 Q200 60 400 110 Q600 70 800 100 Q1000 55 1200 90 Q1350 70 1440 100 L1440 180 L0 180Z"
              fill="rgba(16,185,129,0.08)" />

            {/* Mid hills */}
            <path d="M0 155 Q180 100 350 130 Q550 90 750 125 Q950 85 1150 115 Q1300 95 1440 120 L1440 180 L0 180Z"
              fill="rgba(16,185,129,0.12)" />

            {/* Wind turbine 1 */}
            <g>
              <line x1="280" y1="65" x2="280" y2="135" stroke="rgba(107,114,128,0.3)" strokeWidth="2" />
              <g className="eco-turbine-blades" style={{ transformOrigin: '280px 65px' }}>
                <line x1="280" y1="65" x2="280" y2="35" stroke="rgba(107,114,128,0.35)" strokeWidth="1.5" />
                <line x1="280" y1="65" x2="306" y2="80" stroke="rgba(107,114,128,0.35)" strokeWidth="1.5" />
                <line x1="280" y1="65" x2="254" y2="80" stroke="rgba(107,114,128,0.35)" strokeWidth="1.5" />
              </g>
              <circle cx="280" cy="65" r="2" fill="rgba(107,114,128,0.4)" />
            </g>

            {/* Wind turbine 2 */}
            <g>
              <line x1="340" y1="75" x2="340" y2="130" stroke="rgba(107,114,128,0.25)" strokeWidth="1.5" />
              <g className="eco-turbine-blades eco-turbine-blades--slow" style={{ transformOrigin: '340px 75px' }}>
                <line x1="340" y1="75" x2="340" y2="50" stroke="rgba(107,114,128,0.3)" strokeWidth="1.2" />
                <line x1="340" y1="75" x2="362" y2="87" stroke="rgba(107,114,128,0.3)" strokeWidth="1.2" />
                <line x1="340" y1="75" x2="318" y2="87" stroke="rgba(107,114,128,0.3)" strokeWidth="1.2" />
              </g>
              <circle cx="340" cy="75" r="1.5" fill="rgba(107,114,128,0.35)" />
            </g>

            {/* Trees - group 1 (left) */}
            <g className="eco-tree">
              <rect x="98" y="125" width="4" height="20" rx="1" fill="rgba(120,80,40,0.25)" />
              <ellipse cx="100" cy="115" rx="16" ry="20" fill="rgba(16,185,129,0.2)" />
              <ellipse cx="100" cy="108" rx="12" ry="14" fill="rgba(16,185,129,0.15)" />
            </g>
            <g className="eco-tree eco-tree--2">
              <rect x="138" y="128" width="3" height="16" rx="1" fill="rgba(120,80,40,0.2)" />
              <ellipse cx="140" cy="120" rx="12" ry="16" fill="rgba(34,197,94,0.18)" />
              <ellipse cx="140" cy="114" rx="9" ry="11" fill="rgba(34,197,94,0.12)" />
            </g>

            {/* Trees - group 2 (center-left) */}
            <g className="eco-tree eco-tree--3">
              <rect x="498" y="118" width="4" height="22" rx="1" fill="rgba(120,80,40,0.25)" />
              <path d="M500 70 L485 118 L515 118Z" fill="rgba(16,185,129,0.18)" />
              <path d="M500 80 L489 112 L511 112Z" fill="rgba(16,185,129,0.12)" />
            </g>

            {/* Trees - group 3 (right) */}
            <g className="eco-tree">
              <rect x="1048" y="110" width="4" height="24" rx="1" fill="rgba(120,80,40,0.25)" />
              <ellipse cx="1050" cy="98" rx="18" ry="22" fill="rgba(16,185,129,0.2)" />
              <ellipse cx="1050" cy="90" rx="13" ry="15" fill="rgba(16,185,129,0.14)" />
            </g>
            <g className="eco-tree eco-tree--2">
              <rect x="1098" y="115" width="3" height="18" rx="1" fill="rgba(120,80,40,0.2)" />
              <ellipse cx="1100" cy="107" rx="14" ry="17" fill="rgba(34,197,94,0.18)" />
            </g>
            <g className="eco-tree eco-tree--3">
              <rect x="1138" y="118" width="3" height="16" rx="1" fill="rgba(120,80,40,0.18)" />
              <ellipse cx="1140" cy="112" rx="10" ry="13" fill="rgba(16,185,129,0.16)" />
            </g>

            {/* Solar panels */}
            <g>
              <rect x="700" y="128" width="28" height="3" rx="0.5" fill="rgba(59,130,246,0.2)" transform="rotate(-15, 714, 129)" />
              <line x1="714" y1="131" x2="714" y2="142" stroke="rgba(107,114,128,0.2)" strokeWidth="1.5" />
              <rect x="740" y="130" width="28" height="3" rx="0.5" fill="rgba(59,130,246,0.2)" transform="rotate(-15, 754, 131)" />
              <line x1="754" y1="133" x2="754" y2="142" stroke="rgba(107,114,128,0.2)" strokeWidth="1.5" />
            </g>

            {/* Small house / community building */}
            <g>
              <rect x="880" y="122" width="30" height="22" rx="1" fill="rgba(148,163,184,0.15)" />
              <path d="M876 124 L895 108 L914 124Z" fill="rgba(107,114,128,0.15)" />
              <rect x="890" y="132" width="6" height="12" rx="0.5" fill="rgba(251,191,36,0.2)" />
              <rect x="900" y="128" width="5" height="5" rx="0.5" fill="rgba(186,230,253,0.25)" />
            </g>

            {/* Front ground/grass hill */}
            <path d="M0 165 Q360 140 720 155 Q1080 138 1440 150 L1440 180 L0 180Z"
              fill="rgba(16,185,129,0.18)" />

            {/* Water/pond with shimmer */}
            <ellipse cx="600" cy="170" rx="60" ry="8" fill="rgba(59,130,246,0.1)" />
            <ellipse className="eco-water-shimmer" cx="590" cy="168" rx="15" ry="2" fill="rgba(255,255,255,0.3)" />
            <ellipse className="eco-water-shimmer eco-water-shimmer--2" cx="610" cy="171" rx="12" ry="1.5" fill="rgba(255,255,255,0.25)" />
            <ellipse className="eco-water-shimmer eco-water-shimmer--3" cx="580" cy="172" rx="10" ry="1.5" fill="rgba(255,255,255,0.2)" />

            {/* Small flowers/bushes scattered */}
            <circle cx="50" cy="162" r="4" fill="rgba(16,185,129,0.15)" />
            <circle cx="55" cy="160" r="3" fill="rgba(34,197,94,0.12)" />
            <circle cx="200" cy="158" r="3" fill="rgba(16,185,129,0.12)" />
            <circle cx="450" cy="160" r="5" fill="rgba(34,197,94,0.1)" />
            <circle cx="455" cy="157" r="3" fill="rgba(16,185,129,0.12)" />
            <circle cx="950" cy="155" r="4" fill="rgba(16,185,129,0.12)" />
            <circle cx="1250" cy="158" r="3" fill="rgba(34,197,94,0.1)" />
            <circle cx="1350" cy="160" r="5" fill="rgba(16,185,129,0.12)" />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Leaf size={14} /> Sustainable Micro-Finance Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Invest in a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Greener
              </span>{' '}
              Future
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Lend small amounts to local green initiatives and community gardens.
              Earn returns while reducing CO₂ and building sustainable communities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-200"
              >
                Start Investing <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-green-500 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 py-16" id="impact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-green-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Eco-Lender?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to make sustainable investing accessible, secure, and rewarding.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-green-100 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Three simple steps to start making an impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up in under 2 minutes and set your investment preferences.', icon: Users },
              { step: '02', title: 'Browse Projects', desc: 'Explore curated green initiatives matched to your interests and risk tolerance.', icon: Leaf },
              { step: '03', title: 'Invest & Earn', desc: 'Fund projects with any amount. Track returns, get certificates, and measure your CO₂ impact.', icon: DollarSign }
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="absolute top-4 right-4 text-5xl font-extrabold text-gray-100">{item.step}</span>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-green-100 mb-8 text-lg max-w-xl mx-auto">
              Join thousands of eco-conscious investors who are earning returns while protecting the planet.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-bold transition-colors"
            >
              Create Free Account <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/projects" className="hover:text-green-400">Projects</Link></li>
                <li><Link to="/lenders" className="hover:text-green-400">Lenders</Link></li>
                <li><Link to="/analytics" className="hover:text-green-400">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blogs" className="hover:text-green-400">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-green-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="cursor-pointer hover:text-green-400">Privacy Policy</span></li>
                <li><span className="cursor-pointer hover:text-green-400">Terms of Service</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-green-400">Login</Link></li>
                <li><Link to="/signup" className="hover:text-green-400">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4 md:mb-0">
              <Leaf size={22} className="text-green-500" />
              Eco-Lender
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Eco-Lender. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
