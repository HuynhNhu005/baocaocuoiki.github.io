import React, { useState, useEffect } from "react";
import "./Admin.css";

// --- SUB-COMPONENT: LỊCH SỬ THI ---
const HistoryView = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setHistory(await res.json());
      } catch (e) {}
    };
    fetchHistory();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ borderBottom: "2px solid #fbbf24", paddingBottom: "10px", display: "inline-block" }}>📜 Lịch sử làm bài</h3>
      {history.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#666" }}>Bạn chưa thực hiện bài thi nào.</p>
      ) : (
        <table className="modern-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Ngày thi</th>
              <th style={{ padding: "12px" }}>Số câu</th>
              <th style={{ padding: "12px" }}>Điểm số</th>
              <th style={{ padding: "12px" }}>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}>{new Date(h.created_at).toLocaleString('vi-VN')}</td>
                <td style={{ padding: "12px" }}>{h.total_questions}</td>
                <td style={{ padding: "12px", fontWeight: "bold", color: h.score >= 5 ? "#10b981" : "#ef4444" }}>{h.score.toFixed(1)} đ</td>
                <td style={{ padding: "12px" }}>{h.correct_answers} đúng</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: BẢNG XẾP HẠNG ---
const LeaderboardView = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/leaderboard");
        if (res.ok) setLeaderboard(await res.json());
      } catch (e) {}
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ borderBottom: "2px solid #fbbf24", paddingBottom: "10px", display: "inline-block" }}>🏆 Bảng xếp hạng Top 10</h3>
      {leaderboard.length === 0 ? (
        <p style={{ marginTop: "20px" }}>Chưa có dữ liệu.</p>
      ) : (
        <table className="modern-table" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px", textAlign: "center" }}>Hạng</th>
              <th style={{ padding: "12px" }}>Thành viên</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Điểm cao nhất</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px", textAlign: "center", fontSize: "1.2rem" }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td style={{ padding: "12px", fontWeight: "500" }}>{u.full_name || u.username}</td>
                <td style={{ padding: "12px", textAlign: "right", color: "#2563eb", fontWeight: "bold" }}>{u.max_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export default function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' | 'practice' | 'history' | 'leaderboard'
  const [classInfo, setClassInfo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  
  // State config cho luyện tập tự do
  const [practiceConfig, setPracticeConfig] = useState({ limit: 10, category: "", difficulty: "" });

  // State làm bài thi
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [currentExamData, setCurrentExamData] = useState(null); 
  const [userAnswers, setUserAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);

  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  // 1. Lấy thông tin Lớp & Bài tập được giao
  const fetchDashboardInfo = async () => {
      try {
          const res = await fetch("http://localhost:8000/api/student/dashboard-info", {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              // Lưu ý: data.classes bây giờ là mảng []
              setClassInfo(data.classes); // Lưu danh sách lớp vào state
              setAssignments(data.assignments);
          }
      } catch (e) { console.error(e); }
  };

  // 2. Bắt đầu làm bài (Bài tập Giáo viên giao)
  const handleStartAssignedExam = async (examId) => {
      if(!window.confirm("Bắt đầu làm bài ngay?")) return;

      try {
          const res = await fetch(`http://localhost:8000/api/student/exams/${examId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              
              // --- 👇 ĐOẠN CODE SỬA LỖI (Parse JSON) 👇 ---
              const processedQuestions = data.questions.map(q => ({
                  ...q,
                  // Nếu choices là chuỗi (string) thì ép kiểu sang mảng (array)
                  choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
              }));
              // ----------------------------------------------

              setCurrentExamData({
                  ...data.exam,
                  questions: processedQuestions, // Dùng dữ liệu đã sửa lỗi
                  type: "assigned"
              });
              setIsTakingExam(true);
              setUserAnswers({});
              setExamResult(null);
          } else {
              alert("Không thể tải đề thi.");
          }
      } catch(e) { console.error(e); alert("Lỗi kết nối!"); }
  };

  // 3. Bắt đầu làm bài (Luyện tập tự do)
  const handleStartPractice = async (e) => {
      e.preventDefault();
      try {
          let url = `http://localhost:8000/api/questions/random?limit=${practiceConfig.limit}`;
          if (practiceConfig.category) url += `&category=${practiceConfig.category}`;
          if (practiceConfig.difficulty) url += `&difficulty=${practiceConfig.difficulty}`;

          const res = await fetch(url);
          if (res.ok) {
              const questions = await res.json();
              if(questions.length === 0) { alert("Không tìm thấy câu hỏi phù hợp!"); return; }
              
              setCurrentExamData({
                  title: "Luyện tập tự do",
                  duration: 999, // Không giới hạn
                  questions: questions,
                  type: "practice"
              });
              setIsTakingExam(true);
              setUserAnswers({});
              setExamResult(null);
          }
      } catch (e) { alert("Lỗi kết nối!"); }
  };

  // 4. Nộp bài
  const handleSubmitExam = async () => {
      const payload = { answers: userAnswers };
      try {
        const res = await fetch("http://localhost:8000/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        setExamResult(result);
      } catch (e) { alert("Lỗi khi nộp bài!"); }
  };

  // --- GIAO DIỆN LÀM BÀI ---
  if (isTakingExam && currentExamData) {
      if (examResult) {
          return (
              <div className="admin-container" style={{justifyContent:"center", alignItems:"center"}}>
                  <div className="card" style={{textAlign:"center", padding:"40px", maxWidth:"500px"}}>
                      <h2 style={{color: examResult.score >= 5 ? "#10b981" : "#ef4444"}}>🏁 Kết Quả: {examResult.score} điểm</h2>
                      <p style={{fontSize:"1.2rem", margin:"10px 0"}}>Bạn trả lời đúng <strong>{examResult.correct}/{examResult.total}</strong> câu.</p>
                      <button className="btn-add" style={{marginTop:"20px", width:"100%"}} onClick={() => {setIsTakingExam(false); setExamResult(null); fetchDashboardInfo();}}>⬅ Quay về Dashboard</button>
                  </div>
              </div>
          )
      }

      return (
          <div className="admin-container" style={{display:"block", padding:"20px", background:"#f8fafc", overflowY:"auto"}}>
              <div className="card" style={{maxWidth:"900px", margin:"0 auto"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #eee", paddingBottom:"15px", marginBottom:"20px"}}>
                      <h3 style={{margin:0}}>{currentExamData.title}</h3>
                      <div style={{fontWeight:"bold", color:"#f59e0b", border:"1px solid #f59e0b", padding:"5px 10px", borderRadius:"5px"}}>⏳ {currentExamData.duration} phút</div>
                  </div>
                  
                  <div className="questions-list">
                      {currentExamData.questions.map((q, idx) => (
                          <div key={q.id} style={{marginBottom:"25px", padding:"15px", background:"#f1f5f9", borderRadius:"8px"}}>
                              <p style={{fontWeight:"bold", marginBottom:"10px"}}>Câu {idx + 1}: {q.title}</p>
                              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px"}}>
                                  {q.choices.map((choice, cIdx) => (
                                      <label key={cIdx} style={{display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", padding:"8px", background:"white", borderRadius:"5px", border: userAnswers[q.id] === cIdx ? "2px solid #2563eb" : "1px solid #e2e8f0"}}>
                                          <input type="radio" name={`q-${q.id}`} checked={userAnswers[q.id] === cIdx} onChange={() => setUserAnswers({...userAnswers, [q.id]: cIdx})} />
                                          {choice}
                                      </label>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
                  <button className="btn-add" style={{width:"100%", marginTop:"20px", fontSize:"1.2rem"}} onClick={handleSubmitExam}>🚀 Nộp Bài</button>
              </div>
          </div>
      );
  }

  // --- GIAO DIỆN DASHBOARD CHÍNH ---
  const IconBook = () => <span>📚</span>; const IconLightning = () => <span>⚡</span>; const IconHistory = () => <span>📜</span>; const IconTrophy = () => <span>🏆</span>;

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="sidebar" style={{ background: "#1e293b" }}>
        <div className="brand" style={{ color: "#fbbf24" }}>🎓 Student App</div>
        <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #334155" }}>
            <div style={{ width: "60px", height: "60px", background: "#3b82f6", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>👨‍🎓</div>
            <p style={{ color: "#fff", marginTop: "10px", fontWeight: "bold" }}>{username}</p>
            {/* Hiển thị lớp */}
            <div style={{fontSize:"0.85rem", color:"#fbbf24", marginTop:"10px", textAlign:"left", background:"rgba(255,255,255,0.1)", padding:"8px", borderRadius:"6px"}}>
    <strong>Lớp tham gia:</strong>
    {!classInfo || classInfo.length === 0 ? (
        <div style={{opacity:0.7, fontStyle:"italic"}}>Chưa tham gia lớp nào</div>
    ) : (
        <ul style={{margin:"5px 0 0 15px", padding:0}}>
            {classInfo.map(c => (
                <li key={c.id} style={{marginBottom:"4px"}}>
                    {c.code} - {c.name}
                </li>
            ))}
        </ul>
    )}
</div>
        </div>
        
        <button className={`nav-item ${activeTab==="assignments"?"active":""}`} onClick={()=>setActiveTab("assignments")}><IconBook /> Bài tập được giao</button>
        <button className={`nav-item ${activeTab==="practice"?"active":""}`} onClick={()=>setActiveTab("practice")}><IconLightning /> Luyện tập tự do</button>
        <button className={`nav-item ${activeTab==="history"?"active":""}`} onClick={()=>setActiveTab("history")}><IconHistory /> Lịch sử thi</button>
        <button className={`nav-item ${activeTab==="leaderboard"?"active":""}`} onClick={()=>setActiveTab("leaderboard")}><IconTrophy /> Bảng xếp hạng</button>
        
        <button className="nav-item logout" onClick={onLogout}>🚪 Đăng xuất</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
          
          {/* TAB 1: BÀI TẬP ĐƯỢC GIAO */}
          {activeTab === "assignments" && (
              <div>
                  <h2 style={{marginBottom:"20px"}}>Bài tập / Bài thi của tôi</h2>
                  {!classInfo ? (
                      <div style={{padding:"20px", background:"#fee2e2", color:"#991b1b", borderRadius:"8px"}}>⚠️ Bạn chưa được thêm vào lớp nào. Vui lòng liên hệ giáo viên.</div>
                  ) : assignments.length === 0 ? (
                      <p style={{color:"#64748b"}}>Hiện chưa có bài tập nào được giao.</p>
                  ) : (
                      <div className="stats-grid">
                          {assignments.map(exam => (
                              <div key={exam.id} className="stat-card" style={{borderLeft:"5px solid #2563eb", flexDirection:"column", alignItems:"flex-start"}}>
                                  <div className="stat-info">
                                      <h3>{exam.title}</h3>
                                      <p>⏳ Thời gian: <strong>{exam.duration} phút</strong></p>
                                      <p style={{fontSize:"0.9rem", marginTop:"5px"}}>📅 Ngày giao: {new Date(exam.created_at).toLocaleDateString('vi-VN')}</p>
                                  </div>
                                  <button className="btn-add" style={{marginTop:"15px", width:"100%"}} onClick={() => handleStartAssignedExam(exam.id)}>✍️ Làm bài ngay</button>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* TAB 2: LUYỆN TẬP TỰ DO (CONFIG CŨ CỦA BẠN) */}
          {activeTab === "practice" && (
              <div className="card" style={{maxWidth:"600px", margin:"0 auto"}}>
                  <h2 style={{borderBottom:"1px solid #eee", paddingBottom:"15px"}}>⚡ Cấu hình bài thi nhanh</h2>
                  <form onSubmit={handleStartPractice} style={{marginTop:"20px"}}>
                      <div className="form-group">
                          <label>Số lượng câu hỏi:</label>
                          <select value={practiceConfig.limit} onChange={(e) => setPracticeConfig({ ...practiceConfig, limit: Number(e.target.value) })}>
                              <option value={5}>5 câu (Nhanh)</option>
                              <option value={10}>10 câu (Tiêu chuẩn)</option>
                              <option value={20}>20 câu (Thử thách)</option>
                          </select>
                      </div>
                      <div className="form-group">
                          <label>Chủ đề:</label>
                          <select value={practiceConfig.category} onChange={(e) => setPracticeConfig({ ...practiceConfig, category: e.target.value })}>
                              <option value="">Tất cả chủ đề</option>
                              <option value="IT">Công nghệ thông tin</option>
                              <option value="Math">Toán học</option>
                              <option value="Science">Khoa học</option>
                              <option value="Geography">Địa lý</option>
                              <option value="Literature">Văn học</option>
                              <option value="English">Tiếng Anh</option>
                          </select>
                      </div>
                      <div className="form-group">
                          <label>Độ khó:</label>
                          <select value={practiceConfig.difficulty} onChange={(e) => setPracticeConfig({ ...practiceConfig, difficulty: e.target.value })}>
                              <option value="">Ngẫu nhiên</option>
                              <option value="easy">Dễ</option>
                              <option value="medium">Trung bình</option>
                              <option value="hard">Khó</option>
                          </select>
                      </div>
                      <button type="submit" className="btn-add" style={{width:"100%", marginTop:"10px"}}>🚀 Bắt đầu luyện tập</button>
                  </form>
              </div>
          )}

          {/* TAB 3: LỊCH SỬ THI */}
          {activeTab === "history" && <div className="card"><HistoryView /></div>}

          {/* TAB 4: BẢNG XẾP HẠNG */}
          {activeTab === "leaderboard" && <div className="card"><LeaderboardView /></div>}
      </div>
    </div>
  );
}