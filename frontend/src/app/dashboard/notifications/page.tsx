"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { setHasUnread } = useNotification();
  const router = useRouter();

  // Unread count nikalne ke liye
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    api.get("/notifications")
      .then(res => setNotifications(res.data.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const markAllRead = async () => {
      try {
        await api.patch("/notifications/mark-all-read");
        // Thodi der baad unread status update karenge taaki user dekh sake kitne naye the
        setTimeout(() => setHasUnread(false), 3000);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    if (notifications.length > 0) markAllRead();
  }, [notifications.length, setHasUnread]);

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <div className="max-w-2xl mx-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1.5 w-8 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Inbox</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Notifications</h1>
          </div>
          
          {/* NEW NOTIFICATION COUNTER */}
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-indigo-100 animate-bounce">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <p className="text-[11px] font-black text-slate-700 uppercase">
                {unreadCount} New Messages
              </p>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Clean Slate. No Alerts.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => n.data?.taskId && router.push(`/tasks/${n.data.taskId}`)}
                className={`
                  relative group transition-all duration-500
                  p-6 rounded-[2rem] border-2 flex items-center gap-5
                  ${n.isRead 
                    ? 'bg-white/60 border-transparent hover:border-slate-100 hover:bg-white' 
                    : 'bg-white border-indigo-100 shadow-xl shadow-indigo-100/20 ring-1 ring-indigo-50'
                  }
                `}
              >
                {/* ICON BOX */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110
                  ${n.isRead ? 'bg-slate-50 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}
                `}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-[14px] font-black tracking-tight ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md tracking-tighter uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-[11.5px] font-medium leading-relaxed ${n.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                    {n.message}
                  </p>
                </div>

                {/* TIME STAMP */}
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* SIDE HIGHLIGHT FOR NEW */}
                {!n.isRead && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}