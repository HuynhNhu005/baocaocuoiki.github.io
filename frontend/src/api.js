// SỬA: Lấy URL từ biến môi trường Vercel. Nếu không có (chạy local) thì mới dùng localhost
// Lưu ý: import.meta.env.VITE_API_URL chính là cái link https://quiz-backend-f85v.onrender.com bạn đã cài bên Vercel
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE = `${BASE_URL}/api`;

export async function fetchRandomQuestions(limit = 10, category = "", difficulty = "") {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    if (category) params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);

    console.log("Calling API:", `${API_BASE}/questions/random?${params.toString()}`); // Log để kiểm tra

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
    // SỬA: Lấy token từ localStorage (giả sử bạn lưu token tên là 'access_token' hoặc 'token')
    // Bạn cần kiểm tra xem lúc đăng nhập bạn lưu tên là gì nhé.
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // QUAN TRỌNG: Phải gửi kèm Token thì Backend mới biết ai đang nộp bài
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
      // Đọc lỗi chi tiết từ Backend trả về
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Lỗi khi nộp bài");
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error);
    throw error;
  }
}