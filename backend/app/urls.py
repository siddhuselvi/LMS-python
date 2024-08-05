from django.urls import path
from . import views
from .views import ExcelImportView_Tests,ExcelImportView_Candidate, ExcelImportView_Questions, TestCandidatesMapView, ExcelImportView_Questions_Code, ExcelImportView_Candidateuser, ExcelImportView_CandidateLAST
from django.views.decorators.csrf import csrf_exempt
from .views import import_questions_from_word,import_questions

urlpatterns = [

    path('api/appinfo/', views.appinfogetAPIView.as_view(), name='appinfo-list'),
    path('api/appinfo/create/', views.appinfoAPIView.as_view(), name='appinfo-create'),
    path('api/appinfo/<int:pk>/', views.appinfoRetrieveUpdateDestroyAPIView.as_view(), name='appinfo-detail'),
   
    path('api/get/login/', views.get_login, name='login-retrive'),
    path('api/add/login/', views.login_create.as_view(), name='login-create'),
    path('api/update/login/<str:user_name>/', views.update_login, name='login-update'),
    path('api/delete/login/<int:pk>/', views.delete_login, name='login-delete'),
    
    path('api/skilltypes/', views.skilltypegetAPIView.as_view(), name='skilltype-list'),
    path('api/skilltypes/create/', views.skilltypecreateAPIView.as_view(), name='skilltype-create'),
    path('api/skilltypes/<int:pk>/', views.skilltypeRetrieveUpdateDestroyAPIView.as_view(), name='skilltype-detail'),
    path('api/skilltypes/<int:pk>/delete/', views.delete_skill_type, name='delete-skilltype'),

    path('api/testtypes/', views.test_type_listView.as_view(), name='testtypes-list'),
    path('api/testtypes/create/', views.test_type_create.as_view(), name='testtypes-create'),
    path('api/testtypes/<int:pk>/', views.test_type_Update.as_view(), name='testtypes-detail'),
    path('api/testtypes/<int:pk>/delete/', views.delete_test_type, name='delete-testtypes'),

    path('api/questiontypes/', views.question_type_listView.as_view(), name='questiontypes-list'),
    path('api/questiontypes/create/', views.question_type_create.as_view(), name='questiontypes-create'),
    path('api/questiontypes/<int:pk>/', views.question_type_Update.as_view(), name='questiontypes-detail'),
    path('api/questiontypes/<int:pk>/delete/', views.delete_question_type, name='delete-questiontypes'),

    path('api/colleges/', views.CollegeListView.as_view(), name='college-list'),
    path('api/colleges/create/', views.collegeCreateView.as_view(), name='college-create'),
    path('api/colleges/update/<int:pk>/', views.collegeUpdateView.as_view(), name='college-update'),
    path('api/colleges/delete/<int:pk>/', views.delete_college, name='college-delete'),

    # Department URLs
    path('api/departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('api/departments/create/', views.departmentCreateView.as_view(), name='department-create'),
    path('api/departments/update/<int:pk>/', views.departmentUpdateView.as_view(), name='department-update'),
    path('api/departments/delete/<int:pk>/', views.delete_department, name='department-delete'),
     
    path('api/topic/', views.topicListView.as_view(), name='topic-list'),
    path('api/topic/create/', views.topicCreateView.as_view(), name='topic-create'),
    path('api/topic/<int:pk>/', views.topicUpdateView.as_view(), name='topic-detail'),
    path('api/topic/<int:pk>/delete/', views.delete_topic, name='delete-topic'),

    path('api/skills/', views.skillsAPIView.as_view(), name='skill-list'),
    path('api/skills/create/', views.skillscreateAPIView.as_view(), name='skill-create'),
    path('api/skills/<int:pk>/', views.skillsRetrieveUpdateAPIView.as_view(), name='skill-detail'),
    path('api/skills/<int:pk>/delete/', views.delete_skills, name='delete-skill'),

    path('api/course/', views.get_course, name='course-list'),
    path('api/course/create/', views.coursecreateAPIView.as_view(), name='course-create'),
    path('api/course/<int:pk>/', views.courseUpdateAPIView.as_view(), name='course-detail'),
    path('api/course/<int:pk>/delete/', views.delete_course, name='delete-course'),
    
    path('api/candidates/', views.get_candidate, name='candidates-list'),
    path('api/candidates/all/', views.get_candidate_all, name='candidates-list-all'),
    path('api/candidates/create/', views.candidatescreateAPIView.as_view(), name='candidates-create'),
    path('api/candidates/<int:pk>/', views.candidates_Select_Update.as_view(), name='candidates-detail'),
    path('api/candidates/<int:pk>/delete/', views.delete_candidates, name='delete-candidates'),
    
    path('api/content/', views.get_content, name='content-list'),
    path('api/content/create/', views.contentcreateAPIView.as_view(), name='content-create'),
    path('api/content/<int:pk>/', views.contentUpdateAPIView.as_view(), name='content-detail'),
    path('api/content/<int:pk>/delete/', views.delete_content, name='delete-content'),

    # path('api/trainers/', views.TrainerListAPIView.as_view(), name='trainer-list'),
    path('api/trainers/all/', views.get_trainer_all, name='candidates-list-all'),
    path('api/trainers/create/', views.TrainerCreateAPIView.as_view(), name='trainer-create'),
    path('api/trainers/<int:pk>/', views.TrainerRetrieveUpdateAPIView.as_view(), name='trainer-detail'),
    path('api/trainers/<int:pk>/delete/', views.delete_trainer, name='delete-trainer'),
   
    path('api/tests/get/', views.get_test, name='tests-list'),
   # path('api/tests/delete/<int:pk>/', views.testsRetrievedeleteAPIView.as_view(), name='tests-delete'),
    path('api/tests/create/', views.testcreateAPIView.as_view(), name='tests-create'),
    path('api/tests/<int:pk>/', views.testsRetrieveUpdateAPIView.as_view(), name='tests-detail'),
    path('api/tests/<int:pk>/delete/', views.delete_tests, name='delete-tests'),
   
    path('api/questions/', views.get_questions, name='questions-list'),
    path('api/questions/create/', views.questionscreateAPIView.as_view(), name='questions-create'),
    path('api/questions/<int:pk>/', views.questionsRetrieveUpdateAPIView.as_view(), name='questions-detail'),
    path('api/questions/<int:pk>/delete/', views.delete_question, name='delete-questions'),
  
    path('api/collegeadmin/', views.get_collegeadmin, name='admin-list'),
    path('api/collegeadmin/create/', views.collegeadmincreateAPIView.as_view(), name='admin-create'),
    path('api/collegeadmin/<int:pk>/', views.collegeadminRetrieveUpdateAPIView.as_view(), name='admin-detail'),
    path('api/collegeadmin/<int:pk>/delete/', views.delete_college_admin, name='delete-admmin'),
    
    path('api/course/content/', views.get_course_content, name='get_course_content'),
    path('api/course/content/create/', views.coursecontentscreateAPIView.as_view(), name='create_course_content'),
    path('api/course/content/update/<int:pk>/', views.coursecontentsUpdateAPIView.as_view(), name='update_course_content'),
    path('api/course/content/delete/<int:pk>/', views.delete_course_contents, name='delete_course_content'),
     
    path('api/course-candidates-map/', views.get_course_candidates_map, name='course-candidates-map'),
    path('api/course-candidates-map/create/', views.coursecandidatesmapcreateAPIView.as_view(), name='create-course-candidates-map'),
    path('api/course-candidates-map/update/<int:pk>/', views.coursecandidatesmapUpdateAPIView.as_view(), name='update-course-candidates-map'),
    path('api/course-candidates-map/delete/<int:pk>/', views.delete_course_can, name='delete-course-candidates-map'),

    path('api/content-detail/', views.get_content_detail, name='content-detail'),
    path('api/content-detail/create/', views.contentdetailcreateAPIView.as_view(), name='create-content-detail'),
    path('api/content-detail/update/<int:pk>/', views.coursecontentdetailUpdateAPIView.as_view(), name='update-content-detail'),
    path('api/content-detail/delete/<int:pk>/', views.delete_content_detail, name='delete-content-detail'),
   
    path('api/testcandidate/', views.get_tests_candidates_map, name='tests-candidates-map-list'),
    path('api/testcandidate/create/', views.testcandidatemapcreateAPIView.as_view(), name='tests-candidates-map-create'),
    path('api/testcandidate/update/', views.testcandidatemapUpdateAPIView.as_view(), name='tests-candidates-map-detail'),
    path('api/testcandidate/update/test_master/', views.test_master_UpdateAPIView.as_view(), name='test_master_UpdateAPIView'),

    path('api/testcandidate/<str:test_name>/delete/', views.delete_testcandidatemap, name='delete-tests-candidates-map'),
    path('api/testcandidate/<int:pk>/updateIsActive/', views.update_testcandidatemap_is_active, name='update-isactive-tests-candidates-map'),


    path('api/tests-candidates-answers/', views.get_tests_candidates_answer, name='tests-candidates-answers-list'),
    path('api/tests-candidates-answers/create/', views.testcandidateanscreateAPIView.as_view(), name='tests-candidates-answers-create'),
    path('api/tests-answer/', views.test_candidates_answer_view, name='test_candidates_answer_view'),
    path('api/tests-answer/submit/', views.test_candidates_answer_view_Submit, name='test_candidates_answer_view-submit'),    
    path('api/tests-candidates-answers/<int:pk>/', views.testcandidateansUpdateAPIView.as_view(), name='tests-candidates-answers-detail'),
    path('api/tests-candidates-answers/<int:pk>/delete/', views.delete_testcandidateanswer, name='delete-tests-candidates-answers'),
    

    path('api/get/course_contenet_feedback/', views.get_course_content_feedback, name='course_contenet_feedback-retrive'),
    path('api/add/course_contenet_feedback/', views.add_course_content_feedback.as_view(), name='course_contenet_feedback-create'),
    path('api/update/course_contenet_feedback/<int:pk>/', views.update_course_content_feedback.as_view(), name='course_contenet_feedback-update'),
    path('api/delete/course_contenet_feedback/<int:pk>/', views.delete_course_content_feedback, name='course_contenet_feedback-delete'),

    path('api/get/attendance_master/', views.get_attendance_master, name='attendance_master-retrive'),
    path('api/add/attendance_master/', views.add_attendance_master.as_view(), name='attendance_master-create'),
    path('api/update/attendance_master/<int:pk>/', views.update_attendance_master.as_view(), name='attendance_master-update'),
    path('api/delete/attendance_master/<int:pk>/', views.delete_attendance_master, name='delete_attendance_master-delete'),

    path('api/get/announcement_master/', views.get_announcement_master, name='announcement_master-retrive'),
    path('api/add/announcement_master/', views.add_announcement_master.as_view(), name='announcement_master-create'),
    path('api/update/announcement_master/<int:pk>/', views.update_announcement_master.as_view(), name='announcement_master-update'),
    path('api/delete/announcement_master/<int:pk>/', views.delete_announcement_master, name='announcement_master-delete'),

    path('api/get/trainer_skill_map/', views.get_trainer_skill_map, name='trainer_skill_map-retrive'),
    path('api/add/trainer_skill_map/', views.add_trainer_skill_map.as_view(), name='trainer_skill_map-create'),
    path('api/update/trainer_skill_map/<int:pk>/', views.update_trainer_skill_map.as_view(), name='trainer_skill_map-update'),
    path('api/delete/trainer_skill_map/<int:pk>/', views.delete_trainer_skill_map, name='announctrainer_skill_mapement_master-delete'),

    path('api/get/trainer_availability/', views.get_trainer_availability, name='trainer_availability-retrive'),
    path('api/add/trainer_availability/', views.add_trainer_availability.as_view(), name='trainer_availability-create'),
    path('api/update/trainer_availability/<int:pk>/', views.update_trainer_availability.as_view(), name='trainer_availability-update'),
    path('api/delete/trainer_availability/<int:pk>/', views.delete_trainer_availability, name='trainer_availability-delete'),

    path('api/get/test_question_map/', views.get_testQuestion_map, name='test_question_map-retrive'),
    path('api/add/test_question_map/', views.add_testQuestion_map.as_view(), name='test_question_map-create'),
    path('api/update/test_question_map/<int:pk>/', views.update_testQuestion_map.as_view(), name='test_question_map-update'),
    path('api/delete/test_question_map/<int:pk>/', views.delete_testQuestion_map, name='test_question_map-delete'),

    path('api/get/course_schedule/', views.get_course_schedule, name='course_schedule-retrive'),
    path('api/add/course_schedule/', views.add_course_schedule.as_view(), name='course_schedule-create'),
    path('api/update/course_schedule/<int:pk>/', views.update_course_schedule.as_view(), name='course_schedule-update'),
    path('api/delete/course_schedule/<int:pk>/', views.delete_course_schedule, name='course_schedule-delete'),
   
    path('api/question/import_excel/', ExcelImportView_Questions.as_view(), name='excel-import'),
    path('api/test/import_excel/', ExcelImportView_Tests.as_view(), name='excel-import-test'),
    path('api/Candidate/import_excel/', ExcelImportView_CandidateLAST.as_view(), name='excel-import-Candidate'),
    path('api/question/import_excel/code/', ExcelImportView_Questions_Code.as_view(), name='excel-import'),

    path('api/rules/', views.rules_listView.as_view(), name='rules-list'),
    path('api/rules/create/', views.rules_create.as_view(), name='rules-create'),
    path('api/rules/<int:pk>/', views.rules_Update.as_view(), name='rules-detail'),
    path('api/rules/<int:pk>/delete/', views.delete_rules, name='delete-rules'),
    
    path('api/attendance_excel_data/', views.attendance_excel_data, name='import_excel_data'),
    
    path('api/update/totalScore/<int:pk>/', views.update_totalScore_test_candidate_map, name='total-score-update'),
    path('api/update/avgMark/<int:pk>/', views.update_Avg_Marks_test_candidate_map, name='avg-mark-update'),

    # path('add-test-candidate/<str:batch_no>/', TestCandidatesMapView.as_view(), name='add-test-candidate'),
    path('api/test-candidates-map/create/', TestCandidatesMapView.as_view(), name='test-candidates-map'),
    path('api/test-candidates-map/non-db/create/', views.NonDbTestAssign.as_view(), name='NonDbTestAssign'),
    
    path('api/batch_list/', views.batch_list, name='batch_list'),
    path('api/question_name_list/', views.question_name_list, name='question_name_list'),
    path('api/unique_test_type/', views.unique_test_type, name='unique_test_type'),
    path('api/MCQ_test_type/', views.MCQ_test_type, name='MCQ_test_type'),
    path('api/Coding_test_type/', views.Coding_test_type, name='Coding_test_type'),
    path('api/unique_question_type/', views.unique_question_type, name='unique_question_type'),
    path('api/sidebar/main_menu/', views.sidebarMenu.as_view(), name='sidebarMenu-list'),
    
    path('api/main_menu_Training/', views.main_menu_Training, name='main_menu_Training'),
    path('api/topic_list/', views.topic_list, name='topic_list'),

    path('api/candidates/text/update/<int:pk>/', views.candidates_one_Update.as_view(), name='candidates-detail'),

    path('api/get-question-paper/', views.get_question_paper, name='get_question_paper'),
    path('api/create-question-paper/', views.questionpapercreateAPIView.as_view(), name='create_question_paper'),
    path('api/update-question-paper/<int:pk>/', views.questionpaperUpdateAPIView.as_view(), name='update_question_paper'),
    path('api/delete-question-paper/<int:pk>/', views.delete_question_paper, name='delete_question_paper'),

    path('api/get_last_question_paper/', views.get_last_added_question_paper, name='get_last_question_paper'),
    
    #  path('api/questions_io/', views.get_questions_IO, name='questions-list'),
    path('api/questions_io/create/Op/', views.questionscreateAPIView_IO_OLD.as_view(), name='questions-create-old'),
    path('api/questions_io/<int:pk>/Op/', views.questionsRetrieveUpdateAPIView_IO_OLD.as_view(), name='questions-detail'),
    #  path('api/questions_io/<int:pk>/delete/', views.delete_question_IO, name='delete-questions'),
  
    path('api/questions_io/', views.get_questions_IO, name='questions-list'),
    path('api/questions_io/create/', csrf_exempt(views.upload_question), name='questions-create'),
    path('api/questions_io/<int:pk>/', views.update_question, name='questions-detail'),
    path('api/questions_io/<int:pk>/delete/', views.delete_question_IO, name='delete-questions'), 

    path('api/questions_Code/', views.get_questions_Code, name='questions-list'),
    path('api/questions_Code/create/', views.upload_question_code, name='questions-create'),
    path('api/questions/<int:question_id>/update/', views.update_question_code, name='update_question_code'),
    path('api/questions_Code/<int:question_id>/update/', views.update_question, name='update_question'),

    path('api/questions_all/<int:question_name_id>/', views.get_questions_Qp_id, name='get_questions_Qp_id'),
    path('api/Candidate/user/import_excel/', ExcelImportView_Candidateuser.as_view(), name='excel-import-Candidate'),

    path('api/questions_io/create/code/', views.questionscreateAPIView_IO_code.as_view(), name='questions-create-old'),
    path('api/questions_io/<int:pk>/code/', views.questionsRetrieveUpdateAPIView_IO_code.as_view(), name='questions-detail'),

    path('api/test-update/<int:id>/', views.get_tests_candidates_map_Update_ID, name='get_tests_candidates_map_Update_ID'),
    path('api/testcandidate/Reports/', views.get_tests_candidates_map_Reports, name='tests-candidates-map-list-Reports'),

    path('api/update/need-info/<int:studentID>/', views.update_Need_Candidate_info, name='update_Need_Candidate_info'),
    path('api/update/clg_login/<str:userName>/', views.update_clg_login, name='update_clg_login'),

    path('api/get_candidate_login/', views.get_candidate_login , name='get_candidate_login'),
    
    path('api/test-assign/selected/', views.TestAssignFor_Selected.as_view() , name='TestAssignFor_Selected'),
    path('api/test_group/', views.get_group_test_name , name='get_group_test_name'),

    path('api/test_reports/', views.get_tests_Reports , name='get_tests_reports'),
    
    path('api/company/', views.company_listView.as_view(), name='company_master_list'),
    path('api/company/create/', views.company_create.as_view(), name='company_master_create'),
    path('api/company/<int:pk>/', views.company_master_Update.as_view(), name='company_master_update'),
    path('api/company/<int:pk>/delete/', views.company_master_delete.as_view(), name='company_master_update'),
    path('api/company/delete/<int:pk>/', views.delete_company_master, name='delete_company_master'),
    # Job Master URLs
    path('api/job/', views.get_job, name='get_job'),
    path('api/job/create/', views.jobcreateAPIView.as_view(), name='job_create'),
    path('api/job/<int:pk>/', views.jobUpdateAPIView.as_view(), name='job_update'),
    path('api/job/delete/<int:pk>/', views.delete_job, name='delete_job'),

    # Event Master URLs
    path('api/event/', views.get_event, name='get_event'),
    path('api/event/create/', views.eventcreateAPIView.as_view(), name='event_create'),
    path('api/event/<int:pk>/', views.eventUpdateAPIView.as_view(), name='event_update'),
    path('api/event/delete/<int:pk>/', views.delete_events, name='delete_event'),

    
    #------------------Placement admin Dashboard------------------------#

    path('api/distinct-test-name-count-today/', views.get_distinct_test_name_count_today, name='get_distinct_test_name_count_today'),
    path('api/avg-total-present/', views.get_avg_total_present, name='avg-total-present'),
    path('api/avg-total-absent/', views.get_avg_total_absent, name='avg-total-absent'),

    #-----------------Students Dashboards------------------------------------#

    path('api/events/<int:college_id>/<int:department_id>/', views.get_events_by_college_and_department, name='get_events_by_college_and_department'),
    #path('import-questions/', ImportQuestionsView.as_view(), name='import-questions'),
    path('api/import-mcq-questions/', csrf_exempt(import_questions_from_word), name='import_questions'),
    path('api/import-coding-questions/', csrf_exempt(import_questions), name='import_questions'),
    #______________training_report________________________________

    path('api/get-training-report/', views.get_training_report, name='get_training_report'),
    path('api/create-training-report/', views.trainingreportcreateAPIView.as_view(), name='create_training_report'),
    path('api/update-training-report/<int:pk>/', views.trainingreportUpdateAPIView.as_view(), name='update_training_report'),
    path('api/delete-training-report/<int:pk>/', views.delete_training_report, name='delete_training_report'),
 
 
    path('api/trainer-feedback/create/', views.add_trainer_feedback.as_view(), name='add_trainer_feedback'),
    path('api/trainer-feedback/get/', views.get_trainer_feedback, name='get_trainer_feedback'),
    path('api/trainer-feedback/update/<int:pk>/', views.update_trainer_feedback.as_view(), name='update_trainer_feedback'),
    path('api/trainer-feedback/delete/<int:pk>/', views.delete_trainer_feedback, name='delete_trainer_feedback'),
    #----------------------Compiler coding Test----------------------#
    
    path('api/program_compiler/', views.program_compiler, name='program_compiler'),
    
    path('api/tests-answer-com/', views.test_candidates_answer_view_Com, name='test_candidates_answer_view'),
    path('api/tests-answer-com/submit/', views.test_candidates_answer_view_Submit_Com, name='test_candidates_answer_view-submit'),    
    path('api/get-last-compiler-output/<int:student_id>/', views.get_last_compiler_output, name='get_last_compiler_output'),
    path('api/insert_empty_output/<int:student_id>/', views.insert_empty_output_view, name='insert_empty_output'),

    #----------------------Training admin dashboard----------------------#

    path('api/distinct-test-name-count/<int:college_id>/', views.get_distinct_test_name_count, name='get_distinct_test_name_count'),    
    path('api/avg-score-by-department/<int:college_id>/<str:dtm_start>/', views.get_avg_score_by_department, name='get_avg_score_by_department'),
    path('api/avg-score-by-department-coding/<int:college_id>/<str:dtm_start>/', views.avg_score_by_department_Coding, name='avg_score_by_department_Coding'),
    path('api/max-score-by-department/<int:college_id>/', views.get_max_score_by_department, name='get_max_score_by_department'),
    path('api/max-score-by-department-coding/<int:college_id>/', views.get_max_score_by_department_coding, name='get_max_score_by_department-coding'),
    path('api/count-company-names/', views.count_company_names, name='count_company_names'),
    path('api/candidates/all/<int:college_id>/', views.get_candidate_all_college_id, name='candidates-list-all'),
    
    #------------------Placement admin Dashboard------------------------#

    path('api/distinct-test-name-count-today/', views.get_distinct_test_name_count_today, name='get_distinct_test_name_count_today'),
    path('api/avg-total-present/', views.get_avg_total_present, name='avg-total-present'),
    path('api/avg-total-absent/', views.get_avg_total_absent, name='avg-total-absent'),

    #-----------------Students Dashboards------------------------------------#

    path('api/events/<int:college_id>/<int:department_id>/', views.get_events_by_college_and_department, name='get_events_by_college_and_department'),
    path('api/course-progress/<int:student_id>/', views.course_progress, name='course_progress'),
    path('api/tests-by-student/<int:student_id>/', views.get_tests_by_student, name='get_tests_by_student'),
    path('api/avg-total-score-by-month/<int:student_id>/', views.get_avg_total_score_by_month, name='avg_total_score_by_month'),
    path('api/attendance-stu/<str:reg_no>/', views.attendance_report_new, name='attendance_report'),
  
    #------------- Interview Master URLs---------------------------#
    path('api/interview/', views.get_interview_master, name='get_job'),
    path('api/interview/create/', views.interview_master_createAPIView.as_view(), name='job_create'),
    path('api/interview/<int:pk>/', views.interview_master_UpdateAPIView.as_view(), name='job_update'),
    path('api/interview/delete/<int:pk>/', views.delete_interview_master, name='delete_job'),

    #------------- interview_schedule URLs---------------------------#
    path('api/interview_schedule/', views.get_interview_schedule, name='get_job'),
    path('api/interview_schedule/create/', views.interview_schedule_createAPIView.as_view(), name='job_create'),
    path('api/interview_schedule/<int:pk>/', views.interview_schedule_UpdateAPIView.as_view(), name='job_update'),
    path('api/interview_schedule/delete/<int:pk>/', views.delete_interview_schedule, name='delete_job'),

    #------------- interview_result URLs---------------------------#
    path('api/interview_result/', views.get_interview_result, name='get_job'),
    path('api/interview_result/create/', views.interview_result_createAPIView.as_view(), name='job_create'),
    path('api/interview_result/<int:pk>/', views.interview_result_UpdateAPIView.as_view(), name='job_update'),
    path('api/interview_result/delete/<int:pk>/', views.delete_interview_result, name='delete_job'),

    #------------- Student Request URLs---------------------------#
    path('api/student_request/', views.get_student_request, name='get_job'),
    path('api/student_request/create/', views.student_request_createAPIView.as_view(), name='job_create'),
    path('api/student_request/<int:pk>/', views.student_request_UpdateAPIView.as_view(), name='job_update'),
    path('api/student_request/delete/<int:pk>/', views.delete_student_request, name='delete_job'),

    #---------------------------Upcomming interviews-------------------------#

    path('api/interview-schedule/<int:college_id>/<int:department_id>/', views.interview_schedule_view, name='interview_schedule'),
    path('api/interview-status-count/<int:college_id>/<int:company_id>/', views.interview_status_count_view, name='interview_status_count'),
    path('api/interview-result-stu/<int:college_id>/', views.interview_result_view, name='interview_result'),
    path('api/interview-result-stu-email/<int:college_id>/', views.interview_result_view_emailAddress, name='interview_result_view_emailAddress'),
    path('api/total-no-of-offers/<int:college_id>/', views.total_no_of_offers, name='interview_result_view_emailAddress'),
    path('api/pending-requests-count/', views.pending_requests_count, name='pending_requests_count'),
  
    #---------------------------Django Login---------------------------------#


    path('api/add/user-profiles/', views.add_user_profile, name='add_user_profile'),
    path('api/user-profiles/', views.view_user_profile, name='view_user_profile'),
    path('api/view/user-profiles/', views.custom_user_profiles, name='view_user_profile'),
    path('api/user-profiles/<int:pk>/update/', views.update_user_profile, name='update_user_profile'),
    path('api/user-profiles/<int:pk>/delete/', views.delete_user_profile, name='delete_user_profile'),
  
  
    path('api/update/lms/<int:id>/', views.update_LMS_id, name='update_LMS_id'),
    path('api/topic/lms/<int:id>/', views.update_LMS_Topic_id, name='update_LMS_Topic_id'),


    path('api/get-test-type-category/<str:test_name>/', views.get_test_type_category, name='get_test_type_category'),
    path('api/test-candidates/<str:username>/need-info/', views.get_test_candidates_NeedInfo, name='get_test_candidates_NeedInfo'),
  
    #-------------------------student Dasboard New-------------------------------#

    path('api/active-tests-count/<int:student_id>/', views.active_tests_count, name='active-tests-count'),
    path('api/number-of-offers/<int:candidate_id>/', views.get_number_of_offers, name='get-number-of-offers'),
    path('api/student-requests/count/<int:student_id>/', views.count_student_requests, name='count-student-requests'),
    path('api/monthly-avg-total-score/<int:student_id>/apditute/', views.get_monthly_avg_total_score_apditute, name='monthly-avg-total-score'),
    path('api/monthly-avg-total-score/<int:student_id>/softskill/', views.get_monthly_avg_total_score_softskill, name='monthly-avg-total-score'),
    path('api/monthly-avg-total-score/<int:student_id>/technical/', views.get_monthly_avg_total_score_technical, name='monthly-avg-total-score'),
    path('api/monthly-avg-total-score/<int:student_id>/coding/', views.get_monthly_avg_total_score_Coding, name='monthly-avg-total-score'),

    path('api/number-of-offers/<int:college_id>/college_id/', views.get_number_of_offers_college_id, name='get-number-of-offers'),
    path('api/student-requests/count/<int:college_id>/college_id/', views.count_student_requests_college_id, name='count-student-requests'),
   
    #------Student Attendance table------------------------------------------#
    # path('summary/', views.view_attendance_summary, name='view_attendance_summary'),

    path('api/schedule-with-tests/<str:dtm_start>/<int:student_id>/', views.get_schedule_with_tests, name='schedule_with_tests'),

    path('api/testcandidate/mcq/<str:user_name>/', views.get_tests_candidates_map_MCQ, name='tests-candidates-map-list-mcq'),
    path('api/testcandidate/coding/<str:user_name>/', views.get_tests_candidates_map_Coding, name='tests-candidates-map-list-mcq'),
    
    #--------------------------PLACEMENT------------------------------#


    path('api/tests-reports/<int:college_id>/placement/', views.get_tests_Reports_placement, name='get_tests_reports_placement'),
    path('api/tests-schedules/<int:college_id>/placement/', views.get_group_test_name_placement, name='get_group_test_name_placement'),
    path('api/tests-reports-candidates/<int:college_id>/<str:test_name>/placement/', views.get_tests_Reports_placement_Candidates, name='get_tests_reports_placement'),
    path('api/candidates-by-last-job/', views.get_candidate_all_job_master, name='get_candidate_all_job_master'),

    path('api/students-test-schedule/<int:college_id>/<str:user_name>/', views.get_students_test_schedule, name='tests-candidates-map-list'),
    
    path('api/questions_io/<int:question_id>/filter/', views.get_questions_IO_filter, name='get_questions_IO_filter'),
    path('api/test-list/<str:test_name>/', views.get_tests_candidates_map_testName, name='tests-candidates-map-list'),
    path('api/test_reports/candidates/<str:test_name>/', views.get_tests_Reports_candidates , name='get_tests_Reports_candidates'),
    
    path('api/course-schedule-map/', views.CourseScheduleMapView.as_view(), name='course-schedule-map'),

    path('api/sub_topic/<str:topic_name>/', views.get_content_master_subTopic, name='content-master'),

    path('api/course-content/students/', views.students_course_content_view, name='course-content'),

    path('api/delete-question-paper/<str:question_paper_name>/', views.delete_question_paper_by_name, name='delete-question-paper-by-name'),

    path('api/course-content/Trainer/', views.Trainer_course_content_view, name='course-content'),
    
    path('api/candidates/username/', views.get_candidate_user_name, name='candidates-list-all'),

    path('api/candidate-info/', views.candidate_info, name='candidate-info'),
    path('api/update-candidate-info/', views.update_candidate_info, name='update-candidate-info'),

    path('api/get-department-info/', views.get_department_info, name='get_department_info'),
    path('api/get-department-info/LMS/', views.get_department_info_LMS, name='get_department_info'),

    path('api/get_candidate_details/', views.get_candidate_details, name='get_candidate_details'),

    #--------------College With Logo----------------------------#

    path('api/colleges/list/', views.get_colleges, name='college-list'),
    path('api/colleges/uploads/', views.upload_college, name='college-upload'),
    path('api/colleges/updates/<int:college_id>/', views.update_college, name='college-update'),
    path('api/colleges/deletes/<int:pk>/', views.delete_college, name='college-delete'),
]