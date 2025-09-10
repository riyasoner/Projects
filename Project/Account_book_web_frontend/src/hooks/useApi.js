import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(
    async (endpoint, method = "GET", data = null, config = {}) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");

        const headers = {
          ...config.headers,
          Authorization: token || "",
        };

        const response = await apiClient.request({
          url: endpoint,
          method,
          ...(method !== "DELETE" && { data }),
          ...config,
          headers,
        });

        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);
        const errorMessage = err.response?.data.message || err.message || "An unknown error occurred";
        console.error("API Error:", errorMessage);
        setError(errorMessage);
        throw err.response?.data || { message: errorMessage};

      }
    },
    []
  );

  const get = useCallback(
    (endpoint, config = {}) => fetchData(endpoint, "GET", null, config),
    [fetchData]
  );

  const post = useCallback(
    (endpoint, data, config = {}) => fetchData(endpoint, "POST", data, config),
    [fetchData]
  );

  const patch = useCallback(
    (endpoint, data, config = {}) => fetchData(endpoint, "PATCH", data, config),
    [fetchData]
  );

  const del = useCallback(
    (endpoint, config = {}) => fetchData(endpoint, "DELETE", null, config),
    [fetchData]
  );

  return { get, post, patch, del, loading, error };
};

export default useApi;
