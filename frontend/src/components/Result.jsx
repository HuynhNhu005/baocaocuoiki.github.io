import React from "react";

export default function Result({ result, onRetake }) {
  if (!result) return null;

  // Đậu nếu điểm >= 50
  const isPassed = result.score >= 50;

  return (
    <div className="card">
      <h2 style={{ color: isPassed ? '#10b981' : '#ef4444', textAlign: 'center' }}>
        {isPassed ? "🎉 Chúc Mừng! Bạn Đã Hoàn Thành" : "😢 Rất Tiếc! Hãy Cố Gắng Lần Sau"}
      </h2>
      
      <div style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem' }}>
        <p>Điểm số của bạn: <strong style={{fontSize: '2rem'}}>{result.score.toFixed(0)}</strong> / 100</p>
        <p>Số câu đúng: <strong>{result.correct}</strong> / {result.total}</p>
      </div>

      {/* Chức năng nâng cao: CERTIFICATE */}
      {isPassed && (
        <div className="certificate">
          <h3>CERTIFICATE OF COMPLETION</h3>
          <p>Chứng nhận này được trao cho</p>
          <div className="cert-name">Sinh Viên Xuất Sắc</div>
          <p>Đã vượt qua bài kiểm tra trắc nghiệm với số điểm {result.score.toFixed(0)}/100</p>
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ccc', width: '200px', margin: '1.5rem auto 0' }}>
            <small>Ngày: {new Date().toLocaleDateString()}</small>
          </div>
        </div>
      )}

      <hr style={{margin: '2rem 0', border: '0', borderTop: '1px solid #eee'}} />

      <h3>Chi tiết bài làm:</h3>
      <div>
        {result.details.map((d, i) => (
          <div
            key={d.id}
            style={{ 
              marginBottom: 15, 
              padding: 15, 
              borderRadius: 8,
              border: "1px solid #eee",
              borderLeft: `5px solid ${d.is_correct ? '#10b981' : '#ef4444'}`,
              backgroundColor: '#f9fafb'
            }}
          >
            <div style={{fontWeight: 'bold', marginBottom: 5}}>
              Câu {i + 1}: {d.title}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.95rem' }}>
              <div>
                Chọn: <span style={{fontWeight: 'bold', color: d.is_correct ? '#10b981' : '#ef4444'}}>
                  {d.selected == null ? "Không chọn" : String.fromCharCode(65 + Number(d.selected))}
                </span>
              </div>
              <div>
                Đáp án đúng: <span style={{fontWeight: 'bold', color: '#10b981'}}>
                  {String.fromCharCode(65 + d.correct_answer)}
                </span>
              </div>
            </div>

            {d.explanation && (
              <div style={{ marginTop: 8, fontStyle: "italic", color: "#666", fontSize: '0.9rem' }}>
                💡 Giải thích: {d.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="btn primary-btn" onClick={onRetake} style={{ marginTop: '1rem' }}>
        Làm Đề Mới 🔄
      </button>
    </div>
  );
}