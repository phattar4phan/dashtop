import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  className?: string;
}

export default function MiniLineChart({
  data,
  width = 200,
  height = 60,
  color = "#dd700b",
  showGrid = true,
  className = "",
}: Props) {
  const smoothPath = useMemo(() => {
    if (data.length < 2) return "";
    const hi = Math.max(...data, 1);
    const lo = Math.min(...data, 0);
    const range = hi - lo || 1;
    const pad = 4;
    const pts = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (width - pad * 2),
      y: height - pad - ((v - lo) / range) * (height - pad * 2),
    }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].x + pts[i].x) / 2;
      d += ` C ${cpx} ${pts[i - 1].y}, ${cpx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!smoothPath) return "";
    return `${smoothPath} L ${width} ${height} L 0 ${height} Z`;
  }, [smoothPath, width, height]);

  const gradId = `g-${color.replace("#", "")}`;

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {showGrid &&
        [0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={0}
            y1={height - height * p}
            x2={width}
            y2={height - height * p}
            stroke="#adaca7"
            strokeWidth={0.5}
          />
        ))}
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {data.length >= 2 && (
        <>
          <motion.path
            d={fillPath}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={smoothPath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="butt"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </>
      )}
    </motion.svg>
  );
}
