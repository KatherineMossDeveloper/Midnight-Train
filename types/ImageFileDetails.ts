// src/types/ImageFileDetails.ts
// type for the images in the ImageGallery.
//
export type ImageFileDetails = {
  filename: string;   // stable key (shared selection key)
  kmeans_pca_cluster; // group number applied by kmeans, pca
  src: string;        // derived display URL (/images_testing/...)
  alt?: string;
};
