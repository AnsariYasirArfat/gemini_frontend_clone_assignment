
export const LOCALSTORAGE_KEYS = {
  AUTH: "auth",
  CHATROOMS: "chatRooms",
} as const;

export type LocalStorageKey = typeof LOCALSTORAGE_KEYS[keyof typeof LOCALSTORAGE_KEYS];

