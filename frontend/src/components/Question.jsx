import React from "react";

export default function Question({ q, selectedOption, onSelect }) {
  if (!q) return null;

  return (
    <div className="question-container" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
      {/* Tiêu đề câu hỏi */}
      <h3 style={{ 
        fontSize: "1.3rem", 
        color: "#1f2937", 
        marginBottom: "1.5rem",
        lineHeight: "1.6"
      }}>
        {q.title}
      </h3>

      {/* Danh sách đáp án */}
      <div style={{ display: "grid", gap: "12px" }}>
        {q.choices.map((choice, idx) => {
          const isSelected = selectedOption === idx;
          
          return (
            <div
              key={idx}
              onClick={() => onSelect(idx)}
              style={{
                padding: "14px 20px",
                border: isSelected ? "2px solid #4f46e5" : "2px solid #e5e7eb",
                backgroundColor: isSelected ? "#e0e7ff" : "#ffffff",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                fontWeight: isSelected ? "600" : "500",
                color: isSelected ? "#4338ca" : "#374151",
                boxShadow: isSelected ? "0 2px 4px rgba(79, 70, 229, 0.1)" : "none"
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              {/* Vòng tròn chữ cái A, B, C, D */}
              <span style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: isSelected ? "#4f46e5" : "#f3f4f6",
                color: isSelected ? "#ffffff" : "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                flexShrink: 0
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              
              {/* Nội dung đáp án */}
              <span>{choice}</span>
            </div>
          );
        })}
      </div>

      {/* Style animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}