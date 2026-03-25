// WeaviateStatus.tsx
// This creates elements on the top of the screen:  the app
// version number, the database status and version number,
// the hyperlink tot the GitHub repo, then a horizontal line.text
//
// function StatusDot
// export default function WeaviateStatus
//
"use client";

import { useEffect, useState } from "react";

type DbStatus = {
  ok: boolean;
  weaviateVersion?: string;
};

// Local helper component
function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`
        inline-block
        w-2.5
        h-2.5
        rounded-full
        ${ok ? "bg-blue-300" : "bg-rose-500"}
      `}
      title={ok ? "Database connected" : "Database unavailable"}
    />
  );
}

export default function WeaviateStatus() {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

  useEffect(() => {
    fetch("/api/weaviate/status")
      .then(res => res.json())
      .then(setDbStatus)
      .catch(() => setDbStatus({ ok: false }));
  }, []);

 return (
<div className="text-base">
  <div className="flex flex-col pl-3 items-end ">

    {/* Row 0: application version */}
    <h2 className="text-lg text-slate-300 ">
      Ver. 1.0
    </h2>

    {/* Row 1: database status */}
    <div className="flex items-center gap-2">
      {dbStatus?.ok ? (
        <span className="text-lg text-slate-300">
          Weaviate database connected (ver. {dbStatus.weaviateVersion})
        </span>
      ) : (
        <span className="text-lg text-slate-300">
          Weaviate database not connected.
        </span>
      )}

      <StatusDot ok={dbStatus?.ok === true} />

    </div>

    {/* Row 2: text and hyperlink */}
    <h2 className="text-lg text-slate-300 pb-1">
      For more, visit { }
      <a href="https://github.com/KatherineMossDeveloper"
        className="text-lg text-blue-300 underline" >
        katherinemossdeveloper GitHub account
      </a>
    </h2>

    {/* Row 3: white horizontal line.    */}
    {/*           full width, draw line, soft white,     */}
    <div className="w-full border-t border-white/50 pb-3" />

  </div>
</div>
);
}
