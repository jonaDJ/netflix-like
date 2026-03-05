export interface UserProfile {
  id: string;
  name: string;
  isKids: boolean;
  avatarColor: string;
}

export interface WatchProgressItem {
  id: string;
  type: string;
  played: number;
  durationSeconds: number;
  updatedAt: number;
}

const WATCH_PROGRESS_KEY = "watch-progress";
export const CONTINUE_WATCHING_UPDATED_EVENT = "continue-watching-updated";

export const APP_PROFILES: UserProfile[] = [
  { id: "p1", name: "Jon", isKids: false, avatarColor: "#E50914" },
  { id: "p2", name: "Guest", isKids: false, avatarColor: "#1E40AF" },
  { id: "p3", name: "Kids", isKids: true, avatarColor: "#16A34A" },
];
export const PRIMARY_PROFILE_ID = "p1";

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

const emitContinueWatchingUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONTINUE_WATCHING_UPDATED_EVENT));
};

export const isProfileSelectable = (profile: UserProfile): boolean =>
  profile.id === PRIMARY_PROFILE_ID;

const loadProgressState = (): Record<string, WatchProgressItem[]> =>
  readJson<Record<string, WatchProgressItem[]>>(WATCH_PROGRESS_KEY, {});

const saveProgressState = (state: Record<string, WatchProgressItem[]>) => {
  writeJson(WATCH_PROGRESS_KEY, state);
};

export const loadContinueWatching = (profileId: string): WatchProgressItem[] => {
  const state = loadProgressState();
  const items = state[profileId] ?? [];

  return [...items]
    .filter((item) => item.played >= 0.03 && item.played < 0.97)
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const saveWatchProgress = (
  profileId: string,
  payload: { id: string; type: string; played: number; durationSeconds: number }
) => {
  if (!profileId) return;

  const state = loadProgressState();
  const current = state[profileId] ?? [];
  const safePlayed = Math.max(0, Math.min(1, payload.played));
  const now = Date.now();

  const filtered = current.filter(
    (item) => !(item.id === payload.id && item.type === payload.type)
  );

  // Remove fully watched titles from continue watching.
  if (safePlayed >= 0.97 || safePlayed < 0.01) {
    state[profileId] = filtered;
    saveProgressState(state);
    emitContinueWatchingUpdated();
    return;
  }

  state[profileId] = [
    {
      id: payload.id,
      type: payload.type,
      played: safePlayed,
      durationSeconds: payload.durationSeconds,
      updatedAt: now,
    },
    ...filtered,
  ];

  saveProgressState(state);
  emitContinueWatchingUpdated();
};

export const removeWatchProgress = (
  profileId: string,
  payload: { id: string; type?: string }
) => {
  if (!profileId) return;

  const state = loadProgressState();
  const current = state[profileId] ?? [];

  state[profileId] = current.filter((item) => {
    if (item.id !== payload.id) return true;
    if (!payload.type) return false;
    return item.type !== payload.type;
  });

  saveProgressState(state);
  emitContinueWatchingUpdated();
};

export const removeWatchProgressByIds = (profileId: string, ids: string[]) => {
  if (!profileId || ids.length === 0) return;

  const idSet = new Set(ids);
  const state = loadProgressState();
  const current = state[profileId] ?? [];
  const next = current.filter((item) => !idSet.has(item.id));

  if (next.length === current.length) return;

  state[profileId] = next;
  saveProgressState(state);
  emitContinueWatchingUpdated();
};
