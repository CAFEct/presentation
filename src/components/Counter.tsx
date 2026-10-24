import { useState, useEffect } from 'react';

interface CounterProps {
  to: number;
  dur?: number;
}

function Counter({ to, dur = 1600 }: CounterProps) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const t = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start - 700) / dur, 1);
      setV(p < 0 ? 0 : Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(t);
    };

    raf = requestAnimationFrame(t);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);

  return <>{v}</>;
}

export default Counter;