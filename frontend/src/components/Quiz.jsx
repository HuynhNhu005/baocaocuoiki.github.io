import React, { useEffect, useState } from "react";
import { fetchRandomQuestions, submitAnswers } from "../api";
import Timer from "./Timer";
import Result from "./Result";

export default function Quiz({ config, onRetry }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1 phút cho mỗi câu hỏi
  const TIME_LIMIT = config.limit * 60;

  useEffect(() => {
    load();
  }, [config]);

  async function load() {
    setLoading(true);
    try {
      const qs = await fetchRandomQuestions(config.limit, config.category, config.difficulty);
      setQuestions(qs);
      setAnswers({});
      setResult(null);
      setCurrentIndex(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function onSelect(qid, idx) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length === 0 && !confirm("Bạn chưa trả lời câu nào. Chắc chắn nộp?")) return;
    try {
      const res = await submitAnswers(answers);
      setResult(res);
    } catch (error) {
      alert("Lỗi khi nộp bài!");
    }
  }

  if (loading) return (
    <div className="card" style={{textAlign: "center"}}>
      <h2>⏳ Đang tải dữ liệu...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="card" style={{textAlign: "center"}}>
      <h2>❌ Không tìm thấy câu hỏi!</h2>
      <p>Vui lòng chọn chủ đề hoặc độ khó khác.</p>
      <button className="btn secondary-btn" onClick={onRetry}>Quay lại</button>
    </div>
  );

  if (result) return <Result result={result} onRetake={onRetry} />;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="card">
      <div className="quiz-header">
        <div>
          <small style={{ color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>Câu hỏi</small>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#4f46e5" }}>
            {currentIndex + 1}<span style={{fontSize: "1rem", color: "#9ca3af"}}>/{questions.length}</span>
          </div>
        </div>
        <Timer seconds={TIME_LIMIT} onTimeUp={handleSubmit} />
      </div>

      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="question-text">
        {currentQ.title}
      </div>

      <div className="options-grid">
        {currentQ.choices.map((choice, idx) => (
          <div
            key={idx}
            className={`option-item ${answers[currentQ.id] === idx ? 'selected' : ''}`}
            onClick={() => onSelect(currentQ.id, idx)}
          >
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%", 
              background: answers[currentQ.id] === idx ? "#4f46e5" : "#f3f4f6",
              color: answers[currentQ.id] === idx ? "white" : "#6b7280",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: "15px", fontWeight: "bold", flexShrink: 0
            }}>
              {String.fromCharCode(65 + idx)}
            </div>
            {choice}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button 
          className="btn secondary-btn" 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          ⬅ Quay lại
        </button>
        
        {currentIndex < questions.length - 1 ? (
          <button 
            className="btn primary-btn" 
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            Tiếp theo ➡
          </button>
        ) : (
          <button 
            className="btn primary-btn" 
            style={{background: "#10b981"}}
            onClick={handleSubmit}
          >
            Nộp Bài ✅
          </button>
        )}
      </div>
    </div>
  );
}