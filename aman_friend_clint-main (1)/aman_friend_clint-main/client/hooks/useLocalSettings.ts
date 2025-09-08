import { useEffect, useState } from "react";

export type LocalSettings = {
  background?: string | null; // data URL or external URL
  headline?: string | null;
  subtext?: string | null;
  slotMedia?: (string | null)[]; // length flexible
};

const KEY = "rv_local_settings_v1";
const KEY_SESSION = "rv_local_settings_session_v1";
const EVT = "rv-local-settings-update";

export function useLocalSettings() {
  const [settings, setSettings] = useState<LocalSettings>({});

  useEffect(() => {
    try {
      const mem = (window as any).__rv_local_settings_cache as LocalSettings | undefined;
      if (mem) {
        setSettings(mem);
      } else {
        const sess = sessionStorage.getItem(KEY_SESSION);
        if (sess) {
          setSettings(JSON.parse(sess));
        } else {
          const raw = localStorage.getItem(KEY);
          if (raw) setSettings(JSON.parse(raw));
        }
      }
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    const onLocal = (e: Event) => {
      const any = e as CustomEvent<LocalSettings>;
      if (any?.detail) setSettings(any.detail);
    };
    window.addEventListener(EVT, onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVT, onLocal);
    };
  }, []);

  useEffect(() => {
    try {
      // keep full settings in-memory (handles large data URLs)
      (window as any).__rv_local_settings_cache = settings;
      // also keep a full copy in sessionStorage for same-tab navigation
      try {
        sessionStorage.setItem(KEY_SESSION, JSON.stringify(settings));
      } catch {}
      // store a pruned version in localStorage for cross-tab persistence
      const pruned: LocalSettings = {
        ...settings,
        background:
          settings.background &&
          settings.background.startsWith("data:") &&
          settings.background.length > 5_000_000
            ? null
            : (settings.background ?? null),
        slotMedia:
          settings.slotMedia?.map((m) =>
            m && m.startsWith("data:") && m.length > 2_000_000 ? null : m,
          ) ?? settings.slotMedia,
      };
      localStorage.setItem(KEY, JSON.stringify(pruned));
      window.dispatchEvent(new CustomEvent(EVT, { detail: settings }));
    } catch {}
  }, [settings]);

  const save = () => {
    try {
      (window as any).__rv_local_settings_cache = settings;
      try {
        sessionStorage.setItem(KEY_SESSION, JSON.stringify(settings));
      } catch {}
      const pruned: LocalSettings = {
        ...settings,
        background:
          settings.background &&
          settings.background.startsWith("data:") &&
          settings.background.length > 5_000_000
            ? null
            : (settings.background ?? null),
        slotMedia:
          settings.slotMedia?.map((m) =>
            m && m.startsWith("data:") && m.length > 2_000_000 ? null : m,
          ) ?? settings.slotMedia,
      };
      localStorage.setItem(KEY, JSON.stringify(pruned));
      window.dispatchEvent(new CustomEvent(EVT, { detail: settings }));
    } catch {}
  };

  return {
    settings,
    setSettings,
    reset: () => setSettings({}),
    save,
  } as const;
}

export async function filesToDataUrls(
  files: FileList | File[] | null,
): Promise<string[]> {
  const arr = Array.from(files);
  const tasks = arr.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
  );
  return Promise.all(tasks);
}
