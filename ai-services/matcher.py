from sklearn.metrics.pairwise import cosine_similarity
from model import model

THRESHOLD = 0.55


def match_skills(student_skills, job_skills):

    student_skills = list(set([s.strip().lower() for s in student_skills if s]))
    job_skills = list(set([s.strip().lower() for s in job_skills if s]))

    if not student_skills or not job_skills:
        return {
            "match_score": 0.0,
            "matched_skills": [],
            "missing_skills": job_skills
        }

    student_embeddings = model.encode(student_skills)
    job_embeddings = model.encode(job_skills)

    similarity = cosine_similarity(job_embeddings, student_embeddings)

    matched = []
    missing = []
    total = 0.0

    for i in range(len(job_skills)):
        best = similarity[i].argmax()
        score = float(similarity[i][best])   
      
        total += score

        if score >= THRESHOLD:
            matched.append({
                "job_skill": job_skills[i],
                "student_skill": student_skills[best],
                "similarity": round(score, 2)
            })
        else:
            missing.append(job_skills[i])

    final_score = float(round((total / len(job_skills)) * 100, 2))

    return {
        "match_score": final_score,
        "matched_skills": matched,
        "missing_skills": missing
    }