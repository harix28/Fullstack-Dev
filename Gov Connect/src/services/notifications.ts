import type { Notification } from '@/types';
import { mockNotifications } from '@/data/mockNotifications';

// In-memory mutable copy so read-state changes persist during a session
let notificationsStore: Notification[] = mockNotifications.map((n) => ({ ...n }));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Notifications Service ────────────────────────────────────────────────────

/**
 * Fetch all notifications for the current user.
 * Sorted with unread first, then by date descending.
 *
 * Future: GET to API_ENDPOINTS.notifications.list
 */
export const getNotifications = async (): Promise<Notification[]> => {
  await delay(300);

  return [...notificationsStore].sort((a, b) => {
    // Unread first
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    // Then newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Get the count of unread notifications.
 *
 * Future: GET to API_ENDPOINTS.notifications.list?unread=true (check count field)
 */
export const getUnreadCount = async (): Promise<number> => {
  await delay(150);
  return notificationsStore.filter((n) => !n.isRead).length;
};

/**
 * Mark a single notification as read.
 * Returns the updated notification.
 *
 * Future: PATCH to API_ENDPOINTS.notifications.markRead(id)
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  await delay(200);

  const index = notificationsStore.findIndex((n) => n.id === id);
  if (index === -1) {
    throw new Error(`Notification with id "${id}" not found.`);
  }

  notificationsStore[index] = {
    ...notificationsStore[index],
    isRead: true,
  };

  return { ...notificationsStore[index] };
};

/**
 * Mark all notifications as read.
 * Returns the full updated list.
 *
 * Future: PATCH to API_ENDPOINTS.notifications.markAllRead
 */
export const markAllAsRead = async (): Promise<Notification[]> => {
  await delay(300);

  notificationsStore = notificationsStore.map((n) => ({
    ...n,
    isRead: true,
  }));

  return notificationsStore.map((n) => ({ ...n }));
};
