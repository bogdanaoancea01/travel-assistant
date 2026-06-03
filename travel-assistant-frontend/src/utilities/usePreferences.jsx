import { useState, useEffect } from "react";
 
const API = "https://localhost:7063/api/preferences";
 
function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
 
export function usePreferences() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetch(API, { headers: getAuthHeaders() })
      .then((res) => (res.status === 204 ? null : res.json()))
      .then((data) => setPreferences(data ?? {}))
      .catch(() => setPreferences({}))
      .finally(() => setLoading(false));
  }, []);
 
  const savePreferences = async (dto) => {
    const res = await fetch(API, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(dto),
    });
    const saved = await res.json();
    setPreferences(saved);
    return saved;
  };
 
  const deleteField = async (fieldName) => {
    const res = await fetch(`${API}/field/${fieldName}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const updated = await res.json();
    setPreferences(updated);
    return updated;
  };
 
  return { preferences, loading, savePreferences, deleteField };
}