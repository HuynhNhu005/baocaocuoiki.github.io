import React, { useState, useEffect } from "react";
import "./Admin.css"; 

export default function TeacherDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("my-classes");
  const [classes, setClasses] = useState([]);
  const [questions, setQuestions] = useState([]); 
  const [examHistory, setExamHistory] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); 
  
  // STATE CÁC TÍNH NĂNG
  const [gradebook, setGradebook] = useState(null); 
  const [showGradebook, setShowGradebook] = useState(false); 
  
  // STATE TẠO ĐỀ THI
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]); // Lưu ID các câu hỏi được chọn

  // STATE TẠO CÂU HỎI
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false); 
  const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);

  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  // --- TẢI DỮ LIỆU ---
  useEffect(() => {
    fetchMyClasses();
    fetchQuestions(); // Tải câu hỏi luôn để dùng cho việc tạo đề
  }, []);

  const fetchMyClasses = async () => {
    try {
        const res = await fetch("http://localhost:8000/api/teacher/my-classes", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setClasses(await res.json());
    } catch(e) {}
  };

  const fetchQuestions = async () => {
    try {
       
        const res = await fetch("http://localhost:8000/api/admin/questions", { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        
        if (res.ok) setQuestions(await res.json());
    } catch(e) {}
  };
  const fetchExamHistory = async () => {
    try {
        const res = await fetch("http://localhost:8000/api/teacher/exams-history", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setExamHistory(await res.json());
    } catch(e) {}
  };

  // --- 1. XỬ LÝ TẠO CÂU HỎI (Hỗ trợ tạo lồng trong tạo đề) ---
  const handleCreateQuestion = async (e) => {
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
      
      const res = await fetch("http://localhost:8000/api/questions", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
      });

      if (res.ok) {
          const newQuestion = await res.json();
          alert("✅ Tạo câu hỏi thành công!");
          
          // Cập nhật lại danh sách câu hỏi ngay lập tức
          const updatedQuestions = [...questions, newQuestion];
          setQuestions(updatedQuestions);
          
          // Nếu đang mở form tạo đề thi -> Tự động tích chọn câu hỏi vừa tạo
          if (showCreateExam) {
              setSelectedQuestionIds(prev => [...prev, newQuestion.id]);
          }

          setIsCreatingQuestion(false); // Đóng modal tạo câu hỏi
      } else {
          alert("❌ Lỗi khi thêm câu hỏi!");
      }
  };

  // --- 2. XỬ LÝ TẠO ĐỀ THI (Logic chọn câu hỏi) ---
  const handleToggleQuestion = (qId) => {
      setSelectedQuestionIds(prev => 
          prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
      );
  };

  const handleCreateExam = async (e) => {
      e.preventDefault();
      if (selectedQuestionIds.length === 0) { alert("⚠️ Chọn ít nhất 1 câu hỏi!"); return; }
      const form = e.target;
      const payload = {
          class_id: selectedClass.id,
          title: form.title.value,
          duration: parseInt(form.duration.value),
          question_count: selectedQuestionIds.length,
          question_ids: selectedQuestionIds,
          max_attempts: parseInt(form.max_attempts.value) // Lấy từ form
      };
      const res = await fetch("http://localhost:8000/api/teacher/exams", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
      });
      if (res.ok) {
          alert(`✅ Đã giao bài "${payload.title}" (Tối đa ${payload.max_attempts} lần làm)!`);
          setShowCreateExam(false); setSelectedQuestionIds([]);
      }
  };
  // --- CÁC TÍNH NĂNG KHÁC ---
  const handleViewGradebook = async () => {
      if (!selectedClass) return;
      try {
          const res = await fetch(`http://localhost:8000/api/teacher/classes/${selectedClass.id}/gradebook`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              setGradebook(await res.json());
              setShowGradebook(true);
          } else {
              // Báo lỗi cụ thể nếu Server từ chối
              const err = await res.json();
              alert("❌ Lỗi tải bảng điểm: " + (err.detail || "Server chưa phản hồi"));
          }
      } catch (error) {
          console.error(error);
          alert("❌ Lỗi kết nối Server! Bạn đã bật Backend chưa?");
      }
  };

  const handlePrintGradebook = () => {
      const printContent = document.getElementById("gradebook-table").outerHTML;
      const win = window.open("", "", "height=700,width=900");
      win.document.write(`<html><head><title>Bảng điểm lớp ${selectedClass.name}</title>`);
      win.document.write('<style>table {width: 100%; border-collapse: collapse; font-family: sans-serif;} th, td {border: 1px solid #000; padding: 10px; text-align: left;} th {background: #f0f0f0;}</style>');
      win.document.write('</head><body>');
      win.document.write(`<h2 style="text-align:center;">DANH SÁCH BẢNG ĐIỂM</h2>`);
      win.document.write(`<h3>Lớp: ${selectedClass.name} - Mã: ${selectedClass.code}</h3>`);
      win.document.write(printContent);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
  };

  const fetchStudentHistory = async (studentId) => {
      try {
          const res = await fetch(`http://localhost:8000/api/admin/users/${studentId}/history`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              setSelectedStudentHistory(await res.json());
          } else {
              alert("❌ Bạn chưa được cấp quyền xem lịch sử học sinh này!");
          }
      } catch (error) {
          alert("❌ Lỗi kết nối!");
      }
  };

  // --- RENDER ---
  const IconClass = () => <span>🏫</span>; const IconQues = () => <span>❓</span>;const IconHistory = () => <span>📜</span>; const IconLogOut = () => <span>🚪</span>;

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar" style={{ background: "#1e293b" }}>
        <div className="brand" style={{ color: "#fbbf24" }}>🎓 Teacher Pro</div>
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
          <div style={{ width: "60px", height: "60px", background: "#fbbf24", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>👨‍🏫</div>
          <p style={{ color: "#fff", marginTop: "10px", fontWeight: "bold" }}>{username}</p>
        </div>
        <button className={`nav-item ${activeTab === "my-classes" ? "active" : ""}`} onClick={() => {setActiveTab("my-classes"); setSelectedClass(null);}}><IconClass /> Lớp chủ nhiệm</button>
        <button className={`nav-item ${activeTab === "questions" ? "active" : ""}`} onClick={() => setActiveTab("questions")}><IconQues /> Ngân hàng câu hỏi</button>
        <button className={`nav-item ${activeTab === "exam-history" ? "active" : ""}`} onClick={() => setActiveTab("exam-history")}><IconHistory /> Lịch sử giao bài</button>
        <button className="nav-item logout" onClick={onLogout}><IconLogOut /> Đăng xuất</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h2>{activeTab === 'questions' ? "Ngân hàng câu hỏi" : activeTab === 'exam-history' ? "Lịch sử đề thi đã giao" : selectedClass ? `Lớp: ${selectedClass.name}` : "Danh sách lớp"}</h2>
        </div>

        {/* TAB DANH SÁCH LỚP */}
        {activeTab === 'my-classes' && !selectedClass && (
          <div className="stats-grid">
            {classes.length === 0 ? <p style={{color:"#64748b"}}>Chưa có lớp.</p> : classes.map(c => (
                <div key={c.id} className="stat-card" style={{ borderLeft: "5px solid #fbbf24", cursor: "pointer" }} onClick={() => setSelectedClass(c)}>
                  <div className="stat-info"><h3>{c.code}</h3><p>{c.name}</p><div style={{marginTop:"10px"}}>👥 <strong>{c.student_count}</strong> SV</div></div>
                  <button className="btn-add" style={{ marginTop: "15px", width: "100%", background: "#fbbf24", color: "#000" }}>👉 Vào lớp</button>
                </div>
            ))}
          </div>
        )}

        {/* TAB NGÂN HÀNG CÂU HỎI */}
        {activeTab === 'questions' && (
            <div className="table-card">
                <div className="table-header"><h3>Kho câu hỏi ({questions.length})</h3><button className="btn-add" onClick={() => setIsCreatingQuestion(true)}>+ Tạo câu hỏi mới</button></div>
                <div style={{maxHeight:"65vh", overflowY:"auto"}}>
                    <table className="modern-table">
                        <thead><tr><th>ID</th><th>Nội dung</th><th>Chủ đề</th><th>Độ khó</th></tr></thead>
                        <tbody>
                            {questions.length === 0 ? <tr><td colSpan="4" style={{textAlign:"center"}}>Ngân hàng trống. Hãy tạo câu hỏi mới!</td></tr> :
                            questions.map(q => (<tr key={q.id}><td>#{q.id}</td><td style={{maxWidth:"400px"}}>{q.title}</td><td><span className={`badge ${q.category}`}>{q.category}</span></td><td>{q.difficulty}</td></tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        {/* 👇 TAB 3: LỊCH SỬ GIAO BÀI (MỚI) */}
        {activeTab === 'exam-history' && (
            <div className="table-card">
                <div className="table-header"><h3>Danh sách bài thi đã tạo</h3></div>
                <table className="modern-table">
                    <thead><tr><th>Tên bài thi</th><th>Lớp</th><th>Thời gian</th><th>Số lượt cho phép</th><th>Ngày tạo</th></tr></thead>
                    <tbody>
                        {examHistory.length === 0 ? <tr><td colSpan="5" style={{textAlign:"center"}}>Chưa có bài thi nào.</td></tr> :
                        examHistory.map(ex => (
                            <tr key={ex.id}>
                                <td style={{fontWeight:"bold", color:"#2563eb"}}>{ex.title}</td>
                                <td>{ex.class_name}</td>
                                <td>{ex.duration} phút</td>
                                <td><span style={{background:"#dcfce7", color:"#166534", padding:"4px 8px", borderRadius:"4px"}}>{ex.max_attempts} lần</span></td>
                                <td>{new Date(ex.created_at).toLocaleString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* CHI TIẾT LỚP HỌC (Giữ nguyên, chỉ sửa nút Ra đề để mở modal mới) */}
        {selectedClass && (
          <div>
            <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
                <button className="action-btn" onClick={() => setSelectedClass(null)}>⬅ Quay lại</button>
                <button className="btn-add" style={{background: "#f59e0b"}} onClick={() => {setShowCreateExam(true); fetchQuestions();}}>📝 Ra Đề Thi Mới</button>
            </div>
            
            <div className="table-card">
              <div className="table-header"><h3>Danh sách sinh viên</h3><button className="btn-add" style={{ background: "#10b981" }} onClick={handleViewGradebook}>📊 Bảng Điểm & In</button></div>
              <table className="modern-table">
                  <thead><tr><th>ID</th><th>Tài khoản</th><th>Họ tên</th><th>Hành động</th></tr></thead>
                  <tbody>
                    {selectedClass.students?.map((st) => (
                      <tr key={st.id}><td>#{st.id}</td><td style={{ fontWeight: "bold" }}>{st.username}</td><td>{st.full_name || "--"}</td><td><button className="btn-history" onClick={() => fetchStudentHistory(st.id)}>👁️ Xem bài làm</button></td></tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL 1: TẠO ĐỀ THI (CÓ CHỌN CÂU HỎI & NÚT TẠO NHANH) --- */}
      {showCreateExam && (
          <div className="modal-overlay">
              <div className="modal-content" >
                  <h3>📝 Soạn đề thi cho lớp {selectedClass.code}</h3>
                  <form onSubmit={handleCreateExam} style={{display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", marginTop: "15px"}}>
                      
                      {/* Cột Trái: Thông tin đề */}
                      <div style={{background: "#f8fafc", padding: "15px", borderRadius: "8px", height: "fit-content"}}>
                          <h4>ℹ️ Thông tin chung</h4>
                          <div className="form-group"><label>Tên bài thi:</label><input name="title" required placeholder="VD: Kiểm tra 1 tiết" /></div>
                          <div className="form-group"><label>Thời gian (phút):</label><input type="number" name="duration" defaultValue={45} /></div>
                          {/* 👇 INPUT MỚI: SỐ LẦN LÀM BÀI */}
                          <div className="form-group">
                              <label>Số lần được làm:</label>
                              <select name="max_attempts" style={{width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc"}}>
                                  <option value="1">1 lần (Kiểm tra)</option>
                                  <option value="2">2 lần</option>
                                  <option value="3">3 lần</option>
                                  <option value="99">Không giới hạn (Luyện tập)</option>
                              </select>
                          </div>
                          <div className="form-group"><label>Đã chọn:</label><div style={{fontSize: "1.2rem", fontWeight: "bold", color: "#f59e0b"}}>{selectedQuestionIds.length} câu</div></div>
                          <button type="submit" className="btn-add" style={{width: "100%", marginTop: "10px", background: "#f59e0b"}}>🚀 Giao bài ngay</button>
                          <button type="button" className="action-btn" style={{width: "100%", marginTop: "10px"}} onClick={() => setShowCreateExam(false)}>Hủy bỏ</button>
                      </div>
                      

                      {/* Cột Phải: Chọn câu hỏi */}
                      <div style={{display: "flex", flexDirection: "column", height: "500px"}}>
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                              <h4>📚 Chọn câu hỏi</h4>
                              {/* NÚT TẠO CÂU HỎI NGAY TRONG MODAL */}
                              <button type="button" className="btn-add" style={{fontSize: "0.8rem", padding: "5px 10px"}} onClick={() => setIsCreatingQuestion(true)}>+ Soạn câu hỏi mới</button>
                          </div>
                          
                          <div className="question-list-container" style={{flex: 1, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff"}}>
                              {questions.length === 0 ? <p style={{padding: "20px", textAlign: "center", color: "#999"}}>Kho câu hỏi trống.</p> : 
                              questions.map(q => (
                                  <div key={q.id} style={{padding: "10px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px", background: selectedQuestionIds.includes(q.id) ? "#fffbeb" : "transparent"}}>
                                      <input type="checkbox" checked={selectedQuestionIds.includes(q.id)} onChange={() => handleToggleQuestion(q.id)} style={{cursor: "pointer", width: "18px", height: "18px", marginTop: "3px"}} />
                                      <div>
                                          <div style={{fontWeight: "500"}}>{q.title}</div>
                                          <div style={{fontSize: "0.8rem", color: "#64748b"}}><span className={`badge ${q.category}`}>{q.category}</span> • {q.difficulty}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- MODAL 2: TẠO CÂU HỎI MỚI (LEVEL 2 - NẰM TRÊN CÙNG) --- */}
      {isCreatingQuestion && (
          <div className="modal-overlay-level-2"> {/* Class mới cho modal tầng trên */}
              <div className="modal-content" >
                  <h3 style={{color: "#2563eb"}}>✨ Soạn câu hỏi mới</h3>
                  <form onSubmit={handleCreateQuestion}>
                      <div className="form-group"><label>Nội dung câu hỏi:</label><textarea name="title" rows="3" required placeholder="Nhập nội dung câu hỏi..." style={{width: "100%", padding: "10px"}}/></div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px"}}>
                          <div className="form-group"><label>Chủ đề:</label><select name="category"><option value="IT">IT</option><option value="Math">Math</option><option value="General">General</option></select></div>
                          <div className="form-group"><label>Độ khó:</label><select name="difficulty"><option value="easy">Dễ</option><option value="medium">TB</option><option value="hard">Khó</option></select></div>
                      </div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                          {[0,1,2,3].map(i => <input key={i} name={i===0?"choiceA":i===1?"choiceB":i===2?"choiceC":"choiceD"} placeholder={`Đáp án ${String.fromCharCode(65+i)}`} required />)}
                      </div>
                      <div className="form-group"><label>Đáp án đúng (0-3):</label><input type="number" name="answer" min="0" max="3" required /></div>
                      <div className="modal-actions"><button type="button" className="action-btn" onClick={()=>setIsCreatingQuestion(false)}>Hủy</button><button type="submit" className="btn-add">Lưu & Chọn</button></div>
                  </form>
              </div>
          </div>
      )}

      {/* --- MODAL: BẢNG ĐIỂM --- */}
      {showGradebook && gradebook && (
          <div className="modal-overlay" onClick={() => setShowGradebook(false)}>
              <div className="modal-content" >
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
                      <h3>📊 Bảng điểm lớp: {selectedClass.name}</h3>
                      <button className="btn-add" style={{background:"#8b5cf6"}} onClick={handlePrintGradebook}>🖨️ In Danh Sách</button>
                  </div>
                  <div id="gradebook-table">
                      <table className="modern-table" style={{width:"100%"}}>
                          <thead><tr style={{background: "#f1f5f9"}}><th>Sinh viên</th><th>Số bài thi</th><th>Điểm TB</th><th>Xếp loại</th></tr></thead>
                          <tbody>
                              {gradebook.map(g => (
                                  <tr key={g.student_id}><td>{g.full_name} <br/><small>@{g.username}</small></td><td style={{textAlign:"center"}}>{g.exam_count}</td><td style={{fontWeight:"bold", color:"#2563eb"}}>{g.avg_score}</td><td>{g.avg_score >= 5 ? "Đạt" : "Trượt"}</td></tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="modal-actions"><button className="action-btn" onClick={() => setShowGradebook(false)}>Đóng</button></div>
              </div>
          </div>
      )}

      {/* --- MODAL: XEM LỊCH SỬ HỌC SINH --- */}
      {selectedStudentHistory && (
        <div className="modal-overlay" onClick={() => setSelectedStudentHistory(null)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>📜 Lịch sử thi của học sinh</h3>
              {selectedStudentHistory.length === 0 ? <p>Học sinh này chưa làm bài nào.</p> : (
                 <table className="modern-table" style={{marginTop:"15px"}}>
                    <thead><tr><th>Ngày thi</th><th>Điểm số</th><th>Số câu đúng</th></tr></thead>
                    <tbody>{selectedStudentHistory.map(h => <tr key={h.id}><td>{new Date(h.created_at).toLocaleString('vi-VN')}</td><td style={{fontWeight:"bold", color:h.score>=5?"#16a34a":"#dc2626"}}>{h.score}đ</td><td>{h.correct_answers} câu</td></tr>)}</tbody>
                 </table>
              )}
              <div className="modal-actions"><button className="btn-add" style={{background:"#64748b"}} onClick={() => setSelectedStudentHistory(null)}>Đóng</button></div>
           </div>
        </div>
      )}
    </div>
  );
}