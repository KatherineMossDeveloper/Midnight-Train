// /lib/dataMapper.ts
// utility functions for mapping subsections of the data from the db.
//
// export function toGalleryData
// export function toKmeansData
// export function toEntropyData
// export function toParallelCoordinatesData
//

import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";

import type { ImageGalleryPoint } from "@/components/ImageGallery";
import type { PCAKmeansPoint } from "@/components/GraphScatterPCAKmeans";
import type { EntropyPoint } from "@/components/GraphScatterEntropy";
import type { ParallelCoordinatesPoint } from "@/components/GraphParallelCoordinates";

// ************************************************
export function toGalleryData( crystals: ImageDatabaseObject[]): ImageGalleryPoint[] {
  return crystals.map((c) => ({
    id: c.id,
    image_id: c.image_id,
    class_label: c.class_label,
    confidence: c.confidence,
    image_entropy: c.image_entropy,
    image_header: c.image_header,
    kmeans_pca_cluster: c.kmeans_pca_cluster,
  }));
}

// ************************************************
export function toKmeansData(crystals: ImageDatabaseObject[]): PCAKmeansPoint[] {
  return crystals.map((c) => ({
      x: c.kmeans_pca_x as number,
      y: c.kmeans_pca_y as number,
      cluster: c.kmeans_pca_cluster as number,
      image_id: c.image_id,
    }));
}

// ************************************************
export function toEntropyData(crystals: ImageDatabaseObject[]): EntropyPoint[] {
  return crystals.map((c) => ({
      entropy: c.image_entropy as number,
      cluster: c.kmeans_pca_cluster as number,
      image_id: c.image_id as string
    }));
}

// ************************************************
export function toParallelCoordinatesData(crystals: ImageDatabaseObject[]): ParallelCoordinatesPoint[] {
  return crystals.map((c) => ({
      cluster: c.kmeans_pca_cluster as number,
      pca_y: c.kmeans_pca_y as number,
      pca_x: c.kmeans_pca_x as number,
      entropy: c.image_entropy as number,
      confidence: c.confidence as number,
      image_id: c.image_id as string
    }));
}