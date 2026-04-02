/**
 * Additional content sections and FAQs for service pages
 * These are server-rendered sections that appear after specific headings
 */

export interface ServiceAdditionalContent {
  afterTagline?: {
    title?: string;
    content: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const serviceContent: Record<string, ServiceAdditionalContent> = {
  'red-light-therapy': {
    afterTagline: {
      content: `Service Four at Premium Service Business

Protocol-led sessions with clear documentation

Service Four demonstrates how a premium studio documents protocols, sets expectations, and delivers repeatable outcomes. The template copy below stands in for clinical or technical detail you will supply for your own vertical.

What clients experience

Visits open with a structured briefing: timing, boundaries, and how to signal staff if something needs to adjust. The core session follows a consistent rhythm so teams can train against it and clients always know what comes next. Closing includes a concise recap and optional scheduling prompts.

Why this matters for your brand

When documentation and hospitality work together, trust rises. Staff feel supported by clear standards; clients feel respected because nothing is vague. Pair Service Four with other offerings using the same tone of voice for a coherent brand story.

Planning your own version

Replace this placeholder with specifications, safety notes, and proof points that match your legal review. Keep the first line in the form “{Offering name} at Premium Service Business” (or your configured business name) so the layout parser can style the main title correctly.`,
    },
    faqs: [
      {
        question: 'What is Service Four designed to demonstrate?',
        answer:
          'It shows how a studio can combine clear protocols, calm communication, and consistent follow-up—useful for any service that requires repeatable documentation.',
      },
      {
        question: 'How long is a typical session?',
        answer:
          'Template default: plan for a compact visit with buffer time before and after so staff are never rushed. Adjust durations when you publish real service specs.',
      },
      {
        question: 'Who is this offering best suited for?',
        answer:
          'Clients who value precision, transparency, and a steady hand from check-in through departure.',
      },
      {
        question: 'Where is Premium Service Business located?',
        answer:
          '123 Main Street in Riverton—update this answer when you connect live address data from your business configuration.',
      },
      {
        question: 'Are memberships or packages available?',
        answer:
          'Yes. This template assumes you will sell passes or memberships through your booking stack; mirror whatever your live checkout supports.',
      },
      {
        question: 'Can Service Four be combined with other offerings?',
        answer:
          'Absolutely. Many studios sequence complementary appointments the same day; keep spacing realistic so quality does not drop.',
      },
      {
        question: 'What makes this template section unique?',
        answer:
          'It is written to be industry-agnostic. Swap in your differentiators once legal and operations sign off on the details.',
      },
    ],
  },
  'infrared-sauna': {
    afterTagline: {
      content: `Service Two at Premium Service Business

Ambiance, education, and pacing in one visit

Service Two highlights how heat-forward experiences can still feel breathable and modern. The focus is on teaching clients what to expect, how long each phase runs, and how staff stay available without hovering.

Inside the session

Rooms are tuned for calm: steady temperature, predictable airflow, and lighting that flatters without distraction. Specialists explain how to hydrate, when to pause, and how to signal for help.

Why teams like this structure

Predictable scripts reduce variance between shifts. New hires ramp faster, and veterans still have room to personalize tone.

Extend the template

Drop in your own measurements, contraindications, and brand stories. Maintain the opening pattern “Service Two at Premium Service Business” for the hero heading split.`,
    },
    faqs: [
      {
        question: 'How does Service Two differ from Service Three?',
        answer:
          'Service Two emphasizes guided education and moderated intensity; Service Three leans into a more classic, high-temperature ritual. Choose the story that matches your build-out.',
      },
      {
        question: 'What should first-time clients know?',
        answer:
          'Hydrate beforehand, wear comfortable layers for arrival and departure, and expect staff to check in at set intervals.',
      },
      {
        question: 'Is this offering right for sensitive clients?',
        answer:
          'Many studios offer lower-intensity options. Final medical guidance belongs in your waiver and clinician-reviewed copy.',
      },
      {
        question: 'Where can clients book?',
        answer:
          'Use your standard booking path—web, app, or front desk—so the answer always matches production integrations.',
      },
      {
        question: 'How do you keep sessions feeling premium at volume?',
        answer:
          'Stagger arrivals, protect reset time between parties, and keep recovery lounges stocked so no one waits awkwardly.',
      },
      {
        question: 'Can clients stack other services the same day?',
        answer:
          'Yes when scheduling allows. Build cooldown or transition time into the calendar so staff can reset rooms properly.',
      },
      {
        question: 'What memberships fit this offering?',
        answer:
          'Month-to-month, bundles, or corporate plans—describe whichever options you actually sell once commerce is wired up.',
      },
    ],
  },
  'traditional-sauna': {
    afterTagline: {
      content: `Service Three at Premium Service Business

Classic ritual with modern operations

Service Three is the template for a bold, familiar experience backed by tight operations: wood-forward materials, crisp housekeeping standards, and a clear cool-down path after each cycle.

Experience design

Guests move through heat, optional breathwork, and recovery with signage that reinforces safety. Staff watch humidity and temperature logs so the room feels intentional, not improvised.

Operations note

High-heat environments demand disciplined cleaning windows and filter checks. Document those tasks in your runbooks alongside client-facing copy.

Customize responsibly

Replace temperatures, durations, and claims with data approved for your market. Keep the first heading aligned with “Service Three at Premium Service Business.”`,
    },
    faqs: [
      {
        question: 'What defines Service Three?',
        answer:
          'A traditional, air-first heat experience with structured cool-downs and staff oversight—tune the specifics to your equipment.',
      },
      {
        question: 'How does heat support client goals?',
        answer:
          'Many guests seek relaxation, circulation support, and a mental reset. Use evidence-based language once your legal team reviews it.',
      },
      {
        question: 'What other services pair well?',
        answer:
          'Studios often alternate warm and cool modalities; confirm spacing and client screening with your policies.',
      },
      {
        question: 'Can bookings include back-to-back sessions?',
        answer:
          'Only if your SOPs include full room recovery time—never sacrifice safety for throughput.',
      },
      {
        question: 'How do memberships work here?',
        answer:
          'Mirror your live pricing: packs, unlimited options, or hybrid models—whatever you truly offer at checkout.',
      },
      {
        question: 'Are low-EMF options available?',
        answer:
          'Document the reality of your build. If you use radiant panels elsewhere, explain the difference honestly.',
      },
      {
        question: 'Why invest in this long term?',
        answer:
          'Consistent heat rituals create habit loops. Clients return when the experience feels stable and respectful of their time.',
      },
    ],
  },
  'cold-plunge': {
    afterTagline: {
      content: `Service One at Premium Service Business

Flagship visit with structured pacing

Service One is the template flagship: a choreographed appointment that proves how your studio handles intake, delivery, and follow-up. It is deliberately industry-neutral so you can map your hero offering onto the same layout.

Client journey

Arrival covers goals and boundaries. Core time is focused and staffed. Departure includes recap, hydration cues, and an easy rebook path.

Staff benefits

Clear phases reduce improvisation fatigue. Everyone knows which checklist applies and when to escalate.

Go-live checklist

Swap placeholder language with your actual temperatures, durations, and risk disclosures after legal review. Preserve the heading format “Service One at Premium Service Business.”`,
    },
    faqs: [
      {
        question: 'Why highlight Service One separately?',
        answer:
          'Flagship offerings set expectations for the entire brand. Nail this flow and every other service benefits from the halo.',
      },
      {
        question: 'How do beginners get started?',
        answer:
          'Start with shorter intervals, prioritize breath coaching, and celebrate progress without pushing past policy limits.',
      },
      {
        question: 'What if clients want DIY setups at home?',
        answer:
          'Acknowledge the option, then explain why supervised sessions offer monitoring, equipment integrity, and community.',
      },
      {
        question: 'How cold is cold?',
        answer:
          'Insert the exact range your equipment maintains after calibration—never guess in customer-facing copy.',
      },
      {
        question: 'What should pricing mention?',
        answer:
          'Point visitors to the live quote in your booking tool so numbers never drift out of sync with commerce.',
      },
      {
        question: 'Are guided sessions available?',
        answer:
          'If you offer them, describe how coaches participate. If not, clarify self-directed expectations instead.',
      },
      {
        question: 'What is contrast scheduling?',
        answer:
          'Alternating warm and cool experiences requires deliberate spacing; publish the cadence your clinicians approve.',
      },
    ],
  },
  'compression-boots': {
    afterTagline: {
      content: `Service Five at Premium Service Business

Equipment-forward comfort with adaptive settings

Service Five showcases passive recovery: clients settle into supportive seating while technology handles cadence. The narrative focuses on how staff set expectations, monitor comfort, and keep the room quiet enough to decompress.

Operational rhythm

Sessions run on timers with visible progress cues. Technicians log pressure preferences so repeat visits feel personal without reinventing the wheel.

Brand takeaway

Premium does not mean complicated interfaces. Simple controls and human availability beat flashy dashboards every time.

Fill in your data

Document pressure ranges, contraindications, and session length from manufacturer guidance plus your counsel.`,
    },
    faqs: [
      {
        question: 'How do compression systems help clients?',
        answer:
          'Rhythmic pressure can support circulation and comfort between harder training days—phrase benefits to match your approved claims.',
      },
      {
        question: 'Who should consult a clinician first?',
        answer:
          'Anyone with acute injuries, circulatory concerns, or implants should get medical clearance—reflect your waiver language here.',
      },
      {
        question: 'Can this pair with other bookings?',
        answer:
          'Yes, when schedules include transition time and staff can reset equipment fully between guests.',
      },
      {
        question: 'Where is the studio?',
        answer:
          'Riverton at 123 Main Street until you update centralized business settings.',
      },
      {
        question: 'How long is a session?',
        answer:
          'Template baseline: 15–20 minutes with adjustable programs—sync with your real device settings.',
      },
      {
        question: 'Is the therapy intense?',
        answer:
          'Pressure should feel firm, not painful. Staff should coach clients to speak up immediately.',
      },
      {
        question: 'What should clients wear?',
        answer:
          'Comfortable clothing that allows cuffs to fit cleanly; publish your exact dress code if different.',
      },
    ],
  },
  'percussion-massage': {
    afterTagline: {
      content: `Service Six at Premium Service Business

Therapist-led mobility with transparent communication

Service Six blends handheld tools with coaching. Clients learn positioning, depth cues, and how to pause if something feels off. The emphasis is partnership, not performance.

Session arc

Check-in covers soreness maps and goals. Work segments alternate sides so the body stays balanced. Close with mobility homework or hydration reminders when appropriate.

Team training

Document stroke patterns, sanitation steps, and how to sanitize devices between users—your insurance partner will thank you.

Personalize

Swap in certifications, scope-of-practice statements, and contraindications from your clinical advisors.`,
    },
    faqs: [
      {
        question: 'How is Service Six different from self-guided tool use?',
        answer:
          'Specialists tailor angles and duration while watching biomechanics—ideal for guests who want feedback in real time.',
      },
      {
        question: 'Can athletes book before events?',
        answer:
          'If your policies allow pre-performance work, say so explicitly; otherwise steer guests toward recovery-focused timing.',
      },
      {
        question: 'Does it replace manual therapy?',
        answer:
          'It complements other modalities. Use language your regulators approve when comparing techniques.',
      },
      {
        question: 'What about soreness afterward?',
        answer:
          'Mild tenderness can happen; severe pain should be reported immediately—mirror your incident protocol.',
      },
      {
        question: 'Where can guests sign up?',
        answer:
          'Through the same booking surfaces you use for every other offering.',
      },
      {
        question: 'Are there add-ons?',
        answer:
          'List only what you truly bundle—stretch blocks, aromatherapy, or contrast passes, for example.',
      },
      {
        question: 'Is the therapy painful?',
        answer:
          'Discomfort should stay productive. Clients control depth and speed with staff guidance.',
      },
      {
        question: 'How does this fit a broader membership?',
        answer:
          'Bundle it with high-demand slots or sell à la carte—describe the commercial structure you actually operate.',
      },
    ],
  },
};
