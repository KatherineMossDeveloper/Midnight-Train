// ImageSlider.tsx
// present the currently selected image along with the same image with
// a CAM overlay.
//
// The currently selected image is presented in full.  The CAM overlay
// image is clipped to the extent dictated by the slider bar.  The CAM
// overlay images are in either the CEX or PG folders because this
// component is created twice, one for each type of image classification.
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import { useRef, useEffect, useState } from "react";
import { useSelection } from "@/components/SelectionContext";
import { useLog } from "@/components/LogPanel";

// ************************************************
export default function ImageSlider() {

  // hooks
  const { selectedFilename } = useSelection();
  const { log } = useLog();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sliderPct, setSliderPct] = useState(50); // 0–100
  useEffect(() => { log("[mount]  ImageSlider"); }, [log]);

  // the CAM overlay images are in either the CEX or PG folders
  const safe = selectedFilename ? encodeURIComponent(selectedFilename) : null;
  const isCEX = safe?.startsWith("CEX");
  const camFolder = isCEX ? "CEX" : "PG";
  const originalSrc = safe ? `/images_orig512/${safe}` : undefined;
  const camSrc = safe ? `/images_CAM/${camFolder}/${safe}` : undefined;
  const altLeft = safe ? `/images_testing/${safe}` : undefined;
  const altRight = safe ? `/images_CAM/${camFolder}/${safe}` : undefined;

 // helper function
  function updateSlider(clientX: number) {
    if (!containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();

    const x = clientX - bounds.left;
    const pct = (x / bounds.width) * 100;
    setSliderPct(Math.max(0, Math.min(100, pct)));
  }

  // reset the slider to the center when we get a new image.
  useEffect(() => {
    if (!containerRef.current) return;
    setSliderPct(50);
  }, [selectedFilename]);

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => { if (e.buttons === 1) { updateSlider(e.clientX); }}}
      onPointerMove={(e) => { if (e.buttons === 1) { updateSlider(e.clientX); }}}
      className="relative w-full h-[300px] border border-slate-400">

      {/* original image */}
      <img
        src={originalSrc}
        alt={altLeft}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Masked CAM overlay; className:  place image in parent, stretch in all directions,
                              make it fill the parent box, preserve the image shape.    */}
      <img
         src={camSrc}
         alt={altRight}
         className="absolute inset-0 w-full h-full object-contain "
         style={{
            clipPath: `inset(0 ${100 - sliderPct}% 0 0)`,
            transition: "clip-path 0.2s linear",
         }}
      />

      {/* Slider line; className:  place image in parent; draw top to bottom; make it blue. */}
      <div  className="absolute top-0 h-full bg-blue-400"
        style={{ left: `${sliderPct}%`, width: 4, transform: "translateX(-50%)", }}
      />

      {/* Slider handle with ↔ hint symbol; className:  place 1/2 down; 7x7 px, rounded, blue,
          black border, make cursor ↔, place ↔ in middle, do not highlight selections */}
      <div
        className=" absolute top-1/2 w-7 h-7 rounded-full bg-blue-400 border border-black
                    cursor-col-resize flex items-center justify-center select-none "
        style={{ left: `${sliderPct}%`, transform: "translate(-50%, -50%)", }}
      >
      ↔
      </div>
    </div>
  );
}
