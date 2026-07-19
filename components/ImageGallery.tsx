// components/ImageGallery.tsx
// This component is an image gallery of all the images, plus a section
// at the top for metadata about the currently selected image.
//
// type ImageGalleryProps
// export default function ImageGallery({ images, onAddNeighbors...
// async function fetchNeighbors()   (fetch nearest neighbors for the selected image)
//
// Notes.
// The number of nearest neighbor image vectors to pull is limited to
// 5.  Fewer would make the FDG less dynamic.  More would crowd the
// FDG immediately, which might hinder attempts to study the image relationships.
// Note that the order in which the nearest neighbors are pulled effects
// the relationships depicted in the graph.
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import React, { useState, useEffect, useMemo } from "react";  
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import type { ImageThumb } from "@/types/ImageThumb";
import type { NeighborCenter, NeighborRecord } from "@/lib/data/types";
import { getNeighborsClient } from "@/lib/api/crystalsClient";

import { useSelection } from "@/components/SelectionContext";
import { useMetaByFilename } from "@/components/MetaContext";
import { useLog } from "@/components/LogPanel";  
import { image } from "d3";
import { CLUSTER_HEX, CLUSTER_COLORS } from "@/lib/graphUtilities";

type ImageGalleryProps = {
  images: ImageThumb[];
  onAddNeighbors: (center: NeighborCenter, neighbors: NeighborRecord[]) => void;
};


// ************************************************
export default function ImageGallery({ images, onAddNeighbors }: ImageGalleryProps) {

  // listen for changes to the currently selected file name.
  const { selectedFilename, setSelectedFilename } = useSelection();

  // combine the MetaContext with the SelectionContext to get the meta data for the selected image.
  const metaByFilename = useMetaByFilename();
  const selectedMeta = selectedFilename != null ? metaByFilename.get(selectedFilename) : null;

  // use the selected image file name to fetch the image from disk.
  const selectedImage = selectedFilename ? images.find(i => i.filename === selectedFilename) ?? null : null;

  const { log } = useLog();
  useEffect(() => {log(`[mount]  ImageGallery`);}, [log]);
  useEffect(() => {log(`[data]   Images count ${images.length}`); }, [images.length]);
  useEffect(() => {log(`[select] Gallery image ${selectedFilename}`); }, [selectedFilename]);

  const [showFirstImageCue, setShowFirstImageCue] = useState(false);

  useEffect(() => {
    if (selectedFilename) return;
    const startTimer = window.setTimeout(() => {
      if (!selectedFilename) {
        setShowFirstImageCue(true);
      }
    }, 3000);

    const stopTimer = window.setTimeout(() => {
      setShowFirstImageCue(false);
    }, 10000);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
    };
  }, [selectedFilename]);

  useEffect(() => {
    if (!selectedFilename || !selectedMeta) return;

    async function fetchNeighbors() {
      try {
        if (!selectedFilename || !selectedMeta) return;
        const result = await getNeighborsClient({ id: selectedMeta.id,
                                                  imageId: selectedFilename,
                                                  k: 5 });
        onAddNeighbors(result.center, result.neighbors);
        console.log("--->Inside ImageGallery, after onAddNeighbors call.");

      } catch (err) {
        console.error("Inside ImageGallery, failed to fetch neighbors:", err);
      }
    }
    fetchNeighbors();
  }, [selectedFilename]);

  return (
  <div className="flex h-full min-h-0 flex-col">

    {/* Selected image and metadata          className="flex shrink-0 gap-4"> */}
    <div className="flex shrink-0 gap-4">

      {/* Selected image */}
      <div className="shrink-0">
        {selectedImage ? (
          <img src={selectedImage.src}
            className="w-28 h-28 object-contain rounded border-2 border-blue-900 mb-4 " />
        ) : (
          <div className="w-28 h-28 rounded mb-4 bg-gray-300 border-2 border-blue-900 flex items-center justify-center text-black">
            No image selected
          </div>
        )}
      </div>

      {/* details for currently selected image (passed from parent) */}
      <div className="min-w-0 flex-1" >
        {selectedMeta != null && (
          <div className="text-base text-black">
            <div className="ml-3">image file: {selectedMeta.image_id}</div>
            <div className="ml-3">classification: {selectedMeta.class_label}</div>
            <div className="ml-3">confidence: {selectedMeta.confidence.toFixed(1)} %</div>
            <div className="ml-3">K-means no.: {selectedMeta.kmeans_pca_cluster}</div>
            <div className="ml-3">Shannon entropy: {selectedMeta.image_entropy.toFixed(2)}</div>
            <div className="ml-3">timestamp: {selectedMeta.image_header}</div>
          </div>

        )}
      </div>
    </div>

    {/* Scrollable gallery */}
    <div className="mt-4 min-h-0 flex-1 overflow-y-auto grid
                    grid-cols-[repeat(auto-fill,7rem)] auto-rows-[7rem] gap-1 content-start">
         {images.map((image, index) => {
            const clusterIndex = Number(image.kmeans_pca_cluster);
            const borderClass =
                  CLUSTER_COLORS[clusterIndex] ?? "border-l-slate-400";  // slate fallback
            const colorHex =
                  CLUSTER_HEX[clusterIndex] ?? "#94a3b8";  // slate fallback

            return (
               <button
                  key={image.filename}
                  onClick={() => {setSelectedFilename(image.filename);
                                  setShowFirstImageCue(false);
                                 }}
                  className={`relative h-28 w-28 rounded-md
                             ${index === 0 && showFirstImageCue
                                 ? "animate-pulse"
                                 : ""
                              }
                             ${borderClass}`} >

                  {/* image */}
                  <img className="block w-full h-full object-cover p-1" src={image.src} alt={image.filename} />

                  {/* colored circle */}
                  <span className=" absolute top-2 right-2 size-4 rounded-full "
                        style={{ backgroundColor: colorHex }} />
              </button>
            );
         })}
      </div>
  </div>
  );
}
