import React, { useState, useEffect } from "react";
import "./Admin.css"; 
import "./Teacher.css";

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
  const [viewingQuestion, setViewingQuestion] = useState(null); // Lưu câu hỏi đang xem
const [viewingExam, setViewingExam] = useState(null);         // Lưu đề thi đang xem

  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");
  const [filterCategory, setFilterCategory] = useState(""); // 👈 Bộ lọc Môn học
const [filterDifficulty, setFilterDifficulty] = useState("");
const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    // Tải ảnh đại diện riêng cho username này
    const savedAvatar = localStorage.getItem(`avatar_${username}`);
    if (savedAvatar) setAvatar(savedAvatar);
  }, [username]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
         alert("⚠️ Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem(`avatar_${username}`, reader.result); // Lưu vào LocalStorage
      };
      reader.readAsDataURL(file);
    }
  };

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
  const handleViewExamDetail = async (examId) => {
    try {
        const res = await fetch(`http://localhost:8000/api/student/exams/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            // Xử lý parse JSON cho choices giống bên Student
            const processedQuestions = data.questions.map(q => ({
                ...q,
                choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
            }));
            setViewingExam({ ...data.exam, questions: processedQuestions });
        } else {
            alert("Không tải được chi tiết đề!");
        }
    } catch (e) {
        alert("Lỗi kết nối!");
    }
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
          setShowCreateExam(false); setSelectedQuestionIds([]);fetchExamHistory();
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
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
            <label style={{ cursor: "pointer", position: "relative", display: "inline-block" }} title="Bấm để đổi ảnh">
                {avatar ? (
                    <img 
                        src={avatar} 
                        alt="Avatar" 
                        style={{ 
                            width: "80px", height: "80px", 
                            borderRadius: "50%", objectFit: "cover", 
                            border: "3px solid #fbbf24" // Viền màu vàng cam cho Giáo viên
                        }} 
                    />
                ) : (
                    <div style={{ 
                        width: "80px", height: "80px", 
                        background: "#fbbf24", 
                        borderRadius: "50%", margin: "0 auto", 
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        fontSize: "2.5rem" 
                    }}>
                        👨‍🏫
                    </div>
                )}
                
                {/* Icon máy ảnh nhỏ ở góc */}
                <div style={{ position: "absolute", bottom: "0", right: "0", background: "white", borderRadius: "50%", padding: "4px", boxShadow: "0 2px 5px rgba(0,0,0,0.3)", fontSize: "12px" }}>
                    📷
                </div>

                <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>

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

        {/* TAB NGÂN HÀNG CÂU HỎI (FIX LỖI CHẠY DỌC BẰNG MIN-WIDTH) */}
        {activeTab === 'questions' && (
            <div className="table-card">
                <div className="table-header">
                    <h3>Kho câu hỏi ({questions.length})</h3>
                    <button className="btn-add" onClick={() => setIsCreatingQuestion(true)}>+ Tạo câu hỏi mới</button>
                </div>
                
                {/* overflow-x: auto giúp xuất hiện thanh cuộn ngang nếu bảng quá rộng */}
                <div style={{maxHeight:"75vh", overflowY:"auto", overflowX: "auto"}}> 
                    <table className="modern-table" style={{width: "100%", borderCollapse: "collapse", minWidth: "800px"}}> {/* Set minWidth cho cả bảng */}
                        <thead style={{position: "sticky", top: 0, background: "#f8fafc", zIndex: 10}}>
                            <tr>
                                <th style={{width: "60px", textAlign: "center"}}>ID</th>
                                {/* QUAN TRỌNG: Thêm minWidth để cột này không bao giờ bị bóp nhỏ */}
                                <th style={{minWidth: "400px"}}>Nội dung câu hỏi</th> 
                                <th style={{width: "150px"}}>Chủ đề</th>
                                <th style={{width: "100px"}}>Độ khó</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.length === 0 ? 
                                <tr><td colSpan="4" style={{textAlign:"center", padding: "30px", color: "#64748b"}}>Ngân hàng trống. Hãy tạo câu hỏi mới!</td></tr> 
                            :
                            questions.map(q => (
                                <tr key={q.id} 
                                    onClick={() => setViewingQuestion(q)} 
                                    style={{cursor: "pointer", borderBottom: "1px solid #f1f5f9"}} 
                                    className="hover-row"
                                >
                                    <td style={{textAlign: "center", fontWeight: "bold", color: "#64748b"}}>#{q.id}</td>
                                    
                                    <td style={{padding: "12px"}}>
                                        <div style={{
                                            fontWeight: "500", 
                                            color: "#1e293b",
                                            fontSize: "1rem",
                                            lineHeight: "1.5"
                                            // Đã bỏ các thuộc tính cắt dòng, để nó hiển thị tự nhiên
                                        }}>
                                            {q.title}
                                        </div>
                                    </td>
                                    
                                    <td>
                                        <span className={`badge ${q.category}`} style={{
                                            display: "inline-block", padding: "4px 8px", borderRadius: "4px", 
                                            background: "#e0f2fe", color: "#0284c7", border: "1px solid #bae6fd", fontSize: "0.85rem", whiteSpace: "nowrap"
                                        }}>
                                            {q.category}
                                        </span>
                                    </td>
                                    
                                    <td>
                                        <span style={{
                                            padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "500", whiteSpace: "nowrap",
                                            background: q.difficulty === 'easy' ? '#dcfce7' : q.difficulty === 'medium' ? '#fef9c3' : '#fee2e2',
                                            color: q.difficulty === 'easy' ? '#166534' : q.difficulty === 'medium' ? '#854d0e' : '#991b1b'
                                        }}>
                                            {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'TB' : 'Khó'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                            <tr key={ex.id}
                            onClick={() => handleViewExamDetail(ex.id)} // 👈 Thêm sự kiện click gọi API
                                style={{cursor: "pointer"}}>
                                
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

      {/* --- MODAL 1: TẠO ĐỀ THI (CÓ BỘ LỌC NÂNG CẤP) --- */}
      {showCreateExam && (
          <div className="modal-overlay">
              <div className="modal-content" style={{minWidth: "900px"}}> {/* Tăng chiều rộng modal chút cho thoáng */}
                  <h3>📝 Soạn đề thi cho lớp {selectedClass.code}</h3>
                  <form onSubmit={handleCreateExam} style={{display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", marginTop: "15px"}}>
                      
                      {/* Cột Trái: Thông tin đề (GIỮ NGUYÊN) */}
                      <div style={{background: "#f8fafc", padding: "15px", borderRadius: "8px", height: "fit-content"}}>
                          <h4>ℹ️ Thông tin chung</h4>
                          <div className="form-group"><label>Tên bài thi:</label><input name="title" required placeholder="VD: Kiểm tra 1 tiết" /></div>
                          <div className="form-group"><label>Thời gian (phút):</label><input type="number" name="duration" defaultValue={45} /></div>
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
                      
                      {/* Cột Phải: Chọn câu hỏi (CÓ BỘ LỌC) */}
                      <div style={{display: "flex", flexDirection: "column", height: "600px"}}> {/* Tăng chiều cao */}
                          
                          {/* Header: Tiêu đề + Nút tạo mới */}
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                              <h4>📚 Chọn câu hỏi từ Ngân hàng</h4>
                              <button type="button" className="btn-add" style={{fontSize: "0.8rem", padding: "5px 10px"}} onClick={() => setIsCreatingQuestion(true)}>+ Soạn câu hỏi mới</button>
                          </div>

                          {/* 👇👇👇 KHU VỰC BỘ LỌC (FILTER) MỚI 👇👇👇 */}
                          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px", background: "#f1f5f9", padding: "10px", borderRadius: "8px"}}>
                                {/* Lọc theo Môn học */}
                                <div>
                                    <label style={{fontSize: "0.8rem", fontWeight: "bold", display: "block", marginBottom: "4px"}}>📂 Môn học / Chủ đề:</label>
                                    <select 
                                        value={filterCategory} 
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        style={{width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc"}}
                                    >
                                        <option value="">-- Tất cả chủ đề --</option>
                                        {/* Tự động lấy danh sách category duy nhất từ dữ liệu */}
                                        {[...new Set(questions.map(q => q.category))].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Lọc theo Độ khó */}
                                <div>
                                    <label style={{fontSize: "0.8rem", fontWeight: "bold", display: "block", marginBottom: "4px"}}>📊 Độ khó:</label>
                                    <select 
                                        value={filterDifficulty} 
                                        onChange={(e) => setFilterDifficulty(e.target.value)}
                                        style={{width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc"}}
                                    >
                                        <option value="">-- Tất cả độ khó --</option>
                                        <option value="easy">Dễ (Easy)</option>
                                        <option value="medium">Trung bình (Medium)</option>
                                        <option value="hard">Khó (Hard)</option>
                                    </select>
                                </div>
                          </div>
                          {/* 👆👆👆 KẾT THÚC BỘ LỌC 👆👆👆 */}

                          {/* Danh sách câu hỏi (Đã lọc) */}
                          <div className="question-list-container" style={{flex: 1, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff"}}>
                              {(() => {
                                  // Logic lọc câu hỏi tại đây
                                  const filteredQuestions = questions.filter(q => {
                                      const matchCategory = filterCategory ? q.category === filterCategory : true;
                                      const matchDifficulty = filterDifficulty ? q.difficulty === filterDifficulty : true;
                                      return matchCategory && matchDifficulty;
                                  });

                                  if (filteredQuestions.length === 0) return <p style={{padding: "20px", textAlign: "center", color: "#999"}}>Không tìm thấy câu hỏi phù hợp.</p>;

                                  return filteredQuestions.map(q => (
                                      <div key={q.id} style={{padding: "10px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px", background: selectedQuestionIds.includes(q.id) ? "#fffbeb" : "transparent"}}>
                                          <input 
                                              type="checkbox" 
                                              checked={selectedQuestionIds.includes(q.id)} 
                                              onChange={() => handleToggleQuestion(q.id)} 
                                              style={{cursor: "pointer", width: "18px", height: "18px", marginTop: "3px"}} 
                                          />
                                          <div style={{flex: 1}}>
                                              <div style={{fontWeight: "500", marginBottom: "4px"}}>{q.title}</div>
                                              <div style={{fontSize: "0.8rem", display: "flex", gap: "10px"}}>
                                                  {/* Hiển thị Badge Môn học */}
                                                  <span className={`badge ${q.category}`} style={{padding: "2px 6px", borderRadius: "4px", background: "#e0f2fe", color: "#0284c7", border: "1px solid #bae6fd"}}>
                                                      📂 {q.category}
                                                  </span>
                                                  {/* Hiển thị Badge Độ khó */}
                                                  <span style={{
                                                      padding: "2px 6px", borderRadius: "4px", border: "1px solid #ddd",
                                                      background: q.difficulty === 'easy' ? '#dcfce7' : q.difficulty === 'medium' ? '#fef9c3' : '#fee2e2',
                                                      color: q.difficulty === 'easy' ? '#166534' : q.difficulty === 'medium' ? '#854d0e' : '#991b1b'
                                                  }}>
                                                      📊 {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'TB' : 'Khó'}
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  ));
                              })()}
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
      {/* --- 🆕 MODAL 5: XEM CHI TIẾT CÂU HỎI --- */}
      {viewingQuestion && (
        <div className="modal-overlay" onClick={() => setViewingQuestion(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 style={{borderBottom:"2px solid #fbbf24", paddingBottom:"10px", display:"inline-block"}}>🔍 Chi tiết câu hỏi #{viewingQuestion.id}</h3>
                <div style={{marginTop:"15px", background:"#f8fafc", padding:"15px", borderRadius:"8px"}}>
                    <p style={{fontSize:"1.1rem", fontWeight:"bold", marginBottom:"10px"}}>{viewingQuestion.title}</p>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                        {(typeof viewingQuestion.choices === 'string' ? JSON.parse(viewingQuestion.choices) : viewingQuestion.choices).map((c, idx) => (
                            <div key={idx} style={{
                                padding:"10px", 
                                border: idx === viewingQuestion.answer ? "2px solid #10b981" : "1px solid #e2e8f0",
                                background: idx === viewingQuestion.answer ? "#dcfce7" : "#fff",
                                borderRadius:"6px"
                            }}>
                                {String.fromCharCode(65+idx)}. {c} {idx === viewingQuestion.answer && "✅"}
                            </div>
                        ))}
                    </div>
                    {viewingQuestion.explanation && (
                        <div style={{marginTop:"15px", padding:"10px", background:"#fffbeb", borderLeft:"4px solid #f59e0b"}}>
                            <strong>💡 Giải thích:</strong> {viewingQuestion.explanation}
                        </div>
                    )}
                </div>
                <div className="modal-actions"><button className="action-btn" onClick={() => setViewingQuestion(null)}>Đóng</button></div>
            </div>
        </div>
      )}

      {/* --- 🆕 MODAL 6: XEM CHI TIẾT ĐỀ THI (UPDATE: HIỆN FULL ĐÁP ÁN) --- */}
      {viewingExam && (
        <div className="modal-overlay" onClick={() => setViewingExam(null)}>
            <div className="modal-content" style={{maxWidth:"800px"}} onClick={e => e.stopPropagation()}>
                <div style={{borderBottom:"1px solid #eee", paddingBottom:"10px", marginBottom:"15px"}}>
                    <h3 style={{margin:0}}>📄 Đề thi: {viewingExam.title}</h3>
                    <p style={{color:"#64748b", margin:"5px 0 0 0"}}>
                        Lớp: {viewingExam.class_id} | Thời gian: {viewingExam.duration} phút | Số câu: {viewingExam.questions.length}
                    </p>
                </div>
                
                <div style={{maxHeight:"65vh", overflowY:"auto", border:"1px solid #e2e8f0", borderRadius:"8px"}}>
                    <table className="modern-table" style={{width:"100%"}}>
                        <thead style={{position:"sticky", top:0, zIndex:1, background:"#f1f5f9"}}>
                            <tr>
                                <th style={{width: "50px", textAlign: "center"}}>STT</th>
                                <th>Nội dung câu hỏi & Đáp án</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewingExam.questions.map((q, idx) => {
                                // Xử lý parse JSON (để chắc chắn choices là mảng)
                                const choices = typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices;
                                
                                return (
                                    <tr key={idx}>
                                        <td style={{textAlign:"center", verticalAlign: "top", paddingTop: "15px"}}>
                                            <span style={{fontWeight:"bold", color:"#64748b", background:"#e2e8f0", padding:"4px 8px", borderRadius:"4px"}}>#{idx+1}</span>
                                        </td>
                                        <td style={{padding: "15px"}}>
                                            <div style={{fontSize: "1.05rem", fontWeight: "bold", marginBottom: "12px", color: "#1e293b"}}>
                                                {q.title}
                                            </div>
                                            
                                            {/* Lưới hiển thị 4 đáp án */}
                                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                                                {choices.map((c, cIdx) => (
                                                    <div key={cIdx} style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "6px",
                                                        fontSize: "0.95rem",
                                                        // Tô màu xanh nếu là đáp án đúng
                                                        border: cIdx === q.answer ? "1px solid #10b981" : "1px solid #e2e8f0",
                                                        background: cIdx === q.answer ? "#effdf5" : "#f8fafc",
                                                        color: cIdx === q.answer ? "#15803d" : "#475569",
                                                        display: "flex", alignItems: "center", justifyContent: "space-between"
                                                    }}>
                                                        <span>
                                                            <strong style={{marginRight: "6px"}}>{String.fromCharCode(65+cIdx)}.</strong> 
                                                            {c}
                                                        </span>
                                                        {cIdx === q.answer && <span>✅</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="modal-actions" style={{marginTop: "15px", borderTop:"1px solid #eee", paddingTop:"10px"}}>
                    <button className="action-btn" onClick={() => setViewingExam(null)}>Đóng</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
  
}
