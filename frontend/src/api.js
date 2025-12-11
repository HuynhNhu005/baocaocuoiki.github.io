// Cấu hình URL Backend (mặc định localhost:8000)
const API_BASE = "http://localhost:8000/api";

export async function fetchRandomQuestions(limit = 10, category = "", difficulty = "") {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    if (category) params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);

    const res = await fetch(`${API_BASE}/questions/random?${params.toString()}`);
    
    if (!res.ok) {
      throw new Error(`Lỗi API: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi tải câu hỏi:", error);
    throw error;
  }
}

export async function submitAnswers(answers) {
  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
      throw new Error("Lỗi khi nộp bài");
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error);
    throw error;
  }
}