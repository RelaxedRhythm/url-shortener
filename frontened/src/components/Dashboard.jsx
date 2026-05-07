import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserUrls, getAnalytics, API_BASE_URL } from '@/api/url';
import { checkAuth } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    mostClickedUrl: null,
    avgClicksPerUrl: 0
  });
  const [chartData, setChartData] = useState({
    topUrls: [],
    clicksOverTime: []
  });
  const navigate = useNavigate();
  const backendOrigin = new URL(API_BASE_URL).origin;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await checkAuth();
      setIsLoggedIn(authStatus.isLoggedIn);
      if (authStatus.user) {
        setUser(authStatus.user);
      } else {
        setLoading(false);
        return;
      }
      await fetchUserUrls();
    } catch (err) {
      console.error('Auth check failed:', err);
      setLoading(false);
    }
  };

  const fetchUserUrls = async () => {
    try {
      const userUrls = await getUserUrls();
      setUrls(userUrls);
      // Fetch analytics for each URL
      const analyticsData = {};
      let totalClicks = 0;
      const urlClicks = [];

      for (const url of userUrls) {
        try {
          const data = await getAnalytics(url.shortId);
          analyticsData[url.shortId] = data;
          totalClicks += data.totalClicks;
          urlClicks.push({
            shortId: url.shortId,
            redirectUrl: url.redirectUrl,
            clicks: data.totalClicks,
            analytics: data.analytics
          });
        } catch (err) {
          console.error(`Failed to fetch analytics for ${url.shortId}:`, err);
        }
      }

      // Calculate summary stats
      const mostClickedUrl = urlClicks.reduce((max, url) => 
        url.clicks > max.clicks ? url : max, 
        { clicks: 0, redirectUrl: 'None' }
      );

      const avgClicksPerUrl = userUrls.length > 0 ? (totalClicks / userUrls.length).toFixed(1) : 0;

      setSummaryStats({
        totalUrls: userUrls.length,
        totalClicks,
        mostClickedUrl: mostClickedUrl.clicks > 0 ? mostClickedUrl : null,
        avgClicksPerUrl
      });

      // Prepare chart data
      const topUrls = urlClicks
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10)
        .map(url => ({
          name: url.redirectUrl.length > 30 ? url.redirectUrl.substring(0, 30) + '...' : url.redirectUrl,
          clicks: url.clicks
        }));

      // Aggregate clicks over time (last 30 days)
      const clicksByDate = {};
      urlClicks.forEach(url => {
        url.analytics.forEach(visit => {
          const date = new Date(visit.timestamp).toISOString().split('T')[0];
          clicksByDate[date] = (clicksByDate[date] || 0) + 1;
        });
      });

      const clicksOverTime = Object.entries(clicksByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30) // Last 30 days
        .map(([date, clicks]) => ({
          date: new Date(date).toLocaleDateString(),
          clicks
        }));

      setChartData({ topUrls, clicksOverTime });
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (shortId) => {
    const fullUrl = `${backendOrigin}/url/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Copied to clipboard!');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
    alert('Logged out successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar isLoggedIn={isLoggedIn} user={user} handleLoginRedirect={handleLoginRedirect} handleLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar isLoggedIn={isLoggedIn} user={user} handleLoginRedirect={handleLoginRedirect} handleLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your analytics dashboard</p>
            <Button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700">
              Go to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar isLoggedIn={isLoggedIn} user={user} handleLoginRedirect={handleLoginRedirect} handleLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar isLoggedIn={isLoggedIn} user={user} handleLoginRedirect={handleLoginRedirect} handleLogout={handleLogout} />
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 mt-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your shortened URLs performance</p>
          </div>

          {urls.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">No URLs found. Create some short URLs first!</p>
              <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700">
                Go to Home
              </Button>
            </Card>
          ) : (
            <>
              {/* Summary Statistics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.totalUrls}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.totalClicks}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Clicks/URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summaryStats.avgClicksPerUrl}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most Clicked URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium truncate">
                      {summaryStats.mostClickedUrl ? 
                        summaryStats.mostClickedUrl.redirectUrl.length > 25 ? 
                          summaryStats.mostClickedUrl.redirectUrl.substring(0, 25) + '...' : 
                          summaryStats.mostClickedUrl.redirectUrl : 
                        'None'
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {summaryStats.mostClickedUrl ? `${summaryStats.mostClickedUrl.clicks} clicks` : ''}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Top URLs Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing URLs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        clicks: {
                          label: "Clicks",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <BarChart data={chartData.topUrls}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="clicks" fill="var(--color-clicks)" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Clicks Over Time Line Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Clicks Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        clicks: {
                          label: "Clicks",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <LineChart data={chartData.clicksOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={12}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="var(--color-clicks)" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Individual URL Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {urls.map((url) => {
                  const urlAnalytics = analytics[url.shortId];
                  return (
                    <Card key={url._id} className="p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                          <a href={url.redirectUrl} target="_blank" rel="noopener noreferrer"> 
                            {url.redirectUrl}
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Short URL:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {url.shortId}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleCopyUrl(url.shortId)}
                              className="text-xs"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Clicks:</span>
                          <span className="font-bold text-lg text-indigo-600">
                            {urlAnalytics ? urlAnalytics.totalClicks : 0}
                          </span>
                        </div>
                        {urlAnalytics && urlAnalytics.analytics.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600 block mb-2">Recent Visits:</span>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {urlAnalytics.analytics.slice(-5).reverse().map((visit, index) => (
                                <div key={index} className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  {new Date(visit.timestamp).toLocaleString()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          Created: {new Date(url.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};