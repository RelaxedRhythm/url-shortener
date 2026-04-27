import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserUrls, getAnalytics, API_BASE_URL } from '@/api/url';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

export const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({});
  const navigate = useNavigate();
  const backendOrigin = new URL(API_BASE_URL).origin;

  useEffect(() => {
    fetchUserUrls();
  }, []);

  const fetchUserUrls = async () => {
    try {
      const userUrls = await getUserUrls();
      setUrls(userUrls);
      // Fetch analytics for each URL
      const analyticsData = {};
      for (const url of userUrls) {
        try {
          const data = await getAnalytics(url.shortId);
          analyticsData[url.shortId] = data;
        } catch (err) {
          console.error(`Failed to fetch analytics for ${url.shortId}:`, err);
        }
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {urls.map((url) => {
                const urlAnalytics = analytics[url.shortId];
                return (
                  <Card key={url._id} className="p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                        <a href={url.redirectUrl}> 
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
          )}
        </div>
      </div>
    </div>
  );
};