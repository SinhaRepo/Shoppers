const Badge = ({ children, variant = 'red', className = '' }) => {
  const variants = {
    red: 'bg-red-badge text-white',
    gray: 'bg-[#888888] text-white',
    green: 'bg-detail-savings-text text-white',
    outline: 'bg-transparent border border-border-card text-text-secondary',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${variants[variant] || variants.red} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
