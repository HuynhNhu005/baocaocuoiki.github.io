import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import "./index.css";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  // Thêm state để lưu thông tin user (nếu cần hiển thị tên)
  const [username, setUsername] = useState("");

  const [config, setConfig] = useState({
    limit: 10,
    category: "",
    difficulty: ""
  });

  // 1. KIỂM TRA ĐĂNG NHẬP (QUAN TRỌNG)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("username");
    
    if (!token) {
      // Nếu không có token -> Đá về trang đăng nhập
      alert("Bạn cần đăng nhập để tiếp tục!");
      window.location.href = "/login.html";
    } else {
      if (storedUser) setUsername(storedUser);
    }
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    setGameStarted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.href = "/login.html";
  };

  return (
    <div className="app-container">
      {/* Header nhỏ hiển thị người dùng */}
      <div style={{ position: "absolute", top: "10px", right: "20px", color: "#fff" }}>
        {username && <span>Xin chào, <b>{username}</b> | </span>}
        <button 
          onClick={handleLogout}
          style={{ background: "transparent", border: "none", color: "#ff4757", cursor: "pointer", textDecoration: "underline" }}
        >
          Đăng xuất
        </button>
      </div>

      {!gameStarted ? (
        <div className="card">
          <h1>🎓 Nền Tảng Thi Trắc Nghiệm</h1>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "2rem" }}>
            Chào mừng bạn! Hãy thiết lập bài thi của mình.
          </p>

          <form onSubmit={handleStart}>
            <div className="form-group">
              <label>Số lượng câu hỏi:</label>
              <select
                value={config.limit}
                onChange={(e) => setConfig({ ...config, limit: Number(e.target.value) })}
              >
                <option value={5}>5 câu (Nhanh)</option>
                <option value={10}>10 câu (Tiêu chuẩn)</option>
                <option value={20}>20 câu (Thử thách)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Chủ đề (Category):</label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
              >
                <option value="">Tất cả chủ đề</option>
                <option value="IT">Công nghệ thông tin</option>
                <option value="Math">Toán học</option>
                <option value="Science">Khoa học</option>
                <option value="Geography">Địa lý</option>
              </select>
            </div>

            <div className="form-group">
              <label>Độ khó:</label>
              <select
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
              >
                <option value="">Ngẫu nhiên</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>

            <button type="submit" className="btn primary-btn">
              Bắt Đầu Làm Bài 🚀
            </button>
          </form>
        </div>
      ) : (
        <Quiz config={config} onRetry={() => setGameStarted(false)} />
      )}
    </div>
  );
}