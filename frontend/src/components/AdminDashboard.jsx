import React, { useState, useEffect } from "react";
import "./Admin.css"; // Import file CSS mới

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({ users: 0, questions: 0, exams: 0 });
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // Null: đóng modal, {}: thêm mới, {data}: sửa
  const [selectedUserHistory, setSelectedUserHistory] = useState(null); // Modal lịch sử
  const [editingUser, setEditingUser] = useState(null); // Null, hoặc data user khi sửa

  const token = localStorage.getItem("access_token");

  // --- API CALLS ---
  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setter(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeTab === "stats") fetchData("stats", setStats);
    if (activeTab === "questions") fetchData("questions", setQuestions);
    if (activeTab === "users") fetchData("users", setUsers);
  }, [activeTab]);

  const fetchUserHistory = async (userId) => {
    const res = await fetch(`http://localhost:8000/api/admin/users/${userId}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setSelectedUserHistory(await res.json());
  };

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (!confirm("⚠️ Hành động này không thể hoàn tác! Bạn chắc chắn muốn xóa?")) return;
    await fetch(`http://localhost:8000/api/admin/questions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchData("questions", setQuestions);
  };
const handleDeleteUser = async (id, username) => {
    if (!confirm(`⚠️ Bạn chắc chắn muốn xóa tài khoản ${username}?`)) return;
    await fetch(`http://localhost:8000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData("users", setUsers); // Load lại bảng User
  };

const handleSaveUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
        id: editingUser.id,
        username: editingUser.username,
        full_name: form.full_name.value,
        role: form.role.value
    };

    const res = await fetch(`http://localhost:8000/api/admin/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert("✅ Cập nhật tài khoản thành công!");
        setEditingUser(null);
        fetchData("users", setUsers);
    } else { alert("❌ Lỗi khi cập nhật!"); }
};
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      title: form.title.value,
      category: form.category.value,
      difficulty: form.difficulty.value,
      choices: [form.choiceA.value, form.choiceB.value, form.choiceC.value, form.choiceD.value],
      answer: parseInt(form.answer.value),
      explanation: form.explanation.value
    };

    const url = editingQuestion.id 
      ? `http://localhost:8000/api/admin/questions/${editingQuestion.id}`
      : "http://localhost:8000/api/questions";
    const method = editingQuestion.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("✅ Lưu thành công!");
      setEditingQuestion(null);
      fetchData("questions", setQuestions);
    } else { alert("❌ Có lỗi xảy ra!"); }
  };

  // --- ICONS (SVG) ---
  const IconStats = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/></svg>;
  const IconQues = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
  const IconUser = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IconLogOut = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

  // --- RENDER ---
  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="brand">
          <span style={{fontSize:"1.8rem"}}>⚡</span> Quiz Admin
        </div>
        <button className={`nav-item ${activeTab==="stats"?"active":""}`} onClick={() => setActiveTab("stats")}>
          <IconStats /> Thống kê
        </button>
        <button className={`nav-item ${activeTab==="questions"?"active":""}`} onClick={() => setActiveTab("questions")}>
          <IconQues /> Ngân hàng câu hỏi
        </button>
        <button className={`nav-item ${activeTab==="users"?"active":""}`} onClick={() => setActiveTab("users")}>
          <IconUser /> Người dùng
        </button>
        <button className="nav-item logout" onClick={onBack}>
          <IconLogOut /> Thoát
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h2>{activeTab === 'stats' ? 'Tổng quan hệ thống' : activeTab === 'questions' ? 'Quản lý câu hỏi' : 'Danh sách người dùng'}</h2>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
             <div style={{width:"35px", height:"35px", borderRadius:"50%", background:"#cbd5e1", display:"flex", alignItems:"center", justifyContent:"center"}}>👤</div>
             <span>Admin</span>
          </div>
        </div>

    {activeTab === "stats" && (
  <div className="stats-grid">
    {/* Card 1: Users */}
    <div className="stat-card" style={{ borderLeft: "5px solid #0284c7" }}>
      {/* ... */}
      <div className="stat-info">
        <h3>{stats.users}</h3>
        <p>Tổng Người dùng</p>
      </div>
    </div>

    {/* Card 2: Questions */}
    <div className="stat-card" style={{ borderLeft: "5px solid #16a34a" }}>
      {/* ... */}
      <div className="stat-info">
        <h3>{stats.questions}</h3>
        <p>Tổng Câu hỏi</p>
      </div>
    </div>

    {/* Card 3: Exams */}
    <div className="stat-card" style={{ borderLeft: "5px solid #9333ea" }}>
      {/* ... */}
      <div className="stat-info">
        <h3>{stats.exams}</h3>
        <p>Tổng Lượt thi</p>
      </div>
    </div>
  </div>
)}
        {/* TAB: QUESTIONS */}
        {activeTab === "questions" && (
          <div className="table-card">
            <div className="table-header">
              <h3>Danh sách câu hỏi ({questions.length})</h3>
              <button className="btn-add" onClick={() => setEditingQuestion({})}>
                + Thêm câu hỏi mới
              </button>
            </div>
            <div style={{maxHeight: "65vh", overflowY: "auto"}}>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nội dung câu hỏi</th>
                    <th>Chủ đề</th>
                    <th>Độ khó</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.id}>
                      <td>#{q.id}</td>
                      <td style={{maxWidth:"400px"}}>{q.title}</td>
                      <td><span className={`badge ${q.category}`}>{q.category}</span></td>
                      <td>
                        <span style={{
                          color: q.difficulty==='easy'?'#16a34a': q.difficulty==='medium'?'#ca8a04':'#dc2626',
                          fontWeight: "bold", textTransform: "capitalize"
                        }}>{q.difficulty}</span>
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => setEditingQuestion(q)} title="Sửa">✏️</button>
                        <button className="action-btn delete" onClick={() => handleDelete(q.id)} title="Xóa">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === "users" && (
  <div className="table-card">
    <table className="modern-table">
      <thead><tr><th>ID</th><th>Tài khoản</th><th>Họ tên</th><th>Vai trò</th><th>Hành động</th></tr></thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>#{u.id}</td>
            <td style={{ fontWeight: "bold" }}>{u.username}</td>
            <td>{u.full_name}</td>
            <td><span className={`badge ${u.role}`}>{u.role}</span></td>
            <td>
              <button className="action-btn edit" onClick={() => setEditingUser(u)} title="Sửa">✏️</button>
              <button className="action-btn delete" onClick={() => handleDeleteUser(u.id, u.username)} title="Xóa">🗑️</button>
              <button className="btn-add" style={{padding:"5px 10px", fontSize:"0.8rem", marginLeft: "10px"}} onClick={() => fetchUserHistory(u.id)}>👁️ Lịch sử</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{editingUser && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2 style={{marginBottom:"20px"}}>👥 Sửa thông tin User: {editingUser.username}</h2>
            <form onSubmit={handleSaveUser}>
                <div className="form-group">
                    <label>Họ và tên:</label>
                    <input name="full_name" defaultValue={editingUser.full_name} required />
                </div>
                <div className="form-group">
                    <label>Vai trò (Role):</label>
                    <select name="role" defaultValue={editingUser.role}>
                        <option value="student">student</option>
                        <option value="admin">admin</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="action-btn" onClick={() => setEditingUser(null)} style={{fontSize:"1rem", fontWeight:"600"}}>Hủy</button>
                    <button type="submit" className="btn-add">Lưu</button>
                </div>
            </form>
        </div>
    </div>
)}
      </div>

      {/* MODAL: THÊM / SỬA CÂU HỎI */}
      {editingQuestion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom:"20px"}}>{editingQuestion.id ? "✏️ Chỉnh sửa câu hỏi" : "✨ Thêm câu hỏi mới"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Câu hỏi:</label>
                <textarea name="title" rows="2" defaultValue={editingQuestion.title} required></textarea>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px"}}>
                <div className="form-group">
                  <label>Chủ đề:</label>
                  <select name="category" defaultValue={editingQuestion.category || "IT"}>
                    <option value="IT">IT</option><option value="Math">Math</option><option value="Science">Science</option><option value="Geography">Geography</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Độ khó:</label>
                  <select name="difficulty" defaultValue={editingQuestion.difficulty || "easy"}>
                    <option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option>
                  </select>
                </div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                 {[0,1,2,3].map(i => (
                    <div className="form-group" key={i}>
                        <input name={i===0?"choiceA":i===1?"choiceB":i===2?"choiceC":"choiceD"} 
                               placeholder={`Đáp án ${String.fromCharCode(65+i)}`} 
                               defaultValue={editingQuestion.choices?.[i]} required />
                    </div>
                 ))}
              </div>
              <div className="form-group">
                 <label>Đáp án đúng (0=A, 1=B, 2=C, 3=D):</label>
                 <input type="number" name="answer" min="0" max="3" defaultValue={editingQuestion.answer || 0} required />
              </div>
              <div className="form-group">
                 <label>Giải thích (Optional):</label>
                 <input name="explanation" defaultValue={editingQuestion.explanation} placeholder="Tại sao đáp án này đúng?" />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="action-btn" onClick={() => setEditingQuestion(null)} style={{fontSize:"1rem", fontWeight:"600"}}>Hủy bỏ</button>
                <button type="submit" className="btn-add">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LỊCH SỬ THI */}
      {selectedUserHistory && (
        <div className="modal-overlay" onClick={() => setSelectedUserHistory(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>📜 Lịch sử thi đấu</h3>
              {selectedUserHistory.length === 0 ? <p style={{color:"#64748b", textAlign:"center", padding:"20px"}}>Chưa có dữ liệu thi.</p> : (
                 <table className="modern-table" style={{marginTop:"15px"}}>
                    <thead><tr><th>Ngày</th><th>Điểm</th><th>Kết quả</th></tr></thead>
                    <tbody>
                       {selectedUserHistory.map(h => (
                          <tr key={h.id}>
                             <td>{new Date(h.created_at).toLocaleString('vi-VN')}</td>
                             <td style={{fontWeight:"bold", color:h.score>=5?"#16a34a":"#dc2626"}}>{h.score}đ</td>
                             <td>{h.correct_answers}/{h.total_questions} câu</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              )}
              <div className="modal-actions">
                 <button className="btn-add" style={{background:"#64748b"}} onClick={() => setSelectedUserHistory(null)}>Đóng</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}