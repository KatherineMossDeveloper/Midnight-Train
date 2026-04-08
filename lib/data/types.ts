// types.ts
// types used for fetching data
//
// export interface ImageDatabaseObject    (Page)
// export interface DbStatus               (WeaviateStatus)
// export interface ImageObjectsResult     (crystalDataSource)
//

export type DataSourceKind = "weaviate" | "json";

export interface ImageDatabaseObject {
  id?: string;
  image_id: string;
  class_label?: string;
  confidence?: number;
  image_entropy?: number;
  kmeans_pca_x?: number;
  kmeans_pca_y?: number;
  kmeans_pca_cluster?: number;
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
