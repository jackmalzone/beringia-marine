import React from 'react';

interface NoScriptFallbackProps {
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Provides a graceful fallback for EmailButton when JavaScript is disabled
 * Renders a standard mailto link that works without JavaScript
 */
export const NoScriptFallback: React.FC<NoScriptFallbackProps> = ({
  email,
  subject,
  body,
  cc,
  bcc,
  children,
  className = '',
}) => {
  // Build mailto URL for noscript fallback
  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }

  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  if (cc) {
    params.push(`cc=${encodeURIComponent(cc)}`);
  }

  if (bcc) {
    params.push(`bcc=${encodeURIComponent(bcc)}`);
  }

  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  const mailtoUrl = `mailto:${encodeURIComponent(email)}${queryString}`;

  return (
    <>
      {/* This will be hidden when JavaScript is enabled */}
      <noscript>
        <a
          href={mailtoUrl}
          className={`email-button-noscript ${className}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '0.375rem',
            fontWeight: '500',
            fontSize: '1rem',
            lineHeight: '1.5',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {children}
        </a>
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            border: '1px solid #bbdefb',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
          }}
        >
          <strong>JavaScript is disabled.</strong> Click the button above to open your email client,
          or copy this email address: <strong>{email}</strong>
        </div>
      </noscript>
    </>
  );
};

export default NoScriptFallback;
