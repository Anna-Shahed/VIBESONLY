"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onCaptured(canvas: HTMLCanvasElement): void;
  onCancel(): void;
  onPermissionError(): void;
}

type Stage = "requesting" | "live" | "error";

export function CameraView({ onCaptured, onCancel, onPermissionError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stage, setStage] = useState<Stage>("requesting");
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [error, setError] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    stopStream();
    setStage("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Your browser doesn't support camera access.");
        setStage("error");
        onPermissionError();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode === "environment" ? { ideal: "environment" } : "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStage("live");
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") onPermissionError();
      else setError("Couldn't open the camera. Try a sample vibe instead.");
      setStage("error");
    }
  }, [stopStream, onPermissionError]);

  useEffect(() => {
    void startCamera(facing);
    return () => stopStream();
  }, [startCamera, stopStream, facing]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1280 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d", { colorSpace: "srgb" });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCaptured(canvas);
  }, [onCaptured]);

  const flip = useCallback(() => {
    setFacing((f) => (f === "environment" ? "user" : "environment"));
  }, []);

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-vibe-muted">{error || "Camera unavailable."}</p>
        <button className="vo-btn-ghost" onClick={onCancel}>Go back</button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-vibe-line">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}
      />

      {}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-6 top-6 bottom-6 border border-white/25 rounded-lg">
          <span className="absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-vibe-accent" />
          <span className="absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-vibe-accent" />
          <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-vibe-accent" />
          <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-vibe-accent" />
        </div>
        <div className="scanline" />
      </div>

      {stage === "requesting" && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-vibe-muted vo-pulse">Opening camera…</p>
        </div>
      )}

      {}
      <p className="absolute top-3 inset-x-0 text-center text-xs uppercase tracking-[0.3em] text-white/80 pointer-events-none">
        point it at something that feels like you
      </p>

      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6 pointer-events-none">
        <button aria-label="Close camera" onClick={onCancel} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur text-white">✕</button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          aria-label="Capture the vibe"
          onClick={capture}
          disabled={stage !== "live"}
          className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-vibe-accent disabled:opacity-40"
        >
          <span className="h-11 w-11 rounded-full bg-white/90" />
        </motion.button>
        <button aria-label="Flip camera" onClick={flip} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur text-white">⇄</button>
      </div>
    </div>
  );
}
