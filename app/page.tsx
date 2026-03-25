// page.tsx
// the server component.
//
// Fetch the image objects from the database
// and pass them to the DataExplorerClient.

import { getImageObjects } from "@/lib/weaviate/weaviateQueries";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import DataExplorerClient from "@/components/DataExplorerClient";

export default async function Page() {

  let image_objects: ImageDatabaseObject[] = [];
  let error: string | null = null;

  try {
    const { items } = await getImageObjects(100);
    console.log("Inside page.tsx, data objects returned ", items.length, "objects");
    image_objects = items as ImageDatabaseObject[];

  } catch (err: any) {
    error = err?.message ?? "Unknown error querying image database objects.";
  }

  return <DataExplorerClient crystals={image_objects} error={error}/>;

}
