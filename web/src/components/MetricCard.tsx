import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";

interface Props {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  accent = false,
  className = "",
}: Props) {
  return (
    <motion.div
      className={`brutal-card p-5 flex flex-col gap-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-dt-muted text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className={accent ? "text-dt-accent" : "text-dt-muted"}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <NumberFlow
          value={value}
          className={`text-3xl font-bold tracking-tight ${
            accent ? "text-dt-accent" : "text-dt-text"
          }`}
        />
        {unit && (
          <span className="text-dt-muted text-sm font-medium">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}
