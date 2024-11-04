"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface Article {
  title: string;
  description: string;
  guid: string;
  categories?: string[];
  thumbnail?: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@hacisimsek"
        );
        const data = await response.json();
        const items = data.items || [];
        console.log("items", items);

        const formattedArticles = items.map((item: any) => ({
          title: item.title,
          description: extractTextFromHTML(item.description),
          guid: item.guid,
          categories: item.categories,
          thumbnail: findImage(item.content),
        }));
        console.log("formattedArticles", formattedArticles);

        setArticles(formattedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

    fetchArticles();
  }, []);

  function findImage(htmlString: string) {
    const regex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
    const match = regex.exec(htmlString);
    return match ?
      match[1] :
      "https://cdn-images-1.medium.com/v2/resize:fit:564/0*-BkwD9DCSLszd2ag.jpg";
  }


  function extractTextFromHTML(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }

  return (
    <section id="articles" className="mb-12">
      <h4 className="text-xl font-bold mb-4">Latest Articles</h4>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index}>
            <Card className="flex">
              <div className="flex-1">
                <CardHeader>
                  <a href={article.guid} target="_blank">
                    <CardTitle>{article.title}</CardTitle>
                  </a>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {article.description.length > 300
                      ? article.description.slice(0, 300) + "..."
                      : article.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {article.categories?.slice(0, 3)
                      ?.map((category) => `#${category}`)
                      .join(" ")}
                  </p>
                </CardFooter>
              </div>
              <div className="">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-48 h-48 object-cover rounded-lg shadow-lg border border-gray-200 mt-3.5 mr-3"
                />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
