/**
 * Mock Auth/Session Helpers
 */

export const mockSession = {
  user: {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 86400000).toISOString(),
};

export const mockUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
};
