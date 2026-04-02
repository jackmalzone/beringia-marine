import {
  Body,
  Button,
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

export interface ContactFormNotificationProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

export const ContactFormNotification = ({
  firstName,
  lastName,
  email,
  phone,
  message,
}: ContactFormNotificationProps) => {
  const fullName = `${firstName} ${lastName}`;

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
      <Preview>New contact form submission from {fullName}</Preview>
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
            <Text style={emailStyles.tagline}>Website contact notification</Text>
          </Section>

          <Section style={emailStyles.content}>
            <Heading style={emailStyles.h1}>New Contact Form Submission</Heading>
            <Text style={emailStyles.subtitle}>
              You have received a new contact form submission from your website.
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

              {message && (
                <Section style={emailStyles.fieldRowLast}>
                  <Text style={emailStyles.label}>Message</Text>
                  <Text style={emailStyles.messageText}>{message}</Text>
                </Section>
              )}
            </Section>

            <Hr style={emailStyles.hr} />

            <Section style={emailStyles.buttonSection}>
              <Button
                style={emailStyles.button}
                href={`mailto:${email}?subject=Re: Your contact form submission`}
              >
                Reply to {firstName}
              </Button>
            </Section>
          </Section>

          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              This message was sent from your website contact form.
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

export default ContactFormNotification;
