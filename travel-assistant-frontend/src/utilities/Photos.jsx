// Fetches photos through backend, which holds the Unsplash key server-side.
// Returns an array of image URLs or an empty array on failure.
 
const API_BASE = "https://localhost:7063";
 
export async function searchPhotos(query, count = 1, orientation) {
  if (!query) return [];
 
  const params = new URLSearchParams({ query, count: String(count) });
  if (orientation) params.set("orientation", orientation);
 
  try {
    const res = await fetch(`${API_BASE}/photos?${params.toString()}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    if (!res.ok) return [];
    const urls = await res.json();
    return Array.isArray(urls) ? urls : [];
  } catch {
    return [];
  }
}