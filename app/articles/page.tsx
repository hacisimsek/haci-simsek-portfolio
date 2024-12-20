'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

interface Article {
  title: string;
  description: string;
  guid: string;
  categories?: string[];
  thumbnail?: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@hacisimsek'
        );
        const data = await response.json();
        const items = data.items || [];
        console.log('items', items);

        const formattedArticles = items.map((item: any) => ({
          title: item.title,
          description: extractTextFromHTML(item.description),
          guid: item.guid,
          categories: item.categories,
          thumbnail: findImage(item.content),
        }));
        console.log('formattedArticles', formattedArticles);

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false); // Stop the loader
      }
    }

    fetchArticles();
  }, []);

  function findImage(htmlString: string) {
    const regex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
    const match = regex.exec(htmlString);
    return match
      ? match[1]
      : 'https://cdn-images-1.medium.com/v2/resize:fit:564/0*-BkwD9DCSLszd2ag.jpg';
  }

  function extractTextFromHTML(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  return (
    <section id="articles" className="mb-12">
      <h4 className="text-xl font-bold mb-4">Latest Articles</h4>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={index}>
              <Card>
                <CardHeader>
                  <a href={article.guid} target="_blank">
                    <CardTitle>{article.title}</CardTitle>
                  </a>
                </CardHeader>
                <div className="flex">
                  <div className="flex-1">
                    <CardContent>
                      <CardDescription>
                        {article.description.length > 600
                          ? article.description.slice(0, 600) + '...'
                          : article.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        {article.categories
                          ?.slice(0, 3)
                          ?.map((category) => `#${category}`)
                          .join(' ')}
                      </p>
                    </CardFooter>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-48 h-48 object-cover rounded-lg shadow-lg border border-gray-200 mb-1 mr-3"
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
