import { useState } from "react";
import { useLocalSettings, filesToDataUrls } from "@/hooks/useLocalSettings";
import { toast } from "sonner";

function MediaThumb({ src, onUse }: { src: string; onUse: () => void }) {
  const isVideo = /video|mp4/i.test(src);
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/15">
      {isVideo ? (
        <video
          src={src}
          className="h-24 w-24 object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img src={src} className="h-24 w-24 object-cover" />
      )}
      <button
        onClick={onUse}
        className="absolute inset-x-0 bottom-0 text-xs bg-black/60 text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Use
      </button>
    </div>
  );
}

export default function Admin() {
  const { settings, setSettings, reset, save } = useLocalSettings();
  const [gallery, setGallery] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem("rv_admin_ok") === "1",
  );
  const [pw, setPw] = useState("");

  if (!authed) {
    return (
      <div className="container py-24 max-w-md">
        <div className="glass p-6 space-y-4">
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter password"
            className="glass-input p-2 text-white bg-white/10 w-full"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded-md brand-gradient text-white shadow-glass w-full"
            onClick={() => {
              if (pw === "admin123") {
                sessionStorage.setItem("rv_admin_ok", "1");
                setAuthed(true);
              } else {
                toast.error("Incorrect password");
              }
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const assignToSlot = (index: number) => {
    const media = selected;
    if (!media) return;
    const next = [...(settings.slotMedia ?? Array(11).fill(null))];
    next[index] = media;
    setSettings({ ...settings, slotMedia: next });
  };

  const uploadToSlot = async (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const [data] = await filesToDataUrls([files[0]]);
    const next = [...(settings.slotMedia ?? Array(11).fill(null))];
    next[index] = data;
    setSettings({ ...settings, slotMedia: next });
  };

  return (
    <div className="container py-10 space-y-8 pb-24">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Admin Panel (local-only)
          </h1>
          <p className="text-white/70 text-sm">
            Changes are stored in your browser only (localStorage). Netlify
            visitors won’t see your edits.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <a href="/" className="px-3 py-2 rounded-md glass text-white">
            Back to website
          </a>
          <button
            className="px-3 py-2 rounded-md brand-gradient text-white shadow-glass"
            onClick={() => {
              save();
              toast.success("Saved locally (visible only to you)");
            }}
          >
            Save
          </button>
          <button
            className="px-3 py-2 rounded-md glass text-white"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </div>

      <section className="glass p-4 md:p-6 space-y-4">
        <h2 className="font-semibold text-white">Site Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="glass-input p-2 text-white bg-white/10"
            placeholder="Headline"
            value={settings.headline ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, headline: e.target.value })
            }
          />
          <input
            className="glass-input p-2 text-white bg-white/10"
            placeholder="Subtext"
            value={settings.subtext ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, subtext: e.target.value })
            }
          />
        </div>
      </section>

      <section className="glass p-4 md:p-6 space-y-4">
        <h2 className="font-semibold text-white">Background</h2>
        <div className="flex items-center gap-3">
          <input
            className="glass-input p-2 text-white bg-white/10 flex-1"
            placeholder="Paste image/video URL"
            value={settings.background ?? ""}
            onChange={(e) =>
              setSettings({ ...settings, background: e.target.value })
            }
          />
          <label className="glass px-3 py-2 rounded-md text-white cursor-pointer">
            Upload
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={async (e) => {
                const [data] = await filesToDataUrls(e.target.files);
                if (data) setSettings({ ...settings, background: data });
              }}
            />
          </label>
          <button
            className="px-3 py-2 rounded-md brand-gradient text-white shadow-glass"
            onClick={() => setSettings({ ...settings, background: null })}
          >
            Clear
          </button>
        </div>
        {settings.background && (
          <div className="rounded-lg overflow-hidden border border-white/15">
            {/video|mp4/i.test(settings.background) ? (
              <video
                src={settings.background}
                className="h-40 w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={settings.background}
                className="h-40 w-full object-cover"
              />
            )}
          </div>
        )}
      </section>

      <section className="glass p-4 md:p-6 space-y-4">
        <h2 className="font-semibold text-white">Gallery Upload</h2>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={async (e) => {
            if (!e.target.files) return;
            const data = await filesToDataUrls(e.target.files);
            setGallery((g) => [...g, ...data]);
            if (data[0]) setSelected(data[0]);
            if (data.length) {
              toast.success(
                "Added to gallery. Select a slot or use Upload on a slot.",
              );
            }
          }}
          className="text-white/80"
        />
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {gallery.map((src, i) => (
              <div
                key={i}
                onClick={() => setSelected(src)}
                className={
                  "cursor-pointer " +
                  (selected === src ? "ring-2 ring-brand" : "")
                }
              >
                <MediaThumb src={src} onUse={() => setSelected(src)} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass p-4 md:p-6 space-y-4">
        <h2 className="font-semibold text-white">Assign to Slots (3-4-4)</h2>
        <p className="text-xs text-white/70">
          Select a gallery item, then click a slot or upload directly for that
          slot.
        </p>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, idx) => {
              const media = settings.slotMedia?.[idx] ?? null;
              const isVideo = !!media && /video|mp4/i.test(media);
              return (
                <div key={idx} className="space-y-2">
                  <button
                    className="glass-card aspect-square w-full overflow-hidden"
                    onClick={() => assignToSlot(idx)}
                  >
                    {media ? (
                      isVideo ? (
                        <video
                          src={media}
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          src={media}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <span className="text-white/70">Slot {idx + 1}</span>
                    )}
                  </button>
                  <label className="text-xs text-white/80 inline-block cursor-pointer">
                    <span className="glass px-2 py-1 rounded">Upload</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => uploadToSlot(idx, e.target.files)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => {
              const index = 3 + idx;
              const media = settings.slotMedia?.[index] ?? null;
              const isVideo = !!media && /video|mp4/i.test(media);
              return (
                <div key={idx} className="space-y-2">
                  <button
                    className="glass-card aspect-square w-full overflow-hidden"
                    onClick={() => assignToSlot(index)}
                  >
                    {media ? (
                      isVideo ? (
                        <video
                          src={media}
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          src={media}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <span className="text-white/70">Slot {index + 1}</span>
                    )}
                  </button>
                  <label className="text-xs text-white/80 inline-block cursor-pointer">
                    <span className="glass px-2 py-1 rounded">Upload</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => uploadToSlot(index, e.target.files)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => {
              const index = 7 + idx;
              const media = settings.slotMedia?.[index] ?? null;
              const isVideo = !!media && /video|mp4/i.test(media);
              return (
                <div key={idx} className="space-y-2">
                  <button
                    className="glass-card aspect-square w-full overflow-hidden"
                    onClick={() => assignToSlot(index)}
                  >
                    {media ? (
                      isVideo ? (
                        <video
                          src={media}
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          src={media}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <span className="text-white/70">Slot {index + 1}</span>
                    )}
                  </button>
                  <label className="text-xs text-white/80 inline-block cursor-pointer">
                    <span className="glass px-2 py-1 rounded">Upload</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => uploadToSlot(index, e.target.files)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-md brand-gradient text-white shadow-glass"
          onClick={() => {
            save();
            toast.success("Saved locally (visible only to you)");
          }}
        >
          Save
        </button>
        <button
          className="px-4 py-2 rounded-md glass text-white"
          onClick={reset}
        >
          Reset local changes
        </button>
      </div>
    </div>
  );
}
