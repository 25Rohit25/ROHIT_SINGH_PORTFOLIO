"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import silverSkinImage from "../silver-skin-hero-img.png";
import InkReveal from "./ui/ink-reveal";

const FRAME_COUNT = 303;
const FRAME_FOLDER = "/hero/frames";
const BEAT_COUNT = 3;

type MotionMode = "pending" | "sequence" | "static";
type ProgressRef = { current: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const frameUrl = (frameIndex: number) =>
  `${FRAME_FOLDER}/frame_${String(frameIndex + 1).padStart(4, "0")}.jpg`;

const beatTransform = (offset: number) =>
  `perspective(900px) translate3d(0, ${offset * 82}vh, ${-Math.abs(offset) * 30}vh) rotateX(${-(offset * 58)}deg)`;

const beats = [
  {
    eyebrow: "MOTION STUDY",
    firstLine: "Something worth",
    secondLine: "watching, in",
    thirdLine: "motion.",
    copy: "A quiet sequence with enough room for the eye to catch up.",
  },
  {
    eyebrow: "SCROLL LOGIC",
    firstLine: "Smooth scroll.",
    secondLine: "Scrubbed video.",
    thirdLine: "Pinned reveals.",
    copy: "Every gesture becomes a cut, and every pause keeps its frame.",
  },
  {
    eyebrow: "BUILT TO STAY",
    firstLine: "Built to",
    secondLine: "make people",
    thirdLine: "stay.",
    copy: "A slower visual rhythm for ideas that deserve another look.",
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 2.5v10M4.5 9l3.5 3.5L11.5 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 text-[10px] uppercase tracking-[0.22em] text-white sm:px-7 sm:py-7 lg:px-10">
      <a
        className="pointer-events-auto group flex flex-col gap-1 leading-none"
        href="#hero"
      >
        <span className="font-semibold text-[13px] tracking-[-0.03em] text-[#f4f1eb] sm:text-sm">
          YOUR BRAND
        </span>
        <span className="text-[8px] tracking-[0.34em] text-white/50 transition-colors group-hover:text-white/80">
          THREE WORDS HERE
        </span>
      </a>

      <nav className="pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/20 bg-black/30 p-1.5 backdrop-blur-md md:flex md:top-7">
        {["Home", "About", "Contact"].map((item, index) => (
          <a
            className="rounded-full px-4 py-2 text-[9px] tracking-[0.2em] text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            href={index === 0 ? "#hero" : index === 1 ? "#about" : "#contact"}
            key={item}
          >
            {item}
          </a>
        ))}
      </nav>

      <a
        className="pointer-events-auto group flex items-center gap-2 rounded-full bg-[#f4f1eb] py-1.5 pl-4 pr-1.5 text-[9px] font-semibold tracking-[0.18em] text-black transition-transform hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:py-2 sm:pl-5 sm:pr-2"
        href="#explore"
      >
        <span>Let&apos;s talk</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[#f4f1eb] transition-transform duration-300 group-hover:translate-x-0.5 sm:h-7 sm:w-7">
          <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 16 16">
            <path
              d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </header>
  );
}

function TextDrum({
  progressRef,
  active,
}: {
  progressRef: ProgressRef;
  active: boolean;
}) {
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;

    const animate = () => {
      const drumPosition = progressRef.current * (BEAT_COUNT - 1);

      beatRefs.current.forEach((beat, index) => {
        if (!beat) return;
        beat.style.transform = beatTransform(index - drumPosition);
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [active, progressRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {beats.map((beat, index) => (
        <div
          className="hero-beat absolute left-[clamp(1.25rem,7vw,7.5rem)] top-1/2 w-[min(44rem,calc(100vw-2.5rem))] -translate-y-1/2"
          key={beat.eyebrow}
          ref={(element) => {
            beatRefs.current[index] = element;
          }}
          style={{ transform: beatTransform(index) }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-semibold tracking-[0.28em] text-white/75 backdrop-blur-md sm:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b51] shadow-[0_0_14px_rgba(255,107,81,0.8)]" />
            {beat.eyebrow}
          </div>
          <h1
            className="text-[clamp(3.25rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#f4f1eb]"
          >
            <span className="block">{beat.firstLine}</span>
            <span className="block">{beat.secondLine}</span>
            <span className="font-serif font-normal italic tracking-[-0.075em] text-[#f4f1eb]">
              {beat.thirdLine}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-white/70 sm:mt-7 sm:text-[15px] sm:leading-7">
            {beat.copy}
          </p>
        </div>
      ))}
    </div>
  );
}

function MetaRail() {
  return (
    <aside className="pointer-events-none absolute inset-y-0 right-7 z-30 hidden w-40 flex-col justify-between py-9 text-right text-[9px] uppercase tracking-[0.26em] text-white/55 lg:flex xl:right-10">
      <div aria-hidden="true" className="h-0" />

      <div className="space-y-5">
        <div>
          <p className="mb-1 text-white/35">Currently</p>
          <p className="text-white/75">A moving still</p>
        </div>
        <div>
          <p className="mb-1 text-white/35">This week</p>
          <p className="text-white/75">Slow cinema</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-white/65">
        <span>Scroll to explore</span>
        <ArrowIcon />
      </div>
    </aside>
  );
}

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const silverRevealRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const currentFrameRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(true);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [mode, setMode] = useState<MotionMode>("pending");

  useEffect(() => {
    const modeFrame = window.requestAnimationFrame(() => {
      const isCompact = window.matchMedia("(max-width: 768px)").matches;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMode(isCompact || isReduced ? "static" : "sequence");
    });

    return () => window.cancelAnimationFrame(modeFrame);
  }, []);

  useEffect(() => {
    if (mode !== "sequence") return;

    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const media = mediaRef.current;
    if (!track || !stage || !canvas || !media) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const images = Array.from({ length: FRAME_COUNT }, () => new window.Image());
    framesRef.current = images;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let destroyed = false;

    const drawImageCover = (image: HTMLImageElement, alpha = 1) => {
      if (!image.naturalWidth || !canvasWidth || !canvasHeight) return;

      const scale = Math.max(
        canvasWidth / image.naturalWidth,
        canvasHeight / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;

      context.globalAlpha = alpha;
      context.drawImage(
        image,
        (canvasWidth - width) / 2,
        (canvasHeight - height) / 2,
        width,
        height,
      );
      context.globalAlpha = 1;
    };

    const drawPosition = (position: number) => {
      const floorFrame = clamp(Math.floor(position), 0, FRAME_COUNT - 1);
      const nextFrame = Math.min(floorFrame + 1, FRAME_COUNT - 1);
      const fraction = position - floorFrame;
      const floorImage = framesRef.current[floorFrame];
      const nextImage = framesRef.current[nextFrame];

      if (!floorImage?.naturalWidth) return;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawImageCover(floorImage);
      if (nextFrame !== floorFrame && fraction > 0 && nextImage?.naturalWidth) {
        drawImageCover(nextImage, fraction);
      }
    };

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawPosition(currentFrameRef.current);
    };

    const revealFirstFrame = () => {
      if (destroyed) return;
      resizeCanvas();
      drawPosition(0);
      canvas.style.opacity = "1";
    };

    images.forEach((image, index) => {
      image.decoding = "async";
      image.onload = index === 0 ? revealFirstFrame : null;
      image.src = frameUrl(index);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(track);

    const pointerMove = (event: PointerEvent) => {
      pointerTargetRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const pointerLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("resize", resizeCanvas);

    let frameId = 0;
    const animate = () => {
      if (visibleRef.current) {
        const rect = track.getBoundingClientRect();
        const scrollRange = Math.max(rect.height - window.innerHeight, 1);
        const rawProgress = clamp(-rect.top / scrollRange, 0, 1);
        const targetFrame = rawProgress * (FRAME_COUNT - 1);
        const difference = targetFrame - currentFrameRef.current;
        currentFrameRef.current += difference * 0.1;

        if (Math.abs(difference) < 0.001) {
          currentFrameRef.current = targetFrame;
        }

        drawPosition(currentFrameRef.current);
        progressRef.current = currentFrameRef.current / (FRAME_COUNT - 1);

        pointerCurrentRef.current.x +=
          (pointerTargetRef.current.x - pointerCurrentRef.current.x) * 0.1;
        pointerCurrentRef.current.y +=
          (pointerTargetRef.current.y - pointerCurrentRef.current.y) * 0.1;

        const holdFade = Math.max(0, 1 - currentFrameRef.current / 6);
        if (silverRevealRef.current) {
          silverRevealRef.current.style.opacity = String(holdFade);
        }
        const tiltX = pointerCurrentRef.current.x * holdFade;
        const tiltY = pointerCurrentRef.current.y * holdFade;
        media.style.transform = `perspective(1400px) rotateX(${-tiltY * 2.2}deg) rotateY(${tiltX * 2.2}deg) translate3d(${-tiltX * 8}px, ${-tiltY * 8}px, 0) scale(1)`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      images.forEach((image) => {
        image.onload = null;
        image.src = "";
      });
      framesRef.current = [];
    };
  }, [mode]);

  return (
    <>
      <Header />
      <main
        id="hero"
        className={mode === "static" ? "hero-track h-[100svh]" : "hero-track"}
        ref={trackRef}
        style={mode === "static" ? { height: "100svh" } : undefined}
      >
        <section
          className="hero-stage sticky top-0 isolate w-full overflow-hidden bg-black"
          ref={stageRef}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover"
              fill
              priority
              sizes="100vw"
              src={frameUrl(0)}
            />
            {mode !== "static" && (
              <div className="hero-media-wrap absolute inset-0" ref={mediaRef}>
                <canvas
                  aria-hidden="true"
                  className="hero-canvas absolute inset-0 h-full w-full object-cover"
                  ref={canvasRef}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-auto absolute inset-0 overflow-hidden"
                  ref={silverRevealRef}
                  style={{
                    WebkitMaskImage: "url('/hero/silver-face-mask.svg')",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                    maskImage: "url('/hero/silver-face-mask.svg')",
                    maskRepeat: "no-repeat",
                    maskSize: "100% 100%",
                    opacity: 0,
                  }}
                >
                  <InkReveal
                    brushSize={72}
                    className="h-full w-full"
                    imageSrc={silverSkinImage.src}
                    lifetime={750}
                    maxStamps={90}
                    rStart={6}
                    style={{ cursor: "auto", zIndex: 16 }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2/3 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-gradient-to-l from-black/40 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/35 to-transparent" />

          <TextDrum active={mode !== "static"} progressRef={progressRef} />
          <MetaRail />
        </section>
      </main>
    </>
  );
}
