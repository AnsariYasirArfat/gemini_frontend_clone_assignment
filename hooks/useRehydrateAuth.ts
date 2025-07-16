import { useEffect } from "react";
import { login, logout } from "@/store/reducers/authSlice";
import { useAppDispatch } from "@/store/hook";
import { LOCALSTORAGE_KEYS } from "@/constants/localStorage";

export function useRehydrateAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) {
          dispatch(login({ phone: parsed.phone, country: parsed.country }));
        } else {
          localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH);
          dispatch(logout());
        }
      } catch {
        localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH);
        dispatch(logout());
      }
    } else {
      localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH);
      dispatch(logout());
    }
  }, [dispatch]);
}
