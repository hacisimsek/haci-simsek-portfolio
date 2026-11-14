import Hero from '@/components/sections/hero';
import SystemDiagram from '@/components/sections/system-diagram';
import SystemStory from './system-story';
import StoryStage from './story-stage';

// The hero and the story share one drawing. Where the story scrolls (see
// app/globals.css), the diagram beside the name stays in place while the name
// and then the story's steps scroll past it, and each step lights its part of
// the drawing. Elsewhere the drawing shows once, finished, beside the story's
// steps, and the hero is the name alone.
export default function HeroStory() {
  return (
    <StoryStage className="hero-story flex flex-col gap-16 sm:gap-24 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-x-8">
      <Hero />
      <div
        aria-hidden
        className="hero-story-diagram hidden lg:col-start-2 lg:row-start-1 lg:self-center"
      >
        <SystemDiagram className="h-full w-full" />
      </div>
      <SystemStory />
    </StoryStage>
  );
}
