import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/AdminDashboard"; // <--- 1. IMPORT QUAN TRỌNG
import "./index.css";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [showAdmin, setShowAdmin] = useState(false); // <--- 2. STATE MỚI ĐỂ BẬT ADMIN

  const [config, setConfig] = useState({
    limit: 10,
    category: "",
    difficulty: ""
  });

  // KIỂM TRA ĐĂNG NHẬP
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    
    if (!token) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      window.location.href = "/login.html";
    } else {
      if (storedUser) setUsername(storedUser);
      if (storedRole) setRole(storedRole);
    }
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    setGameStarted(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login.html";
  };

  // 3. SỬA HÀM NÀY: Bật chế độ Admin thay vì Alert
  const handleAdminAction = () => {
    setShowAdmin(true);
  };

  return (
    <div className="app-container">
      {/* HEADER: Hiển thị thông tin User & Nút Admin */}
      <div style={{ position: "absolute", top: "15px", right: "20px", color: "#fff", zIndex: 100, display: "flex", alignItems: "center", gap: "15px" }}>
        
        {username && (
          <span style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            Xin chào, <b>{username}</b> <small>({role})</small>
          </span>
        )}
        
        {/* NÚT ADMIN: Chỉ hiện nếu role là 'admin' */}
        {role === 'admin' && (
            <button 
                onClick={handleAdminAction}
                style={{ 
                  background: "linear-gradient(45deg, #f59e0b, #d97706)", 
                  color: "#fff",
                  border: "none", 
                  padding: "6px 12px", 
                  borderRadius: "20px", 
                  cursor: "pointer", 
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s"
                }}
                title="Trang quản trị viên"
            >
                ⚙ Quản lý
            </button>
        )}

        <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.3)" }}></div>

        <button 
          onClick={handleLogout}
          style={{ background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer", textDecoration: "underline", fontWeight: "600" }}
        >
          Đăng xuất
        </button>
      </div>

      {/* PHẦN NỘI DUNG CHÍNH (LOGIC HIỂN THỊ) */}
      
      {/* Trường hợp 1: Đang mở trang Admin */}
      {showAdmin ? (
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      ) : 
      /* Trường hợp 2: Chưa bắt đầu game -> Hiện Form chọn đề */
      !gameStarted ? (
        <div className="card">
          <h1 style={{ background: "-webkit-linear-gradient(45deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🎓 Nền Tảng Thi Trắc Nghiệm
          </h1>
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

            <button type="submit" className="btn primary-btn" style={{ marginTop: "10px" }}>
              Bắt Đầu Làm Bài 🚀
            </button>
          </form>
        </div>
      ) : (
        /* Trường hợp 3: Đang chơi -> Hiện Quiz */
        <Quiz config={config} onRetry={() => setGameStarted(false)} />
      )}
    </div>
  );
}