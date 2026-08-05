// lib/data/types.ts
// types used for fetching data
//
// export interface ImageObjectsResult     (crystalDataSource)
// export interface ImageDatabaseObject    (Page)
// export interface DbStatus               (WeaviateStatus)
//

export type DataSourceKind = "weaviate" | "json";

export type NeighborCenter = {
  id: string;
  image_id: string;
  kmeans_pca_cluster?: number;
};

export type NeighborRecord = {
  id: string;
  image_id: string;
  kmeans_pca_cluster?: number;
  distance?: number;
};

export interface ImageDatabaseObject {
  id: string;             // Weaviate UUID
  image_id: string;       // the file name; e.g., CEX (1).png.
  class_label: string;    // the model's image classification; e.g., CEX or PG
  confidence: number;     // percent of the model's confidence in the classification.
  image_entropy: number;  // image entropy number.
  image_header: string;   // timestamp int the image file's header.
  kmeans_pca_x: number | null; //  PCA 2D x position in the K-means PCA graph
  kmeans_pca_y: number | null; //  PCA 2D y position in the K-means PCA graph
  kmeans_pca_cluster: number;  //  K-means group number.
}

export interface DbStatus {
  ok: boolean;
  source: "weaviate" | "json";
  message: string;
  weaviateVersion?: string;
}

export interface ImageObjectsResult {
  items: ImageDatabaseObject[];
  dbStatus: DbStatus;
}

export type GetNeighborsResult = {
  center: NeighborCenter;
  neighbors: NeighborRecord[];
  source: string;
};