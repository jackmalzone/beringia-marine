/**
 * AuthorCard Component Tests
 */

import { render, screen } from '@testing-library/react';
import AuthorCard from '../AuthorCard';
import { Author } from '@/types/insights';

describe('AuthorCard', () => {
  describe('String Author', () => {
    it('renders simple author name', () => {
      render(<AuthorCard author="John Doe" />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('applies simple styling class', () => {
      const { container } = render(<AuthorCard author="John Doe" />);
      const card = container.querySelector('.authorCard--simple');
      expect(card).toBeInTheDocument();
    });

    it('does not render avatar or social links', () => {
      render(<AuthorCard author="John Doe" />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Author Object', () => {
    const fullAuthor: Author = {
      name: 'Dr. Sarah Chen',
      role: 'Sports Medicine Specialist',
      bio: 'Dr. Chen specializes in recovery science and has published over 30 peer-reviewed papers.',
      avatar: 'https://example.com/avatar.jpg',
      social: {
        twitter: 'https://twitter.com/drsarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen-md',
        website: 'https://sarahchenmd.com',
      },
    };

    it('renders author name', () => {
      render(<AuthorCard author={fullAuthor} />);
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    it('renders author role', () => {
      render(<AuthorCard author={fullAuthor} />);
      expect(screen.getByText('Sports Medicine Specialist')).toBeInTheDocument();
    });

    it('renders author bio', () => {
      render(<AuthorCard author={fullAuthor} />);
      expect(screen.getByText(/Dr. Chen specializes in recovery science/)).toBeInTheDocument();
    });

    it('renders avatar image', () => {
      render(<AuthorCard author={fullAuthor} />);
      const avatar = screen.getByAltText('Dr. Sarah Chen avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('renders social links', () => {
      render(<AuthorCard author={fullAuthor} />);
      expect(screen.getByLabelText('Dr. Sarah Chen on Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('Dr. Sarah Chen on LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText("Dr. Sarah Chen's website")).toBeInTheDocument();
    });

    it('social links open in new tab', () => {
      render(<AuthorCard author={fullAuthor} />);
      const twitterLink = screen.getByLabelText('Dr. Sarah Chen on Twitter');
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Partial Author Object', () => {
    it('renders without avatar', () => {
      const author: Author = {
        name: 'Jane Smith',
        role: 'Wellness Coach',
      };
      render(<AuthorCard author={author} />);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Wellness Coach')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders without bio', () => {
      const author: Author = {
        name: 'Jane Smith',
        role: 'Wellness Coach',
        avatar: 'https://example.com/avatar.jpg',
      };
      render(<AuthorCard author={author} />);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText(/specializes/)).not.toBeInTheDocument();
    });

    it('renders without social links', () => {
      const author: Author = {
        name: 'Jane Smith',
        role: 'Wellness Coach',
        bio: 'A passionate wellness coach.',
      };
      render(<AuthorCard author={author} />);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders with partial social links', () => {
      const author: Author = {
        name: 'Jane Smith',
        social: {
          twitter: 'https://twitter.com/janesmith',
        },
      };
      render(<AuthorCard author={author} />);
      expect(screen.getByLabelText('Jane Smith on Twitter')).toBeInTheDocument();
      expect(screen.queryByLabelText('Jane Smith on LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Jane Smith's website")).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<AuthorCard author="John Doe" className="custom-class" />);
      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for social links', () => {
      const author: Author = {
        name: 'Dr. Sarah Chen',
        social: {
          twitter: 'https://twitter.com/drsarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen-md',
          website: 'https://sarahchenmd.com',
        },
      };
      render(<AuthorCard author={author} />);

      const twitterLink = screen.getByLabelText('Dr. Sarah Chen on Twitter');
      const linkedinLink = screen.getByLabelText('Dr. Sarah Chen on LinkedIn');
      const websiteLink = screen.getByLabelText("Dr. Sarah Chen's website");

      expect(twitterLink).toHaveAttribute('aria-label', 'Dr. Sarah Chen on Twitter');
      expect(linkedinLink).toHaveAttribute('aria-label', 'Dr. Sarah Chen on LinkedIn');
      expect(websiteLink).toHaveAttribute('aria-label', "Dr. Sarah Chen's website");
    });

    it('has aria-hidden on social icons', () => {
      const author: Author = {
        name: 'Dr. Sarah Chen',
        social: {
          twitter: 'https://twitter.com/drsarahchen',
        },
      };
      const { container } = render(<AuthorCard author={author} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
