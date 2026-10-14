import { describe, expect, it } from 'vitest';
import { firstImageSrc, htmlToText, stripQuery } from '@/lib/feeds/html';

describe('htmlToText', () => {
  it('drops tags and keeps words apart across block elements', () => {
    expect(htmlToText('<h3>Title</h3><p>First line.</p><p>Second</p>')).toBe(
      'Title First line. Second'
    );
  });

  it('decodes the entities Medium emits', () => {
    expect(
      htmlToText(
        '<p>a &lt;b&gt; &quot;c&quot; &amp; d&#39;s &#x27;e&#x27;&nbsp;f &#8217;</p>'
      )
    ).toBe("a <b> \"c\" & d's 'e' f ’");
  });

  it('collapses whitespace and trims', () => {
    expect(htmlToText('  <p>a\n\n   b</p>  ')).toBe('a b');
  });
});

describe('firstImageSrc', () => {
  const hosts = ['cdn-images-1.medium.com', 'miro.medium.com'] as const;

  it('returns the first image on an allowed host', () => {
    const html =
      '<img src="https://medium.com/_/stat?event=x" /><img alt="" src="https://cdn-images-1.medium.com/max/1024/a.png"><img src="https://miro.medium.com/b.png">';
    expect(firstImageSrc(html, hosts)).toBe(
      'https://cdn-images-1.medium.com/max/1024/a.png'
    );
  });

  it('ignores tracking pixels, other hosts and non-https sources', () => {
    const html =
      '<img src="https://medium.com/_/stat?event=x"><img src="http://cdn-images-1.medium.com/a.png"><img src="https://evil.example/a.png">';
    expect(firstImageSrc(html, hosts)).toBeNull();
  });
});

describe('stripQuery', () => {
  it('removes the tracking query and hash', () => {
    expect(
      stripQuery('https://medium.com/@hacisimsek/post-aaea?source=rss-1#x')
    ).toBe('https://medium.com/@hacisimsek/post-aaea');
  });
});
