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
import type { NeighborCenter, NeighborRecord } from "@/lib/data/types";
import { getNeighborsClient } from "@/lib/api/crystalsClient";

import { useSelection } from "@/components/SelectionContext";
import { useLog } from "@/components/LogPanel";
import { CLUSTER_HEX, WHITE_HEX } from "@/lib/graphUtilities";

export type ImageGalleryPoint = {
  id: string;
  image_id: string;
  class_label: string;
  confidence: number;
  image_entropy: number;
  image_header: string;
  kmeans_pca_cluster: number;
  //src: `/images_testing/${encodeURIComponent(image_id)}`;
  //alt: image_id;
};

type ImageGalleryProps = {
  images: ImageGalleryPoint[];
  onAddNeighbors: (center: NeighborCenter, neighbors: NeighborRecord[]) => void;
};


// ************************************************
export default function ImageGallery({ images, onAddNeighbors }: ImageGalleryProps) {

  // listen for changes to the currently selected file name.
  const { selectedFilename, setSelectedFilename } = useSelection();

  // get the meta data for the selected image, if one has been selected.
  const selectedMeta = selectedFilename != null ?
                       images.find(image => image.image_id === selectedFilename) : null;

  // use the selected image file name to fetch the image from disk and get its K-means color.
  const selectedImage = selectedFilename ?
                        images.find(i => i.image_id === selectedFilename) ?? null : null;
  const clusterIndex = Number(selectedImage?.kmeans_pca_cluster);
  const colorHex = CLUSTER_HEX[clusterIndex] ?? WHITE_HEX;

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

    {/* Selected image and metadata  */}
    <div className="flex shrink-0 gap-4">

      {/* Selected image  Tailwind:  relative=img+span; mt/b margin top/bottom   */}
      <div className="shrink-0">
        {selectedImage ? (
           <div className="relative mt-1 mb-3 h-28 w-28">
             <img className="rounded-md border-3 border-slate-400 h-28 w-28 "
                 src={`/images_testing/${encodeURIComponent(selectedImage.image_id)}`}
                 alt={selectedImage.image_id}                                       />

             <span className="absolute top-2 right-2 h-4 w-4 rounded-full"
               style={{ backgroundColor: colorHex }} />
          </div>
        ) : (
          <div className="w-28 h-28 rounded mt-1 mb-3 bg-gray-100 border-2
                          border-blue-900 flex items-center justify-center text-slate-900">
            Select an image.
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

         {/* Loop through the images, create buttons with them and add K-means group circles on them. */}
         {images.map((image, index) => {
            const clusterIndex = Number(image.kmeans_pca_cluster);
            const colorHex = CLUSTER_HEX[clusterIndex] ?? WHITE_HEX;

            return (
               <button
                  key={image.image_id}
                  onClick={() => {setSelectedFilename(image.image_id);
                                  setShowFirstImageCue(false);
                                 }}
                  className={`relative h-28 w-28 rounded-md
                             ${index === 0 && showFirstImageCue
                                 ? "animate-pulse" : "" }
                             ${selectedImage?.image_id === image.image_id
                                 ? "border-3 border-slate-400" : "" }
                             `} >

                  {/* image and its kmeans colored circle */}
                  <img className={'block w-full h-full object-cover p-1 '}
                     src={`/images_testing/${encodeURIComponent(image.image_id)}`}
                     alt={image.image_id}   />

                  <span className="absolute top-2 right-2 h-4 w-4 rounded-full"
                        style={{ backgroundColor: colorHex }} />
               </button>
            );
         })}
      </div>
  </div>
  );
}
