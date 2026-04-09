// DataExplorerClient.tsx
// This component takes the data from page.tsx as a parameter and acts
// as the main driver for Midnight Train.
//
// function handleClearGraph
// function handleAddNeighbors(center, neighbors)
// export default function DataExplorerClient
//
// Notes on the currently selected image context provider.
// This component sets up the context provider for the currently selected image,
// the SelectionProvider.  A component listening for the selection will import
// the useSelection from the SelectionContext component.  A component that can
// also change the currently selected image will set up a click event that
// captures a new image selection and set up a useSelection that is tied to the
// click event.
//
// Notes on forwardRef components.
// Some of the components are forwardRef because the parent needs to call
// functions in them.  For example, if the user clicks a 'copy to clipboard'
// button for the Entropy graph, then the parent will need to call functions
// in the GraphScatterEntropy component to fulfill the request.
//

"use client";

// react
import { useEffect, useState, useRef } from "react";

// data
import type { NeighborCenter, NeighborRecord } from "@/lib/data/types";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import type { ImageFileDetails } from "@/types/ImageFileDetails";
import type { GraphNode, GraphLink } from "@/types/FDGtypes";
import type { ImageThumb } from "@/types/ImageThumb";
import { toThumb, toKmeansData, toEntropyData } from  "@/lib/dataMapper";

// copy to clipboard buttons
import type { GraphForceDirectedFunctions } from "@/components/GraphForceDirected";
import type { GraphScatterKmeansFunctions } from "@/components/GraphScatterKmeans";
import type { GraphScatterEntropyFunctions } from "@/components/GraphScatterEntropy";

// context providers
import { SelectionProvider } from "@/components/SelectionContext";
import LogPanel, { LogProvider } from "@/components/LogPanel";
import { MetaProvider } from "@/components/MetaContext";

// UI components.
import CamAccordion from "@/components/CamAccordion";
import GraphForceDirected from "@/components/GraphForceDirected";
import GraphHistogram from "@/components/GraphHistogram";
import GraphScatterEntropy, { EntropyPoint } from "@/components/GraphScatterEntropy";
import GraphScatterKmeans, { ScatterPoint } from "@/components/GraphScatterKmeans";
import ImageGallery from "@/components/ImageGallery";
import ImageSlider from "@/components/ImageSlider";
import WeaviateStatus from "@/components/WeaviateStatus";

// extras.
import { mergeGraphData } from "@/lib/graphUtilities";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { TOOLTIP_TEXT } from "@/lib/toolTipsText";


// ************************************************
export default function DataExplorerClient({ crystals, error }: {
     crystals: ImageDatabaseObject[];
     error: string | null; }) {

  // hooks at the top.
  const fdgRef = useRef<GraphForceDirectedFunctions | null>(null);
  const gskRef = useRef<GraphScatterKmeansFunctions | null>(null);
  const entRef = useRef<GraphScatterEntropyFunctions | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pixels, setPixels] = useState<number[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [graphNodes, setGraphNodes] = useState<Map<string, GraphNode>>(new Map());
  const [graphEdges, setGraphEdges] = useState<GraphLink[]>([]);

  // get various kinds of data.
  let imageFiles: ImageThumb[] = [];
  let kmeansData: ScatterPoint[] = [];
  let entropyData: EntropyPoint[] = [];
  const camImages = crystals.map(c => (c.image_id));
  if (!error) {
    imageFiles = crystals.map(toThumb);
    kmeansData = toKmeansData(crystals);
    entropyData = toEntropyData(crystals);
  }

  // clear the FDG when the 'clear FDG' button is pressed.
  function handleClearGraph() {
    setGraphNodes(new Map());
    setGraphEdges([]);
  }

  // add nodes and edges to the FDG by calling /lib/graphUtilities.mergeGraphData
  function handleAddNeighbors( center: NeighborCenter, neighbors: NeighborRecord[] ) {
    console.log("handleAddNeighbors center:", center);
    console.log("handleAddNeighbors neighbors:", neighbors);

    const { newNodes, newEdges } = mergeGraphData(
      graphNodes,
      graphEdges,
      center,
      neighbors
    );

    setGraphNodes(newNodes);
    setGraphEdges(newEdges);

    console.log("nodes after merge:", newNodes.size);
    console.log("edges after merge:", newEdges.length);
  }

  // State to track visibility of the log message component
  const toggleVisibility = () => {
     setIsVisible(prev => !prev);
  };

  return (
    <MetaProvider metas={crystals}>
      <LogProvider>
        <SelectionProvider>
          <main className="min-h-screen p-6 bg-slate-950 text-slate-100">
             <h1 className="mb-4 text-2xl pt-2 pl-3 font-semibold flex items-center gap-x-2 leading-relaxed">
               Midnight Train
                 <Tooltip content={TOOLTIP_TEXT.title}>
                    <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                 </Tooltip>
             </h1>
             <WeaviateStatus />

            {/* main div */}
            <div
               /* create grid; gap 16px between grid items; min. 1 col. displayed; med. scr. = 2 cols; xl scr. = 4 cols.; min. row height 220  */
               className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto" >

               {/* Image gallery of crystal images */}
               <section className="row-span-3 bg-slate-900/60 rounded-xl p-3">
                 <h2 className="mb-2 text-lg font-medium">Image Gallery (click an image)
                    <Tooltip content={TOOLTIP_TEXT.gallery}>
                       <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <ImageGallery images={imageFiles} onAddNeighbors={handleAddNeighbors} />
                 </h2>
               </section>

               {/* Force directed graph showing nearest neighbors for feature vectors from the db. */}
               <section className="row-span-1 col-span-2 bg-slate-900/60 rounded-xl p-4">
                 <h2 className="flex items-center gap-2 mb-2 text-lg font-medium">Force directed graph (drag points)
                    <Tooltip content={TOOLTIP_TEXT.force}>
                       <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>

                    <Button onClick={handleClearGraph} >Clear FDG</Button>
                    <Button onClick={() => fdgRef.current?.copySvg()}> Copy vector </Button>
                    <Button onClick={() => fdgRef.current?.copyPng()}> Copy bitmap </Button>
                    <Tooltip content={TOOLTIP_TEXT.buttons}>
                       <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>

                 </h2>
                 <GraphForceDirected nodes={Array.from(graphNodes.values())} links={graphEdges} ref={fdgRef} />
               </section>

               {/* Kmeans, PCA scatter plot: spans 2 columns on xl */}
               <section className="xl:row-span-1 bg-slate-900/60 rounded-xl p-4">
                 <h2 className="mb-2 text-lg font-medium">Kmeans/PCA scatter plot (click a point)
                    <Tooltip content={TOOLTIP_TEXT.kmeans}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <Button onClick={() => gskRef.current?.copySvg()}> Copy vector </Button>
                    <Button onClick={() => gskRef.current?.copyPng()}> Copy bitmap </Button>
                 </h2>

                 <GraphScatterKmeans data={kmeansData} width={300} height={300} ref={gskRef} />
               </section>

               {/* Entropy scatter plot: spans 2 columns on xl */}
               <section className="xl:row-span-1 bg-slate-900/60 rounded-xl p-4">
                 <h2 className="mb-2 text-lg font-medium">Entropy scatter plot (click a point)
                    <Tooltip content={TOOLTIP_TEXT.entropy}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <Button onClick={() => entRef.current?.copySvg()}> Copy vector </Button>
                    <Button onClick={() => entRef.current?.copyPng()}> Copy bitmap </Button>
                 </h2>
                 <GraphScatterEntropy data={entropyData} width={300} height={300}
                                      xTickEvery={1} ref={entRef} />
               </section>

               {/* CAM accordions */}
               <section className="row-span-1 bg-slate-900/60 text-white rounded-xl p-4">
                 <h2 className="mb-2 text-lg font-medium">CEX CAM accordion (click a image)
                    <Tooltip content={TOOLTIP_TEXT.accordionCEX}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <CamAccordion images={camImages} folder="CEX" title="slice position shown" />
                 </h2>

                 <h2 className="mb-2 text-lg font-medium">PG CAM accordion (click a image)
                    <Tooltip content={TOOLTIP_TEXT.accordionPG}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <CamAccordion images={camImages} folder="PG" title="slice position shown" />
                 </h2>
               </section>

               {/* Histogram and panel showing selected original image & its CAM */}
               <section className="row-span-1 bg-slate-900/60 text-white rounded-xl p-4">
                 <h2 className="mb-2 text-lg font-medium">Image histogram
                    <Tooltip content={TOOLTIP_TEXT.histogram}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                   <GraphHistogram width={520} height={260} />
                 </h2>

                 <h2 className="mb-2 text-lg font-medium">CAM & original image (drag the bar)
                    <Tooltip content={TOOLTIP_TEXT.slider}>
                        <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <ImageSlider />
                 </h2>

               </section>

               {/* Panel showing log messages:  1 row, 1 col */}
               <div  className={"bg-slate-900/60 rounded-xl p-4"} > {/* log message div */}
                 <Button onClick={toggleVisibility} variant="secondary" >
                   {isVisible ? "Hide logs" : "Show logs"}
                 </Button>

                 {isVisible && (
                   <>
                   <h2 className="flex items-center gap-2 mb-2 text-lg font-medium">Message log.
                      <Tooltip content={TOOLTIP_TEXT.log}>
                         <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                      </Tooltip>
                   </h2>
                   <LogPanel />
                   </>
                 )}
               </div>  {/* log message div */}
            </div>  {/* main div */}
          </main>
        </SelectionProvider>
      </LogProvider>
    </MetaProvider>
  );
}
