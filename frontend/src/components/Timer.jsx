import React, { useEffect, useState } from "react";

export default function Timer({ seconds, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  // Reset timer khi thời gian đầu vào thay đổi
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  // Logic đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  // Định dạng mm:ss
  const formatTime = (s) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Logic đổi màu: >60s Xanh, <60s Vàng, <15s Đỏ
  let bgColor = "#10b981"; // Green
  let animation = "none";
  
  if (timeLeft < 60) bgColor = "#f59e0b"; // Yellow
  if (timeLeft < 15) {
    bgColor = "#ef4444"; // Red
    animation = "pulse 1s infinite"; // Hiệu ứng nhấp nháy
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "1.1rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "background-color 0.3s ease",
        animation: animation
      }}
    >
      <span>⏳</span>
      <span>{formatTime(timeLeft)}</span>
      
      {/* Thêm style keyframes cho hiệu ứng nhấp nháy */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}