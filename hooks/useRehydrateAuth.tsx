import { useEffect } from "react";
import { login, logout } from "@/store/reducers/authSlice";
import { useAppDispatch } from "@/store/hook";

export function useRehydrateAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) {
          dispatch(login({ phone: parsed.phone, country: parsed.country }));
        } else {
          localStorage.removeItem("auth");
          dispatch(logout());
        }
      } catch {
        localStorage.removeItem("auth");
        dispatch(logout());
      }
    } else {
      localStorage.removeItem("auth");
      dispatch(logout());
    }
  }, [dispatch]);
}
