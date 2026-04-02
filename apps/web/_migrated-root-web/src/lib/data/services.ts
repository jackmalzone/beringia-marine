export interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  heroImage: string;
  textureImage?: string;
  accentColor: string;
  tagline: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  ctaTitle: string;
  ctaText: string;
}

export const servicesData: Record<string, ServiceData> = {
  'cold-plunge': {
    id: 'cold-plunge',
    title: 'Cold Plunge',
    subtitle: 'Controlled cold exposure for recovery & mental resilience',
    description:
      'An ancient practice, reimagined for modern recovery. Historic traditions from Nordic cultures and Japanese onsen, cold water immersion has been used for centuries to promote resilience, healing, and longevity. Cold plunging involves submerging the body in water typically between 39-55°F for a short duration (1-10 minutes at a time). The cold stimulates the nervous system, constricts blood vessels, and triggers powerful physiological responses.',
    backgroundImage: 'https://media.vitalicesf.com/coldplunge_woman.jpg',
    heroImage: 'https://media.vitalicesf.com/ice-vitalblue.jpg',
    textureImage: 'https://media.vitalicesf.com/ice_vertical-texture.jpg',
    accentColor: '#0040FF',
    tagline: 'Step in cold. Step out clear.',
    benefits: [
      {
        title: 'Nervous System Regulation',
        description:
          'Cold exposure activates the sympathetic nervous system, then supports a rebound into the parasympathetic (rest-and-digest) state — helping to build resilience to stress and improve emotional regulation.',
      },
      {
        title: 'Muscle Recovery',
        description:
          'Vasoconstriction reduces inflammation, muscle soreness, and swelling. When followed by re-warming, it improves circulation and speeds up recovery after intense training.',
      },
      {
        title: 'Improved Circulation',
        description:
          'Cold exposure stimulates blood flow by forcing the cardiovascular system to adapt — strengthening blood vessels and improving oxygen delivery throughout the body.',
      },
      {
        title: 'Mental Clarity & Resilience',
        description:
          'Short-term cold stress has been shown to elevate mood and sharpen focus by increasing norepinephrine up to 5x baseline. Regular exposure builds mental toughness and stress adaptation.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Preparation',
        description:
          'Begin with a rinse shower and a brief consultation. Our team will guide you through proper techniques.',
      },
      {
        step: '02',
        title: 'Gradual Exposure',
        description:
          "Start with a 30-second to 1-minute immersion, gradually building tolerance. If you can stay in for 3–5 minutes at 40°F or 10 minutes at 50°F, you're hitting what we consider superior tolerance.",
      },
      {
        step: '03',
        title: 'Breathing Focus',
        description:
          'Practice controlled breathing to manage the cold shock response and maximize benefits.',
      },
      {
        step: '04',
        title: 'Recovery',
        description:
          'Warm up gradually. We recommend contrast therapy by alternating between our saunas and cold plunges.',
      },
    ],
    ctaTitle: 'Ready to Experience Cold Plunge?',
    ctaText: 'Book your first session and discover the transformative benefits of cold therapy',
  },
  'infrared-sauna': {
    id: 'infrared-sauna',
    title: 'Infrared Sauna',
    subtitle: 'Deep tissue warming for detoxification & relaxation',
    description:
      'Infrared saunas introduce a modern, evidence-based approach to the ancient heat ritual. Unlike traditional saunas, which heat the air around you, infrared saunas use specific wavelengths of light, typically in the far-infrared range to warm the body directly. This allows for a deep, penetrating heat that stimulates the body at lower ambient temperatures (typically 120-150°F), making the experience more accessible and less taxing on the cardiovascular system.',
    backgroundImage: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
    heroImage: 'https://media.vitalicesf.com/sauna-infraredwide.jpg',
    textureImage: 'https://media.vitalicesf.com/embers_closeup.jpg',
    accentColor: '#E74C3C',
    tagline: 'Release the strain. Welcome the repair.',
    benefits: [
      {
        title: 'Deep Tissue Penetration',
        description:
          'The infrared light penetrates up to 1.5 inches beneath the skin, triggering a thermal effect at the cellular level for enhanced therapeutic benefits.',
      },
      {
        title: 'Improved Circulation',
        description:
          'Increased circulation and oxygen delivery to tissues, supporting faster recovery and tissue repair.',
      },
      {
        title: 'Detoxification',
        description:
          'Improved detoxification by stimulating perspiration and promoting cellular cleansing.',
      },
      {
        title: 'Stress Relief',
        description:
          'Stress relief via parasympathetic nervous system activation, promoting deep relaxation and mental clarity.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Preparation',
        description:
          'Arrive clean and hydrated, remove any metal jewelry, change into swimwear. Our staff will explain the session and safety guidelines.',
      },
      {
        step: '02',
        title: 'Session',
        description:
          'Spend 20-30 minutes in our infrared sauna at 120-140°F, much lower than traditional saunas. Meditation, breathing exercises and stretching all compliment the sauna very well.',
      },
      {
        step: '03',
        title: 'Hydration',
        description:
          "Stay well-hydrated throughout your session and listen to your body's signals.",
      },
      {
        step: '04',
        title: 'Cool Down',
        description:
          'Gradually cool down. We recommend contrast therapy by alternating between our IR sauna and cold plunges.',
      },
    ],
    ctaTitle: 'Ready to Experience Infrared Sauna?',
    ctaText:
      'Book your session and experience the deep therapeutic benefits of infrared heat therapy',
  },
  'traditional-sauna': {
    id: 'traditional-sauna',
    title: 'Traditional Sauna',
    subtitle: 'Classic Finnish-style dry heat therapy',
    description:
      'Rooted in centuries of Nordic tradition, the traditional sauna is a centuries old method of recovery and revitalization. Heated between 160-200°F, it uses dry air and radiant heat to create a full-body sweat experience that promotes deep relaxation and physiological reset.',
    backgroundImage: 'https://media.vitalicesf.com/sauna-traditional.jpg',
    heroImage: 'https://media.vitalicesf.com/sauna-traditional.jpg',
    textureImage: 'https://media.vitalicesf.com/lavastones.jpg',
    accentColor: '#F39C12',
    tagline: 'Embrace the heat. Emerge renewed.',
    benefits: [
      {
        title: 'Muscle Recovery',
        description:
          'Muscle recovery and inflammation reduction through deep heat penetration and improved circulation.',
      },
      {
        title: 'Detoxification',
        description:
          'Detoxification through elevated perspiration, promoting natural cleansing and waste removal.',
      },
      {
        title: 'Cardiovascular Stimulation',
        description:
          'Cardiovascular stimulation, mimicking the effects of light aerobic exercise for heart health.',
      },
      {
        title: 'Mental Clarity',
        description:
          'Activation of the parasympathetic nervous system for stress relief and mental clarity.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Preparation',
        description:
          'Arrive clean and hydrated, remove any metal jewelry, change into swimwear. Our staff will explain the session and safety guidelines.',
      },
      {
        step: '02',
        title: 'Session',
        description:
          "Spend 10-20 minutes in the sauna at 160-200°F, listening to your body's signals. Meditation, breathing exercises and stretching all compliment the sauna very well.",
      },
      {
        step: '03',
        title: 'Hydration',
        description:
          "Stay well-hydrated throughout your session and listen to your body's signals.",
      },
      {
        step: '04',
        title: 'Cool Down',
        description:
          'Gradually cool down. We recommend contrast therapy by alternating between our sauna and cold plunges.',
      },
    ],
    ctaTitle: 'Ready to Experience Traditional Sauna?',
    ctaText: 'Book your session and experience the authentic Finnish sauna tradition',
  },
  'compression-boots': {
    id: 'compression-boots',
    title: 'Compression Boots',
    subtitle: 'Advanced compression therapy for circulation & recovery',
    description:
      'Compression boot therapy uses advanced pneumatic compression technology to enhance circulation and accelerate recovery. This non-invasive treatment applies rhythmic pressure to your legs, mimicking the natural muscle pump action to improve blood flow and lymphatic drainage. Perfect for athletes, active individuals, or anyone seeking improved circulation and faster recovery.',
    backgroundImage: 'https://media.vitalicesf.com/cells-bloodcells.jpg',
    heroImage: 'https://media.vitalicesf.com/stone_whitesky.jpg',
    textureImage: 'https://media.vitalicesf.com/texture_blacksand-landscape.jpg',
    accentColor: '#8B5CF6',
    tagline: 'Compress the stress. Release the relief.',
    benefits: [
      {
        title: 'Circulatory Support',
        description:
          'Sequential compression enhances venous return and stimulates blood flow, helping deliver nutrients and oxygen to muscle tissue while removing waste byproducts like lactic acid.',
      },
      {
        title: 'Reduced Swelling & Inflammation',
        description:
          'By promoting lymphatic drainage and reducing fluid buildup, compression therapy can ease swelling and inflammation caused by intense training, long periods of standing, or injury.',
      },
      {
        title: 'Muscle Recovery & Soreness Relief',
        description:
          'Helps decrease delayed onset muscle soreness (DOMS) and promotes faster muscle repair by increasing circulation and reducing stagnation in fatigued limbs.',
      },
      {
        title: 'Enhanced Lymphatic Function',
        description:
          "Supports healthy lymphatic flow, aiding the body's detoxification processes and immune response — especially beneficial after travel, illness, or physical stress.",
      },
    ],
    process: [
      {
        step: '01',
        title: 'Assessment & Prep',
        description:
          "We'll explain the compression therapy process, help you get set up in the boots and sitting back in one of our zero gravity chairs with your legs elevated.",
      },
      {
        step: '02',
        title: 'Session',
        description:
          'Relax for 15-20 minutes while the compression boots provide rhythmic pressure therapy.',
      },
      {
        step: '03',
        title: 'Monitoring',
        description:
          'Adjust and optimize the pressure settings with device controls to suit yourself.',
      },
      {
        step: '04',
        title: 'Recovery',
        description: 'Feel immediate relief and improved circulation after your session.',
      },
    ],
    ctaTitle: 'Ready to Experience Compression Therapy?',
    ctaText: 'Book your session and accelerate your recovery with advanced compression technology',
  },
  'percussion-massage': {
    id: 'percussion-massage',
    title: 'Percussion Massage',
    subtitle: 'Deep tissue percussion therapy for muscle recovery',
    description:
      'Percussion massage therapy uses advanced percussive technology to deliver deep tissue massage that targets muscle tension and promotes recovery. This innovative therapy combines the benefits of traditional massage with modern technology to provide more consistent and effective treatment. The percussive action helps break up muscle knots, improve blood flow, and accelerate recovery.',
    backgroundImage: 'https://media.vitalicesf.com/percussion_bicep.jpg',
    heroImage: 'https://media.vitalicesf.com/texture_blackmarble-cracks.jpg',
    textureImage: 'https://media.vitalicesf.com/texture_blackrock.jpg',
    accentColor: '#2ECC71',
    tagline: 'Break the tension. Build the strength.',
    benefits: [
      {
        title: 'Increased Circulation',
        description:
          'Percussive pulses stimulate blood flow and deliver oxygen-rich nutrients to muscle tissue, aiding repair and reducing recovery time.',
      },
      {
        title: 'Soreness & Tension Relief',
        description:
          'Breaks up knots and adhesions, alleviates muscle tightness, and decreases delayed onset muscle soreness (DOMS) after physical activity.',
      },
      {
        title: 'Improved Range of Motion',
        description:
          'Loosens stiff muscle groups and fascia, improving flexibility and mobility — especially beneficial pre-workout or after long periods of sitting.',
      },
      {
        title: 'Neuromuscular Activation',
        description:
          'Helps wake up sluggish muscles and reset neuromuscular pathways, making it an effective warm-up tool for both training and daily movement.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Consultation',
        description: 'Allow us to show you the correct techniques for your specific needs.',
      },
      {
        step: '02',
        title: 'Treatment',
        description:
          'Receive targeted percussion therapy on required muscle groups. Focus directly on and around knots and adhesions.',
      },
      {
        step: '03',
        title: 'Technique',
        description:
          'Focusing directly on and around knots and adhesions, move the massager slowly and in control allowing the device to do the work itself. Adjust pressure and speed based on your comfort and needs.',
      },
      {
        step: '04',
        title: 'Recovery',
        description: 'Experience immediate relief and improved muscle function.',
      },
    ],
    ctaTitle: 'Ready to Experience Percussion Therapy?',
    ctaText:
      'Book your session and experience deep tissue relief with advanced percussion technology',
  },
  'red-light-therapy': {
    id: 'red-light-therapy',
    title: 'Red Light Therapy',
    subtitle: 'Therapeutic light for cellular regeneration & skin health',
    description:
      "Red Light Therapy, scientifically known as photobiomodulation, is a non-invasive treatment that uses specific wavelengths of red and near-infrared light to stimulate cellular function and support tissue repair. Unlike ultraviolet light, which can damage the skin, red and infrared light penetrate safely beneath the surface — reaching muscles, joints, and even mitochondria (your cells' energy engine).",
    backgroundImage: 'https://media.vitalicesf.com/redlight_mask.jpg',
    heroImage: 'https://media.vitalicesf.com/redlight_jellyfish.jpg',
    textureImage: 'https://media.vitalicesf.com/light_blurryhues.jpg',
    accentColor: '#E91E63',
    tagline: 'Illuminate the healing. Ignite the recovery.',
    benefits: [
      {
        title: 'Cellular Energy Production',
        description:
          'Stimulates cytochrome c oxidase in mitochondria, enhancing ATP (energy) production and boosting cellular performance.',
      },
      {
        title: 'Skin Health & Anti-Aging',
        description: 'Improved skin tone, collagen production, and wound healing with regular use.',
      },
      {
        title: 'Pain Relief',
        description:
          'Reduced inflammation and pain relief, especially for joint, tendon, and back pain.',
      },
      {
        title: 'Neurological Benefits',
        description:
          'Supports cognitive function and brain health, reducing symptoms of anxiety and seasonal depression.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Preparation',
        description: 'Remove any makeup or lotions and ensure skin is clean and dry.',
      },
      {
        step: '02',
        title: 'Treatment',
        description:
          'Sit or lie comfortably while the red light penetrates your skin for 10-20 minutes.',
      },
      {
        step: '03',
        title: 'Protection',
        description: 'No special protection needed - red light therapy is safe and non-damaging.',
      },
      {
        step: '04',
        title: 'Results',
        description: 'Experience gradual improvements in skin health and pain relief over time.',
      },
      {
        step: '05',
        title: 'Combine',
        description:
          'Enhance your recovery by pairing compression therapy with one of our rejuvenating red light masks.',
      },
    ],
    ctaTitle: 'Ready to Experience Red Light Therapy?',
    ctaText: 'Book your session and discover the regenerative power of therapeutic light treatment',
  },
};
