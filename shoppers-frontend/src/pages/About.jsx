import { motion } from 'framer-motion';
import { Github, Linkedin, Code2, Database, Layout, Server, Layers, Sparkles } from 'lucide-react';

const techStack = [
  { name: 'React 19', desc: 'Component-based UI with hooks & context', icon: Layout, color: '#61DAFB' },
  { name: 'Tailwind CSS v4', desc: 'Utility-first responsive styling', icon: Sparkles, color: '#38BDF8' },
  { name: 'Framer Motion', desc: 'Page transitions & micro-animations', icon: Layers, color: '#FF6B9D' },
  { name: 'Spring Boot 4', desc: 'RESTful API with JPA & PostgreSQL', icon: Server, color: '#6DB33F' },
  { name: 'Supabase PostgreSQL', desc: 'Cloud-hosted relational database', icon: Database, color: '#3ECF8E' },
  { name: 'Vite', desc: 'Lightning-fast dev server & build tool', icon: Code2, color: '#646CFF' },
];

const features = [
  'Full product catalog with category-specific attributes',
  'Multi-image product galleries (up to 5 images)',
  'Real-time search with debounced API calls',
  'Shopping cart with quantity management',
  'Wishlist with localStorage persistence',
  'User authentication (login / register)',
  'Order checkout flow with address collection',
  'Order history tracking',
  'Product review & rating system',
  'Admin panel for product CRUD operations',
  'Flash sale countdown timer',
  'Responsive design — mobile to desktop',
];

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-bg-page">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-border-divider text-xs text-text-muted mb-6">
              Full-Stack Portfolio Project
            </span>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-betania text-4xl md:text-5xl text-text-primary mb-4"
          >
            About Shoppers
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A modern, full-stack e-commerce platform built to demonstrate real-world
            software engineering skills — from RESTful APIs and database design to
            responsive UI and state management.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <a
              href="https://github.com/sinhaansh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Github size={18} />
              View on GitHub
            </a>
            <a
              href="https://in.linkedin.com/in/sinhaansh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-divider text-text-primary text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-text-primary text-center mb-2">Tech Stack</h2>
        <p className="text-text-muted text-center mb-10">The tools and frameworks powering this project</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group p-5 rounded-xl border border-border-divider bg-bg-card hover:border-[#333] transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${tech.color}15` }}
                >
                  <tech.icon size={18} style={{ color: tech.color }} />
                </div>
                <h3 className="font-medium text-text-primary">{tech.name}</h3>
              </div>
              <p className="text-text-muted text-sm">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-text-primary text-center mb-2">Features</h2>
        <p className="text-text-muted text-center mb-10">What's implemented in this project</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-start gap-2.5 py-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{feature}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Built By */}
      <section className="border-t border-border-divider">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-text-muted text-sm mb-1">Built with care by</p>
          <a
            href="https://in.linkedin.com/in/sinhaansh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary font-medium text-lg hover:underline"
          >
            Ansh Sinha
          </a>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
