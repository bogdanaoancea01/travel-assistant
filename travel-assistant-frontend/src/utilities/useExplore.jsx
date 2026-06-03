const API = "https://localhost:7063/api/explore/suggestions";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchExploreSuggestions() {
  const res = await fetch(API, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  return await res.json();
}