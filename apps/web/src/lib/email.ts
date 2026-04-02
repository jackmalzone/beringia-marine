// Email utility for handling form submissions
import { SITE_CONFIG } from '@vital-ice/config';

export interface JobApplication {
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  experience: string;
  whyJoin: string;
  availability: string;
  resume?: File | null;
}

export const sendJobApplication = async (application: JobApplication): Promise<boolean> => {
  try {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('jobTitle', application.jobTitle);
    formData.append('firstName', application.firstName);
    formData.append('lastName', application.lastName);
    formData.append('email', application.email);

    formData.append('experience', application.experience);
    formData.append('whyJoin', application.whyJoin);
    formData.append('availability', application.availability);

    if (application.resume) {
      formData.append('resume', application.resume);
    }

    // Send application via our API route
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    // Log error to monitoring service instead of console
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error as Error, {
        tags: { component: 'EmailService', action: 'sendApplication' },
      });
    }
    return false;
  }
};

// Alternative: Direct email using mailto (fallback)
export const createEmailLink = (application: JobApplication): string => {
  // Creating email link with application data

  const subject = encodeURIComponent(`Job Application: ${application.jobTitle}`);
  const body = encodeURIComponent(`
Job Application Details:

Position: ${application.jobTitle}
Name: ${application.firstName} ${application.lastName}
Email: ${application.email}
Availability: ${application.availability}

Relevant Experience:
${application.experience}

Why they want to join the team:
${application.whyJoin}

Resume: ${application.resume ? application.resume.name : 'Not provided'}

---
IMPORTANT: If you selected a resume file, please attach it to this email before sending.
The resume file should be named: ${application.resume ? application.resume.name : 'Not provided'}
  `);

  const emailLink = `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
  // Generated email link

  return emailLink;
};
