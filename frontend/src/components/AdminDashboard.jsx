import React, { useState, useEffect } from "react";

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("stats"); // stats, questions, users
  const [stats, setStats] = useState({ users: 0, questions: 0, exams: 0 });
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const token = localStorage.getItem("access_token");

  // --- API CALLS ---
  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch(e) { console.error(e); }
  };

  const fetchQuestions = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/questions", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setQuestions(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(await res.json());
  };

  const fetchUserHistory = async (userId) => {
    const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}/history`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setSelectedUserHistory(await res.json());
  };

  useEffect(() => {
    if (activeTab === "stats") fetchStats();
    if (activeTab === "questions") fetchQuestions();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  // --- HANDLERS ---
  const handleDeleteQuestion = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    await fetch(`http://127.0.0.1:8000/api/admin/questions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchQuestions();
  };

  const handleSaveQuestion = async (e) => {
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

    const url = editingQuestion?.id 
      ? `http://127.0.0.1:8000/api/admin/questions/${editingQuestion.id}`
      : "http://127.0.0.1:8000/api/questions";
    const method = editingQuestion?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Lưu thành công!");
      setEditingQuestion(null);
      fetchQuestions();
    } else {
      alert("Lỗi khi lưu!");
    }
  };

  // --- RENDER ---
  if (editingQuestion !== null) {
    const q = editingQuestion.id ? editingQuestion : { title: "", choices: ["","","",""], answer: 0, explanation: "" };
    return (
      <div className="card">
        <h2>{q.id ? "✏️ Sửa câu hỏi" : "➕ Thêm câu hỏi"}</h2>
        <form onSubmit={handleSaveQuestion} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input name="title" placeholder="Câu hỏi" defaultValue={q.title} required style={{padding: "10px"}}/>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
             <select name="category" defaultValue={q.category||"IT"} style={{padding:"10px"}}>
               <option value="IT">IT</option><option value="Math">Math</option><option value="Science">Science</option><option value="Geography">Geography</option>
             </select>
             <select name="difficulty" defaultValue={q.difficulty||"easy"} style={{padding:"10px"}}>
               <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
             </select>
          </div>
          {q.choices.map((c, i) => (
             <input key={i} name={i === 0 ? "choiceA" : i === 1 ? "choiceB" : i === 2 ? "choiceC" : "choiceD"} 
                    placeholder={`Đáp án ${String.fromCharCode(65+i)}`} defaultValue={c} required style={{padding:"8px"}} />
          ))}
          <label>Đáp án đúng (0=A, 1=B, 2=C, 3=D):</label>
          <input name="answer" type="number" min="0" max="3" defaultValue={q.answer} required style={{padding:"8px"}}/>
          <textarea name="explanation" placeholder="Giải thích" defaultValue={q.explanation} style={{padding:"10px"}}/>
          <div style={{display:"flex", gap:"10px"}}>
             <button type="submit" className="btn primary-btn">Lưu</button>
             <button type="button" className="btn secondary-btn" onClick={() => setEditingQuestion(null)}>Hủy</button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedUserHistory) {
    return (
      <div className="card">
        <h2>📜 Lịch sử thi</h2>
        <button onClick={() => setSelectedUserHistory(null)} className="btn secondary-btn" style={{marginBottom:"10px"}}>⬅ Quay lại</button>
        <table width="100%" border="1" cellPadding="8" style={{borderCollapse:"collapse"}}>
           <thead><tr style={{background:"#f3f4f6"}}><th>Ngày</th><th>Điểm</th><th>Đúng</th></tr></thead>
           <tbody>
             {selectedUserHistory.map(h => (
               <tr key={h.id}>
                 <td>{new Date(h.created_at).toLocaleString()}</td>
                 <td style={{color: h.score>=50?"green":"red", fontWeight:"bold"}}>{h.score.toFixed(1)}</td>
                 <td>{h.correct_answers}/{h.total_questions}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>⚙️ Admin Dashboard</h1>
        <button onClick={onBack} className="btn secondary-btn">Thoát</button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        <button onClick={() => setActiveTab("stats")} className={`btn ${activeTab==="stats"?"primary-btn":"secondary-btn"}`}>📊 Thống kê</button>
        <button onClick={() => setActiveTab("questions")} className={`btn ${activeTab==="questions"?"primary-btn":"secondary-btn"}`}>❓ Câu hỏi</button>
        <button onClick={() => setActiveTab("users")} className={`btn ${activeTab==="users"?"primary-btn":"secondary-btn"}`}>👥 Người dùng</button>
      </div>

      {activeTab === "stats" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", textAlign: "center" }}>
          <div style={{ padding: "20px", background: "#e0f2fe", borderRadius: "8px" }}><h3>Users</h3><h2 style={{color:"#0284c7"}}>{stats.users}</h2></div>
          <div style={{ padding: "20px", background: "#dcfce7", borderRadius: "8px" }}><h3>Questions</h3><h2 style={{color:"#16a34a"}}>{stats.questions}</h2></div>
          <div style={{ padding: "20px", background: "#fae8ff", borderRadius: "8px" }}><h3>Exams</h3><h2 style={{color:"#9333ea"}}>{stats.exams}</h2></div>
        </div>
      )}

      {activeTab === "questions" && (
        <div>
          <button className="btn primary-btn" style={{ marginBottom: "10px" }} onClick={() => setEditingQuestion({})}>+ Thêm mới</button>
          <div style={{maxHeight: "400px", overflowY: "auto"}}>
            <table width="100%" border="1" cellPadding="5" style={{borderCollapse: "collapse", borderColor: "#eee"}}>
                <thead><tr style={{background: "#f9fafb"}}><th>ID</th><th>Câu hỏi</th><th>Hành động</th></tr></thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.title}</td>
                            <td>
                                <button onClick={() => setEditingQuestion(q)} style={{marginRight:"10px"}}>✏️</button>
                                <button onClick={() => handleDeleteQuestion(q.id)} style={{color:"red"}}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <table width="100%" border="1" cellPadding="8" style={{borderCollapse: "collapse"}}>
            <thead><tr style={{background: "#f9fafb"}}><th>Username</th><th>Tên</th><th>Role</th><th>Hành động</th></tr></thead>
            <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.full_name}</td>
                        <td>{u.role}</td>
                        <td><button className="btn secondary-btn" onClick={() => fetchUserHistory(u.id)}>👁️ Lịch sử</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
      )}
    </div>
  );
}