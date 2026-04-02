/**
 * Server-side rendered content for contact page
 */
import Link from 'next/link';
import { TEMPLATE_BUSINESS, BusinessInfoHelpers } from '@vital-ice/config';

export default function ContactPageContent() {
  const address = BusinessInfoHelpers.getFullAddress();
  
  return (
    <>
      <section style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="false">
        <h2>Contact {TEMPLATE_BUSINESS.name}</h2>
        <p>
          Contact {TEMPLATE_BUSINESS.name} in {TEMPLATE_BUSINESS.address.city},{' '}
          {TEMPLATE_BUSINESS.address.state}
        </p>
        {TEMPLATE_BUSINESS.phone && (
          <p>Phone: <a href={`tel:${TEMPLATE_BUSINESS.phone}`}>{BusinessInfoHelpers.getFormattedPhone()}</a></p>
        )}
        {TEMPLATE_BUSINESS.phoneText && (
          <p>Text: <a href={`sms:${TEMPLATE_BUSINESS.phoneText}`}>{BusinessInfoHelpers.getFormattedTextPhone()}</a></p>
        )}
        <p>Email: <a href={`mailto:${TEMPLATE_BUSINESS.email}`}>{TEMPLATE_BUSINESS.email}</a></p>
        <address>
          {TEMPLATE_BUSINESS.address.street}
          <br />
          {TEMPLATE_BUSINESS.address.city}, {TEMPLATE_BUSINESS.address.state} {TEMPLATE_BUSINESS.address.zipCode}
        </address>
        <p>Operating Hours:</p>
        <p>Mon-Fri: 6:30AM-10AM | 12PM-2PM | 4PM-9PM</p>
        <p>Sat: 7AM-9PM</p>
        <p>Sun: 8AM-7PM</p>
        <Link href="/contact">Get in touch</Link>
      </section>
    </>
  );
}
