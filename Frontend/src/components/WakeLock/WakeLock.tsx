import { useWakeLock } from "@/hooks/useWakeLock";

export default function WakeLock() {
  useWakeLock(true);
  return null;
}