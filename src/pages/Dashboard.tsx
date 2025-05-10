
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, LogOut, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { transactions, getRiskLevel, getRiskColor } from '@/data/mockData';
import { RiskBadge } from '@/components/ui/risk-badge';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const filteredTransactions = transactions.filter(transaction => 
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount.toString().includes(searchTerm)
  );

  const pendingHighRiskTransactions = transactions.filter(
    t => t.status === 'pending' && t.riskScore >= 70
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-finance-DEFAULT mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">CardGuard AI</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Alerts Section */}
        {pendingHighRiskTransactions.length > 0 && (
          <div className="mb-6">
            <div className="bg-danger-light border border-danger-DEFAULT text-danger-DEFAULT px-4 py-3 rounded-lg relative" role="alert">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-bold">High Risk Transaction Alert</p>
                  <p className="text-sm">
                    You have {pendingHighRiskTransactions.length} pending transaction{pendingHighRiskTransactions.length > 1 ? 's' : ''} flagged as potentially fraudulent.
                    Please review and confirm or report them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Status */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>Your current security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secure-DEFAULT">Protected</div>
              <p className="text-sm text-gray-500 mt-1">AI monitoring is active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Cards</CardTitle>
              <CardDescription>Your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-finance-light rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-finance-DEFAULT" />
                </div>
                <div>
                  <div className="font-medium">Visa ending in 4582</div>
                  <div className="text-sm text-gray-500">Expires 04/26</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Summary</CardTitle>
              <CardDescription>Transaction risk breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Risk</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-secure-DEFAULT h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium Risk</span>
                  <span className="text-sm font-medium">19%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-warning-DEFAULT h-2 rounded-full" style={{ width: '19%' }}></div>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Risk</span>
                  <span className="text-sm font-medium">9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-danger-DEFAULT h-2 rounded-full" style={{ width: '9%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Review your transaction history</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="sm:divide-y sm:divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="py-4 sm:py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                          <div className="text-sm text-gray-500">{transaction.date} • {transaction.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <RiskBadge score={transaction.riskScore} />
                        <div className="text-sm font-medium">
                          ${transaction.amount.toFixed(2)}
                        </div>
                        <div>
                          {transaction.status === 'completed' && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Completed
                            </span>
                          )}
                          {transaction.status === 'pending' && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          )}
                          {transaction.status === 'declined' && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Declined
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {transaction.fraudIndicators && transaction.fraudIndicators.length > 0 && (
                      <div className="mt-2 ml-14">
                        <div className="bg-danger-light border-l-4 border-danger-DEFAULT p-2 text-sm">
                          <div className="font-medium text-danger-DEFAULT">Fraud indicators:</div>
                          <ul className="list-disc list-inside text-gray-700">
                            {transaction.fraudIndicators.map((indicator, idx) => (
                              <li key={idx}>{indicator}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No transactions found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
