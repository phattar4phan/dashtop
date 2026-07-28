import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  unit = "%",
}: Props) {
  const [pct, setPct] = useState(0);
  const r = (size - strokeWidth) / 2;
  const circ = r * 2 * Math.PI;
  const cx = size / 2;

  useEffect(() => {
    const t = setTimeout(() => setPct(percentage), 100);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke="rgba(70, 69, 69, 0.4)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke="#00ACAC"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            animate={{
              strokeDashoffset: circ - (pct / 100) * circ,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(0, 172, 172, 0.4))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <NumberFlow
            value={Math.round(percentage)}
            className="text-2xl font-bold text-dt-text"
          />
        </div>
      </div>
      {label && (
        <div className="text-center">
          <span className="text-xs font-medium text-dt-muted uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs text-dt-muted ml-1">{unit}</span>
        </div>
      )}
    </div>
  );
}
