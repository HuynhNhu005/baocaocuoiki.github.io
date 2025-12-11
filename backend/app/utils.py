from fastapi import HTTPException

def grade(questions_with_answers, submitted_answers: dict):
    """
    questions_with_answers: list of Question models (include .answer)
    submitted_answers: dict {question_id: selected_index}
    """
    total = len(questions_with_answers)
    correct = 0
    details = []
    
    for q in questions_with_answers:
        qid = q.id
        # Lấy đáp án user chọn (ép kiểu về int nếu có)
        selected = submitted_answers.get(str(qid))
        if selected is None:
            selected = submitted_answers.get(qid)
            
        # Kiểm tra đúng/sai
        is_correct = False
        if selected is not None:
            try:
                is_correct = (int(selected) == int(q.answer))
            except ValueError:
                pass # Selected không phải số hợp lệ
        
        if is_correct:
            correct += 1
            
        details.append({
            "id": qid,
            "title": q.title,
            "selected": selected,
            "correct_answer": q.answer,
            "choices": q.choices,  # <--- THÊM DÒNG NÀY: Gửi danh sách lựa chọn về
            "is_correct": is_correct,
            "explanation": q.explanation
        })
        
    score = (correct / total * 100) if total else 0
    return {"total": total, "correct": correct, "score": score, "details": details}