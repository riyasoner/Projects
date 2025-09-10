import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(
        async (endpoint, method = "GET", data = null, config = {}) => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiClient.request({
                    url: endpoint,
                    method,
                    ...(method !== "DELETE" && { data }),
                    ...config,
                });

                setLoading(false);
                return response.data;
            } catch (err) {
                
                setLoading(false);

                const errorMessage = err.response?.data?.message || "Something went wrong.";
                const statusCode = err.response?.status;

                console.error("API Error:", {
                    message: errorMessage,
                    status: statusCode,
                    details: err.response?.statusText,
                });

                setError(errorMessage); // Optional global error state

                // Redirect to login on 401 (unauthorized)
                if (statusCode === 401) {
                    navigate("/");
                }

                // Throw error for the calling component to handle
                throw err.response?.data || { message: errorMessage, status: statusCode };
            }
        },
        [navigate]
    );

    return {
        get: (endpoint, config) => fetchData(endpoint, "GET", null, config),
        post: (endpoint, data, config) => fetchData(endpoint, "POST", data, config),
        patch: (endpoint, data, config) => fetchData(endpoint, "PATCH", data, config),
        del: (endpoint, config) => fetchData(endpoint, "DELETE", null, config),
        loading,
        error,
    };
};

export default useApi;
