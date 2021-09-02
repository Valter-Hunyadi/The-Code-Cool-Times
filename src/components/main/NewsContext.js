import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NewsContext = createContext();

const apiKeys = [
  "803b1f20229542109d3b21b58d162064", // Tusi's
  "d1f3e37a2d654d0dadc45046a0ab9ec7", // Roky's
  "42bb7b3ce3b34a91aef6e8ff7ae74ec6", // Roky's 2nd
  "e66d041687414a339b55f798c3fa8b6d", // Marta's
];
const apiKey = apiKeys[3];

export const NewsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [newsTheme, setNewsTheme] = useState("everything");

  const todayDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getTopNewsForTheme(newsTheme);
  }, [newsTheme]);

  const changeNewsTheme = (newTheme) => {
    setLoading(true);
    getTopNewsForTheme(newTheme);
  };

  const getTopNewsForTheme = async (newsTheme) => {
    const response = await axios.get(
      "https://newsapi.org/v2/everything?q=" +
        newsTheme +
        "&from=" +
        todayDate +
        "&to=" +
        todayDate +
        "&language=en" +
        "&apiKey=" +
        apiKey
    );
    const responsesWithNoTag = response.data.articles.filter(
      (article) => !article.description.includes("<")
    );
    const responseWithNoTagAndLink = response.data.articles.filter(
      (article) => !article.description.includes("www.")
    );
    setArticles(responseWithNoTagAndLink);
    setLoading(false);
  };
  return (
    <NewsContext.Provider
      value={{
        articles: articles,
        loading: loading,
        setArticles: setArticles,
        setLoading: setLoading,
        apiKey: apiKey,
        setNewsTheme: setNewsTheme,
        changeNewsTheme: changeNewsTheme,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
