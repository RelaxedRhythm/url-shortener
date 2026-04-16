import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navbar({isLoggedIn,handleLoginRedirect,handleLogout}){
    const navigate = useNavigate();
  

  return (
    <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">URL Shortener</h1>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-600 py-2">Logged In</span>
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
