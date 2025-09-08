import { cn } from "@/lib/utils";

export type Slot = {
  id: string;
  video?: string | null;
};

import { useState } from "react";

function SlotCard({ video }: Slot) {
  const [asVideo, setAsVideo] = useState(() => {
    if (!video) return false;
    if (video.startsWith("data:video")) return true;
    if (video.startsWith("data:image")) return false;
    if (/\.mp4(\?|$)/i.test(video)) return true;
    if (video.includes("/o/assets")) return true; // Builder hosted media often videos
    return true; // try video first, fallback to image on error
  });
  return (
    <div className={cn("relative glass-card rounded-xl p-2 md:p-3")}>
      <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
        {video ? (
          asVideo ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              onError={() => setAsVideo(false)}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={video} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="h-10 w-10 rounded-lg border border-white/20" />
        )}
      </div>
    </div>
  );
}

import { useLocalSettings } from "@/hooks/useLocalSettings";

export default function ProductGrid() {
  const { settings } = useLocalSettings();
  const defaultVideos: (string | null)[] = [
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F7b511a45a15842789e983b1ea646b769?alt=media&token=d99a9d88-5281-4382-b2ee-f1c3bd51724c&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2Ff58bee17263b4d7a8226076b80d74214?alt=media&token=8445a7aa-840b-4c09-8b6c-b406c4a79c72&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F7bfe605746c44d96bf2448c4d98a82c7?alt=media&token=ad189c73-ac1e-41d3-9412-b00410bfbb8f&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F28cc4fd3a92e42bd813010dcc9651a8d?alt=media&token=396dfb4a-a944-4273-85c8-f1aef3d702ee&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2Fa5e82eae80da4cd6a9350d3e44c267d6?alt=media&token=98709188-82cd-48cc-b932-29e0ae148f67&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F94d5d8cf39b14add8f6d23afd0f285c9?alt=media&token=06431908-b855-48e6-848e-0ee7a7fa8ace&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2Ff3477b91cc224e3ea73a5f58f38a5cda?alt=media&token=0fc4b2bf-5d30-485e-92e0-ef1748165181&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F5cc3a80c387942c5b06e5eb98b5b702d?alt=media&token=2773f509-2a12-4574-aeec-54e29b325844&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
    "https://cdn.builder.io/o/assets%2F3d5d486ecac2431ca4c70e0a07d28c9f%2F4c089e3a12514ef8837df33a57eafb37?alt=media&token=464e6b23-7be3-4513-bdec-36fa03752242&apiKey=3d5d486ecac2431ca4c70e0a07d28c9f",
  ];

  const provided = settings.slotMedia ?? defaultVideos;

  // Total slots: 11 (3 + 4 + 4) – last ones can be blank
  const totalSlots = 11;
  let slots: Slot[] = Array.from({ length: totalSlots }).map((_, i) => ({
    id: String(i + 1),
    video: provided[i] ?? null,
  }));

  // Reorder row 1 as requested: [bunny, diamonds, fire]
  // Assume current center (index 1) is bunny, index 0 is diamonds, and the last non-null is fire.
  const lastIdx = (() => {
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i]?.video) return i;
    }
    return -1;
  })();
  if (slots[0] && slots[1]) {
    const bunny = slots[1];
    const diamonds = slots[0];
    const fire = lastIdx > 1 ? slots[lastIdx] : undefined;
    const used = new Set<number>();
    const next: Slot[] = Array.from({ length: totalSlots }).map((_, i) => ({
      id: String(i + 1),
      video: null,
    }));
    // Set first row
    next[0] = { ...bunny, id: "1" };
    next[1] = { ...diamonds, id: "2" };
    if (fire) {
      next[2] = { ...fire, id: "3" };
      used.add(lastIdx);
    } else {
      next[2] = { ...slots[2], id: "3" };
    }
    used.add(0);
    used.add(1);

    // Fill remaining positions with original order skipping used
    let cursor = 3;
    for (let i = 2; i < slots.length; i++) {
      if (used.has(i)) continue;
      next[cursor] = { ...slots[i], id: String(cursor + 1) };
      cursor++;
    }
    slots = next;
  }

  return (
    <section className="container -mt-10 md:-mt-12 max-w-4xl">
      {/* Row 1: exactly 3, mobile too */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(0, 3).map((s) => (
          <SlotCard key={s.id} {...s} />
        ))}
      </div>
      {/* Row 2: 4 */}
      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(3, 7).map((s) => (
          <SlotCard key={s.id} {...s} />
        ))}
      </div>
      {/* Row 3: 4 */}
      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(7, 11).map((s) => (
          <SlotCard key={s.id} {...s} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-10">
        <a
          href="#"
          className="px-7 py-3 rounded-full brand-gradient text-white font-bold text-base md:text-lg shadow-glass"
        >
          Claim now
        </a>
      </div>
    </section>
  );
}
