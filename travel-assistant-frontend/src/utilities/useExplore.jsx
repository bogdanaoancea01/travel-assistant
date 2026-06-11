const BASE_API = "https://localhost:7063/api/explore";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// seen: [{ city, country }] already shown this session (excluded server-side)
export async function fetchExploreSuggestions(seen = []) {
  const res = await fetch(`${BASE_API}/suggestions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ seen }),
  });
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  return await res.json(); // { destinations: [...] }
}

// signal: "Like" | "Dislike" | "Save"
export async function submitDestinationFeedback(dest, signal) {
  const res = await fetch(`${BASE_API}/feedback`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      city: dest.city,
      country: dest.country,
      category: dest.category,
      tags: dest.tags ?? [],
      reason: dest.reason ?? "",
      signal,
    }),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
}

// Remove a like/dislike/save (toggle off or unsave)
export async function removeDestinationInteraction(dest) {
  const params = new URLSearchParams({ city: dest.city, country: dest.country });
  const res = await fetch(`${BASE_API}/interaction?${params}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove interaction");
}

export async function fetchSavedDestinations() {
  const res = await fetch(`${BASE_API}/saved`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch saved");
  return await res.json(); // [{ city, country, category, tags, reason }]
}
