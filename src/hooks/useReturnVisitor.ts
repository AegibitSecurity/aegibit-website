"use client";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Returns `true` if this visitor's browser already has the
 * `vc_visited` localStorage marker from a prior session.
 *
 * SSR-safe: the server snapshot is always `false`, so the served
 * HTML matches the first client render before localStorage is read.
 *
 * Why useSyncExternalStore (not useState + useEffect):
 *   This was previously `useEffect(setIsReturn(true))` which trips
 *   react-hooks/set-state-in-effect (cascading-render anti-pattern).
 *   The React 18+ canonical pattern for "derive a value from an
 *   external mutable source" is useSyncExternalStore, with the
 *   browser `storage` event acting as the change-notification
 *   channel (other tabs writing the same key). For same-tab writes
 *   we don't need notifications because the visit-marker write
 *   happens *after* we've already read the snapshot.
 */

const STORAGE_KEY = "vc_visited";

function subscribe(callback: () => void): () => void {
  // `storage` only fires for changes made in OTHER tabs of the same
  // origin. That's the correct signal here: if a sister tab marks
  // the visitor as having visited, we want to reflect that.
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getClientSnapshot(): boolean {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReturnVisitor(): boolean {
  const isReturn = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Mark this visit. Runs once after first mount when we determine
  // this is a fresh visitor. The localStorage write is a pure side
  // effect (no React state change) so the lint rule does not apply.
  useEffect(() => {
    if (!isReturn) {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Storage blocked (private mode, embedded webviews) — the
        // hook will keep returning false for this visitor's session,
        // which is the safe degradation.
      }
    }
  }, [isReturn]);

  return isReturn;
}
