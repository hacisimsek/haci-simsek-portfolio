import Header from '@/components/Header';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Articles from '@/components/Articles';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Header />
      <main>
        <About />
        <Projects />
        <Articles />
        <Contact />
      </main>
    </div>
  );
}