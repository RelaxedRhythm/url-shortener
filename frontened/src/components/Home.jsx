import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldContent, FieldError } from '@/components/ui/field';
import { generateShortUrl, generateCustomUrl, API_BASE_URL } from '@/api/url';
import { useNavigate } from 'react-router-dom';

import  Navbar  from './navbar';

export const Home = () => {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'custom'
  const [urlInput, setUrlInput] = useState('');
  const [customId, setCustomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const backendOrigin = new URL(API_BASE_URL).origin;
  const shortLinkPrefix = `${backendOrigin}/url`;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // You could also decode the token to get user info
  }, []);

  const handleGenerateQuickUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedUrl('');

    try {
      if (!urlInput.trim()) {
        throw new Error('Please enter a URL');
      }
      const result = await generateShortUrl(urlInput);
      console.log(result);
      setGeneratedUrl(result.id);
      setUrlInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log('generated url',generatedUrl)

  };

  const handleGenerateCustomUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedUrl('');

    try {
      if (!isLoggedIn) {
        setError('Please log in to create a custom URL');
        return;
      }
      if (!urlInput.trim() || !customId.trim()) {
        throw new Error('Please enter both URL and custom ID');
      }

      const token = localStorage.getItem('token');
      const result = await generateCustomUrl(urlInput, customId, token);
      setGeneratedUrl(result.id);
      setUrlInput('');
      setCustomId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    const fullUrl = `${shortLinkPrefix}/${generatedUrl}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Copied to clipboard!');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('Logged out successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <Navbar isLoggedIn={isLoggedIn} handleLoginRedirect={handleLoginRedirect}
      handleLogout={handleLogout}/>

      <div className="p-4">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Make your links short and shareable</p>
        </div>

        {/* Tabs */}
        <Card className="p-0 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'quick'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Shorten
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom URL
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Shorten Tab */}
            {activeTab === 'quick' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Random Short URL</h2>
                <form onSubmit={handleGenerateQuickUrl} className="space-y-4">
                  <Field>
                    <FieldLabel>Enter your URL</FieldLabel>
                    <FieldContent>
                      <Input
                        type="url"
                        placeholder="https://example.com/very/long/url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        disabled={loading}
                      />
                    </FieldContent>
                  </Field>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Short URL'}
                  </Button>
                </form>

                {generatedUrl && (
                  <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold mb-2">✓ URL Generated Successfully!</p>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        readOnly
                        value={`${shortLinkPrefix}/${generatedUrl}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white"
                      />
                      <Button
                        onClick={handleCopyToClipboard}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Short ID: <span className="font-mono font-bold">{generatedUrl}</span></p>
                  </div>
                )}
              </div>
            )}

            {/* Custom URL Tab */}
            {activeTab === 'custom' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Custom Short URL</h2>

                {!isLoggedIn ? (
                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-yellow-800 mb-4">
                      📌 <strong>Log in required</strong> to create custom short URLs
                    </p>
                    <Button
                      onClick={handleLoginRedirect}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6"
                    >
                      Go to Login
                    </Button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleGenerateCustomUrl} className="space-y-4">
                      <Field>
                        <FieldLabel>Enter your URL</FieldLabel>
                        <FieldContent>
                          <Input
                            type="url"
                            placeholder="https://example.com/very/long/url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            disabled={loading}
                          />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel>Custom Short ID</FieldLabel>
                        <FieldContent>
                          <Input
                            type="text"
                            placeholder="my-awesome-link"
                            value={customId}
                            onChange={(e) => setCustomId(e.target.value)}
                            disabled={loading}
                          />
                        </FieldContent>
                      </Field>

                      {error && <div className="text-red-500 text-sm">{error}</div>}

                      <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create Custom URL'}
                      </Button>
                    </form>

                    {generatedUrl && (
                      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-semibold mb-2">✓ Custom URL Created!</p>
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="text"
                            readOnly
                            value={`${shortLinkPrefix}/${generatedUrl}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white"
                          />
                          <Button
                            onClick={handleCopyToClipboard}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">Short ID: <span className="font-mono font-bold">{generatedUrl}</span></p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-blue-50">
          <h3 className="text-lg font-bold text-gray-800 mb-3">How it works</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ <strong>Quick Shorten:</strong> Generate a random short URL instantly, no login needed</li>
            <li>✓ <strong>Custom URL:</strong> Create a memorable custom short link (login required)</li>
            <li>✓ <strong>Share:</strong> Copy and share your short links anywhere</li>
          </ul>
        </Card>
        </div>
      </div>
    </div>
  );
};
