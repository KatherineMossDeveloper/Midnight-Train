// /lib/dataMapper.ts
// utility functions for mapping subsections of the data from the db.
//
// export function toThumb
// export function toKmeansData
// export function toEntropyData
//

import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import type { ImageThumb } from "@/types/ImageThumb";
import type { PCAKmeansPoint } from "@/components/GraphScatterPCAKmeans";
import type { EntropyPoint } from "@/components/GraphScatterEntropy";

// ************************************************
export function toThumb(c: ImageDatabaseObject): ImageThumb {

  const db_id = c.id;
  const filename = c.image_id;

  return {
    id: db_id,
    filename,
    kmeans_pca_cluster: c.kmeans_pca_cluster,
    src: `/images_testing/${encodeURIComponent(filename)}`,
    alt: filename
  };
}

// ************************************************
export function toKmeansData(crystals: ImageDatabaseObject[]): PCAKmeansPoint[] {
  return crystals
    .filter(
      (c) =>
        c.kmeans_pca_x !== null &&
        c.kmeans_pca_y !== null &&
        c.kmeans_pca_cluster !== null
    )
    .map((c) => ({
      x: c.kmeans_pca_x as number,
      y: c.kmeans_pca_y as number,
      cluster: c.kmeans_pca_cluster as number,
      filename: c.image_id,
    }));
}

// ************************************************
export function toEntropyData(crystals: ImageDatabaseObject[]): EntropyPoint[] {
  return crystals
    .filter(
      (c) =>
        c.image_id !== null &&
        c.image_entropy !== null &&
        c.kmeans_pca_cluster !== null
    )
    .map((c) => ({
      entropy: c.image_entropy as number,
      cluster: c.kmeans_pca_cluster as number,
      filename: c.image_id as string
    }));
}

// ************************************************
export function toParallelCoordinatesData(crystals: ImageDatabaseObject[]): ParallelCoordinatesPoints[] {
  return crystals
    .filter(
      (c) =>
        c.kmeans_pca_cluster !== null &&
        c.kmeans_pca_y !== null &&
        c.kmeans_pca_x !== null &&
        c.image_entropy !== null &&
        c.confidence !== null &&
        c.image_id !== null
    )

    .map((c) => ({
      cluster: c.kmeans_pca_cluster as number,
      pca_y: c.kmeans_pca_y as number,
      pca_x: c.kmeans_pca_x as number,
      entropy: c.image_entropy as number,
      confidence: c.confidence as number,
      filename: c.image_id as string
    }));
}