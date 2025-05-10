
import { subDays, format } from 'date-fns';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: string;
  status: 'completed' | 'pending' | 'declined';
  riskScore: number; // 0-100 where higher is riskier
  cardLastFour: string;
  location: string;
  deviceId: string;
  ipAddress: string;
  fraudIndicators?: string[];
}

// Generate dates starting from today and going back
const generatePastDate = (daysAgo: number): string => {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
};

export const transactions: Transaction[] = [
  {
    id: 't1',
    date: generatePastDate(1),
    amount: 42.99,
    merchant: 'Amazon',
    category: 'Shopping',
    status: 'completed',
    riskScore: 15,
    cardLastFour: '4582',
    location: 'New York, USA',
    deviceId: 'desktop-chrome-macos',
    ipAddress: '192.168.1.1'
  },
  {
    id: 't2',
    date: generatePastDate(2),
    amount: 126.35,
    merchant: 'Walmart',
    category: 'Groceries',
    status: 'completed',
    riskScore: 8,
    cardLastFour: '4582',
    location: 'New York, USA',
    deviceId: 'desktop-chrome-macos',
    ipAddress: '192.168.1.1'
  },
  {
    id: 't3',
    date: generatePastDate(3),
    amount: 899.99,
    merchant: 'Best Buy',
    category: 'Electronics',
    status: 'completed',
    riskScore: 35,
    cardLastFour: '4582',
    location: 'Chicago, USA',
    deviceId: 'mobile-safari-ios',
    ipAddress: '172.16.254.1'
  },
  {
    id: 't4',
    date: generatePastDate(4),
    amount: 1299.99,
    merchant: 'Apple',
    category: 'Electronics',
    status: 'declined',
    riskScore: 92,
    cardLastFour: '4582',
    location: 'Lagos, Nigeria',
    deviceId: 'unknown-device',
    ipAddress: '91.243.85.126',
    fraudIndicators: ['Unusual location', 'New device', 'Large amount']
  },
  {
    id: 't5',
    date: generatePastDate(5),
    amount: 75.00,
    merchant: 'Uber',
    category: 'Transportation',
    status: 'completed',
    riskScore: 12,
    cardLastFour: '4582',
    location: 'New York, USA',
    deviceId: 'mobile-safari-ios',
    ipAddress: '172.16.254.1'
  },
  {
    id: 't6',
    date: generatePastDate(0), // Today
    amount: 4999.99,
    merchant: 'Electronics Superstore',
    category: 'Electronics',
    status: 'pending',
    riskScore: 88,
    cardLastFour: '4582',
    location: 'Moscow, Russia',
    deviceId: 'unknown-device',
    ipAddress: '77.108.56.121',
    fraudIndicators: ['Unusual location', 'New device', 'Large amount']
  }
];

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 30) return 'low';
  if (score < 70) return 'medium';
  return 'high';
};

export const getRiskColor = (score: number): string => {
  if (score < 30) return 'bg-secure-light text-secure-DEFAULT';
  if (score < 70) return 'bg-warning-light text-warning-DEFAULT';
  return 'bg-danger-light text-danger-DEFAULT';
};

// Aggregated fraud metrics for admin dashboard
export const fraudMetrics = {
  totalTransactions: 145,
  flaggedTransactions: 12,
  blockedTransactions: 7,
  averageRiskScore: 24,
  mostCommonIndicator: 'Unusual location',
  riskDistribution: [
    { level: 'Low Risk', count: 104, percentage: 72 },
    { level: 'Medium Risk', count: 28, percentage: 19 },
    { level: 'High Risk', count: 13, percentage: 9 }
  ]
};
