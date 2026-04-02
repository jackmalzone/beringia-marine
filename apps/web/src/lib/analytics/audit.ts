export type AuditProvider = 'meta' | 'gtm' | 'config';
export type AuditStatus = 'queued' | 'sent' | 'skipped';

export interface AuditEvent {
  ts: number;
  provider: AuditProvider;
  name: string;
  params?: Record<string, unknown>;
  status: AuditStatus;
  note?: string;
}

const MAX_AUDIT_EVENTS = 50;

declare global {
  interface Window {
    __analyticsAudit?: AuditEvent[];
  }
}

export function auditEvent(event: Omit<AuditEvent, 'ts'>): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return;
  }

  if (!window.__analyticsAudit) {
    window.__analyticsAudit = [];
  }

  window.__analyticsAudit.push({
    ...event,
    ts: Date.now(),
  });

  if (window.__analyticsAudit.length > MAX_AUDIT_EVENTS) {
    window.__analyticsAudit.shift();
  }
}

export function getAuditEvents(): AuditEvent[] {
  if (typeof window === 'undefined' || !window.__analyticsAudit) {
    return [];
  }

  return window.__analyticsAudit;
}
