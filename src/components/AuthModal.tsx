import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/mockData';
import { User, UserRole } from '../types';
import { ShieldCheck, X, Key, Check, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUser } = useApp();
  const [selectedUser, setSelectedUser] = useState<User>(currentUser);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === selectedUser.pin) {
      switchUser(selectedUser);
      setPinInput('');
      setError('');
      onClose();
    } else {
      setError('Invalid PIN code! (Default PINs: Admin=1234, Manager=5678, Cashier=0000)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-cyan-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-white">Role-Based Access Switcher</h3>
          <p className="text-xs text-slate-400">
            Switch staff account to test permission access levels.
          </p>
        </div>

        {/* User Role Selection Cards */}
        <div className="space-y-2">
          {INITIAL_USERS.map((usr) => {
            const isSelected = selectedUser.id === usr.id;
            return (
              <div
                key={usr.id}
                onClick={() => {
                  setSelectedUser(usr);
                  setError('');
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{usr.name}</h4>
                    <p className="text-[10px] text-cyan-400 uppercase font-mono font-semibold">
                      Role: {usr.role}
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </div>
            );
          })}
        </div>

        {/* PIN Verification Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Enter Staff PIN for {selectedUser.name.split(' ')[0]}
            </label>
            <input
              type="password"
              maxLength={4}
              required
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-cyan-500"
            />
            {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl text-[10px] text-slate-400 space-y-0.5">
            <p className="font-bold text-slate-300">🔑 Demo Access PIN Codes:</p>
            <p>• Admin (Muhammad Sajid): <span className="font-mono text-cyan-400 font-bold">1234</span></p>
            <p>• Store Manager (Zeeshan): <span className="font-mono text-cyan-400 font-bold">5678</span></p>
            <p>• Cashier (Sajid): <span className="font-mono text-cyan-400 font-bold">0000</span></p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-extrabold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
          >
            Authenticate & Switch User
          </button>
        </form>
      </div>
    </div>
  );
};
