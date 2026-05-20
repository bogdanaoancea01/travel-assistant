const API = "https://localhost:7063/api/chatshistory";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function useChatHistory() {
  const fetchChats = async () => {
    const res = await fetch(API, { headers: getAuthHeaders() });
    return await res.json();
  };

  const loadChat = async (chatId) => {
    const res = await fetch(`${API}/${chatId}`, { headers: getAuthHeaders() });
    return await res.json();
  };

  const createChat = async (name = "New Chat") => {
    const res = await fetch(API, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return await res.json();
  };

  const saveUserMessage = async (chatId, content) => {
    await fetch(`${API}/${chatId}/user-messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
  };

  const saveAssistantResponse = async (chatId, aiReply) => {
    await fetch(`${API}/${chatId}/assistant-responses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ jsonContent: JSON.stringify(aiReply) }),
    });
  };

  const renameChat = async (chatId, name) => {
    await fetch(`${API}/${chatId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
  };

  const deleteChat = async (chatId) => {
    await fetch(`${API}/${chatId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  };

  return {
    fetchChats,
    loadChat,
    createChat,
    saveUserMessage,
    saveAssistantResponse,
    renameChat,
    deleteChat,
  };
}