import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate sending — replace with EmailJS or a real backend endpoint later
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    }, 1200);
  };

  const inputCls =
    'w-full px-4 py-3 rounded-lg border border-border-input bg-bg-input text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:border-text-primary transition-colors';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-bg-page">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-betania text-4xl text-text-primary mb-3"
          >
            Shoppers Care
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted"
          >
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4 pb-20 -mt-4">
        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16 rounded-xl border border-border-divider bg-bg-card"
          >
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Thank you!</h2>
            <p className="text-text-muted text-sm max-w-xs mx-auto">
              Your message has been received. We'll get back to you soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
              className="mt-6 px-5 py-2 text-sm rounded-lg border border-border-divider text-text-primary hover:bg-[#1a1a1a] transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="rounded-xl border border-border-divider bg-bg-card p-6 md:p-8 space-y-5"
          >
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2">
                <User size={13} />
                Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2">
                <Mail size={13} />
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2">
                <MessageSquare size={13} />
                Subject
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className={inputCls}
              />
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-2">
                <MessageSquare size={13} />
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-btn-primary-bg text-btn-primary-text text-sm font-medium hover:bg-[#222] transition-colors disabled:opacity-60"
            >
              {sending ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        )}
      </section>
    </motion.div>
  );
};

export default Contact;
