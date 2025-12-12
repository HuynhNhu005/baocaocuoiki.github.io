import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard"; // Đã import đúng
import StudentDashboard from "./components/StudentDashboard";
import "./index.css";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [showAdmin, setShowAdmin] = useState(false);
  const [viewMode, setViewMode] = useState('config');
  const [email, setEmail] = useState("");

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
    const storedEmail = localStorage.getItem("email");
    
    if (!token) {
      // Nếu chưa đăng nhập, đá về trang login
      if (window.location.pathname !== "/login.html") {
         alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
         window.location.href = "/login.html";
      }
    } else {
      if (storedUser) setUsername(storedUser);
      if (storedRole) setRole(storedRole);
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    setGameStarted(true);
    setViewMode('quiz');
  };

  const onQuizRetry = () => {
    setGameStarted(false);
    setViewMode('config');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login.html";
  };

  const handleAdminAction = () => {
    setShowAdmin(true);
  };

  return (
    <div className="app-container">
      
      {/* HEADER: CHỈ HIỂN THỊ KHI KHÔNG PHẢI LÀ TEACHER (Vì Teacher có Sidebar riêng) */}
      {role !== 'teacher' && (
        <div style={{ 
          position: "fixed", 
          top: "15px", 
          right: "20px", 
          color: "#1e293b", 
          zIndex: 1000, 
          display: "flex", 
          alignItems: "center", 
          gap: "15px",
          background: 'rgba(255,255,255,0.7)',
          padding: '5px 15px',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>
          {username && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
              <span style={{ textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                Xin chào, <b>{username}</b> <small>({role})</small>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{email}</span>
            </div>
          )}
          
          {/* NÚT ADMIN: Chỉ hiện nếu role là 'admin' */}
          {role === 'admin' && !showAdmin && (
              <button 
                  onClick={handleAdminAction}
                  style={{ 
                    background: "linear-gradient(45deg, #f59e0b, #d97706)", 
                    color: "#fff", border: "none", padding: "6px 12px", borderRadius: "20px", 
                    cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
                  }}
              >
                  ⚙ Quản lý
              </button>
          )}

          <div style={{ width: "1px", height: "20px", background: "rgba(0,0,0,0.2)" }}></div>

          <button 
            onClick={handleLogout}
            style={{ background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer", textDecoration: "underline", fontWeight: "600" }}
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* --- PHẦN LOGIC HIỂN THỊ CHÍNH (ĐÃ SỬA) --- */}
      
      {/* Trường hợp 1: Admin đang bật chế độ Quản lý */}
      {role === 'admin' && showAdmin ? (
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      ) : 
      
      /* Trường hợp 2: Giáo viên -> Vào thẳng Teacher Dashboard */
      role === 'teacher' ? (
        <TeacherDashboard onLogout={handleLogout} />
      ) :

      /* Trường hợp 3: Sinh viên đang làm bài thi */
      gameStarted ? (
        <Quiz config={config} onRetry={onQuizRetry} /> 
      ) : (
        /* Trường hợp 4: Mặc định (Sinh viên Dashboard) */
        <StudentDashboard 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            config={config} 
            setConfig={setConfig} 
            handleStart={handleStart} 
        />
      )}
      
    </div>
  );
}