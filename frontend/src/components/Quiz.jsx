import React, { useEffect, useState } from "react";
import { fetchRandomQuestions, submitAnswers } from "../api";
import Timer from "./Timer";
import Result from "./Result";

export default function Quiz({ config, onRetry }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { qid: choice_index }
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  // Thời gian làm bài: 1 phút cho mỗi câu hỏi
  const TIME_LIMIT = config.limit * 60; 

  // Quản lý câu hỏi hiện tại để hiển thị từng câu (thay vì list dài)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    load();
  }, [config]);

  async function load() {
    setLoading(true);
    try {
      // Gọi API với tham số config từ người dùng chọn
      const qs = await fetchRandomQuestions(config.limit, config.category, config.difficulty);
      setQuestions(qs);
      setAnswers({});
      setResult(null);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Lỗi tải câu hỏi:", error);
    } finally {
      setLoading(false);
    }
  }

  function onSelect(qid, idx) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  async function handleSubmit() {
    try {
      const res = await submitAnswers(answers);
      setResult(res);
    } catch (error) {
      alert("Lỗi khi nộp bài!");
    }
  }

  // Tính phần trăm hoàn thành
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentQ = questions[currentIndex];

  if (loading) return <div className="card"><h2>⏳ Đang tải đề thi...</h2></div>;
  if (questions.length === 0) return <div className="card"><h2>❌ Không tìm thấy câu hỏi phù hợp!</h2><button className="btn secondary-btn" onClick={onRetry}>Quay lại cài đặt</button></div>;
  if (result) return <Result result={result} onRetake={onRetry} />;

  return (
    <div className="card">
      {/* Header: Timer & Info */}
      <div className="quiz-header">
        <div>
          <span style={{ fontWeight: 'bold', color: '#6b7280' }}>
            Câu {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <Timer seconds={TIME_LIMIT} onTimeUp={handleSubmit} />
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Question Content */}
      <div className="question-text">
        {currentQ.title}
      </div>

      {/* Options */}
      <div className="options-grid">
        {currentQ.choices.map((choice, idx) => (
          <div
            key={idx}
            className={`option-item ${answers[currentQ.id] === idx ? 'selected' : ''}`}
            onClick={() => onSelect(currentQ.id, idx)}
          >
            <span style={{fontWeight: 'bold', marginRight: '10px'}}>{String.fromCharCode(65 + idx)}.</span> 
            {choice}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button 
          className="btn secondary-btn" 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          style={{ width: '48%' }}
        >
          ⬅ Câu trước
        </button>
        
        {currentIndex < questions.length - 1 ? (
          <button 
            className="btn primary-btn" 
            onClick={() => setCurrentIndex(prev => prev + 1)}
            style={{ width: '48%' }}
          >
            Câu sau ➡
          </button>
        ) : (
          <button 
            className="btn primary-btn" 
            style={{ backgroundColor: '#10b981', width: '48%' }} 
            onClick={handleSubmit}
          >
            Nộp Bài ✅
          </button>
        )}
      </div>
    </div>
  );
}