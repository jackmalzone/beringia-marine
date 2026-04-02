import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { emailStyles } from './sharedStyles';

export interface NewsletterSignupNotificationProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  referralSource?: string;
  sendScheduleEmails?: boolean;
  sendScheduleTexts?: boolean;
  sendPromotionalEmails?: boolean;
  sendPromotionalTexts?: boolean;
}

export const NewsletterSignupNotification = ({
  firstName,
  lastName,
  email,
  phone,
  referralSource,
  sendScheduleEmails,
  sendScheduleTexts,
  sendPromotionalEmails,
  sendPromotionalTexts,
}: NewsletterSignupNotificationProps) => {
  const fullName = `${firstName} ${lastName}`;
  const preferences = [];
  if (sendScheduleEmails) preferences.push('Schedule Emails');
  if (sendScheduleTexts) preferences.push('Schedule Texts');
  if (sendPromotionalEmails) preferences.push('Promotional Emails');
  if (sendPromotionalTexts) preferences.push('Promotional Texts');

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>New newsletter signup from {fullName}</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Section style={emailStyles.logoContainer}>
              <Img
                src="https://placehold.co/180x90/111827/e2e8f0/png?text=Logo"
                alt="Business logo placeholder"
                width={180}
                height={90}
                style={emailStyles.logo}
              />
            </Section>
            <Text style={emailStyles.tagline}>Newsletter signup notification</Text>
          </Section>

          <Section style={emailStyles.content}>
            <Heading style={emailStyles.h1}>New Newsletter Signup</Heading>
            <Text style={emailStyles.subtitle}>
              Someone has signed up for your newsletter.
            </Text>

            <Section style={emailStyles.card}>
              <Section style={emailStyles.fieldRow}>
                <Text style={emailStyles.label}>Name</Text>
                <Text style={emailStyles.value}>{fullName}</Text>
              </Section>

              <Section style={emailStyles.fieldRow}>
                <Text style={emailStyles.label}>Email</Text>
                <Text style={emailStyles.value}>
                  <Link href={`mailto:${email}`} style={emailStyles.link}>
                    {email}
                  </Link>
                </Text>
              </Section>

              <Section style={emailStyles.fieldRow}>
                <Text style={emailStyles.label}>Phone</Text>
                <Text style={phone ? emailStyles.value : emailStyles.valueMuted}>
                  {phone ? (
                    <Link href={`tel:${phone}`} style={emailStyles.link}>
                      {phone}
                    </Link>
                  ) : (
                    '—'
                  )}
                </Text>
              </Section>

              {referralSource && (
                <Section style={emailStyles.fieldRow}>
                  <Text style={emailStyles.label}>How They Heard About Us</Text>
                  <Text style={emailStyles.value}>{referralSource}</Text>
                </Section>
              )}

              {preferences.length > 0 && (
                <Section style={emailStyles.fieldRowLast}>
                  <Text style={emailStyles.label}>Subscription Preferences</Text>
                  <Text style={emailStyles.value}>
                    {preferences.map((pref, idx) => (
                      <span key={pref}>
                        {idx > 0 && ', '}
                        {pref}
                      </span>
                    ))}
                  </Text>
                </Section>
              )}
            </Section>

            <Section style={emailStyles.infoBox}>
              <Text style={emailStyles.infoBoxText}>
                <strong>Note:</strong> This subscriber signed up on your website and will
                receive communications based on their preferences.
              </Text>
            </Section>
          </Section>

          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              <Link href="https://www.example.com" style={emailStyles.footerLink}>
                www.example.com
              </Link>
              {' • '}
              {timestamp}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterSignupNotification;
