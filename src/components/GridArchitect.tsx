import React, { useState, useRef, useMemo } from "react";
import { Toaster, toast } from "sonner";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import {
  Trash2,
  RefreshCcw,
  Copy,
  LayoutGrid,
  Code2,
  Maximize2,
  Zap,
  Download,
} from "lucide-react";

// --- Interfaces ---
interface Box {
  id: string;
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
  index: number;
  label?: string;
}

const DEFAULT_LABELS = [
  "Header / Nav",
  "Sidebar",
  "Main Content",
  "Stats A",
  "Stats B",
  "Footer",
];

// --- Sub-Componente: Preview Card (Ajustado para Dark Mode) ---
const PreviewCard = ({
  box,
  effect,
  height,
}: {
  box: Box;
  effect: string;
  height: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 22 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-25, 25]);
  const magX = useTransform(xSpring, [-0.5, 0.5], [-30, 30]);
  const magY = useTransform(ySpring, [-0.5, 0.5], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      600px circle at ${useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"])},
      rgba(59, 130, 246, 0.15),
      transparent 80%
    )
  `;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      style={{
        gridColumn: `span ${box.colSpan} / span ${box.colSpan}`,
        gridRow: `span ${box.rowSpan} / span ${box.rowSpan}`,
        gridColumnStart: box.colStart,
        gridRowStart: box.rowStart,
        minHeight: `${height}px`,
        rotateX: ["3d-tilt", "perspective"].includes(effect) ? rotateX : 0,
        rotateY: ["3d-tilt", "perspective"].includes(effect) ? rotateY : 0,
        x: effect === "magnetic" ? magX : 0,
        y: effect === "magnetic" ? magY : 0,
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
    >
      {effect === "spotlight" && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
          style={{ background: spotlightBg }}
        />
      )}

      <div
        className="relative z-10 h-full flex flex-col justify-between"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-black shadow-lg">
            {box.index}
          </div>
          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {box.label || "Component"}
          </p>
        </div>
        <p className="text-3xl font-mono font-bold text-black dark:text-white italic leading-none">
          {box.colSpan}{" "}
          <span className="text-zinc-300 dark:text-zinc-700">×</span>{" "}
          {box.rowSpan}
        </p>
      </div>
    </motion.div>
  );
};

export default function GridArchitect() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [effect, setEffect] = useState("3d-tilt");
  const [height, setHeight] = useState(250);
  const [mode, setMode] = useState<"react" | "html">("react");
  const [isDrawing, setIsDrawing] = useState(false);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [ghost, setGhost] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const COLS = 12;
  const ROWS = 8;

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(boxes, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "grid_layout.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("JSON exportado correctamente");
  };

  const checkOverlap = (
    cS: number,
    cSp: number,
    rS: number,
    rSp: number,
    excludeId?: string,
  ) => {
    return boxes.some((b) => {
      if (b.id === excludeId) return false;
      return !(
        cS + cSp <= b.colStart ||
        cS >= b.colStart + b.colSpan ||
        rS + rSp <= b.rowStart ||
        rS >= b.rowStart + b.rowSpan
      );
    });
  };

  const startDrawing = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || (e.target as HTMLElement).closest(".action-btn")) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (rect.width / COLS)) + 1;
    const row = Math.floor(y / (rect.height / ROWS)) + 1;
    if (checkOverlap(col, 1, row, 1)) return toast.error("Espacio ocupado");
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    if (isDrawing) {
      setGhost({
        x: Math.min(x, startPos.x),
        y: Math.min(y, startPos.y),
        w: Math.abs(x - startPos.x),
        h: Math.abs(y - startPos.y),
      });
    }

    if (resizingId) {
      const box = boxes.find((b) => b.id === resizingId);
      if (!box) return;
      const colW = rect.width / COLS;
      const rowH = rect.height / ROWS;
      const newSpanC = Math.max(
        1,
        Math.round((x - (box.colStart - 1) * colW) / colW),
      );
      const newSpanR = Math.max(
        1,
        Math.round((y - (box.rowStart - 1) * rowH) / rowH),
      );
      if (
        !checkOverlap(
          box.colStart,
          newSpanC,
          box.rowStart,
          newSpanR,
          resizingId,
        )
      ) {
        setBoxes((prev) =>
          prev.map((b) =>
            b.id === resizingId
              ? { ...b, colSpan: newSpanC, rowSpan: newSpanR }
              : b,
          ),
        );
      }
    }
  };

  const stopAction = () => {
    if (isDrawing && ghost) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const colW = rect.width / COLS,
        rowH = rect.height / ROWS;
      const colS = Math.floor(ghost.x / colW) + 1,
        rowS = Math.floor(ghost.y / rowH) + 1;
      const colSpan = Math.max(1, Math.round(ghost.w / colW)),
        rowSpan = Math.max(1, Math.round(ghost.h / rowH));
      if (!checkOverlap(colS, colSpan, rowS, rowSpan)) {
        setBoxes([
          ...boxes,
          {
            id: crypto.randomUUID(),
            colStart: colS,
            colSpan,
            rowStart: rowS,
            rowSpan,
            index: boxes.length + 1,
            label:
              DEFAULT_LABELS[boxes.length] || `Element ${boxes.length + 1}`,
          },
        ]);
      }
    }
    setIsDrawing(false);
    setGhost(null);
    setResizingId(null);
  };

  const generatedCode = useMemo(() => {
    const isMotion = mode === "react";
    const boxesCode = boxes
      .map((b) =>
        isMotion
          ? `    <motion.div className="md:col-start-${b.colStart} md:col-span-${b.colSpan} md:row-start-${b.rowStart} md:row-span-${b.rowSpan} border-2 border-black rounded-[2.5rem] p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all" whileHover={{ scale: 1.01 }}><h3 className="font-black uppercase italic">${b.label}</h3></motion.div>`
          : `  <div style="grid-column: ${b.colStart} / span ${b.colSpan}; grid-row: ${b.rowStart} / span ${b.rowSpan};" class="border-2 border-black rounded-[2.5rem] p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">${b.label}</div>`,
      )
      .join("\n");
    return isMotion
      ? `import { motion } from "framer-motion";\n\nexport const BentoGrid = () => (\n  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">\n${boxesCode}\n  </div>\n);`
      : `<div class="grid grid-cols-1 md:grid-cols-12 gap-6">\n${boxesCode}\n</div>`;
  }, [boxes, mode]);

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-black dark:text-white p-6 md:p-20 space-y-16 selection:bg-blue-600 selection:text-white transition-colors duration-500">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--tw-bg-opacity)",
            color: "currentColor",
            border: "2px solid currentColor",
            borderRadius: "1rem",
            fontWeight: "900",
          },
        }}
      />

      {/* HEADER */}
      <header className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center border-b-2 border-zinc-100 dark:border-zinc-900 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
            <Zap size={14} fill="currentColor" /> Grid System Architect
          </div>
          <h1 className="text-6xl  font-black tracking-tighter uppercase italic leading-none">
            Canvas<span className="text-zinc-200 dark:text-zinc-800 ">.</span>
            Grid
          </h1>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <button
            onClick={() => setBoxes([])}
            className="px-6 py-3 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 font-bold uppercase text-[10px] tracking-widest hover:border-red-500 transition-all flex items-center gap-2"
          >
            <RefreshCcw size={14} /> Clear
          </button>
          <button
            onClick={exportJSON}
            className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-[10px] tracking-widest hover:opacity-80 transition-all shadow-xl flex items-center gap-2"
          >
            <Download size={14} /> Export JSON
          </button>
        </div>
      </header>

      {/* CANVAS */}
      <section className="max-w-[1400px] mx-auto">
        <div
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={onMouseMove}
          onMouseUp={stopAction}
          onMouseLeave={stopAction}
          className="relative w-full h-[600px] bg-white dark:bg-zinc-950 rounded-[4rem] border-2 border-zinc-300 dark:border-zinc-800 shadow-2xl overflow-hidden cursor-crosshair transition-colors"
        >
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-20 dark:opacity-10">
            {[...Array(96)].map((_, i) => (
              <div
                key={i}
                className="border-[0.5px] border-zinc-300 dark:border-zinc-700 border-dashed"
              />
            ))}
          </div>
          {boxes.map((box) => (
            <div
              key={box.id}
              className="absolute p-3 group/box"
              style={{
                left: `${(box.colStart - 1) * (100 / COLS)}%`,
                top: `${(box.rowStart - 1) * (100 / ROWS)}%`,
                width: `${box.colSpan * (100 / COLS)}%`,
                height: `${box.rowSpan * (100 / ROWS)}%`,
                zIndex: resizingId === box.id ? 50 : 10,
              }}
            >
              <div className="w-full h-full bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-zinc-700 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[10px] flex items-center justify-center font-black italic">
                      {box.index}
                    </span>
                    <span className="text-[10px] font-black uppercase text-zinc-400">
                      {box.label}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setBoxes(boxes.filter((b) => b.id !== box.id))
                    }
                    className="action-btn text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <span className="text-4xl font-black italic leading-none">
                  {box.colSpan}×{box.rowSpan}
                </span>
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setResizingId(box.id);
                  }}
                  className="action-btn absolute bottom-4 right-4 w-8 h-8 bg-zinc-50 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-xl cursor-nwse-resize flex items-center justify-center opacity-0 group-hover/box:opacity-100 transition-all"
                >
                  <Maximize2 size={12} />
                </div>
              </div>
            </div>
          ))}
          {ghost && (
            <div
              className="absolute border-[3px] border-blue-600 bg-blue-600/5 rounded-[2.5rem] border-dashed animate-pulse pointer-events-none"
              style={{
                left: ghost.x,
                top: ghost.y,
                width: ghost.w,
                height: ghost.h,
                zIndex: 100,
              }}
            />
          )}
        </div>
      </section>

      {/* RENDER PREVIEW */}
      <section className="max-w-[1400px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-zinc-300 dark:border-zinc-800 pb-10">
          <h2 className="text-6xl font-black italic uppercase tracking-tighter">
            Live Render
          </h2>
          <div className="flex gap-8 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-300 dark:border-zinc-800 transition-colors">
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-zinc-400 block">
                Visual Engine
              </span>
              <select
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl font-black text-xs text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700 outline-none transition-colors"
              >
                <option value="3d-tilt">High-Tilt 3D</option>
                <option value="perspective">Perspective Soft</option>
                <option value="magnetic">Magnetic Force</option>
                <option value="spotlight">Ray-Cast Spotlight</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-zinc-400 block">
                Unit Height: {height}px
              </span>
              <input
                type="range"
                min="150"
                max="500"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="accent-blue-600 w-32"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <AnimatePresence mode="popLayout">
            {boxes.length === 0 ? (
              <div className="col-span-12 py-40 flex flex-col items-center opacity-30 dark:opacity-10">
                <LayoutGrid size={100} strokeWidth={1} />
                <p className="text-3xl font-black uppercase mt-6">
                  Empty Canvas
                </p>
              </div>
            ) : (
              boxes.map((box) => (
                <PreviewCard
                  key={box.id}
                  box={box}
                  effect={effect}
                  height={height}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CODE GENERATOR */}
      <section className="max-w-[1400px] mx-auto pt-10">
        <div className="bg-[#0A0A0B] dark:bg-black rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-10 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Code2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-black uppercase italic text-xl">
                  Code Generator
                </h3>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  Real-time compilation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-1.5 rounded-2xl flex border border-white/10">
                {["html", "react"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m as any)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${mode === m ? "bg-white text-black" : "text-white/40"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  toast.success("Copiado al portapapeles");
                }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase hover:bg-zinc-200 transition-all"
              >
                <Copy size={14} /> Copy Code
              </button>
            </div>
          </div>
          <div className="p-12 overflow-auto max-h-[500px]">
            <pre className="text-blue-400/80 font-mono text-sm leading-relaxed">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-[1400px] mx-auto py-20 flex flex-col items-center gap-6 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <span className="text-zinc-300 dark:text-zinc-700 font-black uppercase text-[10px] tracking-[0.5em]">
            Precision Layout Engine v2.0
          </span>
          <div className="hidden md:block h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-6">
            <span className="text-blue-600 dark:text-blue-400 font-black uppercase text-[10px] tracking-widest italic border-b-2 border-blue-600">
              Open Source Project
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 transition-transform group-hover:rotate-12"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-tighter">
                View on GitHub
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
