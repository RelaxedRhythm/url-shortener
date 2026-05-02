import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navbar({isLoggedIn, user, handleLoginRedirect, handleLogout}){
    const navigate = useNavigate();
  

  return (
    <nav className="bg-slate-950/95 border-b border-slate-800 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
            U
          </span>
          <div>
            <p className="text-xl font-semibold text-white">URL Shortener</p>
            <p className="text-sm text-slate-400">Fast links, clean analytics</p>
          </div>
        </button>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {isLoggedIn && user ? (
            <>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
              >
                Dashboard
              </Button>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-white">{user.name || user.email}</span>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleLoginRedirect}
                className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-slate-700/20"
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
