// page.tsx
// Fetch the image objects from the database and
// pass them to the DataExplorerClient.
//
// Flow for fetching data.
// page.tsx
//    crystalDataSource.getImageObjects
//       weaviateQueries.getImageObjectsFromWeaviate
//          api/weaviate/nearest/route.ts
//                - or -
//       jsonQueries.getImageObjectsFromJson
//          (gets data from disk directly)
//

import { getImageObjects } from "@/lib/data/crystalDataSource";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import DataExplorerClient from "@/components/DataExplorerClient";

// ************************************************
export default async function Page() {

  let image_objects: ImageDatabaseObject[] = [];
  let error: string | null = null;
  let dbStatus: string;

  try {
    const { items, dbStatus } = await getImageObjects(100);
    console.log("Inside page.tsx, data objects returned ", items.length, "objects ", dbStatus);
    image_objects = items as ImageDatabaseObject[];

  } catch (err: any) {
    error = err?.message ?? "Unknown error querying image database objects.";
  }

  return <DataExplorerClient crystals={image_objects} error={error}/>;
}
