import { useState, useEffect } from 'react';

const getTimeLeft = () => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diff = endOfDay - now;

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const pad = (n) => String(n).padStart(2, '0');

const TimeBlock = ({ value }) => (
  <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-timer-bg text-white text-sm font-mono font-bold">
    {pad(value)}
  </span>
);

const CountdownTimer = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <TimeBlock value={time.hours} />
      <span className="text-text-primary font-bold text-sm">:</span>
      <TimeBlock value={time.minutes} />
      <span className="text-text-primary font-bold text-sm">:</span>
      <TimeBlock value={time.seconds} />
    </div>
  );
};

export default CountdownTimer;
