// /types/ImageDatabaseObject.ts
// object that mirrors the image objects in the Weaviate database.
//
export type ImageDatabaseObject = {
  id: string;             // Weaviate UUID
  image_id: string;       // the file name; e.g., CEX (1).png.
  class_label: string;    // the model's image classification; e.g., CEX or PG
  confidence: number;     // percent of the model's confidence in the classification.
  image_entropy: number;  // image entropy number.
  image_header: string;   // timestamp int the image file's header.
  kmeans_pca_x: number | null; //  PCA 2D x position in the K-means PCA graph
  kmeans_pca_y: number | null; //  PCA 2D y position in the K-means PCA graph
  kmeans_pca_cluster: number;  //  K-means group number.
};