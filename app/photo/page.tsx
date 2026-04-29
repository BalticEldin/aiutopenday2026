"use client";

import { useSearchParams } from "next/navigation";
import { Download, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense, useState } from "react";

function PhotoContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("url");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl || isDownloading) return;

    setIsDownloading(true);

    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create object URL and trigger download
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `ut-openday-selfie-${Date.now()}.png`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
      }, 100);
    } catch {
      // Fallback: open image in new tab for manual save
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!imageUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 md:p-6">
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-center max-w-md">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Camera className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Photo Not Found
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            This photo link may have expired or is invalid.
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center p-4 md:p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
            <Camera className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              UT Open Day 2026
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">Your selfie is ready!</p>
        </div>

        {/* Photo card */}
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-border/50">
          {/* Photo - using img tag to avoid Next.js image optimization issues with blob URLs */}
          <div className="relative aspect-[4/3] bg-black flex items-center justify-center">
            <img
              src={imageUrl}
              alt="UT Open Day Selfie"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Actions */}
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-base md:text-lg py-5 md:py-6"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? "Downloading..." : "Download Photo"}
            </Button>

            <p className="text-center text-xs md:text-sm text-muted-foreground">
              Save this memory from University of Tetova Open Day!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 md:mt-6 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            Visit UT Open Day booth
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PhotoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <PhotoContent />
    </Suspense>
  );
}
