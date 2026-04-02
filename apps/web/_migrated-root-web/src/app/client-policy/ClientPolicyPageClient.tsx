'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { VITAL_ICE_BUSINESS, BusinessInfoHelpers } from '@/lib/config/business-info';
import styles from './page.module.css';

const ClientPolicyPageClient: React.FC = () => {
  return (
    <div className={styles.policyPage}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Client Policy Packet</h1>
          <p className={styles.subtitle}>
            Please review our policies to ensure a safe and enjoyable experience
          </p>
        </motion.div>

        <motion.div
          className={styles.policies}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Welcome Section */}
          <motion.div
            className={`${styles.policy} ${styles.welcome}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Welcome to Vital Ice</h2>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                We&apos;re excited to have you as part of our recovery community. At Vital Ice,
                we&apos;re committed to creating a safe, respectful, and results-driven space for
                contrast therapy and wellness. Please take a moment to review the following client
                policies. They&apos;re designed to protect your experience, clarify expectations,
                and ensure we can deliver consistent, high-quality service. If you have any
                questions, we&apos;re always here to help — just reach out to our team. We&apos;re
                glad you&apos;re here.
              </p>
            </div>
          </motion.div>

          {/* Liability Waiver */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Liability Waiver and Release of Claims</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                By checking the box and signing below, I acknowledge and agree to the following
                terms related to my participation in services offered by Vital Ice, located at{' '}
                {BusinessInfoHelpers.getFullAddress()}.
              </p>

              <h3>ASSUMPTION OF RISK</h3>
              <p className={styles.paragraph}>
                I understand that services provided by Vital Ice — including but not limited to cold
                plunges, sauna use, and contrast therapy — involve physical activity that carries
                inherent risks. These may include, but are not limited to:
              </p>
              <ul>
                <li>Fainting, dizziness, cardiovascular stress, or physical injury</li>
                <li>Risk of cold-related illness or heat-related issues</li>
                <li>Aggravation of pre-existing medical conditions</li>
              </ul>
              <p className={styles.paragraph}>
                I voluntarily assume full responsibility for any risk of injury, illness, or death
                that may result from my use of Vital Ice&apos;s facilities and services.
              </p>

              <h3>HEALTH CERTIFICATION</h3>
              <p className={styles.paragraph}>I certify that:</p>
              <ul>
                <li>
                  I am in good physical condition and mentally capable of participating in contrast
                  therapy.
                </li>
                <li>
                  I have consulted a healthcare provider regarding any concerns, or I voluntarily
                  accept full responsibility for any health risks associated with my participation.
                </li>
                <li>I have fully disclosed any relevant medical conditions to Vital Ice staff.</li>
                <li>Vital Ice is not responsible for verifying my health status.</li>
              </ul>

              <h3>NO MEDICAL SUPERVISION DISCLAIMER</h3>
              <p className={styles.paragraph}>
                I understand that Vital Ice does not provide medical advice or supervision and that
                staff are not licensed healthcare professionals.
              </p>

              <h3>WAIVER AND RELEASE</h3>
              <p className={styles.paragraph}>
                In consideration for being allowed to use the services and facilities of Vital Ice,
                I hereby release, waive, and discharge Vital Ice, its owners, staff, contractors,
                and affiliates from any and all claims, demands, liabilities, or causes of action,
                whether known or unknown, arising from personal injury, illness, property damage, or
                death resulting from participation.
              </p>

              <h3>CALIFORNIA CIVIL CODE SECTION 1542 WAIVER</h3>
              <p className={styles.paragraph}>
                I expressly waive any rights under Section 1542 of the California Civil Code, which
                states: &quot;A general release does not extend to claims that the creditor or
                releasing party does not know or suspect to exist in his or her favor at the time of
                executing the release, and that, if known by him or her, would have materially
                affected his or her settlement with the debtor or released party.&quot;
              </p>

              <h3>INDEMNIFICATION</h3>
              <p className={styles.paragraph}>
                I agree to indemnify and hold harmless Vital Ice from any claims or liabilities
                resulting from my actions, participation, or failure to disclose relevant health
                information.
              </p>

              <h3>MEDIA RELEASE (OPTIONAL)</h3>
              <p className={styles.paragraph}>
                Unless I notify staff in writing, I grant permission for Vital Ice to use any photos
                or video taken during my participation for promotional or marketing purposes.
              </p>

              <h3>ACKNOWLEDGMENT AND CONSENT</h3>
              <p className={styles.paragraph}>
                By signing electronically, I confirm that I have read this waiver in its entirety,
                understand its terms, and voluntarily agree to be bound by them.
              </p>
            </div>
          </motion.div>

          {/* Cancellation Policy */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Cancellation Policy</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <h3>MEMBERSHIP CANCELLATIONS</h3>
              <ul>
                <li>
                  Members may cancel their membership at any time, effective at the end of their
                  current billing cycle.
                </li>
                <li>
                  Cancellation requests must be submitted through the member portal or via email to{' '}
                  <a
                    href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                    style={{ color: '#00b7b5', textDecoration: 'none' }}
                  >
                    {VITAL_ICE_BUSINESS.email}
                  </a>{' '}
                  before the next billing date.
                </li>
                <li>
                  No future charges will be applied after cancellation is processed, but no prorated
                  refunds will be issued for unused time within the current cycle.
                </li>
              </ul>

              <h3>APPOINTMENT CANCELLATIONS AND NO-SHOWS</h3>
              <ul>
                <li>
                  Contrast Therapy (cold plunge + sauna): $20 fee for cancellations within 24 hours
                  or no-shows.
                </li>
                <li>
                  Recovery Amenities (e.g., red light, compression): $10 fee for cancellations
                  within 24 hours or no-shows.
                </li>
                <li>
                  <strong>
                    These fees are non-refundable and automatically charged to the account or card
                    on file.
                  </strong>
                </li>
              </ul>

              <h3>LATE ARRIVAL POLICY</h3>
              <p className={styles.paragraph}>
                If you arrive more than 15 minutes late without notice, your session may be treated
                as a no-show. Late arrivals may result in shortened sessions. Full session fees
                apply.
              </p>

              <h3>HOW TO CANCEL</h3>
              <p className={styles.paragraph}>
                To avoid fees, cancel or reschedule at least 24 hours in advance via your Vital Ice
                online account or by emailing{' '}
                <a
                  href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                  style={{ color: '#00b7b5', textDecoration: 'none' }}
                >
                  {VITAL_ICE_BUSINESS.email}
                </a>
                . If technical issues prevent timely cancellation, notify us immediately to document
                the situation.
              </p>

              <h3>REFUNDS</h3>
              <ul>
                <li>
                  All sales are final. Vital Ice does not offer refunds for missed sessions or
                  unused services.
                </li>
                <li>
                  In exceptional cases, refund or credit requests may be reviewed by management.
                  Please email{' '}
                  <a
                    href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                    style={{ color: '#00b7b5', textDecoration: 'none' }}
                  >
                    {VITAL_ICE_BUSINESS.email}
                  </a>{' '}
                  within 7 days.
                </li>
                <li>See Refund Policy for further detail</li>
              </ul>

              <h3>EXCEPTIONS</h3>
              <p className={styles.paragraph}>
                Fee waivers may be granted in exceptional cases (e.g., medical emergencies) when
                communicated promptly. Vital Ice reserves the right to grant or deny such requests
                at its sole discretion.
              </p>
            </div>
          </motion.div>

          {/* Refund Policy */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Refund Policy</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                At Vital Ice, we are committed to providing high-quality wellness services and clear
                expectations around payments and refunds. By purchasing any membership, session, or
                package, you acknowledge and agree to the following refund terms:
              </p>

              <h3>ALL SALES ARE FINAL</h3>
              <ul>
                <li>
                  All purchases are non-refundable, including memberships, single sessions,
                  packages, gift cards, and promotions.
                </li>
                <li>We do not offer refunds for missed, unused, or partially used services.</li>
              </ul>

              <h3>NO REFUNDS FOR CANCELLATIONS OR NO-SHOWS</h3>
              <ul>
                <li>
                  Cancellation or no-show fees (e.g., $20 for contrast therapy or $10 for recovery
                  amenities) are non-refundable.
                </li>
                <li>
                  These charges apply regardless of reason unless otherwise waived by management.
                </li>
              </ul>

              <h3>REFUND REQUESTS (EXCEPTIONAL CIRCUMSTANCES ONLY)</h3>
              <ul>
                <li>
                  In rare, exceptional situations such as documented medical emergencies or major
                  service disruptions, you may submit a written refund request to{' '}
                  <a
                    href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                    style={{ color: '#00b7b5', textDecoration: 'none' }}
                  >
                    {VITAL_ICE_BUSINESS.email}
                  </a>
                  .
                </li>
                <li>
                  Requests must be submitted within 7 days of the incident and will be reviewed on a
                  case-by-case basis.
                </li>
                <li>
                  Approved refunds may be issued as account credit or original payment method at our
                  discretion.
                </li>
              </ul>

              <h3>NON-TRANSFERABILITY</h3>
              <ul>
                <li>
                  All services are non-transferable and may only be used by the original purchaser
                  or named account holder.
                </li>
                <li>Exceptions may be granted for gift cards or pre-approved transfers.</li>
              </ul>

              <h3>SERVICE DISRUPTIONS</h3>
              <p className={styles.paragraph}>
                If a session is canceled by Vital Ice due to technical, staffing, or facility
                issues, a replacement session or account credit will be issued — no cash refunds.
              </p>

              <h3>CHARGEBACKS AND DISPUTES</h3>
              <p className={styles.paragraph}>
                Clients are encouraged to resolve any billing concerns directly with us.
                Unauthorized chargebacks may result in temporary account suspension.
              </p>
            </div>
          </motion.div>

          {/* Purchase & Payment Policy */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Purchase & Payment Policy</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                By purchasing a membership, package, or single session, I acknowledge and agree to
                the following terms:
              </p>

              <h3>PAYMENT AUTHORIZATION</h3>
              <p className={styles.paragraph}>
                By booking services, purchasing memberships or packages, or storing a payment method
                on file, I authorize Vital Ice to charge my card for all services rendered and
                applicable fees, including late cancellation or no-show charges.
              </p>

              <h3>PACKAGE EXPIRATION</h3>
              <ul>
                <li>Packages expire 6 months from the date of purchase unless otherwise stated.</li>
                <li>Expired sessions are non-refundable and non-transferable.</li>
              </ul>

              <h3>MEMBERSHIP TERMS</h3>
              <ul>
                <li>Memberships renew monthly and benefits reset each billing cycle.</li>
                <li>
                  Memberships cannot be transferred or shared and unused sessions do not roll over
                  unless otherwise noted.
                </li>
              </ul>

              <h3>MEMBERSHIP HOLDS</h3>
              <p className={styles.paragraph}>
                Members may place memberships on hold for up to 1 month per year in 7-day increments
                with prior written approval. Email{' '}
                <a
                  href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                  style={{ color: '#00b7b5', textDecoration: 'none' }}
                >
                  {VITAL_ICE_BUSINESS.email}
                </a>{' '}
                to request a hold.
              </p>

              <h3>GIFT CARDS AND CREDITS</h3>
              <ul>
                <li>Gift cards expire 12 months after purchase and are non-refundable.</li>
                <li>
                  Store credits issued as goodwill or service recovery expire 6 months from issue
                  and are non-transferable.
                </li>
              </ul>

              <h3>PROMOTIONS AND DISCOUNTS</h3>
              <p className={styles.paragraph}>
                Promotional rates, gift cards, or discounts may include limitations or expiration
                dates. Vital Ice reserves the right to modify or discontinue promotional pricing.
              </p>

              <h3>RIGHT TO REFUSE SERVICE</h3>
              <p className={styles.paragraph}>
                Vital Ice may refuse or revoke service for anyone violating policies, demonstrating
                unsafe behavior, or disrupting the client experience.
              </p>

              <h3>NO GUARANTEE OF RESULTS</h3>
              <p className={styles.paragraph}>
                We make no guarantee of health, wellness, or recovery outcomes. Participation is
                voluntary and at your own risk. Results vary by individual.
              </p>
            </div>
          </motion.div>

          {/* Privacy Policy */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Privacy Policy</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                At Vital Ice, your privacy matters. This Privacy Policy explains how we collect,
                use, share, and protect your personal information when you visit our location, book
                services, or interact with us online. By using our services, you consent to the data
                practices described below.
              </p>

              <h3>INFORMATION WE COLLECT</h3>
              <p className={styles.paragraph}>
                We may collect the following types of personal information:
              </p>
              <ul>
                <li>
                  <strong>Contact Information:</strong> Name, email, phone number, address
                </li>
                <li>
                  <strong>Booking Details:</strong> Service history, appointment times, membership
                  status
                </li>
                <li>
                  <strong>Payment Information:</strong> Card on file, billing details (stored
                  securely via our payment processor)
                </li>
                <li>
                  <strong>Health Information:</strong> Voluntarily disclosed conditions relevant to
                  wellness services (e.g., injuries, contraindications)
                </li>
                <li>
                  <strong>Device/Usage Data:</strong> IP address, browser type, interactions with
                  our website or booking software (e.g., Mindbody)
                </li>
              </ul>

              <h3>HOW WE USE YOUR INFORMATION</h3>
              <p className={styles.paragraph}>We use your information to:</p>
              <ul>
                <li>Schedule and manage appointments</li>
                <li>Process payments and maintain memberships</li>
                <li>Communicate with you (e.g., confirmations, cancellations, promotions)</li>
                <li>Provide customer support</li>
                <li>Maintain internal records and analytics</li>
                <li>Comply with legal and safety obligations</li>
              </ul>
              <p className={styles.paragraph}>
                We do not sell or rent your personal information to third parties.
              </p>

              <h3>HOW WE SHARE YOUR INFORMATION</h3>
              <p className={styles.paragraph}>We may share your data only with:</p>
              <ul>
                <li>
                  Trusted vendors (e.g., Mindbody, payment processors, email platforms) for service
                  delivery
                </li>
                <li>Legal authorities if required by law, court order, or government request</li>
                <li>Vital Ice employees who need access to deliver services</li>
              </ul>
              <p className={styles.paragraph}>
                All third parties are expected to uphold confidentiality and use your information
                only as needed to fulfill their duties.
              </p>

              <h3>DATA SECURITY</h3>
              <p className={styles.paragraph}>
                We take data security seriously. We use secure software, encrypted connections, and
                limited access protocols to protect your personal data. However, no online system is
                ever completely secure — you acknowledge this risk by using our services.
              </p>

              <h3>YOUR RIGHTS (CALIFORNIA RESIDENTS)</h3>
              <p className={styles.paragraph}>
                If you reside in California, you have the right to:
              </p>
              <ul>
                <li>Request a copy of the personal information we hold about you</li>
                <li>
                  Request that we delete your personal information (with some legal exceptions)
                </li>
                <li>Opt out of promotional communications at any time</li>
              </ul>
              <p className={styles.paragraph}>
                To exercise any of these rights, email us at{' '}
                <a
                  href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                  style={{ color: '#00b7b5', textDecoration: 'none' }}
                >
                  {VITAL_ICE_BUSINESS.email}
                </a>{' '}
                with your request.
              </p>

              <h3>MARKETING AND COMMUNICATION</h3>
              <p className={styles.paragraph}>
                You may receive occasional emails or texts from Vital Ice about bookings, offers, or
                updates. You can opt out at any time using the unsubscribe link or by contacting us
                directly.
              </p>

              <h3>COOKIES AND WEBSITE TOOLS</h3>
              <p className={styles.paragraph}>
                Our website and booking system may use cookies or similar technologies to track
                usage, improve performance, and support user experience. You may adjust your browser
                settings to decline cookies if you prefer.
              </p>

              <h3>POLICY UPDATES</h3>
              <p className={styles.paragraph}>
                This Privacy Policy may be updated periodically. Changes will be posted on our
                website and are effective immediately upon posting. Your continued use of our
                services signifies your acceptance of any changes.
              </p>
            </div>
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div
            className={styles.policy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className={styles.policyHeader}>
              <h2 className={styles.policyTitle}>Terms and Conditions</h2>
              <p className={styles.policySubtitle}>Effective Date: 8/1/2025</p>
            </div>
            <div className={styles.policyContent}>
              <p className={styles.paragraph}>
                Welcome to Vital Ice. These Terms and Conditions (&quot;Terms&quot;) govern your
                access to and use of our services, facilities, and website. By booking an
                appointment, purchasing a membership, or entering our studio, you agree to be bound
                by these Terms. If you do not agree, please do not use our services.
              </p>

              <h3>USE OF SERVICES</h3>
              <p className={styles.paragraph}>
                Vital Ice offers wellness and recovery services including cold plunge therapy, sauna
                sessions, red light therapy, and other recovery modalities. You agree to use all
                services responsibly and in accordance with posted rules and staff guidance.
              </p>

              <h3>ELIGIBILITY</h3>
              <ul>
                <li>You must be at least 18 years old to use Vital Ice services.</li>
                <li>
                  Clients aged 14–17 may participate with written parental consent and may require
                  adult supervision unless otherwise approved.
                </li>
                <li>We do not accept guests accompanying members at this time.</li>
              </ul>

              <h3>MINORS POLICY</h3>
              <p className={styles.paragraph}>
                Vital Ice services are designed primarily for adult use. However, minors aged 14 to
                17 may participate under the following conditions:
              </p>
              <ul>
                <li>
                  A parent or legal guardian must provide written consent via our waiver form.
                </li>
                <li>
                  Minors must be accompanied by a parent or guardian during their first visit unless
                  pre-approved by management.
                </li>
                <li>
                  We reserve the right to require adult supervision for all appointments depending
                  on the service type.
                </li>
                <li>
                  Children under 14 are not permitted to use Vital Ice services or enter recovery
                  areas, even with parental accompaniment.
                </li>
                <li>
                  Parents or guardians accept full responsibility for the minor&apos;s safety,
                  behavior, and adherence to all facility rules.
                </li>
              </ul>

              <h3>HEALTH ACKNOWLEDGMENT</h3>
              <p className={styles.paragraph}>
                You confirm that you are in suitable physical and mental condition to use wellness
                services and that you have consulted a healthcare provider as needed. Vital Ice
                staff are not medical professionals and do not provide diagnosis or treatment. You
                participate voluntarily and accept all risks associated with use.
              </p>

              <h3>BOOKINGS, CANCELLATIONS, AND NO-SHOWS</h3>
              <ul>
                <li>
                  You are responsible for booking and managing your sessions through your online
                  account or by contacting us.
                </li>
                <li>Late cancellation and no-show fees apply per our Cancellation Policy.</li>
                <li>
                  If you arrive more than 15 minutes late without notice, your session may be
                  canceled or shortened without refund.
                </li>
              </ul>

              <h3>PAYMENTS, MEMBERSHIPS, AND EXPIRATION</h3>
              <ul>
                <li>
                  All services must be prepaid. Memberships renew automatically and can be canceled
                  before your next billing cycle.
                </li>
                <li>
                  Sessions and packages expire 6 months from the purchase date unless otherwise
                  noted.
                </li>
                <li>Unused sessions do not roll over.</li>
                <li>See our Purchase Policy and Refund Policy for full details.</li>
              </ul>

              <h3>FACILITY USE AND ETIQUETTE</h3>
              <p className={styles.paragraph}>
                To ensure a relaxing and respectful environment, all clients must:
              </p>
              <ul>
                <li>Arrive on time and follow posted service durations</li>
                <li>
                  Shower before using cold plunges. Shower before using saunas if visibly sweaty or
                  soiled
                </li>
                <li>Use provided towels and sit covers as required</li>
                <li>Speak quietly and respect others&apos; space</li>
                <li>Avoid photography of other clients without consent</li>
                <li>Follow staff instructions and posted signage</li>
              </ul>
              <p className={styles.paragraph}>
                Failure to follow etiquette may result in removal or suspension.
              </p>

              <h3>PHOTO/MEDIA RELEASE</h3>
              <p className={styles.paragraph}>
                We may occasionally take photos or video in public areas for promotional use. By
                using our facility, you consent to reasonable use of such media unless you opt out
                in writing. We will never use media that clearly identifies you without your express
                consent.
              </p>

              <h3>GIFT CARDS AND CREDITS</h3>
              <ul>
                <li>
                  Gift cards are non-refundable and expire 12 months after purchase unless otherwise
                  stated.
                </li>
                <li>Store credits (e.g., issued in lieu of refund) expire 6 months from issue.</li>
                <li>Credits and gift cards are non-transferable.</li>
              </ul>

              <h3>TERMINATION OF ACCESS</h3>
              <p className={styles.paragraph}>
                Vital Ice reserves the right to suspend or terminate your access to services, with
                or without notice, for behavior that is unsafe, disruptive, abusive to staff or
                other clients, or in violation of these Terms or other posted policies.
              </p>

              <h3>THIRD-PARTY TOOLS AND BOOKING SOFTWARE</h3>
              <p className={styles.paragraph}>
                Vital Ice uses third-party platforms (e.g., Mindbody) to manage scheduling,
                payments, and communication. While we partner with trusted providers, we are not
                responsible for technical errors, downtime, or data handling issues caused by these
                platforms.
              </p>

              <h3>FORCE MAJEURE</h3>
              <p className={styles.paragraph}>
                Vital Ice is not liable for service delays, interruptions, or closures due to events
                outside our control, including natural disasters, public health emergencies, power
                failures, or facility damage.
              </p>

              <h3>NO GUARANTEE OF RESULTS</h3>
              <p className={styles.paragraph}>
                Vital Ice makes no claims or guarantees regarding therapeutic, health, or wellness
                outcomes. Results vary by individual and participation is at your own discretion and
                risk.
              </p>

              <h3>INTELLECTUAL PROPERTY</h3>
              <p className={styles.paragraph}>
                All content on the Vital Ice website, promotional materials, and brand assets —
                including logos, written content, images, and videos — are the property of Vital
                Ice. You may not copy, reproduce, or redistribute them without prior written
                consent.
              </p>

              <h3>LIMITATION OF LIABILITY</h3>
              <p className={styles.paragraph}>
                You agree that Vital Ice, its owners, staff, and contractors are not liable for any
                injuries, illnesses, or damages resulting from the use of services, equipment, or
                facilities, to the fullest extent allowed by law. See our separate Liability Waiver
                for full details.
              </p>

              <h3>MODIFICATIONS TO TERMS</h3>
              <p className={styles.paragraph}>
                Vital Ice reserves the right to update these Terms and related policies at any time.
                Changes will be posted on our website and will become effective upon posting.
                Continued use of our services constitutes acceptance of any updates.
              </p>

              <h3>GOVERNING LAW</h3>
              <p className={styles.paragraph}>
                These Terms are governed by the laws of the State of California. Any disputes shall
                be resolved in the courts of San Francisco County.
              </p>

              <h3>LINKED POLICIES</h3>
              <p className={styles.paragraph}>
                The following additional policies are incorporated by reference into these Terms:
              </p>
              <ul>
                <li>Cancellation Policy</li>
                <li>Refund Policy</li>
                <li>Purchase & Payment Policy</li>
                <li>Privacy Policy</li>
                <li>Liability Waiver & Release of Claims</li>
              </ul>
              <p className={styles.paragraph}>
                These are available at vitalicesf.com or by request via{' '}
                <a
                  href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                  style={{ color: '#00b7b5', textDecoration: 'none' }}
                >
                  {VITAL_ICE_BUSINESS.email}
                </a>
                .
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className={styles.contact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h3>Contact Us</h3>
            <p>For questions about these policies or your personal information, contact:</p>
            <p>
              <strong>Vital Ice</strong>
              <br />
              {BusinessInfoHelpers.getFullAddress()}
              <br />
              <a
                href={`mailto:${VITAL_ICE_BUSINESS.email}`}
                style={{ color: '#00b7b5', textDecoration: 'none' }}
              >
                {VITAL_ICE_BUSINESS.email}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientPolicyPageClient;
