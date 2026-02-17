import { GridComponent } from "./GridComponent";

export default function Demo() {
  return (
    <div className="p-10 min-h-screen bg-zinc-50 dark:bg-[#09090b] transition-colors duration-500">
      
      {/* SECCIÓN 1: RAY-CAST SPOTLIGHT */}
      <div className="max-w-6xl mx-auto mb-20">
        <header className="mb-8">
          <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase italic">
            Visual Engine: <span className="text-blue-500">Ray-Cast Spotlight</span>
          </h2>
          <p className="text-zinc-500">Iluminación reactiva con detección de bordes y aura interna.</p>
        </header>

        <GridComponent columns={3} animation="Ray-Cast Spotlight" gap="gap-6">
          <div className="h-44 flex flex-col justify-end">
            <div className="text-xs font-mono text-blue-500 mb-2">01 // CORE</div>
            <h3 className="text-xl font-bold dark:text-white">Intelligent Grid</h3>
          </div>
          <div className="h-44 flex flex-col justify-end">
            <div className="text-xs font-mono text-blue-500 mb-2">02 // LIGHT</div>
            <h3 className="text-xl font-bold dark:text-white">Ray-Cast Tech</h3>
          </div>
          <div className="h-44 flex flex-col justify-end">
            <div className="text-xs font-mono text-blue-500 mb-2">03 // STYLE</div>
            <h3 className="text-xl font-bold dark:text-white">Premium UI</h3>
          </div>
        </GridComponent>
      </div>

      {/* SECCIÓN 2: HIGH-TILT 3D (ESTILO BENTO BOX) */}
      <div className="max-w-6xl mx-auto mb-20">
        <header className="mb-8">
          <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase italic">
            Visual Engine: <span className="text-purple-500">High-Tilt 3D</span>
          </h2>
          <p className="text-zinc-500">Profundidad agresiva de 35° con elevación de capas en el eje Z.</p>
        </header>

        <GridComponent columns={4} animation="High-Tilt 3D" gap="gap-4">
          {/* Card que ocupa 2 columnas */}
          <div className="col-span-2 h-64 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg p-2 flex flex-col justify-between">
            <span className="bg-white dark:bg-zinc-800 w-fit px-3 py-1 rounded-full text-xs font-bold dark:text-zinc-300">
              FEATURED
            </span>
            <div className="space-y-1">
              <h3 className="text-2xl font-black dark:text-white uppercase">Aggressive Tilt</h3>
              <p className="text-sm text-zinc-500">El contenido flota a 50px de la base.</p>
            </div>
          </div>

          {/* Card Vertical */}
          <div className="col-span-2 h-64 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl">
             <span className="text-zinc-400 font-mono tracking-widest uppercase text-xs">Interactive Zone</span>
          </div>

          {/* Mini Cards */}
          <div className="h-32 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold text-2xl">A</div>
          <div className="h-32 flex items-center justify-center bg-purple-600 rounded-lg text-white font-bold text-2xl">B</div>
          <div className="h-32 flex items-center justify-center bg-pink-600 rounded-lg text-white font-bold text-2xl">C</div>
          <div className="h-32 flex items-center justify-center bg-orange-600 rounded-lg text-white font-bold text-2xl">D</div>
        </GridComponent>
      </div>

      {/* SECCIÓN 3: MAGNETIC FORCE */}
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase italic">
            Magnetic <span className="text-emerald-500">Force</span>
          </h2>
        </header>

        <GridComponent columns={2} animation="Magnetic Force" gap="gap-10">
          <div className="h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center p-6 gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl">M</div>
            <div>
              <h4 className="font-bold dark:text-white">Atracción Física</h4>
              <p className="text-xs text-zinc-500">La tarjeta sigue el cursor.</p>
            </div>
          </div>
          <div className="h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center p-6 gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl">F</div>
            <div>
              <h4 className="font-bold dark:text-white">Suavidad Spring</h4>
              <p className="text-xs text-zinc-500">Físicas reales de Framer Motion.</p>
            </div>
          </div>
        </GridComponent>
      </div>

    </div>
  );
}