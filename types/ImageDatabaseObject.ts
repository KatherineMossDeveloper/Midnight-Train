// ImageDatabaseObject.ts
// object that mirrors the image objects in the Weaviate database.
//
export type ImageDatabaseObject = {
  image_id: string;
  class_label: string;
  confidence: number;
  image_entropy: number;
  image_header: string;
  id: string;  // Weaviate UUID
  kmeans_pca_x: number | null;
  kmeans_pca_y: number | null;
  kmeans_pca_cluster: number | null;
};