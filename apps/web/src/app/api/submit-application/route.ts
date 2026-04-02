import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/submit-application',
    },
    async span => {
      try {
        const formData = await request.formData();

        // Extract application data from form data
        const application = {
          jobTitle: formData.get('jobTitle') as string,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,

          experience: formData.get('experience') as string,
          whyJoin: formData.get('whyJoin') as string,
          availability: formData.get('availability') as string,
        };

        const resumeFile = formData.get('resume') as File | null;

        // Create transporter (you'll need to configure this with your email service)
        const transporter = nodemailer.createTransport({
          // Option 1: Gmail (requires app password)
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, // e.g. careers@example.com
            pass: process.env.EMAIL_PASSWORD, // App password from Gmail
          },

          // Option 2: Custom SMTP (like SendGrid, Mailgun, etc.)
          // host: 'smtp.sendgrid.net',
          // port: 587,
          // secure: false,
          // auth: {
          //   user: process.env.SMTP_USER,
          //   pass: process.env.SMTP_PASSWORD,
          // },
        });

        // Create email content
        const mailOptions = {
          from: process.env.EMAIL_USER || 'contact@example.com',
          to: 'contact@example.com',
          subject: `Job Application: ${application.jobTitle}`,
          html: `
        <h2>New Job Application</h2>
        <h3>Position: ${application.jobTitle}</h3>
        
        <h4>Applicant Information:</h4>
        <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        
        <p><strong>Availability:</strong> ${application.availability || 'Not provided'}</p>
        
        <h4>Relevant Experience:</h4>
        <p>${application.experience.replace(/\n/g, '<br>')}</p>
        
        <h4>Why they want to join the team:</h4>
        <p>${application.whyJoin.replace(/\n/g, '<br>')}</p>
        
        <p><strong>Resume:</strong> ${resumeFile ? resumeFile.name : 'Not provided'}</p>
        
        <hr>
        <p><em>This application was submitted through the careers page.</em></p>
      `,
          attachments: resumeFile
            ? [
                {
                  filename: resumeFile.name,
                  content: Buffer.from(await resumeFile.arrayBuffer()),
                },
              ]
            : [],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        span.setAttribute('email_sent', true);
        return NextResponse.json({ success: true });
      } catch (error) {
        // Log error to Sentry
        Sentry.captureException(error, {
          tags: {
            endpoint: '/api/submit-application',
            error_type: 'email_send_failed',
          },
          extra: {
            error: error instanceof Error ? error.message : String(error),
          },
        });

        // Log error to monitoring service
        // Error logged via Sentry instrumentation
        return NextResponse.json({ error: 'Failed to send application' }, { status: 500 });
      }
    }
  );
}
