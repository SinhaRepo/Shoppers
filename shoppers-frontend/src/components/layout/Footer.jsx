import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  'About': [
    { label: 'About Shoppers', to: '/about' },
    { label: 'Careers', href: 'https://in.linkedin.com/in/sinhaansh', external: true },
    { label: 'Blog', to: '/coming-soon' },
    { label: 'About Us', to: '/about' },
    { label: 'Sustainability', to: '/coming-soon' },
  ],
  'Buy': [
    { label: 'Shoppers Pay', to: '/coming-soon' },
    { label: 'Gift Cards', to: '/coming-soon' },
    { label: 'Shoppers Points', to: '/coming-soon' },
    { label: 'Return & Refund', to: '/coming-soon' },
    { label: 'Buyer Protection', to: '/coming-soon' },
  ],
  'Sell': [
    { label: 'Start Selling', to: '/admin' },
    { label: 'Learn to Sell', to: '/coming-soon' },
    { label: 'Seller Center', to: '/admin' },
    { label: 'Affiliate Program', to: '/coming-soon' },
  ],
  'Guide & Help': [
    { label: 'Shoppers Care', to: '/contact' },
    { label: 'How to Buy', to: '/coming-soon' },
    { label: 'How to Sell', to: '/coming-soon' },
    { label: 'Shipping & Delivery', to: '/coming-soon' },
    { label: 'Terms & Conditions', to: '/coming-soon' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { name: 'Twitter', href: 'https://x.com', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
  { name: 'Instagram', href: 'https://instagram.com', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { name: 'LinkedIn', href: 'https://in.linkedin.com/in/sinhaansh', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z' },
];

const Footer = () => {
  return (
    <footer className="bg-bg-footer text-text-footer">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-text-footer-heading font-semibold uppercase text-xs tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-text-footer hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-[13px] text-text-footer hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact / App column — desktop only */}
          <div className="hidden lg:block">
            <h3 className="text-text-footer-heading font-semibold uppercase text-xs tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#777777] flex-shrink-0" />
                New Delhi, India
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#777777] flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#777777] flex-shrink-0" />
                help@shoppers.com
              </li>
            </ul>

            {/* App store buttons */}
            <div className="mt-5 space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#2A2F3E] rounded-lg text-[#AAAAAA] hover:bg-[#3A3F4E] transition-colors text-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#2A2F3E] rounded-lg text-[#AAAAAA] hover:bg-[#3A3F4E] transition-colors text-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.56.69.56 1.19s-.22.92-.56 1.19l-1.97 1.13-2.5-2.5 2.5-2.5 1.97 1.49zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-bg-footer-bottom border-t border-border-footer">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="font-betania text-text-footer-logo text-2xl">
              Shoppers
            </Link>
            <span className="text-[#AAAAAA] text-sm italic hidden sm:inline">
              Let's Shop Beyond Boundaries
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#777777] hover:text-white transition-colors"
                aria-label={social.name}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-[#777777] text-xs text-center md:text-right">
            <p>&copy; 2026 Shoppers. All rights reserved.</p>
            <p className="mt-1">
              Developed by{' '}
              <a
                href="https://in.linkedin.com/in/sinhaansh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#AAAAAA] hover:text-white transition-colors"
              >
                Ansh Sinha
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
