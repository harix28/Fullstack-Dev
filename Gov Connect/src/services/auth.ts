import type { User, LoginCredentials, RegisterData } from '@/types';

const TOKEN_KEY = 'govconnect_token';
const USER_KEY = 'govconnect_user';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const persistSession = (user: User, token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ─── Auth Service ─────────────────────────────────────────────────────────────

/**
 * Authenticate a user with email/mobile and password.
 * Returns the authenticated User object.
 * Throws if credentials are invalid.
 *
 * Future: POST to API_ENDPOINTS.auth.login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  await delay(600);

  const { emailOrMobile, password } = credentials;

  if (!emailOrMobile || !password) {
    throw new Error('Please enter both email/mobile and password.');
  }

  // 1. Check registered users list in localStorage
  try {
    const registeredUsersJson = localStorage.getItem('govconnect_registered_users');
    const registeredUsers: (User & { password?: string })[] = registeredUsersJson
      ? JSON.parse(registeredUsersJson)
      : [];

    const found = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === emailOrMobile.toLowerCase().trim() ||
          u.mobile === emailOrMobile.trim()) &&
        (!u.password || u.password === password)
    );

    if (found) {
      const { password: _, ...cleanUser } = found;
      const token = `token_${Date.now()}`;
      persistSession(cleanUser, token);
      return cleanUser;
    }
  } catch (err) {
    console.error('Error reading registered users', err);
  }

  // 2. Validate format: valid email or 10-digit mobile, and password min 6 chars
  const cleanMobile = emailOrMobile.replace(/\D/g, '');
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile.trim());
  const isValidMobile = cleanMobile.length === 10;
  const isValidPassword = password.length >= 6;

  if (!isValidPassword) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (!isValidEmail && !isValidMobile) {
    throw new Error('Please enter a valid email address or 10-digit mobile number.');
  }

  // Generate user session for the authenticated credentials
  const derivedName = isValidEmail
    ? emailOrMobile.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : `Citizen ${cleanMobile.slice(-4)}`;

  const authenticatedUser: User = {
    id: `user_${Date.now()}`,
    name: derivedName,
    email: isValidEmail ? emailOrMobile.trim() : `${cleanMobile}@citizen.in`,
    mobile: isValidMobile ? cleanMobile : '9876543210',
    state: 'Delhi',
    district: 'New Delhi',
    cityVillage: 'City Center',
    dateOfBirth: '2001-01-01',
    age: 24,
    gender: 'male',
    category: 'general',
    hasDisability: false,
    education: 'graduate',
    occupation: 'citizen',
    employmentStatus: 'Employed / Self-Employed',
    skills: ['General Administration', 'Digital Literacy'],
    annualIncome: 300000,
    familySize: 3,
    profileCompletion: 80,
    preferences: {
      language: 'en',
      notifications: true,
      emailUpdates: true,
      theme: 'light',
    },
    createdAt: new Date().toISOString(),
  };

  const token = `token_${Date.now()}`;
  persistSession(authenticatedUser, token);

  return authenticatedUser;
};

/**
 * Register a new user account.
 * Returns the newly created User object.
 *
 * Future: POST to API_ENDPOINTS.auth.register
 */
export const registerUser = async (data: RegisterData): Promise<User> => {
  await delay(700);

  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const newUser: User & { password?: string } = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    state: data.state,
    district: data.district || '',
    cityVillage: data.cityVillage || '',
    dateOfBirth: data.dateOfBirth || '2001-01-01',
    age: data.age || 23,
    gender: (data.gender as User['gender']) || 'male',
    hasDisability: false,
    education: data.education || 'Graduate',
    occupation: data.occupation || 'Professional',
    employmentStatus: data.employmentStatus || 'Seeking Opportunities',
    skills: data.skills || [],
    category: (data.category as any) || 'General',
    annualIncome: data.annualIncome || 300000,
    familySize: 3,
    profileCompletion: 85,
    preferences: {
      language: 'en',
      notifications: true,
      emailUpdates: true,
      theme: 'light',
    },
    createdAt: new Date().toISOString(),
    password: data.password,
  };

  // Save to registered users list in localStorage
  try {
    const registeredUsersJson = localStorage.getItem('govconnect_registered_users');
    const registeredUsers: any[] = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
    registeredUsers.push(newUser);
    localStorage.setItem('govconnect_registered_users', JSON.stringify(registeredUsers));
  } catch (err) {
    console.error('Error saving registered user', err);
  }

  const { password: _, ...userWithoutPassword } = newUser;
  const mockToken = `token_${Date.now()}`;
  persistSession(userWithoutPassword, mockToken);

  return userWithoutPassword;
};

/**
 * Log out the current user and clear local session data.
 *
 * Future: POST to API_ENDPOINTS.auth.logout
 */
export const logoutUser = (): void => {
  clearSession();
};

/**
 * Retrieve the currently authenticated user from localStorage.
 * Returns null if not authenticated or if obsolete demo session is found.
 */
export const getCurrentUser = (): User | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token || !userJson) return null;
    const parsed = JSON.parse(userJson) as User;
    // Wipe obsolete demo session
    if (parsed.id === 'usr_in_demo_01' || token === 'mock_jwt_demo_token') {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    clearSession();
    return null;
  }
};

/**
 * Send a forgot-password request for the given email.
 * Returns a success message string.
 *
 * Future: POST to API_ENDPOINTS.auth.forgotPassword
 */
export const forgotPassword = async (email: string): Promise<string> => {
  await delay(600);

  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  return `A password reset link has been sent to ${email}. Please check your inbox.`;
};

/**
 * Update the profile of the currently authenticated user.
 * Returns the updated User object.
 *
 * Future: PUT to API_ENDPOINTS.auth.profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  await delay(700);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User not authenticated.');
  }

  const updatedUser: User = {
    ...currentUser,
    ...data,
    id: currentUser.id,             // immutable
    email: currentUser.email,       // immutable
    createdAt: currentUser.createdAt, // immutable
  };

  // Recalculate a simple profile completion score
  const completionFields: (keyof User)[] = [
    'name', 'email', 'mobile', 'state', 'district', 'dateOfBirth',
    'gender', 'category', 'education', 'occupation', 'annualIncome',
    'familySize', 'avatar',
  ];
  const filledFields = completionFields.filter(
    (f) => updatedUser[f] !== undefined && updatedUser[f] !== '' && updatedUser[f] !== 0,
  ).length;
  updatedUser.profileCompletion = Math.round((filledFields / completionFields.length) * 100);

  const token = localStorage.getItem(TOKEN_KEY) || `mock_jwt_${Date.now()}`;
  persistSession(updatedUser, token);

  return updatedUser;
};
