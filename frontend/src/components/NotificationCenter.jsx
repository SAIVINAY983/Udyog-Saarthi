import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import api from '../api';

export default function NotificationCenter({ user, highContrast, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
      <div className={`w-full max-w-md h-full shadow-2xl animate-slide-left p-8 flex flex-col ${highContrast ? 'bg-black border-l-4 border-yellow-300' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-blue-50 text-[#000080]'}`}>
              <Bell size={24} />
            </div>
            <h2 className="text-3xl font-black">Alerts</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all font-black text-xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {loading ? (
            <div className="text-center py-10 opacity-40 italic font-medium">Checking for updates...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <Bell size={48} className="mx-auto mb-4" />
              <p className="font-black text-xl italic uppercase tracking-widest">All caught up!</p>
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                className={`p-6 rounded-[2.5rem] border-2 transition-all relative group ${
                  n.is_read ? 'opacity-50 grayscale bg-gray-50 border-gray-100' : 
                  (highContrast ? 'border-yellow-300 bg-black' : 'bg-white border-blue-50 shadow-sm hover:shadow-md')
                }`}
              >
                {!n.is_read && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                )}
                <div className="space-y-2">
                  <h3 className="text-lg font-black leading-tight">{n.title}</h3>
                  <p className="text-sm font-medium opacity-70 italic">{n.message}</p>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                      <Clock size={12} /> {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.is_read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className={`text-[10px] font-black uppercase tracking-widest hover:underline ${n.type === 'warning' ? 'text-orange-600' : 'text-[#000080]'}`}
                      >
                        I understand
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-8 border-t border-gray-100 mt-auto">
          <button 
            onClick={onClose}
            className={`w-full py-5 rounded-[2rem] font-black text-xl transition-all transform active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-xl shadow-blue-100'}`}
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
