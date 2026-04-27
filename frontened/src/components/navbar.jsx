import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navbar({isLoggedIn, user, handleLoginRedirect, handleLogout}){
    const navigate = useNavigate();
  

  return (
    <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>URL Shortener</h1>
          <div className="flex gap-4 items-center">
            {isLoggedIn && user ? (
              <>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Dashboard
                </Button>
                <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{user.name || user.email}</span>
                    <span className="text-xs text-gray-600">{user.email}</span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleLoginRedirect}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Signup
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
  )
}
