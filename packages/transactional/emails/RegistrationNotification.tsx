import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { emailStyles } from './sharedStyles';

export interface RegistrationNotificationProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  birthDate?: string;
  otherInformation?: string;
  sendScheduleEmails?: boolean;
  sendScheduleTexts?: boolean;
  sendPromotionalEmails?: boolean;
  sendPromotionalTexts?: boolean;
  liabilityRelease: boolean;
}

export const RegistrationNotification = ({
  firstName,
  lastName,
  email,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
  birthDate,
  otherInformation,
  sendScheduleEmails,
  sendScheduleTexts,
  sendPromotionalEmails,
  sendPromotionalTexts,
  liabilityRelease,
}: RegistrationNotificationProps) => {
  const fullName = `${firstName} ${lastName}`;
  const fullAddress = [
    addressLine1,
    addressLine2,
    `${city}, ${state} ${postalCode}`,
    country && country !== 'US' ? country : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  const preferences = [];
  if (sendScheduleEmails) preferences.push('Schedule Emails');
  if (sendScheduleTexts) preferences.push('Schedule Texts');
  if (sendPromotionalEmails) preferences.push('Promotional Emails');
  if (sendPromotionalTexts) preferences.push('Promotional Texts');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

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
      <Preview>New client registration: {fullName}</Preview>
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
            <Text style={emailStyles.tagline}>New client registration</Text>
          </Section>

          <Section style={emailStyles.content}>
            <Heading style={emailStyles.h1}>New Client Registration</Heading>
            <Text style={emailStyles.subtitle}>
              A new client has completed registration on your website.
            </Text>

            <Section style={emailStyles.card}>
              <Heading style={emailStyles.h2}>Contact Information</Heading>

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

              {birthDate && (
                <Section style={emailStyles.fieldRowLast}>
                  <Text style={emailStyles.label}>Birth Date</Text>
                  <Text style={emailStyles.value}>{formatDate(birthDate)}</Text>
                </Section>
              )}
            </Section>

            <Section style={emailStyles.card}>
              <Heading style={emailStyles.h2}>Address</Heading>
              <Text style={emailStyles.addressText}>{fullAddress}</Text>
            </Section>

            {preferences.length > 0 && (
              <Section style={emailStyles.card}>
                <Heading style={emailStyles.h2}>Communication Preferences</Heading>
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

            {otherInformation && (
              <Section style={emailStyles.card}>
                <Heading style={emailStyles.h2}>Additional Information</Heading>
                <Text style={emailStyles.messageText}>{otherInformation}</Text>
              </Section>
            )}

            <Section style={emailStyles.infoBox}>
              <Text style={emailStyles.infoBoxText}>
                <strong>Liability Release:</strong>{' '}
                <span
                  style={
                    liabilityRelease
                      ? { ...emailStyles.badge, ...emailStyles.badgeSuccess }
                      : { ...emailStyles.badge, ...emailStyles.badgeError }
                  }
                >
                  {liabilityRelease ? '✓ Signed and Agreed' : '✗ Not Signed'}
                </span>
              </Text>
            </Section>
          </Section>

          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              This registration was submitted through your website.
              <br />
              <br />
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

export default RegistrationNotification;
