import React, { useState } from 'react';
import { Bell, Check, FileText, Briefcase, FolderOpen, MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, EmptyState } from '@/components/ui';
import { timeAgo } from '@/utils/formatDate';
import { mockNotifications } from '@/data/mockNotifications';
import { markAsRead, markAllAsRead } from '@/services/notifications';
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState('all');
    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = notifications.filter(n => filter === 'all' ? true : !n.read);
    const handleMarkAsRead = (id) => {
        markAsRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const handleMarkAllAsRead = () => {
        markAllAsRead();
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };
    const getIcon = (type) => {
        switch (type) {
            case 'scheme': return <FileText className="w-5 h-5 text-[#A67C65]"/>;
            case 'job': return <Briefcase className="w-5 h-5 text-[#59463B]"/>;
            case 'document': return <FolderOpen className="w-5 h-5 text-amber-600"/>;
            case 'grievance': return <MessageSquare className="w-5 h-5 text-purple-600"/>;
            default: return <Bell className="w-5 h-5 text-[#6B5E55]"/>;
        }
    };
    const getIconBg = (type) => {
        switch (type) {
            case 'scheme': return 'bg-[#E3D5CA]';
            case 'job': return 'bg-[#E3D5CA]';
            case 'document': return 'bg-amber-100';
            case 'grievance': return 'bg-purple-100';
            default: return 'bg-[#EDEDE9]';
        }
    };
    return (<div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D231E]">Notifications</h1>
          <p className="text-[#7D6E63]">Stay updated on your applications, schemes, and grievances.</p>
        </div>
        {unreadCount > 0 && (<Button variant="outline" onClick={handleMarkAllAsRead} className="shrink-0 text-sm">
            <Check className="w-4 h-4 mr-2"/> Mark all as read
          </Button>)}
      </div>

      <div className="flex gap-4 border-b border-[#D6CCC2]">
        <button onClick={() => setFilter('all')} className={cn("pb-3 text-sm font-medium transition-colors border-b-2", filter === 'all' ? "border-[#59463B] text-[#59463B]" : "border-transparent text-[#7D6E63] hover:text-[#43342B]")}>
          All Notifications
        </button>
        <button onClick={() => setFilter('unread')} className={cn("pb-3 text-sm font-medium transition-colors border-b-2 flex items-center", filter === 'unread' ? "border-[#59463B] text-[#59463B]" : "border-transparent text-[#7D6E63] hover:text-[#43342B]")}>
          Unread {unreadCount > 0 && <span className="ml-1.5 bg-[#59463B] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </button>
      </div>

      {filteredNotifications.length === 0 ? (<EmptyState icon={<Bell className="w-12 h-12 text-gray-300"/>} title={filter === 'unread' ? "No unread notifications" : "No notifications"} description="You're all caught up! Check back later for updates."/>) : (<div className="space-y-3">
          {filteredNotifications.map(notification => (<Card key={notification.id} className={cn("p-4 flex gap-4 transition-colors", !notification.read ? "bg-[#FAF7F2] border-l-4 border-[#59463B]" : "bg-white")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1", getIconBg(notification.type))}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className={cn("text-sm text-[#2D231E]", !notification.read ? "font-bold" : "font-medium")}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-[#7D6E63] whitespace-nowrap shrink-0">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[#6B5E55] mb-2">{notification.message}</p>
                
                <div className="flex items-center justify-between">
                  {notification.actionUrl ? (<a href={notification.actionUrl} className="text-xs font-medium text-[#59463B] hover:underline">
                      View details
                    </a>) : <div></div>}

                  {!notification.read && (<button onClick={() => handleMarkAsRead(notification.id)} className="text-xs text-[#7D6E63] hover:text-[#59463B] flex items-center transition-colors">
                      <Check className="w-3 h-3 mr-1"/> Mark as read
                    </button>)}
                </div>
              </div>
            </Card>))}
        </div>)}
    </div>);
}
