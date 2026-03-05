"use client";

import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Clock, TrendingUp, Filter } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  description?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "bitcoin" | "ethereum">("all");

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const query = filter === "all" ? "cryptocurrency" : filter;
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=20&apiKey=6c9c0b45339348f2b2bc84508c3e4787`
      );
      const data = await res.json();
      const items = (data.articles || []).map((a: any) => ({
        title: a.title,
        url: a.url,
        source: a.source.name,
        publishedAt: a.publishedAt,
        imageUrl: a.urlToImage,
        description: a.description,
      }));
      setNews(items);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Newspaper size={20} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Crypto News</h1>
              <p className="text-sm text-gray-400 mt-1">
                Latest updates from the cryptocurrency world
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-[#111] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All News</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
            </select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <TrendingUp size={16} className="text-green-500" />
              <span>Total Articles</span>
            </div>
            <div className="text-2xl font-semibold">{news.length}</div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Clock size={16} className="text-blue-500" />
              <span>Last Updated</span>
            </div>
            <div className="text-2xl font-semibold">
              {news.length > 0 ? getTimeAgo(news[0].publishedAt) : "-"}
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Newspaper size={16} className="text-purple-500" />
              <span>Sources</span>
            </div>
            <div className="text-2xl font-semibold">
              {new Set(news.map(n => n.source)).size}
            </div>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all group"
              >
                {item.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden bg-gray-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate flex-1">{item.source}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span>{getTimeAgo(item.publishedAt)}</span>
                      <ExternalLink size={12} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-20">
            <Newspaper size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">No news articles found</p>
          </div>
        )}
      </div>
    </div>
  );
}
