
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Search, AlertCircle, Settings, Users, CreditCard, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { transactions, fraudMetrics } from '@/data/mockData';
import { RiskBadge } from '@/components/ui/risk-badge';

const AdminDashboard = () => {
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
    transaction.amount.toString().includes(searchTerm) ||
    transaction.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort transactions by risk score (highest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.riskScore - a.riskScore);
  
  // High risk transactions
  const highRiskTransactions = sortedTransactions.filter(t => t.riskScore >= 70);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-finance-DEFAULT mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CardGuard AI</h1>
              <div className="text-xs text-gray-500">Admin Dashboard</div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">
              {user?.name} (Admin)
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
        {/* Metrics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudMetrics.totalTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Flagged Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning-DEFAULT">{fraudMetrics.flaggedTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">Requiring review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Blocked Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-danger-DEFAULT">{fraudMetrics.blockedTransactions}</div>
              <p className="text-xs text-gray-500 mt-1">Prevented fraud attempts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{fraudMetrics.averageRiskScore}/100</div>
              <p className="text-xs text-gray-500 mt-1">Platform average</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="high-risk" className="mb-6">
          <TabsList>
            <TabsTrigger value="high-risk" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> High Risk ({highRiskTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="all-transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> All Transactions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> AI Settings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="high-risk" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Transactions</CardTitle>
                <CardDescription>Transactions that require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {highRiskTransactions.length > 0 ? (
                  <div className="space-y-6">
                    {highRiskTransactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-lg font-medium">{transaction.merchant}</div>
                            <div className="text-sm text-gray-500">
                              {transaction.date} • ${transaction.amount.toFixed(2)} • Card ending {transaction.cardLastFour}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <RiskBadge score={transaction.riskScore} className="text-sm" />
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                            <div className="text-sm">{transaction.location}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Device</div>
                            <div className="text-sm">{transaction.deviceId}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">IP Address</div>
                            <div className="text-sm">{transaction.ipAddress}</div>
                          </div>
                        </div>
                        
                        {transaction.fraudIndicators && (
                          <div className="bg-danger-light border-l-4 border-danger-DEFAULT p-3 rounded">
                            <div className="font-medium text-danger-DEFAULT mb-1">AI Fraud Detection Indicators:</div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {transaction.fraudIndicators.map((indicator, idx) => (
                                <li key={idx}>{indicator}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-end gap-3">
                          <Button variant="outline" size="sm">
                            Mark as Safe
                          </Button>
                          <Button variant="destructive" size="sm">
                            Confirm Fraud
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No high-risk transactions found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all-transactions" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>Complete transaction history</CardDescription>
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
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Merchant</th>
                        <th scope="col" className="px-4 py-3">Amount</th>
                        <th scope="col" className="px-4 py-3">Location</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Risk</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{transaction.date}</td>
                          <td className="px-4 py-3 font-medium">{transaction.merchant}</td>
                          <td className="px-4 py-3">${transaction.amount.toFixed(2)}</td>
                          <td className="px-4 py-3">{transaction.location}</td>
                          <td className="px-4 py-3">
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
                          </td>
                          <td className="px-4 py-3">
                            <RiskBadge score={transaction.riskScore} />
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Detection Settings</CardTitle>
                <CardDescription>Configure fraud detection parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium mb-2">AI Model Configuration</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      The AI model is currently active and monitoring transactions in real-time.
                      Last updated: 2 days ago
                    </p>
                    <Button variant="outline" size="sm">Update AI Model</Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium mb-2">Threshold Settings</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Configure the risk score thresholds for transaction handling
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Low Risk</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">0</span>
                          <div className="h-2 flex-grow bg-secure-DEFAULT rounded"></div>
                          <span className="text-sm text-gray-500">30</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Auto-approved</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Medium Risk</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">30</span>
                          <div className="h-2 flex-grow bg-warning-DEFAULT rounded"></div>
                          <span className="text-sm text-gray-500">70</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Additional verification</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">High Risk</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">70</span>
                          <div className="h-2 flex-grow bg-danger-DEFAULT rounded"></div>
                          <span className="text-sm text-gray-500">100</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Manual review required</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">Adjust Thresholds</Button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium mb-2">Detection Factors</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Select which factors the AI should prioritize when analyzing transactions
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-2 border rounded bg-white">
                        <div>
                          <div className="font-medium">Geographic Location</div>
                          <div className="text-xs text-gray-500">Detect unusual transaction locations</div>
                        </div>
                        <div className="text-sm font-medium text-secure-DEFAULT">Enabled</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border rounded bg-white">
                        <div>
                          <div className="font-medium">Transaction Amount</div>
                          <div className="text-xs text-gray-500">Flag unusually large transactions</div>
                        </div>
                        <div className="text-sm font-medium text-secure-DEFAULT">Enabled</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border rounded bg-white">
                        <div>
                          <div className="font-medium">Device Recognition</div>
                          <div className="text-xs text-gray-500">Track and verify user devices</div>
                        </div>
                        <div className="text-sm font-medium text-secure-DEFAULT">Enabled</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border rounded bg-white">
                        <div>
                          <div className="font-medium">Purchase Category</div>
                          <div className="text-xs text-gray-500">Analyze purchase patterns</div>
                        </div>
                        <div className="text-sm font-medium text-secure-DEFAULT">Enabled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and permissions</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  User management functionality will be available in the next version.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
