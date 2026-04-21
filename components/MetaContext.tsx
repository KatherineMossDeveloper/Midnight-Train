// MetaContext.tsx
// provides meta data for the images from the database or JSON files.
//
// export function MetaProvider
// export function useMetaByFilename
//

"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";

// React context object that holds a filename and its metadata.
const MetaContext = createContext<Map<string, ImageDatabaseObject> | null>(null);

// ************************************************
export function MetaProvider({ metas, children,}: {
           metas: ImageDatabaseObject[]; children: React.ReactNode; }) {

  // Creates a lookup map for the data.
  // This is useMemo code, so it will not recreate the map on every render, just when
  // data changes.  In a 'subscriber' to this MetaContext provider, they will call
  // metaByFilename.get(selectedFilename) because this is a map.
  const metaByFilename = useMemo(() => {
    const map = new Map<string, ImageDatabaseObject>();
    for (const m of metas) map.set(m.image_id, m);
    return map;
  }, [metas]);

  return <MetaContext.Provider value={metaByFilename}>{children}</MetaContext.Provider>;
}

export function useMetaByFilename() {
  const ctx = useContext(MetaContext);  // effectively, ctx === metaByFilename
  if (!ctx) throw new Error("useMetaByFilename must be used within <MetaProvider>");
  return ctx;
}
