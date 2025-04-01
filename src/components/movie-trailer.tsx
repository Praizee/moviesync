"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/lib/types";
import Image from "next/image";

interface MovieTrailerProps {
  videos: VideoItem[];
}

export function MovieTrailer({ videos }: MovieTrailerProps) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Filter for YouTube trailers and teasers
  const filteredVideos = videos.filter(
    (video) =>
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser")
  );

  if (filteredVideos.length === 0) {
    return <p className="text-muted-foreground">No trailers available</p>;
  }

  const handlePrevious = () => {
    setActiveVideo((prev) =>
      prev === 0 ? filteredVideos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveVideo((prev) =>
      prev === filteredVideos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted group">
          <Image
            src={`https://img.youtube.com/vi/${filteredVideos[activeVideo].key}/maxresdefault.jpg`}
            alt={filteredVideos[activeVideo].name}
            className="h-full w-full object-cover"
            fill
            priority
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center bg-white/20 hover:bg-white/30 border-white/40"
                onClick={() => setIsOpen(true)}
              >
                <Play className="h-8 w-8 text-white" fill="white" />
                <span className="sr-only">Play trailer</span>
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <DialogTitle className="sr-only">Trailer</DialogTitle>
        <DialogContent className="sm:max-w-[800px] p-0">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${filteredVideos[activeVideo].key}?autoplay=1`}
              title={filteredVideos[activeVideo].name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      {filteredVideos.length > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous trailer</span>
          </Button>
          <div className="flex items-center gap-2">
            {filteredVideos.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === activeVideo
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
                onClick={() => setActiveVideo(index)}
              >
                <span className="sr-only">Trailer {index + 1}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next trailer</span>
          </Button>
        </div>
      )}
    </div>
  );
}

