import React, { useState, useEffect } from "react";
import "./Admin.css"; 

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({ users: 0, questions: 0, exams: 0 });
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]); // <--- STATE MỚI: DANH SÁCH LỚP
  // STATE MỚI CHO QUẢN LÝ ĐỀ THI
  const [examClasses, setExamClasses] = useState([]); // Danh sách lớp kèm đề thi
  const [selectedClassExams, setSelectedClassExams] = useState(null); // Lớp đang xem đề
  const [viewingExamDetail, setViewingExamDetail] = useState(null); // Chi tiết đề thi đang xem

  // State cho Modal
  const [editingQuestion, setEditingQuestion] = useState(null); 
  const [editingUser, setEditingUser] = useState(null); 
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  
  // State cho Modal Lớp học
  const [isCreatingClass, setIsCreatingClass] = useState(false); // Modal tạo lớp
  const [selectedClass, setSelectedClass] = useState(null);      // Modal quản lý chi tiết lớp

  const token = localStorage.getItem("access_token");

  // --- 1. HÀM TẢI DỮ LIỆU THÔNG MINH ---
  const reloadData = async () => {
      // 1. Tải danh sách lớp
      const res = await fetch(`http://localhost:8000/api/admin/classes`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
          const newClasses = await res.json();
          setClasses(newClasses);
          // Cập nhật lại modal lớp nếu đang mở
          if (selectedClass) {
              const updatedClass = newClasses.find(c => c.id === selectedClass.id);
              if (updatedClass) setSelectedClass(updatedClass);
          }
      }
      
      // 2. Tải danh sách User
      const uRes = await fetch(`http://localhost:8000/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      if(uRes.ok) setUsers(await uRes.json());

      // 3. Tải danh sách Đề thi (MỚI THÊM)
      if (activeTab === "exam-manager") {
          const eRes = await fetch(`http://localhost:8000/api/admin/classes-with-exams`, { headers: { Authorization: `Bearer ${token}` } });
          if(eRes.ok) setExamClasses(await eRes.json());
      }
  };
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
    if (activeTab === "classes") {
        reloadData();
    }
    if (activeTab === "exam-manager") reloadData();
  }, [activeTab]);

  const fetchUserHistory = async (userId) => {
    const res = await fetch(`http://localhost:8000/api/admin/users/${userId}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setSelectedUserHistory(await res.json());
  };
// HÀM MỚI: XEM CHI TIẾT ĐỀ THI
  const handleViewExamDetail = async (examId) => {
    try {
        const res = await fetch(`http://localhost:8000/api/student/exams/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const processedQuestions = data.questions.map(q => ({
                ...q,
                choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
            }));
            setViewingExamDetail({ ...data.exam, questions: processedQuestions });
        } else {
            alert("Không tải được chi tiết đề!");
        }
    } catch (e) {
        alert("Lỗi kết nối!");
    }
  };
  // --- HANDLERS CƠ BẢN ---
  const handleDelete = async (id) => {
    if (!confirm("⚠️ Hành động này không thể hoàn tác! Bạn chắc chắn muốn xóa?")) return;
    await fetch(`http://localhost:8000/api/admin/questions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchData("questions", setQuestions);
  };

  const handleDeleteUser = async (id, username) => {
    if (!confirm(`⚠️ Bạn chắc chắn muốn xóa tài khoản ${username}?`)) return;
    await fetch(`http://localhost:8000/api/admin/users/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    fetchData("users", setUsers);
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
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    const url = editingQuestion.id ? `http://localhost:8000/api/admin/questions/${editingQuestion.id}` : "http://localhost:8000/api/questions";
    const method = editingQuestion.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("✅ Lưu thành công!");
      setEditingQuestion(null);
      fetchData("questions", setQuestions);
    } else { alert("❌ Có lỗi xảy ra!"); }
  };

  // --- HANDLERS LỚP HỌC (MỚI) ---
  const handleCreateClass = async (e) => {
    e.preventDefault();
    const payload = {
        name: e.target.name.value,
        code: e.target.code.value,
        description: e.target.description.value
    };
    const res = await fetch("http://localhost:8000/api/admin/classes", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
    if (res.ok) {
        alert("✅ Tạo lớp thành công!");
        setIsCreatingClass(false);
        fetchData("classes", setClasses);
    } else { alert("❌ Lỗi: Mã lớp có thể đã tồn tại!"); }
  };

  const handleAddStudentToClass = async (e) => {
      e.preventDefault();
      const studentUsername = e.target.student_username.value;
      const res = await fetch(`http://localhost:8000/api/admin/classes/${selectedClass.id}/students`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ student_username: studentUsername })
      });
      if (res.ok) {
          alert(`✅ Đã thêm ${studentUsername} vào lớp!`);
          e.target.reset();
          fetchData("classes", setClasses); // Cập nhật lại số lượng SV
      } else {
          const data = await res.json();
          alert("❌ " + data.detail);
      }
  };

  const handleAssignTeacher = async (teacherId) => {
      // Ép kiểu sang số nguyên để tránh lỗi Backend
      const tidInt = parseInt(teacherId);
      
      if (!tidInt) {
          alert("⚠️ Vui lòng chọn một giáo viên trong danh sách!");
          return;
      }

      const res = await fetch(`http://localhost:8000/api/admin/classes/${selectedClass.id}/assign_teacher`, {
          method: "POST", 
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ teacher_id: tidInt }) // Gửi số nguyên (VD: 5 thay vì "5")
      });

      if (res.ok) {
          alert("✅ Đã lưu Giáo viên chủ nhiệm thành công!");
          reloadData(); // Cập nhật lại giao diện ngay
      } else {
          const err = await res.json();
          alert("❌ Lỗi: " + (err.detail || "Không thể lưu giáo viên"));
      }
  };
  // --- 2. HÀM XỬ LÝ CHECKBOX THÔNG MINH (SỬA LỖI KHÔNG HIỆN TÍCH) ---
  const handleToggleStudent = async (student, isChecked) => {
      // A. Cập nhật giao diện NGAY LẬP TỨC (Optimistic Update)
      const currentStudents = selectedClass.students || [];
      let newStudents;
      
      if (isChecked) {
          newStudents = [...currentStudents, student]; // Thêm vào mảng tạm
      } else {
          newStudents = currentStudents.filter(s => s.id !== student.id); // Xóa khỏi mảng tạm
      }
      
      // Set state tạm để UI phản hồi ngay (hiện dấu tích liền)
      setSelectedClass({...selectedClass, students: newStudents});

      // B. Gọi API ngầm bên dưới
      if (isChecked) {
          await fetch(`http://localhost:8000/api/admin/classes/${selectedClass.id}/students`, {
              method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ student_username: student.username })
          });
      } else {
          await fetch(`http://localhost:8000/api/admin/classes/${selectedClass.id}/students/${student.id}`, {
              method: "DELETE", headers: { Authorization: `Bearer ${token}` }
          });
      }
      
      // C. Đồng bộ lại dữ liệu chuẩn từ Server để đảm bảo nhất quán
      reloadData();
  };

  // --- ICONS (SVG) ---
  const IconStats = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/></svg>;
  const IconQues = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
  const IconUser = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IconClass = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4"/></svg>;
  const IconLogOut = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

  // --- RENDER ---
  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="brand"><span style={{fontSize:"1.8rem"}}>⚡</span> Quiz Admin</div>
        <button className={`nav-item ${activeTab==="stats"?"active":""}`} onClick={() => setActiveTab("stats")}><IconStats /> Thống kê</button>
        <button className={`nav-item ${activeTab==="exam-manager"?"active":""}`} onClick={() => setActiveTab("exam-manager")}>📝 Quản lý Đề thi</button>
        <button className={`nav-item ${activeTab==="questions"?"active":""}`} onClick={() => setActiveTab("questions")}><IconQues /> Ngân hàng câu hỏi</button>
        <button className={`nav-item ${activeTab==="classes"?"active":""}`} onClick={() => setActiveTab("classes")}><IconClass /> Quản lý Lớp học</button> {/* <-- MỚI */}
        <button className={`nav-item ${activeTab==="users"?"active":""}`} onClick={() => setActiveTab("users")}><IconUser /> Người dùng</button>
        <button className="nav-item logout" onClick={onBack}><IconLogOut /> Thoát</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h2>{activeTab === 'stats' ? 'Tổng quan hệ thống' : activeTab === 'classes' ? 'Quản lý Lớp học' : 'Quản lý'}</h2>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
             <div style={{width:"35px", height:"35px", borderRadius:"50%", background:"#cbd5e1", display:"flex", alignItems:"center", justifyContent:"center"}}>👤</div>
             <span>Admin</span>
          </div>
        </div>

        {/* TAB: STATS (CLICK ĐỂ CHUYỂN TAB - GIAO DIỆN GỌN) */}
        {activeTab === "stats" && (
          <div className="stats-grid">
            
            {/* 1. Thẻ Người dùng */}
            <div 
                className="stat-card" 
                style={{ borderLeft: "5px solid #0284c7", cursor: "pointer", transition: "transform 0.2s" }} 
                onClick={() => setActiveTab("users")}
                title="Đến trang Quản lý người dùng"
            >
                <div className="stat-info"><h3>{stats.users}</h3><p>Người dùng</p></div>
            </div>

            {/* 2. Thẻ Câu hỏi */}
            <div 
                className="stat-card" 
                style={{ borderLeft: "5px solid #16a34a", cursor: "pointer", transition: "transform 0.2s" }} 
                onClick={() => setActiveTab("questions")}
                title="Đến trang Ngân hàng câu hỏi"
            >
                <div className="stat-info"><h3>{stats.questions}</h3><p>Câu hỏi</p></div>
            </div>
            {/* 3. Thẻ Lượt thi -> Dẫn sang trang Quản lý Đề thi mới */}
            <div 
                className="stat-card" 
                style={{ borderLeft: "5px solid #9333ea", cursor: "pointer", transition: "transform 0.2s" }} 
                onClick={() => setActiveTab("exam-manager")} 
                title="Bấm để xem danh sách đề thi"
            >
                <div className="stat-info">
                    <h3>{stats.exams}</h3>
                    <p>Đề thi (Quản lý)</p> {/* Đổi tên cho rõ nghĩa hơn */}
                </div>
                <small style={{color: "#9333ea", fontWeight: "bold", marginTop: "5px", display: "block"}}>Bấm để xem chi tiết ➝</small>
            </div>

            
        
          </div>
        )}

        {/* TAB: CLASSES (MỚI HOÀN TOÀN) */}
        {activeTab === "classes" && (
            <div className="table-card">
                <div className="table-header">
                    <h3>Danh sách Lớp học ({classes.length})</h3>
                    <button className="btn-add" onClick={() => setIsCreatingClass(true)}>+ Tạo lớp mới</button>
                </div>
                <table className="modern-table">
                    <thead><tr><th>Mã lớp</th><th>Tên lớp</th><th>GV Chủ nhiệm</th><th>Học sinh</th><th>Hành động</th></tr></thead>
                    <tbody>
                        {classes.map(c => (
                            <tr key={c.id}>
                                <td style={{fontWeight:"bold", color:"#6366f1"}}>{c.code}</td>
                                <td>{c.name}</td>
                                <td>
                                    {/* Tìm tên GV trong list users */}
                                    {c.teacher_id ? (
                                        <span className="badge admin" style={{background:"#e0f2fe", color:"#0369a1"}}>
                                            {users.find(u => u.id === c.teacher_id)?.full_name || `GV #${c.teacher_id}`}
                                        </span>
                                    ) : <span style={{color:"#94a3b8"}}>Chưa phân công</span>}
                                </td>
                                <td>{c.student_count || 0} SV</td>
                                <td>
                                    <button className="btn-history" onClick={() => setSelectedClass(c)}>⚙️ Quản lý</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* TAB: QUESTIONS */}
        {activeTab === "questions" && (
          <div className="table-card">
            <div className="table-header">
              <h3>Danh sách câu hỏi ({questions.length})</h3>
              <button className="btn-add" onClick={() => setEditingQuestion({})}>+ Thêm câu hỏi mới</button>
            </div>
            <div style={{maxHeight: "65vh", overflowY: "auto"}}>
              <table className="modern-table">
                <thead><tr><th>ID</th><th>Nội dung câu hỏi</th><th>Chủ đề</th><th>Độ khó</th><th>Hành động</th></tr></thead>
                <tbody>
                  {questions.map(q => (
                    <tr key={q.id}>
                      <td>#{q.id}</td>
                      <td style={{maxWidth:"400px"}}>{q.title}</td>
                      <td><span className={`badge ${q.category}`}>{q.category}</span></td>
                      <td><span style={{color: q.difficulty==='easy'?'#16a34a': q.difficulty==='medium'?'#ca8a04':'#dc2626', fontWeight: "bold", textTransform: "capitalize"}}>{q.difficulty}</span></td>
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
                    <td style={{fontWeight:"bold"}}>{u.username}</td>
                    <td>{u.full_name}</td>
                    <td><span className={`badge ${u.role === 'teacher' ? 'Geography' : u.role}`}>{u.role}</span></td>
                    <td>
                      <div className="action-container">
                        <button className="action-btn edit" onClick={() => setEditingUser(u)} title="Sửa">✏️</button>
                        <button className="action-btn delete" onClick={() => handleDeleteUser(u.id, u.username)} title="Xóa">🗑️</button>
                        <button className="btn-history" onClick={() => fetchUserHistory(u.id)}>👁️ Xem Lịch sử</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* --- BỔ SUNG: TAB QUẢN LÝ ĐỀ THI (EXAM MANAGER) --- */}
        {activeTab === "exam-manager" && (
          <div className="table-card">
            <div className="table-header">
              <h3>Danh sách Lớp & Đề thi ({examClasses.length})</h3>
            </div>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Mã lớp</th>
                  <th>Tên lớp</th>
                  <th>Số lượng đề</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {examClasses.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: "bold", color: "#6366f1" }}>{c.code}</td>
                    <td>{c.name}</td>
                    <td>
                      {c.exams && c.exams.length > 0 ? (
                        <span className="badge" style={{ background: "#dcfce7", color: "#166534" }}>
                          {c.exams.length} đề thi
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>Chưa có đề</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn-history" 
                        onClick={() => setSelectedClassExams(c)}
                      >
                        📂 Quản lý Đề thi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CÁC MODAL --- */}

      {/* MODAL: TẠO LỚP HỌC */}
      {isCreatingClass && (
          <div className="modal-overlay">
              <div className="modal-content">
                  <h3>🏫 Tạo lớp học mới</h3>
                  <form onSubmit={handleCreateClass}>
                      <div className="form-group"><label>Mã lớp (VD: IT01):</label><input name="code" required /></div>
                      <div className="form-group"><label>Tên lớp:</label><input name="name" required /></div>
                      <div className="form-group"><label>Mô tả:</label><input name="description" /></div>
                      <div className="modal-actions">
                          <button type="button" className="action-btn" onClick={() => setIsCreatingClass(false)}>Hủy</button>
                          <button type="submit" className="btn-add">Tạo lớp</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* MODAL: QUẢN LÝ LỚP (CẬP NHẬT: CHECKBOX LIST) */}
      {selectedClass && (
          <div className="modal-overlay">
              <div className="modal-content" style={{width:"700px"}}>
                  <h3 style={{marginBottom:"20px"}}>⚙️ Quản lý lớp: {selectedClass.name}</h3>
                  
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>
                      {/* Cột Trái: Chọn Giáo Viên */}
                      <div style={{background:"#f8fafc", padding:"15px", borderRadius:"8px", height:"fit-content"}}>
                          <h4>👨‍🏫 Giáo viên chủ nhiệm</h4>
                          <div style={{display:"flex", flexDirection:"column", gap:"10px", marginTop:"10px"}}>
                              <select 
    id="teacherSelect" 
    value={selectedClass.teacher_id || ""} 
    onChange={(e) => setSelectedClass({...selectedClass, teacher_id: parseInt(e.target.value)})}
    style={{padding:"10px", borderRadius:"6px", border:"1px solid #ccc"}}
>
    <option value="">-- Chưa phân công --</option>
    {users.filter(u => u.role === 'teacher').map(t => (
        <option key={t.id} value={t.id}>{t.full_name} ({t.username})</option>
    ))}
</select>
                              <button className="btn-add" onClick={() => {
    // Lấy giá trị trực tiếp từ state selectedClass để chính xác nhất
    if (selectedClass.teacher_id) {
        handleAssignTeacher(selectedClass.teacher_id);
    } else {
        alert("Vui lòng chọn giáo viên trước khi lưu!");
    }
}}>💾 Lưu Giáo viên</button>
                          </div>
                      </div>

                      {/* Cột Phải: Danh sách Sinh viên (Checkbox) */}
                      <div style={{background:"#f8fafc", padding:"15px", borderRadius:"8px", maxHeight:"400px", display:"flex", flexDirection:"column"}}>
                          <h4>🎓 Danh sách Sinh viên</h4>
                          <p style={{fontSize:"0.8rem", color:"#64748b", marginBottom:"10px"}}>Tích chọn để thêm vào lớp:</p>
                          
                          <div style={{overflowY:"auto", flex:1, border:"1px solid #e2e8f0", borderRadius:"6px", background:"#fff"}}>
                              {users.filter(u => u.role === 'student').map(st => {
                                  // Kiểm tra xem sinh viên này đã có trong lớp chưa
                                  const isEnrolled = selectedClass.students && selectedClass.students.some(s => s.id === st.id);
                                  
                                  return (
                                      <div key={st.id} style={{
                                          padding:"10px", borderBottom:"1px solid #f1f5f9", 
                                          display:"flex", alignItems:"center", gap:"10px",
                                          background: isEnrolled ? "#f0fdf4" : "transparent"
                                      }}>
                                          <input 
    type="checkbox" 
    checked={isEnrolled || false}
    style={{width:"18px", height:"18px", cursor:"pointer"}}
    onChange={(e) => handleToggleStudent(st, e.target.checked)} 
/>
                                          <div>
                                              <div style={{fontWeight:"600"}}>{st.full_name || st.username}</div>
                                              <div style={{fontSize:"0.8rem", color:"#94a3b8"}}>@{st.username}</div>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </div>

                  <div className="modal-actions" style={{marginTop:"20px"}}>
                      <button type="button" className="action-btn" onClick={() => setSelectedClass(null)}>Đóng & Hoàn tất</button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL: SỬA USER (CẬP NHẬT ROLE TEACHER) */}
      {editingUser && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 style={{marginBottom:"20px"}}>👥 Sửa User: {editingUser.username}</h2>
                <form onSubmit={handleSaveUser}>
                    <div className="form-group"><label>Họ và tên:</label><input name="full_name" defaultValue={editingUser.full_name} required /></div>
                    <div className="form-group">
                        <label>Vai trò (Role):</label>
                        <select name="role" defaultValue={editingUser.role}>
                            <option value="student">Student (Học sinh)</option>
                            <option value="teacher">Teacher (Giáo viên)</option> {/* <--- ROLE MỚI */}
                            <option value="admin">Admin (Quản trị)</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="action-btn" onClick={() => setEditingUser(null)}>Hủy</button>
                        <button type="submit" className="btn-add">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL: QUESTION & HISTORY (GIỮ NGUYÊN) */}
      {editingQuestion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom:"20px"}}>{editingQuestion.id ? "✏️ Sửa câu hỏi" : "✨ Thêm câu hỏi"}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Câu hỏi:</label><textarea name="title" rows="2" defaultValue={editingQuestion.title} required></textarea></div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px"}}>
                <div className="form-group"><label>Chủ đề:</label><select name="category" defaultValue={editingQuestion.category || "IT"}><option value="IT">IT</option><option value="Math">Math</option><option value="Science">Science</option><option value="Geography">Geography</option></select></div>
                <div className="form-group"><label>Độ khó:</label><select name="difficulty" defaultValue={editingQuestion.difficulty || "easy"}><option value="easy">Dễ</option><option value="medium">TB</option><option value="hard">Khó</option></select></div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                 {[0,1,2,3].map(i => <div className="form-group" key={i}><input name={i===0?"choiceA":i===1?"choiceB":i===2?"choiceC":"choiceD"} placeholder={`Đáp án ${String.fromCharCode(65+i)}`} defaultValue={editingQuestion.choices?.[i]} required /></div>)}
              </div>
              <div className="form-group"><label>Đáp án đúng (0-3):</label><input type="number" name="answer" min="0" max="3" defaultValue={editingQuestion.answer || 0} required /></div>
              <div className="form-group"><label>Giải thích:</label><input name="explanation" defaultValue={editingQuestion.explanation} /></div>
              <div className="modal-actions"><button type="button" className="action-btn" onClick={() => setEditingQuestion(null)}>Hủy</button><button type="submit" className="btn-add">Lưu</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedUserHistory && (
        <div className="modal-overlay" onClick={() => setSelectedUserHistory(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>📜 Lịch sử thi</h3>
              {selectedUserHistory.length === 0 ? <p>Chưa có dữ liệu.</p> : (
                 <table className="modern-table" style={{marginTop:"15px"}}>
                    <thead><tr><th>Ngày</th><th>Điểm</th><th>KQ</th></tr></thead>
                    <tbody>{selectedUserHistory.map(h => <tr key={h.id}><td>{new Date(h.created_at).toLocaleString('vi-VN')}</td><td style={{fontWeight:"bold", color:h.score>=5?"#16a34a":"#dc2626"}}>{h.score}đ</td><td>{h.correct_answers} câu</td></tr>)}</tbody>
                 </table>
              )}
              <div className="modal-actions"><button className="btn-add" style={{background:"#64748b"}} onClick={() => setSelectedUserHistory(null)}>Đóng</button></div>
           </div>
        </div>
      )}
      {/* 1. MODAL XEM DANH SÁCH ĐỀ THI CỦA LỚP */}
      {selectedClassExams && (
          <div className="modal-overlay" onClick={() => setSelectedClassExams(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <h3>📝 Đề thi lớp: {selectedClassExams.name}</h3>
                  {selectedClassExams.exams.length === 0 ? (
                      <p style={{padding:"20px", textAlign:"center", color:"#64748b"}}>Lớp này chưa có đề thi nào.</p>
                  ) : (
                      <table className="modern-table" style={{marginTop:"15px"}}>
                          <thead><tr><th>ID</th><th>Tên bài thi</th><th>Thời gian</th><th>Ngày tạo</th><th>Chi tiết</th></tr></thead>
                          <tbody>
                              {selectedClassExams.exams.map(ex => (
                                  <tr key={ex.id}>
                                      <td>#{ex.id}</td>
                                      <td style={{fontWeight:"bold", color:"#2563eb"}}>{ex.title}</td>
                                      <td>{ex.duration} phút</td>
                                      <td>{new Date(ex.created_at).toLocaleString('vi-VN')}</td>
                                      <td>
                                          <button className="btn-history" onClick={() => handleViewExamDetail(ex.id)}>👁️ Xem chi tiết</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  )}
                  <div className="modal-actions"><button className="action-btn" onClick={() => setSelectedClassExams(null)}>Đóng</button></div>
              </div>
          </div>
      )}

      {/* 2. MODAL XEM CHI TIẾT NỘI DUNG CÂU HỎI */}
      {viewingExamDetail && (
          <div className="modal-overlay" style={{zIndex: 1100}} onClick={() => setViewingExamDetail(null)}>
              <div className="modal-content" style={{maxWidth:"900px"}} onClick={e => e.stopPropagation()}>
                  <h3 style={{borderBottom:"1px solid #eee", paddingBottom:"10px"}}>📄 Nội dung đề: {viewingExamDetail.title}</h3>
                  <div style={{maxHeight:"60vh", overflowY:"auto"}}>
                      {viewingExamDetail.questions.map((q, idx) => (
                          <div key={idx} style={{background:"#f8fafc", padding:"15px", marginBottom:"15px", borderRadius:"8px", border:"1px solid #e2e8f0"}}>
                              <div style={{fontWeight:"bold", marginBottom:"10px"}}>Câu {idx+1}: {q.title}</div>
                              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                                  {q.choices.map((c, cIdx) => (
                                      <div key={cIdx} style={{
                                          padding:"8px", borderRadius:"6px", border:"1px solid #cbd5e1",
                                          background: cIdx === q.answer ? "#dcfce7" : "#fff",
                                          color: cIdx === q.answer ? "#166534" : "#334155",
                                          fontWeight: cIdx === q.answer ? "bold" : "normal"
                                      }}>
                                          {String.fromCharCode(65+cIdx)}. {c} {cIdx === q.answer && "✅"}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="modal-actions"><button className="action-btn" onClick={() => setViewingExamDetail(null)}>Đóng</button></div>
              </div>
          </div>
      )}
    </div>
    
  );
}