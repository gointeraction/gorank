import { defineTable, column } from 'astro:db';

export const ContactMessages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, default: crypto.randomUUID() }),
    name: column.text(),
    email: column.text(),
    phone: column.text({ optional: true }),
    subject: column.text(),
    message: column.text(),
    createdAt: column.date({ default: new Date() }),
    isRead: column.boolean({ default: false }),
    status: column.text({ default: 'new' }) // 'new', 'in_progress', 'resolved', 'spam'
  }
});
