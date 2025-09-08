import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocalSettings } from "@/hooks/useLocalSettings";

export default function Hero() {
  const [uid, setUid] = useState("");
  const { settings } = useLocalSettings();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const bg = settings.background;
  const isVideo = !!bg && /video|mp4/i.test(bg);

  return (
    <section
      className={cn(
        "relative overflow-hidden gradient-hero pb-16 pt-20 md:pt-28",
      )}
    >
      {bg &&
        (isVideo ? (
          <video
            src={bg}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={bg}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
          />
        ))}
      {!bg && (
        <div className="absolute inset-0 -z-10 brand-gradient opacity-30" />
      )}
      <div className="container relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {settings.headline || "Premium Glass Loot Store"}
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            {settings.subtext ||
              "Sleek, cinematic and fast. Explore curated drops with luminous glassmorphism."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 max-w-md">
          <div className="glass-input flex items-center gap-2 p-2 md:p-3">
            <Hash className="h-4 w-4 text-white/70" />
            <input
              aria-label="Enter 10 digit UID"
              placeholder="Enter 10 digit UID"
              inputMode="numeric"
              maxLength={10}
              pattern="\\d{10}"
              value={uid}
              onChange={(e) =>
                setUid(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
              }
              className="bg-transparent outline-none placeholder:text-white/50 text-white flex-1 text-sm"
            />
          </div>
          <p className="mt-2 text-[11px] text-white/60">
            UID must be exactly 10 digits.
          </p>
        </form>
      </div>
    </section>
  );
}
