import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface PerformanceProfile {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  shouldLoadHeavyMedia: boolean;
  currentVideoIndex: number;
  preferredVideoFormat: 'webm' | 'mp4';
  hasMediaError: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animations: 'full' | 'reduced' | 'none';
  notifications: boolean;
  expandedFounders: number[];
  openFAQItem: number | null;
  expandedJobs: string[];
  hoveredServiceIndex: number | null;
}

interface AppState {
  // Navigation State
  currentPage: string;
  isMenuOpen: boolean;
  navigationHistory: string[];

  // Loading State
  isLoading: boolean;
  loadingProgress: number;

  // Performance State
  performanceProfile: PerformanceProfile;

  // User Preferences
  userPreferences: UserPreferences;

  // Page-specific State
  showRegistration: boolean;
  currentTestimonialIndex: number;
  isServiceSidebarOpen: boolean;
  isRollingButtonNearFooter: boolean;
  currentPhotoGalleryIndex: number;

  // Actions
  setCurrentPage: (page: string) => void;
  toggleMenu: () => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  startLoading: () => void;
  completeLoading: () => void;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  updatePerformanceProfile: (profile: Partial<PerformanceProfile>) => void;
  setShowRegistration: (show: boolean) => void;
  setCurrentTestimonialIndex: (index: number) => void;
  setServiceSidebarOpen: (open: boolean) => void;
  setRollingButtonNearFooter: (near: boolean) => void;
  setExpandedFounders: (founders: number[]) => void;
  setOpenFAQItem: (item: number | null) => void;
  setExpandedJobs: (jobs: string[]) => void;
  setHoveredServiceIndex: (index: number | null) => void;
  setPreferredVideoFormat: (format: 'webm' | 'mp4') => void;
  setMediaError: (hasError: boolean) => void;
  setCurrentPhotoGalleryIndex: (index: number) => void;
  resetStore: () => void;
}

// Initial state
const initialState = {
  currentPage: '/',
  isMenuOpen: false,
  navigationHistory: [],
  isLoading: false,
  loadingProgress: 0,
  performanceProfile: {
    isMobile: false,
    prefersReducedMotion: false,
    shouldLoadHeavyMedia: true,
    currentVideoIndex: 0,
    preferredVideoFormat: 'mp4' as const,
    hasMediaError: false,
  },
  userPreferences: {
    theme: 'auto' as const,
    animations: 'full' as const,
    notifications: true,
    expandedFounders: [],
    openFAQItem: null,
    expandedJobs: [],
    hoveredServiceIndex: null,
  },
  showRegistration: false,
  currentTestimonialIndex: 0,
  isServiceSidebarOpen: false,
  isRollingButtonNearFooter: false,
  currentPhotoGalleryIndex: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      ...initialState,

      // Navigation Actions
      setCurrentPage: page =>
        set(state => ({
          currentPage: page,
          navigationHistory: [...state.navigationHistory, page].slice(-10), // Keep last 10 pages
        })),

      toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),

      // Loading Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setLoadingProgress: (progress: number) => set({ loadingProgress: progress }),
      startLoading: () => set({ isLoading: true, loadingProgress: 0 }),
      completeLoading: () => set({ isLoading: false, loadingProgress: 100 }),

      // User Preferences Actions
      updateUserPreferences: prefs =>
        set(state => ({
          userPreferences: { ...state.userPreferences, ...prefs },
        })),

      // Performance Actions
      updatePerformanceProfile: profile =>
        set(state => ({
          performanceProfile: { ...state.performanceProfile, ...profile },
        })),

      // Page-specific Actions
      setShowRegistration: (show: boolean) => set({ showRegistration: show }),
      setCurrentTestimonialIndex: (index: number) => set({ currentTestimonialIndex: index }),
      setServiceSidebarOpen: (open: boolean) => set({ isServiceSidebarOpen: open }),
      setRollingButtonNearFooter: (near: boolean) => set({ isRollingButtonNearFooter: near }),
      setExpandedFounders: (founders: number[]) =>
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            expandedFounders: founders,
          },
        })),
      setOpenFAQItem: (item: number | null) =>
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            openFAQItem: item,
          },
        })),
      setExpandedJobs: (jobs: string[]) =>
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            expandedJobs: jobs,
          },
        })),
      setHoveredServiceIndex: (index: number | null) =>
        set(state => ({
          userPreferences: {
            ...state.userPreferences,
            hoveredServiceIndex: index,
          },
        })),
      setPreferredVideoFormat: (format: 'webm' | 'mp4') =>
        set(state => ({
          performanceProfile: {
            ...state.performanceProfile,
            preferredVideoFormat: format,
          },
        })),
      setMediaError: (hasError: boolean) =>
        set(state => ({
          performanceProfile: {
            ...state.performanceProfile,
            hasMediaError: hasError,
          },
        })),
      setCurrentPhotoGalleryIndex: (index: number) => set({ currentPhotoGalleryIndex: index }),

      // Utility Actions
      resetStore: () => set(initialState),
    }),
    {
      name: 'vital-ice-store',
      // Only persist user preferences and performance profile
      partialize: state => ({
        userPreferences: state.userPreferences,
        performanceProfile: state.performanceProfile,
      }),
    }
  )
);

// Convenience hooks for specific state slices
export const useNavigation = () => {
  const {
    currentPage,
    isMenuOpen,
    navigationHistory,
    showRegistration,
    currentTestimonialIndex,
    isServiceSidebarOpen,
    isRollingButtonNearFooter,
    currentPhotoGalleryIndex,
    setCurrentPage,
    toggleMenu,
    setShowRegistration,
    setCurrentTestimonialIndex,
    setServiceSidebarOpen,
    setRollingButtonNearFooter,
    setCurrentPhotoGalleryIndex,
  } = useAppStore();
  return {
    currentPage,
    isMenuOpen,
    navigationHistory,
    showRegistration,
    currentTestimonialIndex,
    isServiceSidebarOpen,
    isRollingButtonNearFooter,
    currentPhotoGalleryIndex,
    setCurrentPage,
    toggleMenu,
    setShowRegistration,
    setCurrentTestimonialIndex,
    setServiceSidebarOpen,
    setRollingButtonNearFooter,
    setCurrentPhotoGalleryIndex,
  };
};

export const useUserPreferences = () => {
  const {
    userPreferences,
    updateUserPreferences,
    setExpandedFounders,
    setOpenFAQItem,
    setExpandedJobs,
    setHoveredServiceIndex,
  } = useAppStore();
  return {
    ...userPreferences,
    updateUserPreferences,
    setExpandedFounders,
    setOpenFAQItem,
    setExpandedJobs,
    setHoveredServiceIndex,
  };
};

export const usePerformance = () => {
  const { performanceProfile, updatePerformanceProfile, setPreferredVideoFormat, setMediaError } =
    useAppStore();
  return { performanceProfile, updatePerformanceProfile, setPreferredVideoFormat, setMediaError };
};

export const useLoading = () => {
  const {
    isLoading,
    loadingProgress,
    setLoading,
    setLoadingProgress,
    startLoading,
    completeLoading,
  } = useAppStore();
  return {
    isLoading,
    loadingProgress,
    setLoading,
    setLoadingProgress,
    startLoading,
    completeLoading,
  };
};
