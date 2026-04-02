import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../SearchBar';
import { ArticleData } from '@/types/insights';

// Mock the insights data module
jest.mock('@/lib/data/insights', () => ({
  searchArticles: jest.fn((query: string) => {
    if (query === 'cold') {
      return [
        {
          id: '1',
          title: 'Cold Plunge Benefits',
          slug: 'cold-plunge-benefits',
          category: 'Wellness Article',
        },
      ] as ArticleData[];
    }
    return [];
  }),
}));

describe('SearchBar', () => {
  const mockOnSearchResults = jest.fn();
  const mockOnSearchClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search articles by title, topic, or tag...');
  });

  it('has proper ARIA labels', () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByLabelText('Search articles');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'search-results-status');
  });

  it('debounces search input (300ms)', async () => {
    jest.useFakeTimers();
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');

    // Type quickly
    fireEvent.change(input, { target: { value: 'c' } });
    fireEvent.change(input, { target: { value: 'co' } });
    fireEvent.change(input, { target: { value: 'col' } });
    fireEvent.change(input, { target: { value: 'cold' } });

    // Should not call immediately
    expect(mockOnSearchResults).not.toHaveBeenCalled();

    // Fast-forward 300ms
    jest.advanceTimersByTime(300);

    // Wait for async operations
    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('displays loading spinner during search', async () => {
    jest.useFakeTimers();
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    // Should show loading spinner immediately
    const spinner = screen.getByRole('status', { name: 'Searching articles' });
    expect(spinner).toBeInTheDocument();

    jest.advanceTimersByTime(300);
    jest.useRealTimers();
  });

  it('displays results count after search', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      expect(screen.getByText(/Found 1 article for/)).toBeInTheDocument();
    });
  });

  it('displays "no results" message when no articles found', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'xyz123' } });

    await waitFor(() => {
      expect(screen.getByText(/No articles found for/)).toBeInTheDocument();
    });
  });

  it('shows clear button when input has value', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
    });
  });

  it('clears search when clear button is clicked', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);
    });

    expect(input.value).toBe('');
    expect(mockOnSearchClear).toHaveBeenCalledTimes(1);
  });

  it('calls onSearchResults with results and query', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            title: 'Cold Plunge Benefits',
          }),
        ]),
        'cold'
      );
    });
  });

  it('calls onSearchClear when input is cleared', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalled();
    });

    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => {
      expect(mockOnSearchClear).toHaveBeenCalled();
    });
  });

  it('announces results to screen readers', async () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} onSearchClear={mockOnSearchClear} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'cold' } });

    await waitFor(() => {
      const status = screen.getByRole('status', { name: '' });
      expect(status).toHaveAttribute('aria-live', 'polite');
    });
  });
});
