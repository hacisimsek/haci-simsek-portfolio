import Hero from '@/components/sections/hero';
import SystemDiagram from '@/components/sections/system-diagram';
import SystemStory from './system-story';
import StoryStage from './story-stage';

// The hero and the story share one drawing. Where the story scrolls (see
// app/globals.css), the diagram beside the name stays in place while the name
// and then the story's steps scroll past it, and each step lights its part of
// the drawing. Elsewhere the hero keeps the plain diagram and the story shows
// the finished one with its steps.
export default function HeroStory() {
  return (
    <StoryStage className="hero-story flex flex-col gap-16 sm:gap-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-8">
      <Hero />
      <div
        aria-hidden
        className="hero-story-diagram hidden lg:col-start-2 lg:row-start-1 lg:block lg:self-center"
      >
        <SystemDiagram className="h-full w-full" />
      </div>
      <SystemStory />
    </StoryStage>
  );
}
