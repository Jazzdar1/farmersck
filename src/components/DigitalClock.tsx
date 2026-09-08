import React, { useState, useEffect } from 'react';

interface DigitalClockProps {
  format24?: boolean;
  showDate?: boolean;
}

export default function DigitalClock({ format24 = false, showDate = false }: DigitalClockProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format time
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      if (format24) {
        setTime(`${hours}:${minutes}:${seconds}`);
      } else {
        const hour12 = now.getHours() % 12 || 12;
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        setTime(`${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`);
      }
      
      // Format date
      if (showDate) {
        const dateStr = now.toLocaleDateString('ur-PK', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        setDate(dateStr);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [format24, showDate]);

  return (
    <div className="font-mono text-left">
      <div className="text-sm font-black tracking-wide text-white">{time}</div>
      {showDate && <div className="text-xs text-white/50 mt-1">{date}</div>}
    </div>
  );
}
