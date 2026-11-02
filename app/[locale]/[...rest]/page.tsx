import { notFound } from 'next/navigation';

export { generateMetadata } from '../not-found';

export default function CatchAllPage() {
  notFound();
}
