export const getAuthHeaders = () => {
  const token = localStorage.getItem("access");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
