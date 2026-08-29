import API from "./apiClient";

export const getOperationsSnapshot = async () => {
  const [stats, incidents, tourists] = await Promise.all([
    API.get("/dashboard/stats"),
    API.get("/incidents", { params: { limit: 250 } }),
    API.get("/tourists"),
  ]);

  return {
    stats: stats.data.data,
    incidents: incidents.data.data || [],
    tourists: tourists.data.tourists || tourists.data.data || [],
  };
};
