import { createContext, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "meme-library-auth";
const SAVED_MEME_STORAGE_KEY = "meme-library-saved-memes-by-user";
const PROFILE_PRIVACY_STORAGE_KEY = "meme-library-profile-privacy-by-user";
export const CURRENT_USER_PROFILE_ID = "hong-private";

const defaultAuthState = {
  isLoggedIn: true,
  displayName: "홍지우",
  email: "hongjiwoo@example.com",
};

const loggedOutState = {
  isLoggedIn: false,
  displayName: "",
  email: "",
};

const AuthContext = createContext(null);

function normalizeAuthState(authState) {
  if (!authState || typeof authState !== "object") {
    return defaultAuthState;
  }

  return {
    isLoggedIn: Boolean(authState.isLoggedIn),
    displayName: typeof authState.displayName === "string" ? authState.displayName : "",
    email: typeof authState.email === "string" ? authState.email : "",
  };
}

function persistAuthState(authState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

function getStoredAuthState() {
  if (typeof window === "undefined") {
    return defaultAuthState;
  }

  const storedAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuthState) {
    return defaultAuthState;
  }

  try {
    return normalizeAuthState(JSON.parse(storedAuthState));
  } catch {
    return defaultAuthState;
  }
}

function getDisplayName(email) {
  const namePart = email.split("@")[0]?.trim();

  return namePart || defaultAuthState.displayName;
}

function normalizeSavedMemeIds(savedMemeIds) {
  if (!Array.isArray(savedMemeIds)) {
    return [];
  }

  return [...new Set(savedMemeIds.filter((id) => typeof id === "string" && id.trim() !== ""))];
}

function getStoredSavedMemeMap() {
  if (typeof window === "undefined") {
    return {};
  }

  const storedSavedMemeMap = window.localStorage.getItem(SAVED_MEME_STORAGE_KEY);

  if (!storedSavedMemeMap) {
    return {};
  }

  try {
    const parsedSavedMemeMap = JSON.parse(storedSavedMemeMap);

    return parsedSavedMemeMap && typeof parsedSavedMemeMap === "object"
      ? parsedSavedMemeMap
      : {};
  } catch {
    return {};
  }
}

function getStoredSavedMemeIds(email) {
  if (!email) {
    return [];
  }

  const savedMemeMap = getStoredSavedMemeMap();

  return normalizeSavedMemeIds(savedMemeMap[email]);
}

function persistSavedMemeIds(email, savedMemeIds) {
  if (typeof window === "undefined" || !email) {
    return;
  }

  const savedMemeMap = getStoredSavedMemeMap();
  const normalizedSavedMemeIds = normalizeSavedMemeIds(savedMemeIds);

  savedMemeMap[email] = normalizedSavedMemeIds;
  window.localStorage.setItem(SAVED_MEME_STORAGE_KEY, JSON.stringify(savedMemeMap));
}

function getStoredProfilePrivacyMap() {
  if (typeof window === "undefined") {
    return {};
  }

  const storedProfilePrivacyMap = window.localStorage.getItem(PROFILE_PRIVACY_STORAGE_KEY);

  if (!storedProfilePrivacyMap) {
    return {};
  }

  try {
    const parsedProfilePrivacyMap = JSON.parse(storedProfilePrivacyMap);

    return parsedProfilePrivacyMap && typeof parsedProfilePrivacyMap === "object"
      ? parsedProfilePrivacyMap
      : {};
  } catch {
    return {};
  }
}

function getStoredProfilePrivacy(email) {
  if (!email) {
    return true;
  }

  const profilePrivacyMap = getStoredProfilePrivacyMap();

  if (typeof profilePrivacyMap[email] === "boolean") {
    return profilePrivacyMap[email];
  }

  return true;
}

function persistProfilePrivacy(email, isProfilePrivate) {
  if (typeof window === "undefined" || !email) {
    return;
  }

  const profilePrivacyMap = getStoredProfilePrivacyMap();

  profilePrivacyMap[email] = Boolean(isProfilePrivate);
  window.localStorage.setItem(PROFILE_PRIVACY_STORAGE_KEY, JSON.stringify(profilePrivacyMap));
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getStoredAuthState);
  const [savedMemeIds, setSavedMemeIds] = useState(() =>
    getStoredSavedMemeIds(getStoredAuthState().email || defaultAuthState.email)
  );
  const [isProfilePrivate, setIsProfilePrivate] = useState(() =>
    getStoredProfilePrivacy(getStoredAuthState().email || defaultAuthState.email)
  );

  const value = useMemo(
    () => ({
      authState,
      isLoggedIn: authState.isLoggedIn,
      displayName:
        authState.displayName || (authState.isLoggedIn ? defaultAuthState.displayName : ""),
      email: authState.email,
      savedMemeIds,
      savedMemeCount: savedMemeIds.length,
      isProfilePrivate,
      login: ({ email }) => {
        const trimmedEmail = email.trim() || defaultAuthState.email;
        const nextAuthState = {
          isLoggedIn: true,
          displayName: getDisplayName(trimmedEmail),
          email: trimmedEmail,
        };

        persistAuthState(nextAuthState);
        setAuthState(nextAuthState);
        setSavedMemeIds(getStoredSavedMemeIds(trimmedEmail));
        setIsProfilePrivate(getStoredProfilePrivacy(trimmedEmail));
      },
      logout: () => {
        persistAuthState(loggedOutState);
        setAuthState(loggedOutState);
        setSavedMemeIds([]);
        setIsProfilePrivate(true);
      },
      toggleSavedMeme: (memeId) => {
        if (!authState.isLoggedIn || !authState.email) {
          return;
        }

        setSavedMemeIds((prev) => {
          const nextSavedMemeIds = prev.includes(memeId)
            ? prev.filter((id) => id !== memeId)
            : [...prev, memeId];

          persistSavedMemeIds(authState.email, nextSavedMemeIds);

          return nextSavedMemeIds;
        });
      },
      setProfilePrivacy: (nextIsProfilePrivate) => {
        if (!authState.isLoggedIn || !authState.email) {
          return;
        }

        const normalizedPrivacy = Boolean(nextIsProfilePrivate);

        persistProfilePrivacy(authState.email, normalizedPrivacy);
        setIsProfilePrivate(normalizedPrivacy);
      },
    }),
    [authState, isProfilePrivate, savedMemeIds]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
