/**
 * Example usage of ArticleContent component
 * This file demonstrates how to use the component with sample HTML content
 */

import ArticleContent from './ArticleContent';
import { ArticleData } from '@/types/insights';

// Sample article with rich HTML content
const sampleArticle: ArticleData = {
  id: 'example-1',
  title: 'The Science Behind Cold Plunge Therapy',
  subtitle: 'Understanding the physiological benefits of cold exposure',
  abstract:
    'Discover how cold plunge therapy triggers powerful physiological responses that enhance recovery, boost mental clarity, and build resilience.',
  content: `
    <h2>Introduction to Cold Therapy</h2>
    <p>
      Cold plunge therapy has been used for centuries across various cultures to enhance recovery, 
      boost mental clarity, and build physical resilience. Recent scientific research has validated 
      many of these traditional practices, revealing the complex physiological mechanisms at work.
    </p>

    <h3>Key Benefits</h3>
    <p>
      Cold exposure triggers a cascade of beneficial responses in the body. Here are the primary 
      benefits supported by scientific research:
    </p>
    <ul>
      <li><strong>Reduced inflammation</strong> and muscle soreness after intense exercise</li>
      <li><strong>Improved circulation</strong> and cardiovascular health through vasoconstriction</li>
      <li><strong>Enhanced mental resilience</strong> and mood through neurotransmitter release</li>
      <li><strong>Boosted immune function</strong> through increased white blood cell production</li>
    </ul>

    <figure>
      <img 
        src="https://media.vitalicesf.com/insights/cold-plunge-science.jpg" 
        alt="Person experiencing cold plunge therapy at Vital Ice" 
      />
      <figcaption>Cold plunge therapy session at Vital Ice San Francisco</figcaption>
    </figure>

    <h3>The Science of Cold Exposure</h3>
    <p>
      When you immerse yourself in cold water, your body undergoes several immediate physiological 
      changes. The most notable is the release of <strong>norepinephrine</strong>, a neurotransmitter 
      that can improve focus, attention, and mood. Studies have shown that cold exposure can increase 
      norepinephrine levels by up to 530%.
    </p>

    <h4>Hormonal Response</h4>
    <p>
      Cold exposure also affects your endocrine system, triggering the release of various hormones 
      that contribute to the therapeutic effects. This includes increased production of endorphins, 
      which act as natural pain relievers and mood elevators.
    </p>

    <h3>Recommended Protocols</h3>
    <p>
      The optimal cold plunge protocol depends on your experience level and goals. Here's a guide 
      to get you started:
    </p>

    <table>
      <thead>
        <tr>
          <th>Experience Level</th>
          <th>Temperature</th>
          <th>Duration</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Beginner</td>
          <td>50-59°F</td>
          <td>2-5 minutes</td>
          <td>2-3x per week</td>
        </tr>
        <tr>
          <td>Intermediate</td>
          <td>45-54°F</td>
          <td>3-8 minutes</td>
          <td>3-4x per week</td>
        </tr>
        <tr>
          <td>Advanced</td>
          <td>39-49°F</td>
          <td>5-15 minutes</td>
          <td>4-7x per week</td>
        </tr>
      </tbody>
    </table>

    <blockquote>
      "The cold is a noble force. It teaches us to be present, to breathe, and to embrace 
      discomfort as a path to growth." — Wim Hof
    </blockquote>

    <h3>Safety Considerations</h3>
    <p>
      While cold plunge therapy offers numerous benefits, it's important to approach it safely. 
      Always consult with a healthcare provider before starting any new wellness practice, especially 
      if you have cardiovascular conditions or other health concerns.
    </p>

    <ol>
      <li>Start with shorter durations and warmer temperatures</li>
      <li>Never plunge alone, especially when starting out</li>
      <li>Listen to your body and exit if you feel dizzy or uncomfortable</li>
      <li>Warm up gradually after your session</li>
      <li>Stay hydrated before and after cold exposure</li>
    </ol>

    <h3>Conclusion</h3>
    <p>
      Cold plunge therapy is a powerful tool for enhancing physical recovery, mental resilience, 
      and overall well-being. By understanding the science behind cold exposure and following 
      proper protocols, you can safely incorporate this practice into your wellness routine.
    </p>
    <p>
      Visit <a href="https://vitalicesf.com">Vital Ice</a> to experience professional cold plunge 
      therapy in a supportive community environment.
    </p>
  `,
  category: 'Research Summary',
  author: 'Vital Ice Team',
  publishDate: '2025-01-15',
  status: 'published',
  coverImage: 'https://media.vitalicesf.com/insights/cold-plunge-science.jpg',
  tags: ['Cold Therapy', 'Recovery', 'Science', 'Wellness'],
  slug: 'science-behind-cold-plunge-therapy',
  pdfUrl: 'https://media.vitalicesf.com/insights/pdfs/cold-plunge-science.pdf',
  readingTime: 8,
};

// Example component usage
export default function ArticleContentExample() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <ArticleContent article={sampleArticle} />
    </div>
  );
}
