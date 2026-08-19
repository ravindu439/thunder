// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { randomUUID } from "node:crypto";

const parsedMax = Number.parseInt(process.env.MAX_MESSAGES ?? "", 10);
const MAX_MESSAGES = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 500;

const messages = [];

export function add({ from, to, subject, date, html, text, headers, raw }) {
  if (messages.length >= MAX_MESSAGES) {
    messages.pop();
  }

  const message = {
    id: randomUUID(),
    from,
    to,
    subject,
    date,
    receivedAt: new Date().toISOString(),
    read: false,
    html,
    text,
    headers,
    raw
  };

  messages.unshift(message);
  return message;
}

export function list() {
  return messages.map(({ id, from, to, subject, date, receivedAt, read }) => ({
    id, from, to, subject, date, receivedAt, read
  }));
}

export function get(id) {
  return messages.find(m => m.id === id) || null;
}

export function setRead(id, read) {
  const message = messages.find(m => m.id === id);
  if (message) {
    message.read = read;
  }
  return message || null;
}

export function remove(id) {
  const index = messages.findIndex(m => m.id === id);
  if (index === -1) return false;
  messages.splice(index, 1);
  return true;
}

export function clear() {
  const count = messages.length;
  messages.length = 0;
  return count;
}

export function unreadCount() {
  return messages.filter(m => !m.read).length;
}
