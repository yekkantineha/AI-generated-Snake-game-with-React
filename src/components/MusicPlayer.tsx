/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from "lucide-react";
import { DUMMY_TRACKS } from "../constants";
import { motion } from "motion/react";

export const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  useEffect(() => {
     if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
     }
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-[400px] bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-3xl -z-10 group-hover:bg-fuchsia-500/20 transition-all duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10 group-hover:bg-cyan-500/20 transition-all duration-1000"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex items-center gap-5">
        {/* Album Art */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-600 p-[2px]"
          >
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-950 border-2 border-zinc-800 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-zinc-100 truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-sm text-zinc-500 font-mono flex items-center gap-2">
            <Music2 className="w-3 h-3 text-cyan-500" />
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-mono text-zinc-500">
            {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <Volume2 className="w-5 h-5 text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors" />

        <div className="flex items-center gap-6">
          <button onClick={skipBackward} className="text-zinc-400 hover:text-cyan-400 transition-colors transform active:scale-90">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950 hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button onClick={skipForward} className="text-zinc-400 hover:text-fuchsia-400 transition-colors transform active:scale-90">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Track List Hint */}
      <div className="mt-6 flex gap-1 justify-center">
        {DUMMY_TRACKS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-4 bg-cyan-500" : "w-1 bg-zinc-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
