'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: string | Date;
  className?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline,
  className,
  onExpire
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        if (onExpire) {
          onExpire();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  if (isExpired) {
    return (
      <div className={cn('text-center', className)}>
        <div className="text-heading-2 font-bold text-error mb-1u">
          Waktu Habis
        </div>
        <p className="text-body-small text-text-secondary">
          Batas waktu borongan telah berakhir
        </p>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  // Determine urgency level for styling
  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  const urgencyLevel = totalHours <= 24 ? 'critical' : totalHours <= 72 ? 'warning' : 'normal';

  const getUrgencyStyles = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          numberColor: 'text-error',
          backgroundColor: 'bg-error/10',
          borderColor: 'border-error/20'
        };
      case 'warning':
        return {
          numberColor: 'text-warning',
          backgroundColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
      default:
        return {
          numberColor: 'text-primary',
          backgroundColor: 'bg-primary/10',
          borderColor: 'border-primary/20'
        };
    }
  };

  const styles = getUrgencyStyles();

  return (
    <div className={cn('text-center', className)}>
      <div className="mb-2u">
        <h4 className="text-body-large font-medium text-text-primary mb-1u">
          Sisa Waktu
        </h4>
        {urgencyLevel === 'critical' && (
          <p className="text-body-small text-error font-medium">
            ⚠️ Waktu hampir habis!
          </p>
        )}
        {urgencyLevel === 'warning' && (
          <p className="text-body-small text-warning font-medium">
            ⏰ Segera berakhir
          </p>
        )}
      </div>

      <div className="flex justify-center gap-2u">
        {timeUnits.map((unit, index) => (
          <div 
            key={unit.label}
            className={cn(
              'flex flex-col items-center p-2u rounded-button border',
              styles.backgroundColor,
              styles.borderColor
            )}
          >
            <div className={cn('text-heading-2 font-bold', styles.numberColor)}>
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-caption text-text-secondary">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 