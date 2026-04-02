/**
 * Shared styles for all Vital Ice email templates
 * Modern, calm, premium design aligned with wellness brand
 */

export const emailStyles = {
  main: {
    backgroundColor: '#f8f9fa',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '20px 0',
  },

  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    maxWidth: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },

  header: {
    backgroundColor: '#1a1a1a',
    padding: '32px 40px 28px 40px',
    margin: '0',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  },

  logoContainer: {
    margin: '0 0 12px 0',
    padding: '0',
  },

  logo: {
    maxWidth: '180px',
    height: 'auto',
  },

  tagline: {
    fontSize: '12px',
    color: '#9EC7C5', // Muted teal
    margin: '8px 0 0 0',
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  content: {
    padding: '40px 40px 32px 40px',
  },

  h1: {
    color: '#1a1a1a',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    padding: '0',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  },

  subtitle: {
    color: '#666666',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 32px 0',
    fontWeight: '400',
  },

  h2: {
    fontSize: '11px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    padding: '0',
    lineHeight: '1.2',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: '#9EC7C5', // Muted teal
  },

  card: {
    backgroundColor: '#fafbfc',
    borderRadius: '8px',
    padding: '24px',
    margin: '0 0 20px 0',
    border: '1px solid #e8eaed',
  },

  fieldRow: {
    marginBottom: '20px',
  },

  fieldRowLast: {
    marginBottom: '0',
  },

  label: {
    color: '#9EC7C5', // Muted teal
    fontSize: '11px',
    fontWeight: '500',
    margin: '0 0 6px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    display: 'block',
  },

  value: {
    color: '#1a1a1a',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    fontWeight: '400',
  },

  valueMuted: {
    color: '#999999',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    fontWeight: '400',
    fontStyle: 'italic',
  },

  link: {
    color: '#00B7B5', // Arctic teal
    textDecoration: 'none',
    fontWeight: '500',
  },

  addressText: {
    color: '#1a1a1a',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    fontWeight: '400',
    whiteSpace: 'pre-line' as const,
  },

  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  badgeSuccess: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
  },

  badgeError: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
  },

  badgeInfo: {
    backgroundColor: '#00B7B5', // Arctic teal
    color: '#ffffff',
    border: 'none',
  },

  hr: {
    border: 'none',
    borderTop: '1px solid #e8eaed',
    margin: '32px 0',
  },

  buttonSection: {
    textAlign: 'center' as const,
    margin: '32px 0 0 0',
    padding: '0',
  },

  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 32px',
    border: 'none',
    letterSpacing: '0.3px',
  },

  footer: {
    backgroundColor: '#fafbfc',
    padding: '24px 40px',
    margin: '0',
    borderTop: '1px solid #e8eaed',
  },

  footerText: {
    color: '#999999',
    fontSize: '11px',
    lineHeight: '18px',
    margin: '0',
    textAlign: 'center' as const,
    letterSpacing: '0.2px',
  },

  footerLink: {
    color: '#00B7B5', // Arctic teal
    textDecoration: 'none',
  },

  infoBox: {
    padding: '20px',
    backgroundColor: '#fafbfc',
    borderLeft: '3px solid #00B7B5', // Arctic teal
    borderRadius: '6px',
    margin: '24px 0',
    border: '1px solid #e8eaed',
  },

  infoBoxText: {
    color: '#1a1a1a',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
  },

  messageText: {
    color: '#1a1a1a',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '12px 0 0 0',
    whiteSpace: 'pre-wrap' as const,
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e8eaed',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};
