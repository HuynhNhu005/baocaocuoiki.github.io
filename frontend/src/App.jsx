import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/AdminDashboard"; // <--- 1. IMPORT QUAN TRỌNG
import "./index.css";
import StudentDashboard from "./components/StudentDashboard";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [showAdmin, setShowAdmin] = useState(false); // <--- 2. STATE MỚI ĐỂ BẬT ADMIN
  const [viewMode, setViewMode] = useState('config');
  

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
    setViewMode('quiz');
  };
  const onQuizRetry = () => {
    setGameStarted(false);
    setViewMode('config'); // Quay lại Student Dashboard (tab cấu hình)
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
      {/* HEADER: HIỂN THỊ THÔNG TIN USER (Được đẩy lên Z-INDEX cao nhất) */}
      <div style={{ 
        position: "fixed", // Đổi từ 'absolute' sang 'fixed'
        top: "15px", 
        right: "20px", 
        color: "#1e293b", // Đổi màu chữ sang tối để nhìn rõ trên nền trắng
        zIndex: 1000,     // Tăng Z-index lên mức cao nhất
        display: "flex", 
        alignItems: "center", 
        gap: "15px",
        background: 'rgba(255,255,255,0.7)', // Thêm nền mờ để chữ không bị nhòe
        padding: '5px 10px',
        borderRadius: '8px',
        backdropFilter: 'blur(5px)' // Hiệu ứng mờ nền
      }}>
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

      {/* Trường hợp 1: Đang mở trang Admin */}
      {showAdmin ? (
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      ) : 
      /* Trường hợp 2: Đang làm bài thi */
      gameStarted ? (
        // Sử dụng hàm onQuizRetry mới (đã được định nghĩa trong App.jsx)
        <Quiz config={config} onRetry={onQuizRetry} /> 
      ) : (
        /* Trường hợp 3: Student Dashboard (Hiển thị các Tab Cấu hình, Lịch sử, Leaderboard) */
        // Chuyển toàn bộ form cũ vào component StudentDashboard
        <StudentDashboard 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            config={config} 
            setConfig={setConfig} 
            handleStart={handleStart} 
        />
      )}
      {/* KHÔNG CÓ DIV.CARD VÀ FORM CẤU HÌNH CŨ Ở ĐÂY NỮA */}
    </div>
  );
}