// LogPanel.tsx
// Context to post log messages for debugging and a panel to show them
//
// type LogEntry
// type LogContextValue
// const LogContext = createContext<LogContextValue...
// export function LogProvider({ children }: { children: ReactNode })
// export function useLog()
// export default function LogPanel()  // for displaying the message.
//
"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useRef, type ReactNode, } from "react";

type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
};

type LogContextValue = {
  logs: LogEntry[];
  log: (message: string) => void;
};

const LogContext = createContext<LogContextValue | null>(null);

export function LogProvider({ children }: { children: ReactNode }) {

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const nextIdRef = useRef(1);  // simple counter

  //
  const log = useCallback((message: string) => {
    const id = nextIdRef.current++;
    const entry: LogEntry = {
      id,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLogs((prevLogs) => [...prevLogs, entry].slice(-30));
  }, []);
  const value = useMemo(() => ({ log }), [log]);

  return (
    <LogContext.Provider value={{ logs, log }}>
      {children}
    </LogContext.Provider>
  );
}


// --- Hook for other components to send messages ---
export function useLog() {
  const ctx = useContext(LogContext);
  if (!ctx) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return ctx;
}

// --- The panel on the UI that shows the messages. ---
export default function LogPanel() {
  const { logs } = useLog();

  return (
    <div className="w-full max-w-md border border-slate-700 rounded-md bg-slate-950 text-slate-100 flex flex-col">
      <div className="px-2 py-1 border-b border-slate-700 text-xs font-semibold text-slate-300">
        Log (last 30 entries)
      </div>

      {/* logs.map will create a row for every message in the array. */}
      {/*             fill   scroll OK    pad x pad y                */}
      <div className="flex-1 overflow-auto px-2 py-1 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="text-slate-500">No messages yet…</div>
        ) : (

          logs.map((entry) => (
            <div key={entry.id} className="whitespace-pre-wrap">
              {entry.id}. [{entry.timestamp}] {entry.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
