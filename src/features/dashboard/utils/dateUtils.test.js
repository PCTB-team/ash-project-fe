import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime } from './dateUtils';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restoring date after each test run
    vi.useRealTimers();
  });

  it('should return empty string if no input is provided', () => {
    expect(formatRelativeTime('')).toBe('');
    expect(formatRelativeTime(null)).toBe('');
  });

  it('should return "Vừa xong" for time difference less than 60 seconds', () => {
    const now = new Date('2026-06-23T08:00:00.000Z');
    vi.setSystemTime(now);
    
    // 30 seconds ago
    const past = new Date(now.getTime() - 30 * 1000);
    expect(formatRelativeTime(past.toISOString())).toBe('Vừa xong');
  });

  it('should return "X phút trước" for time difference less than 60 minutes', () => {
    const now = new Date('2026-06-23T08:00:00.000Z');
    vi.setSystemTime(now);
    
    // 15 minutes ago
    const past = new Date(now.getTime() - 15 * 60 * 1000);
    expect(formatRelativeTime(past.toISOString())).toBe('15 phút trước');
  });

  it('should return "X giờ trước" for time difference less than 24 hours', () => {
    const now = new Date('2026-06-23T08:00:00.000Z');
    vi.setSystemTime(now);
    
    // 5 hours ago
    const past = new Date(now.getTime() - 5 * 60 * 60 * 1000);
    expect(formatRelativeTime(past.toISOString())).toBe('5 giờ trước');
  });

  it('should return "Hôm qua" for time difference between 24 and 48 hours', () => {
    const now = new Date('2026-06-23T08:00:00.000Z');
    vi.setSystemTime(now);
    
    // 30 hours ago
    const past = new Date(now.getTime() - 30 * 60 * 60 * 1000);
    expect(formatRelativeTime(past.toISOString())).toBe('Hôm qua');
  });

  it('should return formatted date for time difference more than 48 hours', () => {
    const now = new Date('2026-06-23T08:00:00.000Z');
    vi.setSystemTime(now);
    
    // 5 days ago
    const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    // Since locale date string can depend on environment, we just check if it contains the year
    expect(formatRelativeTime(past.toISOString())).toContain('2026');
  });
});
