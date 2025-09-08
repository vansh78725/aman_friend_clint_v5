import { cn } from "@/lib/utils";

export type Slot = {
  id: string;
  video?: string | null;
};

import { useState } from "react";

function SlotCard({ video, selected, onSelect }: Slot & { selected: boolean; onSelect: () => void; }) {
  const [asVideo, setAsVideo] = useState(() => {
    if (!video) return false;
    if (video.startsWith("data:video")) return true;
    if (video.startsWith("data:image")) return false;
    if (/\.mp4(\?|$)/i.test(video)) return true;
    if (video.includes("/o/assets")) return true; // Builder hosted media often videos
    return true; // try video first, fallback to image on error
  });
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative glass-card rounded-xl p-1 md:p-1.5 border-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        selected && "ring-1 ring-primary/70 shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
      )}
      aria-pressed={selected}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border-[0.5px] border-white/10 flex items-center justify-center">
        {video ? (
          asVideo ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration && v.duration - v.currentTime < 0.05) {
                  v.currentTime = 0.01;
                }
              }}
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
    </button>
  );
}

import { useLocalSettings } from "@/hooks/useLocalSettings";
import { useClaim } from "@/hooks/useClaim.tsx";

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

  // Normalize media to fixed-length array of 11
  const normalized: (string | null)[] = Array.from({ length: totalSlots }, (_, i) => provided[i] ?? null);

  // Assign user-provided media to slot 6 and slot 11
  normalized[5] = "https://cdn.builder.io/o/assets%2Ffb795d15f146487ca8108581f173dd02%2F5e9b0dec61454f6da64afb298738c678?alt=media&token=47ac2eda-37d8-4759-a7df-c92aaf1ddfff&apiKey=fb795d15f146487ca8108581f173dd02";
  normalized[10] = "https://cdn.builder.io/o/assets%2Ffb795d15f146487ca8108581f173dd02%2F7962ddc881e7420dbdb09fc0cf53063c?alt=media&token=eea120d1-c0e1-42a8-9735-26328813fe7e&apiKey=fb795d15f146487ca8108581f173dd02";

  const slots: Slot[] = normalized.map((video, i) => ({
    id: String(i + 1),
    video,
  }));


  const { selectedIds, toggleSelected, canClaim, claim, isUidValid } = useClaim();

  const renderCard = (s: Slot) => (
    <SlotCard
      key={s.id}
      {...s}
      selected={selectedIds.includes(s.id)}
      onSelect={() => {
        if (!s.video) return;
        toggleSelected(s.id);
      }}
    />
  );

  return (
    <section className="container -mt-10 md:-mt-12 max-w-4xl">
      {/* Row 1: exactly 3, mobile too */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(0, 3).map(renderCard)}
      </div>
      {/* Row 2: 4 */}
      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(3, 7).map(renderCard)}
      </div>
      {/* Row 3: 4 */}
      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {slots.slice(7, 11).map(renderCard)}
      </div>

      <div className="flex justify-center mt-8 md:mt-10">
        <button
          type="button"
          onClick={claim}
          disabled={!canClaim}
          className={cn(
            "relative inline-flex items-center px-8 py-3 rounded-full font-extrabold text-white text-base md:text-lg transition shadow-glass",
            "brand-gradient",
            "before:absolute before:inset-0 before:rounded-full before:blur-xl before:bg-[hsl(var(--primary)/0.55)] before:opacity-70 before:-z-10",
            !canClaim && "opacity-50 cursor-not-allowed"
          )}
          aria-disabled={!canClaim}
          title={!isUidValid ? "Enter a valid 10-digit UID" : selectedIds.length === 0 ? "Select at least one bundle" : "Claim"}
        >
          Claim now
        </button>
      </div>
    </section>
  );
}
