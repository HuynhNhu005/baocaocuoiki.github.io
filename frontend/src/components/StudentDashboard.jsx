import React, { useState, useEffect } from 'react';

// Sub-component: Lịch sử thi
const HistoryView = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("http://localhost:8000/api/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setHistory(await res.json());
    };
    fetchHistory();
  }, [token]);

  return (
    <div style={{padding:"20px"}}>
      <h2>📜 Lịch sử thi của bạn</h2>
      {history.length === 0 ? (
        <p>Bạn chưa thực hiện bài thi nào. Hãy bắt đầu ngay!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Ngày</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Số câu</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Điểm</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{new Date(h.created_at).toLocaleString('vi-VN')}</td>
                <td style={{ padding: '10px' }}>{h.total_questions}</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: h.score >= 5 ? '#10b981' : '#ef4444' }}>{h.score.toFixed(1)}</td>
                <td style={{ padding: '10px' }}>{h.correct_answers} đúng</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Sub-component: Bảng xếp hạng
const LeaderboardView = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("http://localhost:8000/api/leaderboard");
      if (res.ok) setLeaderboard(await res.json());
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{padding:"20px"}}>
      <h2>🏆 Bảng xếp hạng điểm cao nhất</h2>
      {leaderboard.length === 0 ? (
        <p>Chưa có dữ liệu bảng xếp hạng.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '10px', textAlign: 'center' }}>Hạng</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Người dùng</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Điểm cao nhất</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u, index) => (
              <tr key={u.username} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td style={{ padding: '10px' }}>{u.full_name || u.username}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#6366f1' }}>{u.max_score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Component chính
export default function StudentDashboard({ viewMode, setViewMode, config, setConfig, handleStart }) {
  
  // Hiển thị nội dung dựa trên viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'history':
        return <HistoryView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'config':
      default:
        return (
          // Form cấu hình đề thi cũ (giữ nguyên)
          <form onSubmit={handleStart} style={{ padding: "20px" }}>
            <h2 style={{textAlign:"left"}}>📝 Cấu hình bài thi mới</h2>
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
            {/* ... (Các form group Category, Difficulty giữ nguyên) ... */}
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
        );
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', display: 'flex', minHeight: '500px' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '200px', background: '#f8fafc', padding: '20px', borderRight: '1px solid #eee', borderRadius: '20px 0 0 20px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#6366f1', textAlign: 'left' }}>Dashboard</h3>
        <button 
          className={`btn secondary-btn`} 
          style={{ width: '100%', marginBottom: '10px', background: viewMode === 'config' ? '#e0e7ff' : 'white', borderColor: viewMode === 'config' ? '#a5b4fc' : '#eee' }}
          onClick={() => setViewMode('config')}
        >
          📝 Bài thi mới
        </button>
        <button 
          className={`btn secondary-btn`} 
          style={{ width: '100%', marginBottom: '10px', background: viewMode === 'history' ? '#e0e7ff' : 'white', borderColor: viewMode === 'history' ? '#a5b4fc' : '#eee' }}
          onClick={() => setViewMode('history')}
        >
          📜 Lịch sử thi
        </button>
        <button 
          className={`btn secondary-btn`} 
          style={{ width: '100%', background: viewMode === 'leaderboard' ? '#e0e7ff' : 'white', borderColor: viewMode === 'leaderboard' ? '#a5b4fc' : '#eee' }}
          onClick={() => setViewMode('leaderboard')}
        >
          🏆 Bảng xếp hạng
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
}