'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MindbodyErrorBoundary } from '@/components/providers/MindbodyErrorBoundary';
import styles from './MindbodyWidget.module.css';

interface MindbodyWidgetProps {
  widgetType: 'prospects' | 'schedules' | 'enrollment';
  widgetId: string;
  widgetPartner?: string;
  widgetVersion?: string;
  className?: string;
  fallbackContent?: React.ReactNode;
}

const MindbodyWidget: React.FC<MindbodyWidgetProps> = ({
  widgetType,
  widgetId,
  widgetPartner = 'object',
  widgetVersion = '0',
  className = '',
  fallbackContent,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Function to inject custom styles into MindBody iframe
  const injectCustomStyles = () => {
    try {
      // Wait for iframe to be available
      const checkForIframe = () => {
        const iframe = widgetRef.current?.querySelector('iframe');
        if (iframe && iframe.contentDocument) {
          const iframeDoc = iframe.contentDocument;
          const existingStyle = iframeDoc.getElementById('vital-ice-custom-styles');

          if (!existingStyle) {
            const style = iframeDoc.createElement('style');
            style.id = 'vital-ice-custom-styles';
            style.textContent = `
              /* Vital Ice Custom MindBody Widget Styles */
              body { 
                background: transparent !important; 
                color: #ffffff !important;
                font-family: inherit !important;
              }
              
              .hc-form-wrapper,
              .hc-form { 
                background: transparent !important; 
                border: none !important;
              }
              
              input[type="text"],
              input[type="email"], 
              input[type="tel"],
              input[type="password"],
              textarea,
              select {
                background: transparent !important;
                border: none !important;
                border-bottom: 2px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 0 !important;
                color: #ffffff !important;
                padding: 0.75rem 0 0.5rem 0 !important;
                font-size: 1rem !important;
                transition: border-color 0.3s ease !important;
              }
              
              input:focus,
              textarea:focus,
              select:focus {
                outline: none !important;
                border-bottom-color: #00b7b5 !important;
                box-shadow: 0 2px 0 0 #00b7b5 !important;
              }
              
              input::placeholder,
              textarea::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
                font-style: italic !important;
              }
              
              label {
                color: #00b7b5 !important;
                font-weight: 500 !important;
                font-size: 0.875rem !important;
              }
              
              button,
              input[type="submit"] {
                background: linear-gradient(135deg, #00b7b5 0%, #9ec7c5 100%) !important;
                color: #000000 !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 0.75rem 2rem !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
              }
              
              button:hover,
              input[type="submit"]:hover {
                background: linear-gradient(135deg, #9ec7c5 0%, #00b7b5 100%) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(0, 183, 181, 0.3) !important;
              }
              
              .hc-error,
              .error-message {
                color: #ff6b6b !important;
                background: rgba(255, 107, 107, 0.1) !important;
                border: 1px solid rgba(255, 107, 107, 0.3) !important;
                border-radius: 4px !important;
                padding: 0.5rem !important;
              }
              
              /* All text elements - comprehensive coverage */
              p, .hc-text, span, div, td, th {
                color: rgba(255, 255, 255, 0.9) !important;
              }
              
              /* Specific MindBody text elements */
              .hc-form-title,
              .hc-form-subtitle,
              .hc-form-description,
              .hc-widget-title,
              .hc-widget-subtitle,
              .hc-connect-text,
              .hc-subscribe-text,
              .hc-notification-text,
              .hc-updates-text,
              .hc-offers-text {
                color: #00b7b5 !important;
                font-weight: 500 !important;
              }
              
              /* Force all text content to be visible */
              * {
                color: rgba(255, 255, 255, 0.9) !important;
              }
              
              /* Override any dark text specifically */
              [style*="color: #000"],
              [style*="color: black"],
              [style*="color: #333"],
              [style*="color: rgb(0"],
              .dark-text,
              .black-text {
                color: rgba(255, 255, 255, 0.9) !important;
              }
              
              /* Headings and titles in Vital Ice blue */
              h1, h2, h3, h4, h5, h6,
              .title, .heading, .header-text {
                color: #00b7b5 !important;
                font-weight: 600 !important;
              }
              
              a {
                color: #00b7b5 !important;
                text-decoration: none !important;
              }
              
              a:hover {
                color: #9ec7c5 !important;
                text-decoration: underline !important;
              }
            `;

            iframeDoc.head.appendChild(style);
            // Custom MindBody styles injected successfully (removed console.log for production build)
          }
        } else {
          // Retry after a short delay
          setTimeout(checkForIframe, 500);
        }
      };

      checkForIframe();
    } catch {
      // Could not inject custom styles into MindBody iframe (removed console.warn for production build)
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let handleGlobalError: ((_event: ErrorEvent) => boolean | void) | null = null;
    let handleUnhandledRejection: ((event: PromiseRejectionEvent) => boolean | void) | null = null;

    const loadMindbodyScript = () => {
      // Check if script is already loaded
      if (scriptLoadedRef.current || document.querySelector('script[src*="healcode.js"]')) {
        // Add a small delay before setting loaded to ensure DOM is ready
        setTimeout(() => setIsLoaded(true), 100);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://widgets.mindbodyonline.com/javascripts/healcode.js';
        script.type = 'text/javascript';
        script.async = true;

        script.onload = () => {
          scriptLoadedRef.current = true;

          // Add error handling for MindBody widget initialization
          try {
            // Wait for DOM to be ready before initializing widget
            setTimeout(() => {
              setIsLoaded(true);

              // Additional delay for iframe injection
              setTimeout(() => {
                if (widgetRef.current) {
                  injectCustomStyles();
                  const event = new CustomEvent('mindbody-widget-loaded');
                  window.dispatchEvent(event);
                }
              }, 1500);
            }, 500);
          } catch {
            setHasError(true);
          }
        };

        script.onerror = () => {
          setHasError(true);
        };

        // Add comprehensive error event listener for runtime errors
        handleGlobalError = (event: ErrorEvent) => {
          const message = event.message?.toLowerCase() || '';
          const filename = event.filename?.toLowerCase() || '';

          // Suppress known MindBody widget errors
          if (
            message.includes('healcode') ||
            message.includes('mindbody') ||
            message.includes('cannot read properties of null') ||
            filename.includes('healcode.js') ||
            filename.includes('mindbody')
          ) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        };

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MindbodyWidget.tsx:253',message:'Adding error listeners',data:{hasCleanup:true,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        window.addEventListener('error', handleGlobalError);

        // Also handle unhandled promise rejections
        handleUnhandledRejection = (event: PromiseRejectionEvent) => {
          const reason = String(event.reason).toLowerCase();
          if (
            reason.includes('healcode') ||
            reason.includes('mindbody') ||
            reason.includes('cannot read properties of null')
          ) {
            event.preventDefault();
            return false;
          }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        document.head.appendChild(script);

        timeoutId = setTimeout(() => {
          if (!isLoaded) {
            setHasError(true);
          }
        }, 15000); // Increased timeout
      } catch {
        setHasError(true);
      }
    };

    loadMindbodyScript();

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MindbodyWidget.tsx:284',message:'Cleanup function called',data:{hasHandleGlobalError:!!handleGlobalError,hasHandleUnhandledRejection:!!handleUnhandledRejection,timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Clean up error listeners
      if (handleGlobalError) {
        window.removeEventListener('error', handleGlobalError);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MindbodyWidget.tsx:290',message:'Removed error listener',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
      }
      if (handleUnhandledRejection) {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d9b8aed8-5fc5-4fec-acfa-d57418b0ae58',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MindbodyWidget.tsx:293',message:'Removed unhandledrejection listener',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
      }
    };
  }, [isLoaded]);

  // Fallback content for when widget fails to load
  const renderFallback = () => {
    if (fallbackContent) {
      return fallbackContent;
    }

    return (
      <div className={styles.fallback}>
        <div className={styles.fallbackContent}>
          <h3>Contact Us Directly</h3>
          <p>
            Ready to start your wellness journey? Get in touch with us to learn more about our
            services and book your first session.
          </p>
          <div className={styles.fallbackActions}>
            <a href="mailto:info@vitalicesf.com" className={styles.fallbackButton}>
              Email Us: info@vitalicesf.com
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (hasError) {
    return renderFallback();
  }

  return (
    <MindbodyErrorBoundary fallback={renderFallback()}>
      <div className={`${styles.widgetContainer} ${className}`} ref={widgetRef}>
        {!isLoaded && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading contact form...</p>
          </div>
        )}

        {isLoaded &&
          React.createElement('healcode-widget', {
            'data-type': widgetType,
            'data-widget-partner': widgetPartner,
            'data-widget-id': widgetId,
            'data-widget-version': widgetVersion,
            'data-widget-config': '',
            'data-widget-domain': 'https://widgets.mindbodyonline.com',
          })}
      </div>
    </MindbodyErrorBoundary>
  );
};

export default MindbodyWidget;
