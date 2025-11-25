def calculate_score(submitted_answers, questions):
    score = 0
    for user_ans, q in zip(submitted_answers, questions):
        if user_ans == q.correct_answer:
            score += 1
    return score
