import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthUser, StoredUser } from "../../types/type";

const AUTH_STORAGE_KEY = "auth_state";
const USERS_STORAGE_KEY = "registered_users";

const createToken = (payload: object) => {
  return btoa(JSON.stringify(payload));
};

const loadStateFromStorage = (): AuthState => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return { isAuthenticated: false, token: null, user: null };
  try {
    const parsed = JSON.parse(raw) as AuthState;
    return parsed;
  } catch {
    return { isAuthenticated: false, token: null, user: null };
  }
};

const saveStateToStorage = (state: AuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

const initialState: AuthState = loadStateFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (
      _state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      const gmailRegex = /^[^\s@]+@gmail\.com$/i;
      if (!gmailRegex.test(email)) {
        throw new Error("Email '@gmail.com' ko'rinishida bo'lishi kerak");
      }
      if (!password || password.trim().length < 3) {
        throw new Error("Parol noto'g'ri");
      }
      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
      const exists = users.some((u) => u.email === email);
      if (!exists) {
        users.push({ email, password });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } else {
        throw new Error("User already exists");
      }
    },
    loginUser: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const { email, password } = action.payload;
      const gmailRegex = /^[^\s@]+@gmail\.com$/i;
      if (!gmailRegex.test(email)) {
        throw new Error("Email '@gmail.com' ko'rinishida bo'lishi kerak");
      }

      // Hardcoded admin
      const adminEmail = "admin@gmail.com";
      const adminPassword = "admin123";

      let authenticatedUser: AuthUser | null = null;

      if (email === adminEmail && password === adminPassword) {
        authenticatedUser = { email, role: "admin" };
      } else {
        const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
        const match = users.find(
          (u) => u.email === email && u.password === password
        );
        if (match) {
          authenticatedUser = { email, role: "user" };
        }
      }

      if (!authenticatedUser) {
        throw new Error("Invalid credentials");
      }

      const token = createToken({
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        ts: Date.now(),
      });
      state.isAuthenticated = true;
      state.user = authenticatedUser;
      state.token = token;
      saveStateToStorage(state);
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      saveStateToStorage(state);
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
