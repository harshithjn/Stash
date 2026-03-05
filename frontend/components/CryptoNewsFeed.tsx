"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
};

export default function CryptoNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&language=en&pageSize=5&apiKey=6c9c0b45339348f2b2bc84508c3e4787`
        );
        const j = await res.json();
        const items = (j.articles || []).map((a: any) => ({
          title: a.title,
          url: a.url,
          source: a.source.name,
          publishedAt: a.publishedAt,
          imageUrl: a.urlToImage,
        }));
        setNews(items);
      } catch (err) {
        console.error("Error fetching crypto news:", err);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading news...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Latest Crypto News</h2>
      {news.map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#0b0b0b] border border-zinc-800 rounded-lg p-4 hover:border-white/30 transition"
        >
          <div className="flex items-start gap-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-gray-400 text-sm">
                {item.source} ·{" "}
                {new Date(item.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
