// TooltipFDG.tsx
// a tooltip for FDG.  TypeScript file with JSX support
//

"use client";

type FDGTooltipProps = {
  visible: boolean;
  x: number;
  y: number;
  imageSrc?: string;
  label?: string;
};

export default function TooltipFDG({
  visible,
  x,
  y,
  imageSrc,
  label,
}: FDGTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 14, top: y + 14 }}
    >
      <div className="
        bg-white
        rounded-sm
        shadow-xl
        p-2
        pb-4
        w-44
      ">
        <img
          src={imageSrc}
          alt={label}
          className="
            w-full
            aspect-square
            object-cover
            bg-gray-200
            border border-gray-200
          "
        />
        <div className="
          mt-2
          text-xs
          text-gray-700
          text-center
          font-medium
        ">
          {label}
        </div>
      </div>
    </div>
  );
}
