import React, { useState, useEffect } from "react";
import "./Admin.css"; // Tận dụng lại CSS của Admin cho đẹp

export default function TeacherDashboard({ onLogout }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // Khi bấm vào xem chi tiết lớp
  const [activeTab, setActiveTab] = useState("my-classes");

  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  // --- TẢI DỮ LIỆU ---
  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/teacher/my-classes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error);
    }
  };

  // --- ICONS ---
  const IconClass = () => <span>🏫</span>;
  const IconExam = () => <span>📝</span>;
  const IconLogOut = () => <span>🚪</span>;

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar" style={{ background: "#1e293b" }}>
        <div className="brand" style={{ color: "#fbbf24" }}>🎓 Teacher Pro</div>
        
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
          <div style={{ width: "60px", height: "60px", background: "#fbbf24", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
            👨‍🏫
          </div>
          <p style={{ color: "#fff", marginTop: "10px", fontWeight: "bold" }}>{username}</p>
          <span className="badge admin" style={{ background: "#fbbf24", color: "#000" }}>Giáo viên</span>
        </div>

        <button className={`nav-item ${activeTab === "my-classes" ? "active" : ""}`} onClick={() => {setActiveTab("my-classes"); setSelectedClass(null);}}>
          <IconClass /> Lớp chủ nhiệm
        </button>
        
        {/* Tính năng tương lai */}
        <button className="nav-item" onClick={() => alert("Tính năng đang phát triển: Tạo đề thi cho lớp!")}>
          <IconExam /> Ra đề thi (Sắp có)
        </button>

        <button className="nav-item logout" onClick={onLogout}>
          <IconLogOut /> Đăng xuất
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h2>{selectedClass ? `Chi tiết lớp: ${selectedClass.name}` : "Danh sách lớp giảng dạy"}</h2>
        </div>

        {/* DANH SÁCH LỚP */}
        {!selectedClass && (
          <div className="stats-grid">
            {classes.length === 0 ? (
              <p style={{ color: "#64748b" }}>Bạn chưa được phân công lớp nào. Vui lòng liên hệ Admin.</p>
            ) : (
              classes.map((c) => (
                <div key={c.id} className="stat-card" style={{ borderLeft: "5px solid #fbbf24", cursor: "pointer", transition: "transform 0.2s" }} 
                     onClick={() => setSelectedClass(c)}
                     onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                     onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div className="stat-info">
                    <h3 style={{ fontSize: "1.2rem", color: "#1e293b" }}>{c.code}</h3>
                    <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{c.name}</p>
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px", color: "#64748b" }}>
                      👥 <strong>{c.student_count}</strong> Sinh viên
                    </div>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <button className="btn-add" style={{ width: "100%", background: "#fbbf24", color: "#000" }}>👉 Vào lớp</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CHI TIẾT LỚP HỌC (KHI BẤM VÀO 1 LỚP) */}
        {selectedClass && (
          <div>
            <button className="action-btn" style={{ marginBottom: "20px", padding: "8px 15px" }} onClick={() => setSelectedClass(null)}>⬅ Quay lại</button>
            
            <div className="table-card">
              <div className="table-header">
                <h3>Danh sách sinh viên lớp {selectedClass.code}</h3>
                <button className="btn-add" style={{ background: "#10b981" }} onClick={()=>alert("Tính năng: Xem bảng điểm cả lớp (Sắp có)")}>📊 Xem Bảng Điểm</button>
              </div>
              
              {selectedClass.students && selectedClass.students.length > 0 ? (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tài khoản</th>
                      <th>Họ và tên</th>
                      <th>Liên lạc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((st) => (
                      <tr key={st.id}>
                        <td>#{st.id}</td>
                        <td style={{ fontWeight: "bold" }}>{st.username}</td>
                        <td>{st.full_name || "Chưa cập nhật"}</td>
                        <td>{st.email || st.phone_number || "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>Lớp chưa có sinh viên nào.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}