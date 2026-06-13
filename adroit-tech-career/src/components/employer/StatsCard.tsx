import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, className = "" }: StatsCardProps) => {
  return (
    <div className={`bg-card rounded-xl p-6 border-2 border-border hover:border-primary/30 transition-all shadow-card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <p className="font-display text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend.isPositive ? "text-green-600" : "text-destructive"
              }`}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
