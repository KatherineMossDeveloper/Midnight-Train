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
import * as d3 from "d3";

// ************************************************
export default function ImageSlider() {

  // hooks
  const { selectedFilename } = useSelection();
  const { log } = useLog();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [sliderPct, setSliderPct] = useState(50); // 0–100
  useEffect(() => { log("[mount]  ImageSlider"); }, [log]);

  // the CAM overlay images are in either the CEX or PG folders
  const safe = selectedFilename ? encodeURIComponent(selectedFilename) : null;
  const isCEX = safe?.startsWith("CEX");
  const camFolder = isCEX ? "CEX" : "PG";
  const originalSrc = safe ? `/images_testing/${safe}` : null;
  const camSrc = safe ? `/images_CAM/${camFolder}/${safe}` : null;
  const altLeft = safe ? `/images_testing/${safe}` : null;
  const altRight = safe ? `/images_CAM/${camFolder}/${safe}` : null;

  // handle the click and drag mouse event.
  useEffect(() => {
    if (!containerRef.current || !handleRef.current) return;

    const container = containerRef.current;

    const drag = d3
      .drag<HTMLDivElement, unknown>()
      .on("drag", (event) => {
        const bounds = container.getBoundingClientRect();
        const x = event.sourceEvent.clientX - bounds.left;
        const pct = (x / bounds.width) * 100;
        setSliderPct(Math.max(0, Math.min(100, pct)));
      });

    const handleSel = d3.select(handleRef.current);
    handleSel.call(drag);

    return () => {
      handleSel.on(".drag", null);
    };
  }, [selectedFilename]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden bg-black border border-slate-400"  >

      {/* original image */}
      <img  className="absolute inset-0 w-full h-full object-contain"
        src={originalSrc} alt={altLeft}
      />

      {/* Masked CAM overlay */}
      {/* clipPath: `inset(0    ${100 - sliderPct}% 0       0)`    */}
      {/*            inset(top, right,              bottom, left)` */}
      {/* transition: "clip-path 0.2s linear" -- animate clipping  */}

      <img
         src={camSrc}
         alt={altRight}
         className="absolute inset-0 w-full h-full object-contain
                    pointer-events-none border-4 border-blue-400 "
         style={{
            clipPath: `inset(0 ${100 - sliderPct}% 0 0)`,
            transition: "clip-path 0.2s linear",
         }}
      />

      {/* Slider line */}
      <div  className="absolute top-0 h-full bg-blue-400"
        style={{
          left: `${sliderPct}%`,
          width: 9,
          transform: "translateX(-50%)",
        }}
      />

      {/* Slider handle */}
      <div
        ref={handleRef}
        className=" absolute top-1/2 w-7 h-7 rounded-full
                    bg-blue-400 border border-black shadow-md
                    cursor-col-resize flex items-center justify-center select-none "
        style={{
          left: `${sliderPct}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        ↔
      </div>
    </div>
  );
}
