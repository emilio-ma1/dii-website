/**
 * @file useLatestNews.js
 * @description 
 * Custom hook to fetch, filter, and manage the state of the latest news.
 * * Responsibilities:
 * - Isolate data fetching and transformation from the presentation layer.
 * - Map binary image tunnel URLs to avoid heavy payload responses.
 * - Format ISO dates into user-friendly UI strings.
 */
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Formats an ISO date string into a clean DD-MM-YYYY format.
 * * WHY: This ensures visual consistency across the entire web platform without
 * overloading the UI components with date manipulation logic.
 *
 * @param {string} dateString The raw ISO date string from the database.
 * @returns {string} The formatted date or a fallback string.
 * @throws {Error} Does not throw; handles empty inputs gracefully.
 */
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no especificada";
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Filters active news, sorts them by publication date descending, limits the output,
 * and maps the binary image endpoints.
 * * WHY: To prepare the raw API data strictly for UI consumption, reducing
 * the mapping logic inside the React components.
 *
 * @param {Array<object>} rawNewsList The unparsed list of news from the API.
 * @returns {Array<object>} The processed list of up to 3 active news items with mapped URLs.
 * @throws {Error} Does not throw; handles non-array inputs by returning an empty array.
 */
export const processLatestNews = (rawNewsList) => {
  // Early return prevents errors if the backend sends an unexpected payload
  if (!Array.isArray(rawNewsList)) return [];
  
  const activeNews = rawNewsList.filter(news => news.is_active);
  
  const sortedNews = activeNews.sort((a, b) => {
    return new Date(b.published_at) - new Date(a.published_at);
  });
  
  return sortedNews.slice(0, 3).map(news => ({
    ...news,
    formattedDate: formatDate(news.published_at),
    imageUrl: `${API_URL}/api/news/${news.id}/image`
  }));
};

/**
 * Custom hook to fetch and manage the latest news state.
 *
 * @returns {object} State object containing latestNews array, isLoading boolean, and error string.
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
        const response = await fetch(`${API_URL}/api/news`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch news from server");
        }

        const data = await response.json();
        
        // Pass the raw data through our processing pipeline
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