import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MaintenanceRatingProps {
  rating: number; // 0-100
  trend?: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
}

export function MaintenanceRating({ rating, trend = 'stable', size = 'md' }: MaintenanceRatingProps) {
  const getColor = () => {
    if (rating >= 80) return 'text-success';
    if (rating >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getLabel = () => {
    if (rating >= 90) return 'Excellent';
    if (rating >= 80) return 'Great';
    if (rating >= 60) return 'Good';
    if (rating >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      <div className={`flex items-center gap-1 ${getColor()}`}>
        <Star className={starSizes[size]} fill="currentColor" />
        <span className="font-semibold">{rating}</span>
      </div>
      <span className="text-muted-foreground">/ 100</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        rating >= 80 ? 'bg-success/10 text-success' :
        rating >= 60 ? 'bg-warning/10 text-warning' :
        'bg-destructive/10 text-destructive'
      }`}>
        {getLabel()}
      </span>
      {trend !== 'stable' && (
        <TrendIcon className={`w-3 h-3 ${trend === 'up' ? 'text-success' : 'text-destructive'}`} />
      )}
    </div>
  );
}
