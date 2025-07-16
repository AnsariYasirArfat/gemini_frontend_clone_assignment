import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { rehydrateChatRooms } from "@/store/reducers/chatRoomSlice";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage";

export function useRehydrateChatRooms(isAuthenticated: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem(LOCALSTORAGE_KEYS.CHATROOMS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch(rehydrateChatRooms(parsed));
        } catch {
          localStorage.removeItem(LOCALSTORAGE_KEYS.CHATROOMS);
          dispatch(rehydrateChatRooms([]));
        }
      } else {
        dispatch(rehydrateChatRooms([]));
      }
    }
  }, [dispatch, isAuthenticated]);
}
