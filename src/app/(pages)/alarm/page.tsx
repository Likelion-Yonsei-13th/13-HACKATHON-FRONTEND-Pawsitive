"use client";

import { useEffect } from "react";
import PageLayout from "@/app/components/PageLayout";
import { useNotifications } from "@/app/providers/NotificationsProvider";

export default function AlarmPage() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    if (unreadCount > 0) {
      markAllRead();
    }
  }, [unreadCount, markAllRead]);

  return (
    <PageLayout pageTitle="알림">
      <div className="w-full min-h-screen mt-6 space-y-4 px-6">
        {notifications.map((n) => (
          <article
            key={n.id}
            className="rounded-xl bg-white shadow-md px-4 py-4"
          >
            <p className="text-[12px] text-gray-400 mb-1">{n.title}</p>
            <p className="text-sm text-gray-900">{n.message}</p>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
