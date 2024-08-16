from django.contrib import admin
from .models import (
    appinfo, test_master, candidate_master, question_master, skills_master, 
    skill_type, login, test_type, question_type,
     content_master,  department_master, 
    topic_master, tests_candidates_map, tests_candidates_answers, course_schedule, 
     course_content_feedback, attendance_master, announcement_master, 
     test_question_map, rules, compiler_output, StudentAttendance,
    job_master, company_master, question_paper_master, question_master_temp
)

admin.site.register(appinfo)
admin.site.register(test_master)
admin.site.register(candidate_master)
admin.site.register(question_master)
admin.site.register(skills_master)
admin.site.register(skill_type)
admin.site.register(login)
admin.site.register(test_type)
admin.site.register(question_type)
admin.site.register(content_master)
admin.site.register(department_master)
admin.site.register(topic_master)
admin.site.register(tests_candidates_map)
admin.site.register(tests_candidates_answers)
admin.site.register(course_schedule)
admin.site.register(course_content_feedback)
admin.site.register(attendance_master)
admin.site.register(announcement_master)
admin.site.register(test_question_map)
admin.site.register(rules)
admin.site.register(compiler_output)
admin.site.register(StudentAttendance)
admin.site.register(job_master)
admin.site.register(company_master)
admin.site.register(question_paper_master)
admin.site.register(question_master_temp)
