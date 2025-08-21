"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { Notification } from "@/app/lib/notification_data";
import { DUMMY_NOTIFS } from "@/app/lib/notification_data";

type Ctx = {
  notifications: Notification[];
  unreadCount: number;
  add: (n: Omit<Notification, "id"> & { id?: string }) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  setAll: (list: Notification[]) => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(
    DUMMY_NOTIFS.map((n) => ({ ...n, ts: n.ts ?? Date.now() }))
  );

  const unreadCount = useMemo(
    () => notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0),
    [notifications]
  );

  const add = useCallback<Ctx["add"]>((n) => {
    const id =
      n.id ?? `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setNotifications((prev) => [
      { id, ...n, read: n.read ?? false, ts: n.ts ?? Date.now() },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      let changed = false;
      const next = prev.map((n) => {
        if (!n.read) {
          changed = true;
          return { ...n, read: true };
        }
        return n;
      });
      // 변경이 없으면 동일 참조 반환 -> 불필요 렌더 방지함
      return changed ? next : prev;
    });
  }, []);

  const markRead = useCallback<Ctx["markRead"]>((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const setAll = useCallback<Ctx["setAll"]>(
    (list) => setNotifications(list),
    []
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, add, markAllRead, markRead, setAll }),
    [notifications, unreadCount, add, markAllRead, markRead, setAll]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): Ctx {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
}
