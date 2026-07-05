// CamAccordian.tsx
// Accordian control that shows the CAM overlays.
//
// type CamAccordionProps
// export default function CamAccordian
//
// This component is inspired by the D3.js library, but does not use D3.js because
// at this writing this graph type is not available at d3.js.  There are two states
// that the "return" section of the code handles:  isExpanded and isSelected.
// The user can hover over the images, so that they expand to their full width.
// The user can also click on an image, which makes it the currently selected image
// and also draws a blue line around it, designating it as selected.
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import { useState, useEffect } from "react";
import { useLog } from "@/components/LogPanel";
import { useSelection } from "@/components/SelectionContext";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";

type CamAccordionProps = {
  images: string[];      // filenames relative to /public/images_CAM
  folder: string;          // "CEX" or "PG"
  title: string;           // component title
  height?: number;         // px
  collapsedWidth?: number; // px
  expandedWidth?: number;  // px
};

// ************************************************
export default function CamAccordion({images, folder, title,
                                      height = 300, collapsedWidth = 48, expandedWidth = 320,
}: CamAccordionProps) {

  // hooks.
  const { selectedFilename, setSelectedFilename } = useSelection();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sliceX, setSliceX] = useState(50); // percent

  const { log } = useLog();
  useEffect(() => {log("[mount]  CamAccordion");}, [log]);

  // filter for the images that fit the folder (classification label) passed in.
  const filteredImages = images.filter(name => name.startsWith(folder) );

  return (
    <div>

      {/* Slice position control adjusts which vertical slice is shown */}
      <div className="flex items-center gap-3 text-md text-slate-400">
        <span>{title}</span>
        <input
          type="range" min={0} max={100}
          value={sliceX}
          onChange={(e) => setSliceX(Number(e.target.value))}
          className="w-48"
        />
        <span className="tabular-nums">{sliceX}%</span>
      </div>

      {/* Accordion */}
      <div
        className="flex border border-slate-400 rounded-md"
        style={{ height }}
      >

        {/* loop through the images filtered by their classification. */}
        {filteredImages.map((filename, i) => {
          const isExpanded = i === activeIndex;             // for the hover state
          const isSelected = filename === selectedFilename; // for the user selected file.

          return (
            <div
              key={filename}
              className={` relative cursor-pointer duration-300 ease-in-out
                           transition-[flex-basis]
                           ${isExpanded ? "z-10" : "z-0"}
                           ${isSelected ? "border-4 border-blue-400" : ""}
                        `}
              style={{ flexBasis: isExpanded ? expandedWidth : collapsedWidth, }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setSelectedFilename(filename)}   >

              <img
                className={`h-full w-full object-cover`}
                src={`/images_CAM/${folder}/${filename}`}
                alt={filename}
                style={{objectPosition: `${sliceX}% center` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
