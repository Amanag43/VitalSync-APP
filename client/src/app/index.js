import { Redirect } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!hydrated) return null;

  return (
    <Redirect
      href={isLoggedIn ? "/home" : "/login"}
    />
  );
}