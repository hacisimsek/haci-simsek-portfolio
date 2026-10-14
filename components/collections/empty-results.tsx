import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function EmptyResults({ onReset }: { onReset: () => void }) {
  const msg = useTranslations('Collections');
  return (
    <div className="section-shell text-center">
      <p className="text-lg font-semibold">{msg('empty')}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-4 rounded-full"
        onClick={onReset}
      >
        {msg('reset')}
      </Button>
    </div>
  );
}
