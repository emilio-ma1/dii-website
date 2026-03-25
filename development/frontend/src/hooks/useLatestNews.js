/**
 * @file useLatestNews.js
 * @description 
 * Custom hook to fetch, filter, and manage the state of the latest news.
 * Isolates data fetching and transformation from the presentation layer.
 */
import { useState, useEffect } from "react";

/**
 * Filters active news, sorts them by publication date descending, and limits the output.
 * * @param {Array<Object>} rawNewsList - The unparsed list of news from the API.
 * @returns {Array<Object>} The processed list of up to 3 active news items.
 * @throws {Error} No explicit errors thrown; handles non-array inputs gracefully.
 */
export const processLatestNews = (rawNewsList) => {
  if (!Array.isArray(rawNewsList)) return [];
  
  const activeNews = rawNewsList.filter(news => news.is_active);
  const sortedNews = activeNews.sort((a, b) => {
    return new Date(b.published_at) - new Date(a.published_at);
  });
  
  return sortedNews.slice(0, 3);
};

/**
 * Custom hook to fetch and manage the latest news state.
 *
 * @returns {Object} State object containing latestNews array, isLoading boolean, and error string.
 * @throws {Error} Internally catches network errors and sets the error state.
 */
export function useLatestNews() {
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch news from server");
        }

        const data = await response.json();
        const processedNews = processLatestNews(data);
        
        setLatestNews(processedNews);
      } catch (err) {
        console.error("[ERROR] fetchNewsData failed:", err);
        setError("No se pudieron cargar las noticias recientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  return { latestNews, isLoading, error };
}