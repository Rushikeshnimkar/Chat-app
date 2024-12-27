import { setSessionData, getSessionData, deleteSessionData } from '../utils/indexedDB';


// Mock authentication for testing
export const authenticateUser = async (email: string): Promise<string> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock token
      const mockToken = `mock_token_${email}_${Date.now()}`;
      resolve(mockToken);
    }, 1000);
  });
};

export const login = async (email: string) => {
  try {
    const token = await authenticateUser(email);
    console.log('Token generated:', token); // Debug log

    // Store the token and user data
    await setSessionData('authToken', token);
    await setSessionData('userEmail', email);
    
    console.log('Data stored in IndexedDB'); // Debug log
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = await getSessionData('authToken');
    const email = await getSessionData('userEmail');
    console.log('Checking auth - Token:', token, 'Email:', email); // Debug log
    return Boolean(token && email);
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await deleteSessionData('authToken');
    await deleteSessionData('userEmail');
    console.log('Logged out - Session data cleared'); // Debug log
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}; 