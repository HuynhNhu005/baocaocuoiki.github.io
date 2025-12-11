import React from "react";

export default function Result({ result, onRetake }) {
  if (!result) return null;
  const isPassed = result.score >= 50;

  return (
    <div className="card" style={{ animation: "slideUp 0.5s ease-out" }}>
      {/* PHẦN TỔNG KẾT */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>
          {isPassed ? "🎉" : "😢"}
        </div>
        <h2 style={{ 
          color: isPassed ? '#10b981' : '#ef4444', 
          marginBottom: "0.5rem",
          fontSize: "2rem"
        }}>
          {isPassed ? "XUẤT SẮC! BẠN ĐÃ ĐẬU" : "RẤT TIẾC! BẠN CHƯA ĐẠT"}
        </h2>
        <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
          Bạn đã hoàn thành bài kiểm tra với kết quả:
        </p>
      </div>
      
      <div style={{ 
        display: "flex", justifyContent: "center", gap: "2rem",
        marginBottom: "3rem" 
      }}>
        <div style={{ 
          textAlign: "center", background: "#f3f4f6", 
          padding: "1.5rem", borderRadius: "16px", minWidth: "120px"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "5px" }}>ĐIỂM SỐ</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#4f46e5" }}>
            {result.score.toFixed(0)}
          </div>
        </div>
        <div style={{ 
          textAlign: "center", background: "#f3f4f6", 
          padding: "1.5rem", borderRadius: "16px", minWidth: "120px"
        }}>
          <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "5px" }}>CÂU ĐÚNG</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#10b981" }}>
            {result.correct}/{result.total}
          </div>
        </div>
      </div>

      {/* CHỨNG CHỈ (Nếu đậu) */}
      {isPassed && (
        <div className="certificate">
          <div style={{ borderBottom: "2px solid #d97706", paddingBottom: "15px", marginBottom: "20px" }}>
            <span style={{ fontSize: "3.5rem" }}>🏆</span>
          </div>
          <h3 className="cert-title">CHỨNG CHỈ HOÀN THÀNH</h3>
          <p style={{ fontSize: "1.1rem" }}>Chứng nhận này được trao trân trọng cho</p>
          <div className="cert-name">SINH VIÊN TÀI NĂNG</div>
          <p>Đã xuất sắc vượt qua bài kiểm tra với số điểm <strong>{result.score.toFixed(0)}/100</strong></p>
          <div style={{ marginTop: "25px", fontSize: "0.9rem", fontStyle: "italic", color: "#666" }}>
            Cấp ngày: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      )}

      <hr style={{ margin: "3rem 0", border: "0", borderTop: "1px solid #e5e7eb" }} />

      {/* PHẦN XEM LẠI CHI TIẾT */}
      <h3 style={{ textAlign: "left", marginBottom: "1.5rem", color: "#374151" }}>🔍 Xem Lại Bài Làm</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {result.details.map((d, i) => (
          <div key={i} style={{ 
            border: "1px solid #e5e7eb", 
            borderRadius: "12px", 
            padding: "1.5rem",
            background: "#ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
              <span style={{ 
                background: "#f3f4f6", color: "#4b5563", 
                padding: "2px 8px", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", height: "fit-content"
              }}>
                Câu {i + 1}
              </span>
              <span style={{ fontWeight: "600", fontSize: "1.1rem", lineHeight: "1.5" }}>
                {d.title}
              </span>
            </div>

            {/* Hiển thị các lựa chọn */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {d.choices && d.choices.map((choice, idx) => {
                const isSelected = Number(d.selected) === idx;
                const isCorrectAnswer = Number(d.correct_answer) === idx;
                
                let style = {
                  padding: "10px 15px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  display: "flex",
                  alignItems: "center"
                };

                // Tô màu
                if (isCorrectAnswer) {
                  style.background = "#dcfce7"; // Xanh lá nhạt
                  style.borderColor = "#10b981";
                  style.color = "#065f46";
                  style.fontWeight = "600";
                } else if (isSelected && !isCorrectAnswer) {
                  style.background = "#fee2e2"; // Đỏ nhạt
                  style.borderColor = "#ef4444";
                  style.color = "#991b1b";
                } else if (isSelected) {
                   // Trường hợp chọn đúng (đã được xử lý ở if đầu tiên, nhưng thêm cho chắc)
                   style.background = "#dcfce7";
                }

                return (
                  <div key={idx} style={style}>
                    <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {choice}
                    {isCorrectAnswer && <span style={{ marginLeft: "auto" }}>✅</span>}
                    {isSelected && !isCorrectAnswer && <span style={{ marginLeft: "auto" }}>❌</span>}
                  </div>
                );
              })}
            </div>

            {/* Giải thích */}
            <div style={{ 
              marginTop: "1rem", 
              padding: "1rem", 
              background: "#eff6ff", 
              borderRadius: "8px",
              borderLeft: "4px solid #3b82f6",
              color: "#1e40af",
              fontSize: "0.95rem"
            }}>
              <strong>💡 Giải thích:</strong> {d.explanation || "Không có giải thích chi tiết."}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <button className="btn primary-btn" onClick={onRetake}>
          🔄 Làm Bài Mới
        </button>
      </div>
    </div>
  );
}