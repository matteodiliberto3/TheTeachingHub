"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import rough from "roughjs";
import { cn } from "@/lib/cn";

type Props = {
  /** 0 = placeholder, 1 = A + broker + publish, 2 = + B,C + subscribe, 3 = animazione */
  step: number;
  className?: string;
};

const BG = "#0a0a0a";
const ORANGE = "#e69138";
const GREEN = "#4ade80";
const BLUE = "#60a5fa";

const W = 520;
const H = 300;

/**
 * Diagramma pub/sub stile lavagna (Rough.js).
 */
export function SketchyPubSubCanvas({ step, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg, { options: { roughness: 1.35, bowing: 0.12 } });
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const bg = rc.rectangle(0, 0, W, H, {
      fill: BG,
      fillStyle: "solid",
      stroke: "none",
    });
    svg.appendChild(bg);

    if (step < 1) {
      svg.appendChild(
        rc.rectangle(80, 118, 360, 64, {
          stroke: "#3f3f46",
          strokeWidth: 1.5,
          roughness: 0.8,
        }),
      );
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", "120");
      t.setAttribute("y", "156");
      t.setAttribute("fill", "#71717a");
      t.setAttribute("font-size", "12");
      t.setAttribute("font-family", "system-ui, sans-serif");
      t.textContent = "Implementa il bus nel editor →";
      svg.appendChild(t);
      return;
    }

    const brokerX = 340;
    const brokerY = 70;
    const brokerW = 88;
    const brokerH = 170;

    const ax = 48;
    const ay = 62;
    const aw = 112;
    const ah = 46;

    const bx = 48;
    const by = 132;
    const cx = 48;
    const cy = 202;

    svg.appendChild(
      rc.rectangle(brokerX, brokerY, brokerW, brokerH, {
        fill: ORANGE,
        fillStyle: "solid",
        stroke: ORANGE,
        strokeWidth: 2,
      }),
    );

    const slot = (y: number) =>
      rc.rectangle(brokerX + 18, y, brokerW - 36, 10, {
        fill: "#3d2a12",
        stroke: "#5c3d1a",
        strokeWidth: 1,
        roughness: 0.6,
      });
    svg.appendChild(slot(brokerY + 28));
    svg.appendChild(slot(brokerY + 52));
    svg.appendChild(slot(brokerY + 76));

    const svc = (x: number, y: number, label: string) => {
      svg.appendChild(
        rc.rectangle(x, y, aw, ah, {
          stroke: "#fafafa",
          strokeWidth: 2,
          roughness: 1.2,
        }),
      );
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", String(x + 12));
      t.setAttribute("y", String(y + ah / 2 + 5));
      t.setAttribute("fill", "#fafafa");
      t.setAttribute("font-size", "13");
      t.setAttribute("font-family", "system-ui, sans-serif");
      t.textContent = label;
      svg.appendChild(t);
    };

    svc(ax, ay, "Service A");
    const midA = { x: ax + aw, y: ay + ah / 2 };
    const brokerIn = { x: brokerX, y: brokerY + 36 };

    svg.appendChild(
      rc.line(midA.x, midA.y, brokerIn.x, brokerIn.y, {
        stroke: GREEN,
        strokeWidth: 2.2,
        strokeLineDash: [7, 6],
      }),
    );
    const pubT = document.createElementNS("http://www.w3.org/2000/svg", "text");
    pubT.setAttribute("x", String((midA.x + brokerIn.x) / 2 - 22));
    pubT.setAttribute("y", String(midA.y - 10));
    pubT.setAttribute("fill", GREEN);
    pubT.setAttribute("font-size", "11");
    pubT.setAttribute("font-family", "system-ui, sans-serif");
    pubT.textContent = "Publish";
    svg.appendChild(pubT);

    if (step < 2) return;

    svc(bx, by, "Service B");
    svc(cx, cy, "Service C");

    const midB = { x: bx + aw, y: by + ah / 2 };
    const midC = { x: cx + aw, y: cy + ah / 2 };
    const brokerB = { x: brokerX, y: brokerY + 90 };
    const brokerC = { x: brokerX, y: brokerY + 130 };

    svg.appendChild(
      rc.line(midB.x, midB.y, brokerB.x, brokerB.y, {
        stroke: BLUE,
        strokeWidth: 2,
        strokeLineDash: [6, 6],
      }),
    );
    svg.appendChild(
      rc.line(midC.x, midC.y, brokerC.x, brokerC.y, {
        stroke: BLUE,
        strokeWidth: 2,
        strokeLineDash: [6, 6],
      }),
    );

    const st = document.createElementNS("http://www.w3.org/2000/svg", "text");
    st.setAttribute("x", String((midB.x + brokerB.x) / 2 - 28));
    st.setAttribute("y", String(midB.y + 20));
    st.setAttribute("fill", BLUE);
    st.setAttribute("font-size", "11");
    st.setAttribute("font-family", "system-ui, sans-serif");
    st.textContent = "Subscribe";
    svg.appendChild(st);

    const st2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    st2.setAttribute("x", String((midC.x + brokerC.x) / 2 - 28));
    st2.setAttribute("y", String(midC.y + 20));
    st2.setAttribute("fill", BLUE);
    st2.setAttribute("font-size", "11");
    st2.setAttribute("font-family", "system-ui, sans-serif");
    st2.textContent = "Subscribe";
    svg.appendChild(st2);
  }, [step]);

  const showAnim = step >= 3 && !reduce;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col justify-center rounded-lg bg-black/30 p-3 sm:p-4",
        className,
      )}
    >
      <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        Mappa a lavagna
      </p>
      <div
        className="relative mx-auto w-full max-w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          ref={svgRef}
          role="img"
          aria-label="Diagramma pub sub stile sketch"
          className="absolute inset-0 h-full w-full"
        />
        {showAnim ? (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <motion.circle
              r={6}
              fill="#fcd34d"
              stroke="#f59e0b"
              strokeWidth={1}
              initial={{ cx: 160, cy: 85 }}
              animate={{
                cx: [160, 330, 330, 160, 160, 330, 330],
                cy: [85, 106, 106, 155, 225, 202, 202],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.22, 0.28, 0.4, 0.52, 0.72, 1],
              }}
              style={{ filter: "drop-shadow(0 0 6px rgba(252,211,77,0.85))" }}
            />
          </svg>
        ) : null}
      </div>
    </div>
  );
}
