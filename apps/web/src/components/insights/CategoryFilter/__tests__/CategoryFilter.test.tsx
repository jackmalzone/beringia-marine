import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../CategoryFilter';
import { ARTICLE_CATEGORIES } from '@/types/insights';

describe('CategoryFilter', () => {
  const mockOnCategoryChange = jest.fn();
  const categories = ['All', ...ARTICLE_CATEGORIES];

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it('renders all category buttons', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('applies active class to selected category', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="Wellness Article"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const activeButton = screen.getByText('Wellness Article');
    expect(activeButton).toHaveClass('filter__button--active');
  });

  it('calls onCategoryChange when button is clicked', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const button = screen.getByText('Recovery Guide');
    fireEvent.click(button);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Recovery Guide');
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation with Enter key', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const button = screen.getByText('Research Summary');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Research Summary');
  });

  it('supports keyboard navigation with Space key', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const button = screen.getByText('Community Story');
    fireEvent.keyDown(button, { key: ' ' });

    expect(mockOnCategoryChange).toHaveBeenCalledWith('Community Story');
  });

  it('has proper ARIA attributes', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="Wellness Article"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    // Check tablist role
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'Article categories');

    // Check tab roles
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(categories.length);

    // Check aria-selected on active tab
    const activeTab = screen.getByText('Wellness Article');
    expect(activeTab).toHaveAttribute('aria-selected', 'true');

    // Check aria-selected on inactive tabs
    const inactiveTab = screen.getByText('All');
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');

    // Check aria-controls
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-controls', 'insights-articles-grid');
    });
  });

  it('has visible focus indicators (tabIndex)', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const buttons = screen.getAllByRole('tab');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  it('prevents default behavior on Space key to avoid scrolling', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const button = screen.getByText('Recovery Guide');
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    fireEvent(button, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does not trigger on other keys', () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="All"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const button = screen.getByText('Recovery Guide');
    fireEvent.keyDown(button, { key: 'a' });
    fireEvent.keyDown(button, { key: 'Escape' });
    fireEvent.keyDown(button, { key: 'Tab' });

    expect(mockOnCategoryChange).not.toHaveBeenCalled();
  });
});
