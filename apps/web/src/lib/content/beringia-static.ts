export interface ExpertiseCard {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  /** Optional CTA label shown at the bottom of the expanded panel */
  cta?: string;
  ctaHref?: string;
}

export interface ContributionItem {
  period: string;
  title: string;
  description: string;
}

export interface TermsSection {
  title: string;
  body: string;
}

export const BERINGIA_HOME = {
  heroTitle: 'Beringia Marine Technologies',
  heroSubtitle: 'Sales Engineering & Consulting',
  missionHeading: 'Our Mission',
  missionBody:
    "Beringia Marine provides the experience and passion necessary for increasing our knowledge of the oceans. We work with companies to identify and fill the gaps in marine technology to provide scalable solutions for our oceans. Whether you're an established player or a startup, Beringia has the expertise, network, and passion to rapidly scale your success.",
  solutionsTeaser:
    'From autonomous underwater platforms to mission-ready integration support, we help teams validate concepts, reduce deployment risk, and move from prototype to market with confidence.',
  approachHeading: 'Our Expertise',
  approachSubtitle: 'Validate - Execute - Grow - Productize - Scale',
  contributionsHeading: 'Notable Contributions',
  contributionsTeaser:
    "Three decades of work across ocean engineering, autonomous systems, sonar, and geospatial technologies informs Beringia's practical approach to product and market execution.",
  contactCtaHeading: 'Let\u2019s Build What\u2019s Next',
  contactCtaBody:
    'Whether you\u2019re proving a concept, entering a new market, or scaling production\u2014Beringia has the technical depth and commercial networks to accelerate your timeline.',
  contactCtaLabel: 'Start a Conversation',
  contactCtaHref: '/contact',
  artistPlaceholderTitle: 'Featured Artist',
  artistPlaceholderBody:
    "Rebecca Rutstein's work remains part of the Beringia story; a dedicated section with artwork and imagery will be added in a later phase.",
} as const;

export const BERINGIA_EXPERTISE_CARDS: ExpertiseCard[] = [
  {
    title: 'Validate',
    subtitle: 'Benchmarking, Testing & Validating the Path To Success',
    description:
      'The first step in achieving success is establishing clear benchmarks. This phase ensures that both Beringia Marine and their client understand the necessary steps to reach their goals. Benchmarks may include technical engineering milestones, infrastructure readiness, and business development objectives. Once defined, these benchmarks are rigorously tested and validated, aligning both the company and Beringia Marine on the path forward, creating a shared vision of success.',
    details: [],
    cta: 'Get in Touch',
    ctaHref: '/contact',
  },
  {
    title: 'Execute',
    subtitle: 'Business Development Consulting',
    description:
      'With a solid foundation, the next phase focuses on market research and strategy development. During the execution stage, the Beringia Marine identifies the most viable markets and determines the unique selling points that will resonate with these audiences. A tailored business strategy is formed, and key partnerships are identified and secured, laying the groundwork for successful market entry and growth.',
    details: [],
    cta: 'Learn More',
    ctaHref: '/contact',
  },
  {
    title: 'Grow',
    subtitle: 'Business Development',
    description:
      "Building on the execution phase, the grow phase is where strategy turns into action. Beringia Marine works to build a strong pipeline and expand the company's strategic network, all while fostering a company culture that resonates with target markets. This stage is crucial for growing long-term relationships and ensuring the company's brand aligns with market needs and expectations.",
    details: [],
    cta: 'Ping me!',
    ctaHref: '/contact',
  },
  {
    title: 'Productize',
    subtitle: 'Mission Ready',
    description:
      'Having a solution is not enough; it must be fully productized to be successful. During this phase, Beringia Marine ensures that validated solutions are packaged in a way that allows for seamless deployment, even in the harshest marine environments. The focus is on reducing downtime, maximizing return on investment, and ensuring the product is robust and reliable for end users.',
    details: [],
    cta: "Let's Chat!",
    ctaHref: '/contact',
  },
  {
    title: 'Scale',
    subtitle: 'Long Term Growth',
    description:
      'Once the solution is productized, it must be ready for rapid growth. The final phase prepares the company for scaling by implementing a management structure that minimizes time-to-market and ensures a customer success model is in place. This future-proof approach enables the company to expand efficiently while maintaining high standards of quality and customer satisfaction.',
    details: [],
  },
];

export const BERINGIA_CONTRIBUTIONS: ContributionItem[] = [
  {
    period: 'Present-2024',
    title: 'Vehicle Control Systems',
    description:
      "Market viability for new concepts in vehicle control for both remote and autonomous vehicles. Work implemented Beringia's 5-Hub approach for innovative technologies.",
  },
  {
    period: '2024-2022',
    title: 'Hydrus MicroAUV Test',
    description:
      'Product test & verification of the Hydrus microAUV followed by using our network to work with key market influencers rapid product acceptance and placement. Hydrus is a scalable 6-degree freedom fully autonomous solution for providing high resolution, georeferenced photogrammetry to depth as great as 3000m.',
  },
  {
    period: '2022-2021',
    title: 'AUV Data as a Service (DaaS)',
    description:
      "Customized Oceanographic Data as a Service (DaaS) model utilizing small form factor, inexpensive AUV's. Work included constructing the business model, GTM strategy including identification of key markets and partnerships.",
  },
  {
    period: '2019-2016',
    title: 'Autonomous Force Multiplier',
    description:
      '"Multi-grid" solutions for combining the Hydrographic data from multiple mapping USV\'s into a single grid. The solution maximizes efficiency by ensuring 100% survey coverage without duplicating efforts. Feature set were further developed by Sand Point Hydrographic and are now part of the standard deliverable with QINSy.',
  },
  {
    period: '2015-2011',
    title: 'Portable High-Resolution Multibeam',
    description:
      'Beta system design, build, test & performance verification of the first portable, completely self contained multibeam hydrographic system specific for small vessel use. Groundwork paved the way to the what is now an industry standard.',
  },
  {
    period: '2011-2009',
    title: 'Next Generation Doppler Velocity Log Market Research',
    description:
      'Developed the business case and GTM strategy for the Second Generation Doppler Velocity Logs. Work included securing key partnerships with major INS and ROV manufacturers. This generation of DVL is now an industry standard in subsea navigation.',
  },
  {
    period: '2009-2008',
    title: '4-Dimensional Geospatial Software Solutions',
    description:
      'Provided test and verification and GTM strategy of the Eonfusion 4-Dimensional Geospatial software solution. Eonfusion provided the ability to perform visual analysis across time, space and attributes of any geospatial data.',
  },
  {
    period: '2008-2006',
    title:
      'Multibeam Sonars for Autonomous Underwater Vehicles | Implementation of Water Column Data for Scientific Applications | Development of the Next Generation Shallow Water Multibeam',
    description:
      'Developed, tested and verified the implementation of RESON Seabat multibeam sonars as an AUV. Notable implementations include ISE Explorer (Bremen University), MBARI Dorado, WHOI Sentry, WHOI Alvin. All now benchmark solutions for all AUV mapping solutions to follow | Developed, tested hardware and software to output water column sonar data from RESON Seabat Multibeam Sonars. Resulting methodologies are now an industry standard across multiple applications | Development, Test and Verification of the Seabat 7125 multibeam echosounder. Benchmark development for all sonars to follow.',
  },
  {
    period: '2005-2003',
    title: 'Bluefin 21 Hydrographic Payload Integration | Bluefin 21 AUV Sea Trials',
    description:
      'Integrated, tested and verified performance of a hydrographic payload suite including multibeam, sub-bottom profiler, Doppler Velocity Log and Sidescan Sonar in a Bluefin 21 inch vehicle | Sea Trials for the Bluefin 21 inch Autonomous Underwater Vehicle',
  },
  {
    period: '2003-1998',
    title:
      'SONAR Water Column data suitability trials | Design and test viability of multibeam sonar as an AUV payload',
    description:
      'Utilizing Gen 1 architecture, suitability of water column data collection. Project led to what is now standard with future generations of multibeam SONAR | Collaboration with the Monterey Bay Aquarium Research Institute to design and test the viability of high resolution multibeam sonars as a payload to obtain centimeter level accuracy of the deep sea.',
  },
];

export const BERINGIA_ABOUT = {
  heroTitle: 'About Beringia Marine',
  bridgingHeading: 'Bridging Solutions',
  bridgingParagraphs: [
    'Beringia Marine was founded after three decades of experience in marine technology, spanning marine research, ocean engineering, field operations, business development, and executive-level leadership. Throughout this journey, we identified significant gaps in the market, particularly in the early stages of design and solution viability.',
    'We aim to bridge these gaps by leveraging our diverse expertise and extensive network across all verticals of the marine industry. We conduct thorough market research to identify real-world needs for our oceans, focusing on areas that minimize competition and offer high-impact solutions. From initial concept through engineering, business development, and scaling, we ensure solutions are technically sound, aligned with market demands, and positioned for sustainable, long-term growth. By connecting our clients with the right partners and resources, we help businesses maximize their impact and fulfill crucial needs for ocean preservation and innovation.',
  ],
  leadershipHeading: 'Leadership',
  leadershipName: 'Chris Malzone',
  leadershipParagraphs: [
    'Chris Malzone is a seasoned marine technologist and business strategist with over three decades of experience in marine technology, sales, and project management. As the Principal of Beringia Marine Technologies, Chris has led the development and deployment of innovative offshore technologies, successfully managing key offshore projects and consulting clients on the integration of advanced subsea systems.',
    'Throughout his career, Chris has held senior roles, including at Advanced Navigation, where he contributed to significant sales growth, and at AML Oceanographic, where he helped the company achieve record revenues. His focus is on product development, business growth, and market strategy, with expertise in subsea technology and autonomous systems.',
    "With a Bachelor's degree in Geology and a Masters degree in Oceanography, Chris brings a unique technical perspective to every project, driving success through innovative solutions and strategic partnerships.",
  ],
  penguinAlt: 'Chris Malzone with Emperor Penguin in Antarctica',
  imageCaption:
    'Chris Malzone, 1994. Emperor Penguin encounter captured on Konica Autoreflex A with Polarizing Lens and Fuji Velvia film. Antarctica.',
} as const;

export const BERINGIA_CONTACT = {
  heading: 'Contact Us',
  intro:
    "Whether you have a project in mind, need expert insights, or just want to learn more about what we do, we'd love to hear from you.",
  support:
    "Use the form below and we will get back to you as soon as possible. If your request is time-sensitive, reach us directly via the email and phone listed on this page.",
} as const;

/** Verbatim terms (Ver 240913_1); do not paraphrase without legal review. */
export const BERINGIA_TERMS_FOOTER = {
  versionLabel: 'Ver 240913_1',
  dateLabel: '14 September 2024',
} as const;

export const BERINGIA_TERMS_SECTIONS: TermsSection[] = [
  {
    title: '1. Prices',
    body: 'All prices are Fixed and Firm and are inclusive of standard commercial packing for shipment unless otherwise stated. All transportation, insurance, special packing costs and expenses, and all Federal, state and local excise, duties, sales, and other similar taxes are the responsibility of the Purchaser. All prices are subject to adjustment, at any time, by Beringia Marine for changes in manufacturer pricing.',
  },
  {
    title: '2. Payment, Cancellations and Changes',
    body: "Terms are prepayment unless otherwise agreed in writing. Interest shall be charged on overdue accounts at the rate of 18% per year (1.5% per month) from the due date. Cancellations or changes made with Beringia Marine's written consent will be subject to a cancellation fee of $150.00 plus an amount up to 100% of the quoted price. A cancellation or change without Beringia Marine's written consent constitutes a breach of this Agreement and shall entitle Beringia Marine to all remedies available at law or in equity.",
  },
  {
    title: '3. Delivery',
    body: "Purchaser shall supply shipping instructions with each order which sall include: Ship to and bill to address, Quotation #, Preferred carrier and account #, Custom broker/freight forwarder including name and contact phone number. In the absence of specific instructions, the manufacturer and/or Beringia Marine may select a carrier and insure Products in transit and charge Purchaser accordingly. The manufacturer and/or Beringia Marine shall not be responsible for any failure to perform due to unforeseen circumstances or causes beyond its ability to reasonably control. Title shall pass to Purchaser when Purchaser has paid Beringia Marine all amounts due. Risk of loss, damage or destruction shall pass to Purchaser upon delivery to carrier. Goods are provided solely for incorporation into the Purchaser's end product and shall not be onward delivered except as incorporated in the Purchaser's end product.",
  },
  {
    title: '4. Copyright and Confidentiality',
    body: "Copyright in any specification, drawing, computer software, technical description and other document supplied by Beringia Marine on the behalf of the manufacturer under or in connection with the Order and all intellectual property rights in the design of any part of the Equipment or provision of services, whether such design be registered or not, shall vest in the manufacturer absolutely. The Buyer shall keep confidential any information expressed or confirmed by Beringia Marine and the manufacturer in writing to be confidential and shall not disclose it without Beringia Marine and the manufacturer's prior consent in writing to any third party or use it other than for the operation and maintenance of any Equipment provided.",
  },
  {
    title: '5. General Provisions',
    body: 'All Purchase Orders are subject to approval and acceptance by Beringia Marine. Any Purchase Order or other form from the Purchaser, which purports to expand, alter or amend these terms and conditions, is expressly rejected and is and shall not become a part of any agreement between Beringia Marine and the Purchaser. This agreement shall be interpreted under the laws of the State of California, USA.',
  },
  {
    title: '6. Third Party End-User Warranties',
    body: 'Beringia Marine hereby assigns and extends to Purchaser all end-user warranties on third party Products supplied by Beringia Marine, to the extent Beringia Marine is permitted to do so.',
  },
  {
    title: '7. Exclusion of Liability',
    body: "If a Party would, but for this paragraph (7), have concurrent claims in contract and tort (including negligence), such claims in tort (including negligence) shall to the extent permitted by law be wholly barred, unenforceable and excluded. Beringia Marine shall not be liable to the Buyer by way of indemnity or by reason of any breach of the Order or of statutory duty or by reason of tort (including but not limited to negligence) for any loss of profit, loss of use, loss of production, loss of contracts or for any financing costs, or for any indirect or consequential damage whatsoever that may be suffered by the Buyer. In the event and to the extent that Beringia Marine shall have any liability to Buyer pursuant to the terms of the Order, Beringia Marine shall be liable to Buyer only for those damages which have been foreseen or might have reasonably been foreseen on the date of effectivity of the Order and which are solely an immediate and direct result of any act or omission of Beringia Marine in performing the work, or any portion thereof, under the Order and which are not in the aggregate in excess of ten (10%) percent of the total Order price.",
  },
  {
    title: '8. Force Majeure',
    body: "In the event either party is unable to fully perform its obligations hereunder (except for Purchaser's obligation to pay for Products ordered) due to events beyond its reasonable control including but not limited to acts of God, action by any governmental authority (whether valid or invalid), fires, floods, windstorms, explosions, riots, terrorism, natural disasters, wars, sabotage, labor problems (including lockouts, strikes, slowdowns), inability to obtain power, material, labor, equipment or transportation, or court injunction or order, that party shall be relieved of its obligations to the extent it is unable to perform. Timely notice of such inability to perform shall be given to the other party. In the event of Beringia Marine's inability to perform due to force majeure that continues for more than thirty (30) days, Purchaser shall be entitled to reduce its purchase obligations towards Beringia Marine by the quantities purchased from other sources but shall not have the right to terminate this Agreement.",
  },
];
