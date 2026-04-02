/**
 * Careers page content - job openings data
 * Server-rendered for SEO
 */

export interface JobOpening {
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    title: 'Client Experience & Operations Coordinator',
    type: 'Full-time or Part-time',
    location: 'Riverton, ST',
    description:
      'A hands-on role responsible for daily studio operations, polished client service, light sales support, and partnership outreach—ideal for hospitality-minded operators who like systems.',
    requirements: [
      '2–3 years in a customer-facing role (hospitality, retail, professional services, or similar)',
      'Comfort with scheduling software, POS tools, and inbox triage',
      'Clear written and verbal communication; calm under pressure',
      'Organized, detail-oriented, and reliable on shift work',
      'Familiarity with Google Workspace (Docs, Sheets, Calendar)',
      'Willingness to handle light cleaning and facility tidiness between visits',
      'Interest in premium service standards—not a specific industry certification',
      'Professional presence and sound judgment with client issues',
      'Ability to prioritize during peak arrival windows',
      'Team player who documents decisions so coverage stays seamless',
    ],
    responsibilities: [
      'Front desk & client experience (40%): Greet visitors, manage check-in, answer phone and email, explain offerings and policies, guide waivers and first visits, and keep the lobby composed when schedules are tight.',
      'Administration & operations (25%): Maintain accurate records, process payments, reconcile daily totals, track supplies, and support leadership with light reporting and scheduling adjustments.',
      'Sales & partnerships (20%): Listen for client goals, recommend appropriate packages, and identify local businesses that align for co-marketing or referral loops—always within brand guidelines.',
      'Facility care (15%): Reset lounges, suites, and restrooms between sessions; restock amenities; flag maintenance issues before they impact clients.',
    ],
    benefits: [
      'Competitive compensation with performance conversations twice yearly',
      'Studio credit or internal perks (configure to match your live policy)',
      'Clear training paths and documented SOPs',
      'Small-team visibility with leadership',
      'Room to grow as the template becomes your production brand',
    ],
  },
];
