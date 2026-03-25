// Tooltip.tsx
// all the styling and behavior for the tooltips.  TypeScript file with JSX support
//
// notes.
// &_p refers to paragraphs
// &_a refers to hyperlinks
// z-50 is tailwind meaning to put the tooltips over everything else on 'z' axis.
// [&_p]:mb-3  Every <p> inside this tooltip gets a bottom margin.
// [&_p:last-child]:mb-0 The last paragraph should not have extra space below it.
// [&_a]:text-sky-600    All links inside the tooltip should be blue.
// [&_a]:underline       All links should be underlined.
// [&_a:hover]:text-sky-700  When a link inside the tooltip is hovered, darken the color.
/////////////////////////////////////////////////////////////////

"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

type TooltipProps = {
  content: string;            // the string displayed inside the tooltip.
  children: React.ReactNode;  // the blue information icon "i"; a.k.a., the hover trigger.
};

export default function Tooltip({ content, children }: TooltipProps) {

  const [open, setOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement: "top", open, onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 }), ],
    whileElementsMounted: autoUpdate,
  });

  const openTooltip = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const closeTooltip = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 120); // wait 120 milliseconds
  };

  return (
    <>
      <span ref={refs.setReference}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      >
        {children}
      </span>

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
          className="z-50 rounded-md bg-slate-100 text-slate-900
                     px-4 py-3 shadow-lg text-sm max-w-xs
                    [&_p]:mb-3
                    [&_p:last-child]:mb-0
                    [&_a]:text-sky-600
                    [&_a]:underline
                    [&_a:hover]:text-sky-700 "
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}
