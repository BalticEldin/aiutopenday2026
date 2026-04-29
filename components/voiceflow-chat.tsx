"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: {
          verify: { projectID: string };
          url: string;
          versionID: string;
          voice?: { url: string };
          render?: {
            mode: string;
            target: HTMLElement;
          };
          autostart?: boolean;
        }) => void;
        open: () => void;
        hide: () => void;
        show: () => void;
        destroy: () => void;
      };
    };
  }
}

export function VoiceflowChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    if (document.getElementById("voiceflow-script")) {
      // Script exists, try to load into container
      if (containerRef.current && window.voiceflow) {
        loadChatIntoContainer();
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "voiceflow-script";
    script.type = "text/javascript";
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    script.onload = () => {
      loadChatIntoContainer();
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    return () => {
      // Cleanup - destroy the chat widget
      if (window.voiceflow) {
        try {
          window.voiceflow.chat.destroy();
        } catch {
          // Widget might not be initialized
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadChatIntoContainer() {
    if (!containerRef.current || !window.voiceflow) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    window.voiceflow.chat.load({
      verify: { projectID: "69f13eb51ce2ce822b506fa9" },
      url: "https://general-runtime.voiceflow.com",
      versionID: "production",
      voice: {
        url: "https://runtime-api.voiceflow.com",
      },
      render: {
        mode: "embedded",
        target: containerRef.current,
      },
      autostart: true,
    });

    setIsLoaded(true);
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Loading state */}
      {!isLoaded && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Loading AI Assistant...
            </h3>
            <div className="flex items-center justify-center gap-1 pt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:100ms]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
          </div>
        </div>
      )}
      
      {/* Voiceflow embedded chat container */}
      <div 
        ref={containerRef} 
        className="flex-1 min-h-0"
        style={{ 
          display: isLoaded ? "block" : "none",
          height: "100%",
        }}
      />

      {/* Custom styles to make Voiceflow widget fit our design */}
      <style jsx global>{`
        /* Hide the default Voiceflow launcher button */
        .vfrc-launcher {
          display: none !important;
        }
        
        /* Style the embedded widget container */
        .vfrc-widget {
          height: 100% !important;
          max-height: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        
        .vfrc-chat {
          height: 100% !important;
          max-height: none !important;
          border-radius: 0 !important;
        }
        
        .vfrc-chat--embedded {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Hide the close button in embedded mode */
        .vfrc-header__close {
          display: none !important;
        }
        
        /* Hide the header completely for cleaner look */
        .vfrc-header {
          display: none !important;
        }
        
        /* Make messages area scrollable */
        .vfrc-chat__messages {
          flex: 1 !important;
          overflow-y: auto !important;
        }
        
        /* Ensure the widget takes full container height */
        [data-testid="widget-container"] {
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
