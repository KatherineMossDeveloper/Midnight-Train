// SelectionContext.tsx
// provides components with the currently selected file name.
//
// type SelectionContextValue
// export function SelectionProvider({ children }...
// export function useSelection()
//
// A component listening for the selection will import the useSelection from
// this SelectionContext component.  A component that can also change the
// currently selected image will set up a click event that captures a new image
// selection and set up a useSelection that is tied to the click event.
// This is a shared “selection bus” that many components listen to
// because they adjust their UI elements based on the currently selected image.
// As an example of what happens when the selected image is refreshed...
// - the user clicks an image in the ImageGallery,
// - ImageGallery calls setSelectedFilename,
// - which updates state here in SelectionProvider.
// - React then re-renders all components that consume SelectionContext,
// - and each component listening updates its UI based for the new image.

"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

// a publicly scoped API for this context.  Components can change the selected
// file name by calling setSelectedFilename.
type SelectionContextValue = {
  selectedFilename: string | null;
  setSelectedFilename: (filename: string | null) => void;
};

// creating a communication channel.
const SelectionContext = createContext<SelectionContextValue | null>(null);

// The component that owns the state; the children parameter = the components that
// consume the shared value:  the currently selected image file name.
// ************************************************
export function SelectionProvider({ children }: { children: React.ReactNode }) {

  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);

  // only send out updates when the selection changes, avoiding re-rendering.
  const value = useMemo(
    () => ({ selectedFilename, setSelectedFilename }),
    [selectedFilename]
  );

  // wraps the components so they can 'hear' any new selections.
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

// the components 'hear' by putting this useContext in their code.
export function useSelection() {
  const ctx = useContext(SelectionContext);  // effectively, ctx === value
  if (!ctx) throw new Error("useSelection must be used within <SelectionProvider>");
  return ctx;
}
