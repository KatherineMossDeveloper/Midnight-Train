// DataExplorerClient.tsx
// This component takes the data from page.tsx as a parameter and acts
// as the main driver for Midnight Train.
//
// function handleClearGraph
// function handleAddNeighbors(center, neighbors)
// export default function DataExplorerClient
//
// Notes on context providers.
// This component sets up context providers.
// The SelectionContext.SelectionProvider provides the name of the
// currently selected image.  The MetaContext.MetaProvider gives
// details about the images.  The LogPanel.LogProvider allows
// components to log messages for display on the screen.
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

// context providers
import { MetaProvider } from "@/components/MetaContext";
import LogPanel, { LogProvider } from "@/components/LogPanel";
import { SelectionProvider } from "@/components/SelectionContext";

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

// UI components.
import CamAccordion from "@/components/CamAccordion";
import GraphForceDirected from "@/components/GraphForceDirected";
import GraphHistogram from "@/components/GraphHistogram";
import GraphScatterEntropy, { EntropyPoint } from "@/components/GraphScatterEntropy";
import GraphScatterKmeans, { KmeansPoint } from "@/components/GraphScatterKmeans";
import ImageGallery from "@/components/ImageGallery";
import ImageSlider from "@/components/ImageSlider";
import WeaviateStatus from "@/components/WeaviateStatus";

// extras.
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import { TOOLTIP_TEXT } from "@/lib/toolTipsText";
import { mergeGraphData } from "@/lib/graphUtilities";


// ************************************************
export default function DataExplorerClient({ crystals, error }: {
     crystals: ImageDatabaseObject[];
     error: string | null; }) {

  // hooks for copy-to-clipboard buttons.
  const fdgRef = useRef<GraphForceDirectedFunctions | null>(null);
  const gskRef = useRef<GraphScatterKmeansFunctions | null>(null);
  const entRef = useRef<GraphScatterEntropyFunctions | null>(null);

  // hooks for hiding the log panel and maintaining FDG data.
  const [isVisible, setIsVisible] = useState(false);
  const [graphNodes, setGraphNodes] = useState<Map<string, GraphNode>>(new Map());
  const [graphEdges, setGraphEdges] = useState<GraphLink[]>([]);

  const hasData = !error;
  const imageFiles: ImageThumb[] = hasData ? crystals.map(toThumb) : [];
  const kmeansData: KmeansPoint[] = hasData ? toKmeansData(crystals) : [];
  const entropyData: EntropyPoint[] = hasData ? toEntropyData(crystals) : [];
  const camImages: string[] = hasData ? crystals.map(c => c.image_id) : [];

  // clear the FDG when the 'clear FDG' button is pressed.
  function handleClearGraph() {
    setGraphNodes(new Map());
    setGraphEdges([]);
  }

  // add nodes and edges to the FDG by calling /lib/graphUtilities.mergeGraphData
  function handleAddNeighbors( center: NeighborCenter, neighbors: NeighborRecord[] ) {

    const { newNodes, newEdges } = mergeGraphData(
      graphNodes,
      graphEdges,
      center,
      neighbors
    );

    setGraphNodes(newNodes);
    setGraphEdges(newEdges);
  }

  // State to track visibility of the log message component
  const toggleVisibility = () => {
     setIsVisible(prev => !prev);
  };

  return (
    <MetaProvider metas={crystals}>
      <LogProvider>
        <SelectionProvider>

          {/* header section with title and database status. */}
          <main className="min-h-screen p-6 bg-slate-950 text-slate-100">
             <h1 className="mb-4 text-2xl pt-2 pl-3 font-semibold flex items-center gap-x-2 leading-relaxed">
               Midnight Train
                 <Tooltip content={TOOLTIP_TEXT.title}>
                    <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                 </Tooltip>
             </h1>
             <WeaviateStatus />

            {/* outermost div */}
            <div
               /* create grid; gap 16px between grid items; min. 1 col. displayed; med. scr. = 2 cols; xl scr. = 4 cols.; min. row height 220  */
               className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto" >

               {/* Image gallery of crystal images */}
               <section className="row-span-3 bg-white rounded-xl p-3">
                 <h2 className="text-lg text-black ">Image Gallery (click an image)
                    <Tooltip content={TOOLTIP_TEXT.gallery}>
                       <span className="text-slate-400 cursor-help select-none"> ℹ️ </span>
                    </Tooltip>
                    <ImageGallery images={imageFiles} onAddNeighbors={handleAddNeighbors} />
                 </h2>
               </section>

               {/* Force directed graph showing nearest neighbors for feature vectors from the db. */}
               <section className="row-span-1 col-span-2 bg-slate-900/60 rounded-xl p-4">
                 <h2 className="flex items-center gap-2 mb-2 text-lg font-medium">Force directed graph (drag points; roll mouse wheel)
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
            </div>  {/* outermost div */}
          </main>
        </SelectionProvider>
      </LogProvider>
    </MetaProvider>
  );
}
