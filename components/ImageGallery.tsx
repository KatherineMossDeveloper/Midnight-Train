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

"use client";

import React, { useState, useEffect, useMemo } from "react";  
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import type { ImageThumb } from "@/types/ImageThumb";

import { getImageVectorNeighbors } from "@/lib/weaviate/weaviateQueries";

import { useSelection } from "@/components/SelectionContext";
import { useMetaByFilename } from "@/components/MetaContext";
import { useLog } from "@/components/LogPanel";  
import { image } from "d3";
import { CLUSTER_COLORS, CLUSTER_HEX } from "@/lib/graphUtilities";

type ImageGalleryProps = {
  images: ImageThumb[];
  onAddNeighbors: (center: any, neighbors: any[]) => void;
};

export default function ImageGallery({ images, onAddNeighbors }: ImageGalleryProps) {

  // listen for changes to the currently selected file name.
  const { selectedFilename, setSelectedFilename } = useSelection();

  // combine the MetaContext withe SelectionContext to get the meta data for the selected file name.
  const metaByFilename = useMetaByFilename();
  const selectedMeta = selectedFilename != null ? metaByFilename.get(selectedFilename) : null;

  // use the selected image file name to fetch the image from disk.
  const selectedImage = selectedFilename ? images.find(i => i.filename === selectedFilename) ?? null : null;

  const { log } = useLog();
  useEffect(() => {log(`[mount]  ImageGallery`);}, [log]);
  useEffect(() => {log(`[data]   Images count ${images.length}`); }, [images.length]);
  useEffect(() => {log(`[select] Gallery image ${selectedFilename}`); }, [selectedFilename]);

  useEffect(() => {
    if (!selectedFilename) return;

    async function fetchNeighbors() {
      try {
        const result = await getImageVectorNeighbors({
          imageId: selectedFilename,
          k: 5,
        });
        onAddNeighbors(result.center, result.neighbors);

      } catch (err) {
        console.error("Failed to fetch neighbors:", err);
      }
    }
    fetchNeighbors();
  }, [selectedFilename]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-2 shadow-sm">

      {selectedImage ? (
        <img
          src={selectedImage.src}
          className="w-40 h-40 object-contain rounded mb-4 bg-gray-300"
        />
      ) : (
        <div className="w-40 h-40 rounded mb-4 bg-gray-300 flex items-center justify-center text-slate-600">
          No selection
        </div>
      )}

      {/* details for currently selected image (passed from parent) */}
      {selectedImage != null && (
          <div className="mb-4 text-xs text-gray-800">
            <div className="ml-3">image: {selectedMeta.image_id}</div>
            <div className="ml-3">label: {selectedMeta.class_label}</div>
            <div className="ml-3">kmeans/pca group: {selectedMeta.kmeans_pca_cluster}</div>
            <div className="ml-3">confidence: {selectedMeta.confidence.toFixed(3)}</div>
            <div className="ml-3">entropy: {selectedMeta.image_entropy.toFixed(3)}</div>
            <div className="ml-3">timestamp: {selectedMeta.image_header}</div>
          </div>
      )}
      {/* image gallery; create a button with image on it, plus a kmeans colored badge */}
      <div className="grid grid-cols-3 gap-1">
         {images.map((c) => {
            const clusterIndex = Number(c.kmeans_pca_cluster);
            const borderClass =
                  CLUSTER_COLORS[clusterIndex] ?? "border-l-slate-400";
            const colorHex =
                  CLUSTER_HEX[clusterIndex] ?? "#94a3b8"; // slate fallback

            return (
               <button
                  key={c.filename}
                  onClick={() => setSelectedFilename(c.filename)}
                  className={` relative rounded-md overflow-hidden
                     border-l-0 ${borderClass} hover:ring-2 hover:ring-white/40  `}
                  >
                  <img
                     src={c.src}
                     className="block w-full h-full object-cover"
                  />

                 {/* cluster badge */}
                 <span
                    className=" absolute top-1 right-1
                                w-3.5 h-3.5 rounded-full
                                ring-2 ring-black/40 "
                    style={{ backgroundColor: colorHex }}
                 />
              </button>
            );
         })}
      </div>
    </div>
  );
}
