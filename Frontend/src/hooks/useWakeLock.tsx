import { useEffect } from "react";

export function useWakeLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let wakeLock: any = null;
    const isSupported = "wakeLock" in navigator;

    const requestWakeLock = async () => {
      if (!isSupported) {
        console.warn("Wake Lock API not supported in this browser.");
        return;
      }
      try {
        wakeLock = await (navigator as any).wakeLock.request("screen");
        wakeLock.addEventListener?.("release", () => {
          console.log("Wake Lock was released");
        });
        console.log("Wake Lock is active");
      } catch (err) {
        console.error("Failed to obtain wake lock:", err);
      }
    };

    const releaseWakeLock = async () => {
      try {
        if (wakeLock && typeof wakeLock.release === "function") {
          await wakeLock.release();
          wakeLock = null;
        }
      } catch (err) {
        console.error("Failed to release wake lock:", err);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await requestWakeLock();
      } else {
        wakeLock = null;
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [enabled]);
}