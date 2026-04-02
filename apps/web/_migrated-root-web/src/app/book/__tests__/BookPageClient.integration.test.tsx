import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookPageClient from '../BookPageClient';

// Mock the dependencies
jest.mock('@/lib/motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ui/Widget/Widget', () => ({
  Widget: () => <div data-testid="widget">Widget</div>,
}));

jest.mock('@/components/ui/Logo/Logo', () => {
  return function Logo() {
    return <div data-testid="logo">Logo</div>;
  };
});

jest.mock('@/lib/store/AppStore', () => ({
  useAppStore: (selector: () => unknown) => {
    const state = {
      showRegistration: false,
      setShowRegistration: jest.fn(),
    };
    return selector(state);
  },
}));

interface MockEmailButtonProps {
  children: React.ReactNode;
  email: string;
  subject?: string;
  className?: string;
}

jest.mock('@/components/ui/EmailButton/EmailButton', () => ({
  EmailButton: ({ children, email, subject, className }: MockEmailButtonProps) => (
    <button
      data-testid="email-button"
      data-email={email}
      data-subject={subject}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('BookPageClient Integration', () => {
  it('renders all EmailButton components with correct props', () => {
    render(<BookPageClient />);

    // Get all email buttons
    const emailButtons = screen.getAllByTestId('email-button');

    // Should have 5 email buttons total (4 pricing + 1 CTA, FAQ is collapsed)
    expect(emailButtons).toHaveLength(5);

    // Check Community Membership Wave 1
    const communityWave1 = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Community Membership Wave 1 Inquiry'
    );
    expect(communityWave1).toBeInTheDocument();
    expect(communityWave1?.getAttribute('data-email')).toBe('info@vitalicesf.com');

    // Check Community Membership Wave 2
    const communityWave2 = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Community Membership Wave 2 Inquiry'
    );
    expect(communityWave2).toBeInTheDocument();
    expect(communityWave2?.getAttribute('data-email')).toBe('info@vitalicesf.com');

    // Check Private Membership Wave 1
    const privateWave1 = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Private Membership Wave 1 Inquiry'
    );
    expect(privateWave1).toBeInTheDocument();
    expect(privateWave1?.getAttribute('data-email')).toBe('info@vitalicesf.com');

    // Check Private Membership Wave 2
    const privateWave2 = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Private Membership Wave 2 Inquiry'
    );
    expect(privateWave2).toBeInTheDocument();
    expect(privateWave2?.getAttribute('data-email')).toBe('info@vitalicesf.com');

    // FAQ email button is not visible when FAQ section is collapsed
    // This is expected behavior

    // Check CTA button
    const ctaButton = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Founding Membership Inquiry'
    );
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton?.getAttribute('data-email')).toBe('info@vitalicesf.com');
    expect(ctaButton?.textContent).toBe('Secure Your Founding Membership');
  });

  it('applies correct CSS classes to EmailButton components', () => {
    render(<BookPageClient />);

    const emailButtons = screen.getAllByTestId('email-button');

    // Check that pricing buttons have emailLink class
    const pricingButtons = emailButtons.filter(button =>
      button.getAttribute('data-subject')?.includes('Wave')
    );

    pricingButtons.forEach(button => {
      expect(button.className).toContain('emailLink');
    });

    // Check that CTA button has ctaButton class
    const ctaButton = emailButtons.find(
      button => button.getAttribute('data-subject') === 'Founding Membership Inquiry'
    );
    expect(ctaButton?.className).toContain('ctaButton');
  });

  it('renders page content correctly', () => {
    render(<BookPageClient />);

    // Check main headings
    expect(screen.getByText('Booking Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('Founding Memberships Available')).toBeInTheDocument();

    // Check membership types
    expect(screen.getByText('Unlimited Community Membership')).toBeInTheDocument();
    expect(screen.getByText('Unlimited Private Membership')).toBeInTheDocument();

    // Check that all "Inquire" buttons are present
    const inquireButtons = screen.getAllByText('Inquire');
    expect(inquireButtons).toHaveLength(4); // 2 waves × 2 membership types
  });
});
