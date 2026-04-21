/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Point, Direction, GameStatus } from "../types";
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from "../constants";
import { Trophy, RefreshCw, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus("PLAYING");
  };

  const togglePause = () => {
    if (status === "PLAYING") setStatus("PAUSED");
    else if (status === "PAUSED") setStatus("PLAYING");
    else if (status === "GAME_OVER" || status === "IDLE") resetGame();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setDirection((prev) => (prev !== "DOWN" ? "UP" : prev));
        break;
      case "ArrowDown":
        setDirection((prev) => (prev !== "UP" ? "DOWN" : prev));
        break;
      case "ArrowLeft":
        setDirection((prev) => (prev !== "RIGHT" ? "LEFT" : prev));
        break;
      case "ArrowRight":
        setDirection((prev) => (prev !== "LEFT" ? "RIGHT" : prev));
        break;
      case " ":
        togglePause();
        break;
    }
  }, [status]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (status !== "PLAYING") return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case "UP": newHead.y -= 1; break;
          case "DOWN": newHead.y += 1; break;
          case "LEFT": newHead.x -= 1; break;
          case "RIGHT": newHead.x += 1; break;
        }

        // Check walls
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setStatus("GAME_OVER");
          return prevSnake;
        }

        // Check self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus("GAME_OVER");
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, status, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Draw Game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = "#09090b"; // zinc-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = "#18181b"; // zinc-900
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f43f5e"; // rose-500
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.roundRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4, 4);
    ctx.fill();

    // Draw Snake
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#22d3ee"; // cyan-400
    ctx.fillStyle = "#22d3ee";
    snake.forEach((segment, i) => {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2, 4);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Header Info */}
      <div className="flex w-full max-w-[400px] justify-between items-end mb-2">
        <div className="flex flex-col">
           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Current Score</span>
           <span className="text-3xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
             {score.toString().padStart(4, '0')}
           </span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">High Score</span>
           <div className="flex items-center gap-2">
             <Trophy className="w-4 h-4 text-emerald-400" />
             <span className="text-xl font-mono font-bold text-zinc-300">
               {highScore.toString().padStart(4, '0')}
             </span>
           </div>
        </div>
      </div>

      {/* Canvas Wrap */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded bg-zinc-950 cursor-none"
          />
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {status !== "PLAYING" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-lg"
            >
              {status === "GAME_OVER" && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-5xl font-black text-rose-500 mb-2 tracking-tighter uppercase italic">Game Over</h2>
                  <p className="text-zinc-400 font-mono uppercase tracking-[0.2em] text-sm">Systems Failure / Grid Collapse</p>
                </motion.div>
              )}

              {status === "IDLE" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold text-cyan-400 mb-2 uppercase tracking-tight">Neon Snake</h2>
                  <p className="text-zinc-500 text-sm italic font-serif">Navigate the grid. Absorb fragments.</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center gap-3 bg-cyan-500 text-zinc-950 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                {status === "IDLE" ? <Play className="w-5 h-5 fill-current" /> : <RefreshCw className="w-5 h-5" />}
                {status === "IDLE" ? "Initialize" : "Reboot Mission"}
              </motion.button>

              <div className="mt-8 text-zinc-600 text-[10px] uppercase tracking-[0.3em] flex gap-4">
                <span>Arrows to move</span>
                <span>•</span>
                <span>Space to pause</span>
              </div>
            </motion.div>
          )}

          {status === "PAUSED" && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 bg-zinc-900/80 p-2 rounded-full border border-zinc-700 backdrop-blur"
             >
                <Pause className="w-4 h-4 text-cyan-400" />
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
