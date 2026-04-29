"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SelfieCamera } from "@/components/selfie-camera";
import { VoiceflowChat } from "@/components/voiceflow-chat";
import { Camera } from "lucide-react";

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
      </div>

      {/* Main content - scrollable on mobile */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:min-h-screen">
        {/* Left side - Robot (smaller on mobile) */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 pt-6 lg:p-12">
          <div className="relative w-[180px] md:w-[280px] lg:max-w-md lg:w-full">
            {/* Glow effect behind robot */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-2xl scale-110" />
            
            {/* Robot image */}
            <div className="relative animate-in slide-in-from-left duration-700">
              <Image
                src="/images/robot.png"
                alt="AI Assistant Robot - University of Tetova"
                width={500}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Welcome text for mobile */}
          <div className="mt-3 text-center lg:hidden">
            <h1 className="text-lg md:text-2xl font-bold text-foreground mb-1">
              Welcome to UT Open Day
            </h1>
            <p className="text-sm text-muted-foreground">
              Chat with our AI assistant below
            </p>
          </div>
        </div>

        {/* Right side - Chat area */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 pb-6 lg:p-12 lg:pb-12">
          <div className="w-full max-w-xl h-[50vh] md:h-[55vh] lg:h-[600px] animate-in slide-in-from-right duration-700 [animation-delay:200ms]">
            {/* Chat container */}
            <div className="bg-card/80 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-border/50 overflow-hidden h-full flex flex-col">
              {/* Voiceflow chat widget - embedded inside */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <VoiceflowChat />
              </div>

              {/* Chat footer info */}
              <div className="px-3 py-2 lg:px-4 lg:py-3 bg-muted/30 border-t border-border/50 shrink-0">
                <p className="text-xs text-muted-foreground text-center">
                  Ask about programs, campus tours, admissions, and more!
                </p>
              </div>
            </div>
          </div>

          {/* Mobile footer credit - inline below chat */}
          <div className="lg:hidden mt-4 mb-16 text-center">
            <p className="text-xs text-muted-foreground">Created by</p>
            <a
              href="https://eldinbaltic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline transition-colors"
            >
              Eldin Baltic
            </a>
          </div>
        </div>
      </div>

      {/* Selfie button - repositioned for mobile */}
      <Button
        onClick={() => setShowCamera(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-6 lg:bottom-6 z-40 rounded-full px-5 py-3 lg:px-6 lg:py-6 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <Camera className="w-4 h-4 lg:w-5 lg:h-5 mr-2 group-hover:rotate-12 transition-transform" />
        <span className="font-medium text-sm lg:text-base">Take a Selfie</span>
      </Button>

      {/* Footer credit - hidden on mobile */}
      <footer className="hidden lg:block fixed bottom-6 left-6 z-40">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-border/50">
          <p className="text-xs text-muted-foreground">Created By:</p>
          <p className="font-semibold text-foreground">Eldin Baltic</p>
          <a
            href="https://eldinbaltic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline transition-colors"
          >
            eldinbaltic.com
          </a>
        </div>
      </footer>

      {/* Selfie camera modal */}
      {showCamera && <SelfieCamera onClose={() => setShowCamera(false)} />}
    </main>
  );
}
