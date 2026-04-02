// Script to create portable text content for holiday article
// This generates the content structure for the article

function createPortableTextContent() {
  const blocks = [];
  let blockKey = 0;
  let spanKey = 0;

  function addBlock(style, textParts) {
    const children = [];
    const markDefs = [];
    let markDefKey = 0;

    textParts.forEach(part => {
      if (typeof part === 'string') {
        // Plain text
        children.push({
          _type: 'span',
          _key: `span-${spanKey++}`,
          text: part,
          marks: [],
        });
      } else if (part.type === 'bold') {
        // Bold text
        children.push({
          _type: 'span',
          _key: `span-${spanKey++}`,
          text: part.text,
          marks: ['strong'],
        });
      } else if (part.type === 'link') {
        // Link
        const markKey = `link-${markDefKey++}`;
        markDefs.push({
          _key: markKey,
          _type: 'link',
          href: part.href,
          openInNewTab: false,
        });
        children.push({
          _type: 'span',
          _key: `span-${spanKey++}`,
          text: part.text,
          marks: [markKey],
        });
      }
    });

    blocks.push({
      _type: 'block',
      _key: `block-${blockKey++}`,
      style: style,
      children: children,
      markDefs: markDefs,
    });
  }

  // Introduction
  addBlock('normal', ['December brings a very particular kind of tired.']);
  addBlock('normal', [
    "It's not solved by one good night of sleep. It creeps in slowly. Shorter daylight hours. Cold air outside, dry heat inside. Calendars are filling up. More mirrors than usual because dinners, photos, and events suddenly feel closer together.",
  ]);
  addBlock('normal', [
    "Even people who rarely think about skincare start noticing small things. Skin feels tighter. Drier. Makeup doesn't sit the same way it did a few weeks ago. That rested look seems harder to hold onto.",
  ]);
  addBlock('normal', [
    'This is usually when people start talking about ',
    { type: 'bold', text: 'red light therapy' },
    " for skin. Not because it's a trend, but because it offers support without adding recovery time, discomfort, or another complicated step during an already crowded season.",
  ]);

  // What Red Light Therapy Is
  addBlock('h2', ['What Red Light Therapy Is, in Simple Terms']);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    ' uses specific wavelengths of red and near-infrared light to support how skin cells function.',
  ]);
  addBlock('normal', [
    'Unlike surface-level treatments, this light reaches deeper layers of the skin. These are the layers responsible for repair, circulation, and collagen activity. Instead of forcing the skin to change, red light therapy supports processes that already exist but tend to slow down when stress builds up.',
  ]);
  addBlock('normal', [
    "The sessions themselves are simple. You lie down. The light does its work. There's no heat, no irritation, and nothing you need to recover from afterward. That ease is part of why it fits naturally into the holiday season.",
  ]);

  // How Red Light Therapy Supports Skin Health
  addBlock('h2', ['How Red Light Therapy Supports Skin Health']);
  addBlock('normal', [
    'Healthy skin depends less on products and more on how well cells are able to recover.',
  ]);
  addBlock('normal', [
    'When skin cells have enough energy, they repair damage more efficiently and handle inflammation with less reactivity. ',
    { type: 'bold', text: 'Red light therapy' },
    ' supports this by improving cellular energy production, which can influence elasticity, hydration, and tone over time.',
  ]);
  addBlock('normal', [
    { type: 'bold', text: 'Collagen' },
    ' is part of this picture as well. Stress, disrupted sleep, and seasonal changes all affect how collagen is produced. Research shows that red light exposure can support collagen synthesis gradually, which is why results tend to look natural rather than dramatic.',
  ]);
  addBlock('normal', [
    'Most people don\'t say their skin looks "different." They describe it as calmer. More even. Less sensitive.',
  ]);
  addBlock('normal', ['During a busy season, that kind of change matters.']);

  // Why Red Light Therapy Makes Sense Before Christmas
  addBlock('h2', ['Why Red Light Therapy Makes Sense Before Christmas']);
  addBlock('normal', ['December puts quiet pressure on the skin.']);
  addBlock('normal', [
    'Cold air dries it out. Indoor heating does the same. Sleep becomes inconsistent. Stress stays present, even during good moments. Skin reflects all of it.',
  ]);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    " helps by supporting circulation and cellular repair when the body is already managing more than usual. Because sessions are short and non-invasive, they don't add strain to an already full schedule.",
  ]);
  addBlock('normal', [
    "There's also a mental element. Lying down in a calm space, even briefly, allows the nervous system to settle. When the body slows down, skin often responds.",
  ]);

  // Skin Changes People Tend to Notice
  addBlock('h2', ['Skin Changes People Tend to Notice']);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    " doesn't promise instant results.",
  ]);
  addBlock('normal', [
    "What people usually notice instead is gradual improvement. Skin looks brighter. Hydration holds longer through the day. Fine lines don't disappear, but they soften. Makeup applies more smoothly. Photos feel a little more forgiving.",
  ]);
  addBlock('normal', [
    "It's the kind of glow others notice without being able to explain exactly why.",
  ]);

  // When to Start for Holiday Events
  addBlock('h2', ['When to Start for Holiday Events']);
  addBlock('normal', ["Earlier tends to work better, but it doesn't need to be complicated."]);
  addBlock('normal', [
    'Many people begin a few weeks before their first Christmas event. Two to three sessions per week are common. Not because more is better, but because consistency gives skin time to respond naturally.',
  ]);
  addBlock('normal', [
    'Simple habits help support results. Staying hydrated. Keeping routines steady. Avoiding last-minute skincare experiments right before events.',
  ]);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    " works best when it reinforces what you're already doing, not when it's asked to fix everything at once.",
  ]);

  // How Red Light Therapy Fits Into Holiday Skincare
  addBlock('h2', ['How Red Light Therapy Fits Into Holiday Skincare']);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    " doesn't replace skincare. It supports it.",
  ]);
  addBlock('normal', [
    'Gentle cleansing, moisturizing, and hydration still matter. ',
    { type: 'bold', text: 'Red light therapy' },
    ' helps those basics work more effectively by improving how skin functions beneath the surface.',
  ]);
  addBlock('normal', [
    'Some people also pair sessions with other recovery practices during stressful weeks. When the body gets a chance to slow down, skin recovery often improves along with it.',
  ]);
  addBlock('normal', ['Less effort. More support.']);

  // Why People Choose Red Light Therapy at Vital Ice SF
  addBlock('h2', ['Why People Choose Red Light Therapy at Vital Ice SF']);
  addBlock('normal', [
    'At ',
    { type: 'link', text: 'Vital Ice', href: '/' },
    ', ',
    { type: 'bold', text: 'red light therapy' },
    ' is part of a broader recovery approach rather than a cosmetic add-on.',
  ]);
  addBlock('normal', [
    "The space is intentionally calm. Sessions aren't rushed. People come in to slow down during a season that rarely allows much pause.",
  ]);
  addBlock('normal', [
    'Many clients combine ',
    { type: 'bold', text: 'red light therapy' },
    " with other recovery services, turning skincare into part of a full reset instead of a single task. It's also more social than people expect. Familiar faces. Quiet conversations. A shared understanding that taking care of yourself doesn't need to feel performative.",
  ]);
  addBlock('normal', ['That atmosphere matters, especially around the holidays.']);

  // FAQ
  addBlock('h2', ['Frequently Asked Questions']);
  addBlock('normal', [
    { type: 'bold', text: 'How often should I use red light therapy before Christmas?' },
  ]);
  addBlock('normal', [
    'Most people use ',
    { type: 'bold', text: 'red light therapy' },
    ' four to five times per week in the weeks leading up to Christmas. Starting earlier allows results to build gradually instead of relying on last-minute sessions.',
  ]);
  addBlock('normal', [{ type: 'bold', text: 'Is red light therapy safe for all skin types?' }]);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    ' is generally safe for most skin types because it is gentle and non-invasive. Anyone with specific medical concerns should consult a healthcare professional first.',
  ]);
  addBlock('normal', [
    { type: 'bold', text: 'Can red light therapy reduce wrinkles and fine lines?' },
  ]);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    ' supports collagen production, which can help soften the appearance of fine lines over time. Results develop gradually with consistent use.',
  ]);
  addBlock('normal', [{ type: 'bold', text: 'How soon will I see results?' }]);
  addBlock('normal', [
    'Some people notice brighter, more hydrated skin after a few sessions. More visible changes usually appear over several weeks of regular use.',
  ]);

  // Conclusion
  addBlock('h2', ['A Calmer Way to Glow This Christmas']);
  addBlock('normal', ["Holiday skincare doesn't need to feel urgent or extreme."]);
  addBlock('normal', [
    { type: 'bold', text: 'Red light therapy' },
    ' offers steady support when schedules are full and stress runs high. It works quietly, builds over time, and fits into real life.',
  ]);
  addBlock('normal', [
    "If you're heading into Christmas events and want your skin to look rested rather than rushed, booking a ",
    { type: 'link', text: 'red light therapy session', href: '/services/red-light-therapy' },
    ' at Vital Ice SF gives your skin the breathing room it needs.',
  ]);

  return blocks;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPortableTextContent };
}

// If run directly, output JSON
if (require.main === module) {
  const content = createPortableTextContent();
  console.log(JSON.stringify(content, null, 2));
}
