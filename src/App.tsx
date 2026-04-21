import React from "react";
import { SnakeGame } from "./components/SnakeGame";
import { MusicPlayer } from "./components/MusicPlayer";
import { Zap, Terminal, Cpu } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-900/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Zap className="w-5 h-5 text-zinc-950 fill-current" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Neon Grid</span>
        </div>
        <div className="hidden md:flex gap-8">
            <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors text-xs font-mono uppercase tracking-widest">
                <Terminal className="w-4 h-4" />
                <span>Console</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors text-xs font-mono uppercase tracking-widest">
                <Cpu className="w-4 h-4" />
                <span>Engine</span>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
            {/* Game Section */}
            <div className="flex-shrink-0">
                <SnakeGame />
            </div>

            {/* Sidebar / Info Section */}
            <div className="flex flex-col gap-8 w-full max-w-[400px]">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                        Synth<br/>Surge
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px]">
                        The grid pulses with synthetic energy. Navigate the data stream while the pulse drives your movement.
                    </p>
                </div>

                <MusicPlayer />

                {/* Micro Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                        <span className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-1 font-mono">System Load</span>
                        <div className="flex items-end gap-2">
                            <span className="text-xl font-bold font-mono text-cyan-400">0.04ms</span>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                        <span className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-1 font-mono">Grid Status</span>
                        <div className="flex items-end gap-2">
                            <span className="text-xl font-bold font-mono text-emerald-400">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-zinc-800/50 text-center">
        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-mono">
            Experimental Grid System v0.4.2 // Built for AI Studio
        </span>
      </footer>
    </div>
  );
}
