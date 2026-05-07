// Vitest setup — polyfills jsdom gaps and resets per-test global state.

import { beforeEach } from 'vitest';

// jsdom's Storage stub doesn't always expose .clear() — install a minimal in-memory
// localStorage if needed. Tests rely on .clear() to reset between cases.
function installLocalStorage(): void {
  const store = new Map<string, string>();
  const localStorage: Storage = {
    get length() { return store.size; },
    clear() { store.clear(); },
    getItem(key: string) { return store.has(key) ? store.get(key)! : null; },
    setItem(key: string, value: string) { store.set(key, String(value)); },
    removeItem(key: string) { store.delete(key); },
    key(index: number) { return Array.from(store.keys())[index] ?? null; },
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorage,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  installLocalStorage();
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '/');
  }
});
