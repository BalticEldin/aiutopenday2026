"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Camera, X, Download, RotateCcw, MessageCircle, Smartphone, Loader2 } from "lucide-react";

interface SelfieCameraProps {
  onClose: () => void;
}

type CameraState = "preview" | "captured" | "uploading" | "qrcode";

export function SelfieCamera({ onClose }: SelfieCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("preview");
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch {
      setError("Could not access camera. Please allow camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame (mirrored)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    // Load and draw the logo
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/images/ut-logo.png";

    await new Promise<void>((resolve) => {
      logo.onload = () => {
        const logoWidth = canvas.width * 0.18;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        const padding = 15;
        const x = canvas.width - logoWidth - padding;
        const y = canvas.height - logoHeight - padding;
        ctx.drawImage(logo, x, y, logoWidth, logoHeight);
        resolve();
      };
      logo.onerror = () => resolve();
    });

    // Get the data URL for local display
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImageUrl(dataUrl);
    setCameraState("captured");
    stopCamera();
  }, [stopCamera]);

  const takeAnother = useCallback(() => {
    setCapturedImageUrl(null);
    setBlobUrl(null);
    setCameraState("preview");
    startCamera();
  }, [startCamera]);

  const uploadAndShowQR = useCallback(async () => {
    if (!capturedImageUrl) return;

    setCameraState("uploading");
    setError(null);

    try {
      // Convert data URL to Blob
      const response = await fetch(capturedImageUrl);
      const blob = await response.blob();

      // Create FormData and upload
      const formData = new FormData();
      formData.append("file", blob, `ut-openday-selfie-${Date.now()}.png`);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await uploadResponse.json();
      // Create a viewer page URL with query parameter instead of route segment
      const viewerUrl = `${window.location.origin}/photo?url=${encodeURIComponent(url)}`;
      setBlobUrl(viewerUrl);
      setCameraState("qrcode");
    } catch {
      setError("Failed to upload photo. Please try downloading directly instead.");
      setCameraState("captured");
    }
  }, [capturedImageUrl]);

  const downloadPhoto = useCallback(() => {
    if (!capturedImageUrl) return;
    const link = document.createElement("a");
    link.href = capturedImageUrl;
    link.download = `ut-openday-selfie-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [capturedImageUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            UT Open Day Selfie
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {cameraState === "preview" ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none" />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-20 h-20 bg-white hover:bg-gray-100 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="w-14 h-14 rounded-full border-4 border-primary" />
                </Button>
              </div>
            </div>
          ) : cameraState === "captured" ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                {capturedImageUrl && (
                  <img
                    src={capturedImageUrl}
                    alt="Captured selfie"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={downloadPhoto}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={uploadAndShowQR}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Get on Phone
                </Button>
                <Button
                  onClick={takeAnother}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </Button>
              </div>
            </div>
          ) : cameraState === "uploading" ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                {capturedImageUrl && (
                  <img
                    src={capturedImageUrl}
                    alt="Captured selfie"
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <Loader2 className="w-12 h-12 text-white animate-spin mb-3" />
                  <p className="text-white font-medium">Uploading photo...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center gap-2 text-primary">
                  <Smartphone className="w-5 h-5" />
                  <p className="font-medium">Scan to view on your phone</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  {blobUrl && (
                    <QRCodeSVG
                      value={blobUrl}
                      size={200}
                      level="M"
                      includeMargin
                    />
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Scan this QR code with your phone to view and download your selfie.
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Works on any device - no need to be on the same network!
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={downloadPhoto}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Download className="w-4 h-4" />
                  Download Here
                </Button>
                <Button
                  onClick={takeAnother}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Take Another
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Back to Chat
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
