import { motion } from 'framer-motion';
import { Construction, Github, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[70vh] flex items-center justify-center px-4"
    >
      <div className="max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border border-border-divider flex items-center justify-center mx-auto mb-6"
        >
          <Construction size={36} className="text-amber-400" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-betania text-3xl text-text-primary mb-3"
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted leading-relaxed mb-2"
        >
          Thanks for exploring!{' '}
          <span className="text-text-primary font-medium">Shoppers</span> is a
          technical portfolio project built by{' '}
          <a
            href="https://in.linkedin.com/in/sinhaansh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary underline underline-offset-2 hover:text-white"
          >
            Ansh Sinha
          </a>
          .
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-text-muted text-sm mb-8"
        >
          While this page isn't built out yet, you can check out the source code on
          GitHub to see how the platform was engineered from scratch.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-divider text-text-primary text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <a
            href="https://github.com/sinhaansh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Github size={16} />
            View Source Code
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComingSoon;
