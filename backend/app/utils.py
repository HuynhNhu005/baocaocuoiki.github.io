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
        selected = submitted_answers.get(str(qid)) or submitted_answers.get(qid)
        is_correct = (selected is not None) and int(selected) == int(q.answer)
        if is_correct:
            correct += 1
        details.append({
            "id": qid,
            "title": q.title,
            "selected": selected,
            "correct_answer": q.answer,
            "is_correct": is_correct,
            "explanation": q.explanation
        })
    score = (correct / total * 100) if total else 0
    return {"total": total, "correct": correct, "score": score, "details": details}
