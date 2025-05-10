
import { getRiskLevel, getRiskColor } from '@/data/mockData';

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
  className?: string;
}

export function RiskBadge({ score, showScore = true, className = '' }: RiskBadgeProps) {
  const riskLevel = getRiskLevel(score);
  const colorClass = getRiskColor(score);
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ${colorClass} ${className}`}
    >
      {riskLevel === 'low' && "Low Risk"}
      {riskLevel === 'medium' && "Medium Risk"}
      {riskLevel === 'high' && "High Risk"}
      {showScore && ` (${score}/100)`}
    </span>
  );
}
