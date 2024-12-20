import About from '@/components/About';
import Career from '@/components/Career';
import Education from '@/components/Education';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <About />
      <Career />
      <Education />
    </div>
  );
}
