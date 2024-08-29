import axios from 'axios';
import { format } from 'date-fns';
// import Cookies from "js-cookie";



const API_URL = "http://localhost:8000";

//const API_URL = "https://cc.kwantumg.com";

 // const API_URL = "https://ccportal.co.in";



export function getLoginApi() {
  return axios.get(`${API_URL}/api/get/login/`)
    .then(response => response.data)
}
export function addLoginApi(log) {
  return axios.post(`${API_URL}/api/add/login/`, {
    id: null,
    email_id: log.email_id,
    college_id: log.college_id,
    user_name: log.user_name,
    password: log.password,
    role: log.role,
    dtm_created: log.dtm_created,
    dtm_trainer: log.dtm_trainer,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateLoginApi(id, log) {
  return axios.put(`${API_URL}/api/update/login/${id}/`, {

    email_id: log.email_id,
    user_name: log.user_name,
    college_id: log.college_id,
    password: log.password,
    role: log.role,
  })
    .then(response => response.data);

}

export function deleteloginApi(id) {
  return axios.patch(`${API_URL}/api/delete/login/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//--------------------------------Test-------------------------------
export function addTestsApi(test) {

  return axios.post(`${API_URL}/api/tests/create/`, {
    id: null,
    test_name: test.test_name,
    test_type_id: test.test_type_id,
    question_type_id: test.question_type_id,

    skill_type_id: test.skill_type_id,
    // course_id: test.course_id,

    //need_candidate_info: test.need_candidate_info,
  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function getTestsApi() {
  return axios.get(`${API_URL}/api/tests/get/`)
    .then(response => response.data)
}


export async function updateTestsApi(id, test) {

  return axios.put(`${API_URL}/api/tests/${id}/`, {
    test_name: test.test_name,
    test_type_id: test.test_type_id,
    question_type_id: test.question_type_id,
    //students_count: test.students_count,
    //dtm_start: test.dtm_start,
    // dtm_end: test.dtm_end,
    //college_id: test.college_id,
    // duration: test.duration,
    // year: test.year,
    // department_id: test.department_id,
    //rules_id: test.rules_id,
    skill_type_id: test.skill_type_id,
    // course_id: test.course_id,

    //need_candidate_info: test.need_candidate_info,
  })
    .then(response => response.data);

}
export function deleteTestsApi(id) {
  return axios.patch(`${API_URL}/api/tests/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//---------------------------candidate------------------------
export function addcandidateApi(trainees) {
  return axios.post(`${API_URL}/api/candidates/create/`, {
    id: null,
    skill_id: trainees.skill_id,
    college_id: trainees.college_id,
    students_name: trainees.students_name,
    user_name: trainees.user_name,
    registration_number: trainees.registration_number,
    gender: trainees.gender,
    text: trainees.text,
    email_id: trainees.email_id,
    mobile_number: trainees.mobile_number,

    department_id: trainees.department_id,
    year: trainees.year,
    cgpa: trainees.cgpa,
    marks_10th: trainees.marks_10th,
    marks_12th: trainees.marks_12th,
    // marks_semester_wise: trainees.marks_semester_wise,
    history_of_arrears: trainees.history_of_arrears,
    standing_arrears: trainees.standing_arrears,
    number_of_offers: trainees.number_of_offers,
    it_of_offers: trainees.it_of_offers,
    core_of_offers: trainees.core_of_offers,


    batch_no: trainees.batch_no,
    // org_id:trainees.org_id

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add Trainees Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getcandidatesApi() {
  return axios.get(`${API_URL}/api/candidates/`)
    .then(response => response.data)
}


export function getcandidatesApi_ALL() {
  return axios.get(`${API_URL}/api/candidates/all/`)
    .then(response => response.data)
}




export async function updatecandidatesApi(id, trainees) {
  const url = `${API_URL}/api/candidates/${id}/`;
  console.log('PUT Request URL: ', url);
  console.log('Payload: ', trainees);

  return axios.put(url, {
    college_id: trainees.college_id,
    students_name: trainees.students_name,
    registration_number: trainees.registration_number,
    gender: trainees.gender,
    text: trainees.text,
    email_id: trainees.email_id,
    mobile_number: trainees.mobile_number,
    department_id: trainees.department_id,
    year: trainees.year,
    cgpa: trainees.cgpa,
    skill_id: trainees.skill_id,
    marks_10th: trainees.marks_10th,
    marks_12th: trainees.marks_12th,
    // marks_semester_wise: trainees.marks_semester_wise,
    history_of_arrears: trainees.history_of_arrears,
    standing_arrears: trainees.standing_arrears,
    number_of_offers: trainees.number_of_offers,
    it_of_offers: trainees.it_of_offers,
    core_of_offers: trainees.core_of_offers,

    // user_name: trainees.user_name,
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error response data: ', error.response.data);
      throw error;
    });
}


export function deletecandidatesApi(id) {
  return axios.patch(`${API_URL}/api/candidates/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//------------------------------skill------------------------------
export function addSkillApi(skill) {
  return axios.post(`${API_URL}/api/skills/create/`, {
    id: null,
    skill_name: skill.skill_name,



  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add Trainees Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getSkillApi() {
  return axios.get(`${API_URL}/api/skills/`)
    .then(response => response.data)
}


export async function updateSkillApi(id, skill) {
  return axios.put(`${API_URL}/api/skills/${id}/`, {

    skill_name: skill.skill_name,

  })
    .then(response => response.data);

}

export function deleteSkillApi(id) {
  return axios.patch(`${API_URL}/api/skills/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//---------------------------------skill-type---------------------------------
export function addSkilltypeApi(skilltype) {
  return axios.post(`${API_URL}/api/skilltypes/create/`, {
    id: null,
    skill_type: skilltype.skill_type


  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add Skill type Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getSkilltypeApi() {
  return axios.get(`${API_URL}/api/skilltypes/`)
    .then(response => response.data)
}


export async function updateSkilltypeApi(id, skilltype) {
  return axios.put(`${API_URL}/api/skilltypes/${id}/`, {

    skill_type: skilltype.skill_type

  })
    .then(response => response.data);

}

export function deleteSkilltypeApi(id) {
  return axios.patch(`${API_URL}/api/skilltypes/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//------------------------- question---------------------------------
export function addquestionApi(Questions) {
  return axios.post(`${API_URL}/api/questions/create/`, {
    id: null,
    question_name: Questions.question_name,
    question_text: Questions.question_text,
    topic_id: Questions.topic_id,
    // sub_topic:Questions.sub_topic,
    option_a: Questions.option_a,
    option_b: Questions.option_b,
    option_c: Questions.option_c,
    option_d: Questions.option_d,
    answer: Questions.answer,
    negative_mark: Questions.negative_mark,
    view_hint: Questions.view_hint,
    mark: Questions.mark,
    explain_answer: Questions.explain_answer,
    input_format: Questions.input_format,
    // is_active: Questions.is_active
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getquestionApi() {
  return axios.get(`${API_URL}/api/questions/`)
    .then(response => response.data)
}


export async function updatequestionApi(id, Questions) {
  console.log("Updating question with ID:", id, "Data:", Questions);
  return axios.put(`${API_URL}/api/questions/${id}/`, {

    question_name: Questions.question_name,
    question_text: Questions.question_text,
    // sub_topic:Questions.sub_topic,
    topic_id: Questions.topic_id,
    option_a: Questions.option_a,
    option_b: Questions.option_b,
    option_c: Questions.option_c,
    option_d: Questions.option_d,
    // option_e: Questions.option_e,
    // option_f: Questions.option_f,
    // question_type_id: Questions.question_type_id,
    //skill_id: Questions.skill_id,
    answer: Questions.answer,
    negative_mark: Questions.negative_mark,
    view_hint: Questions.view_hint,
    mark: Questions.mark,
    explain_answer: Questions.explain_answer,
    // is_active: Questions.is_active
  })
    .then((response) => {
      console.log("Update response:", response.data);
      console.log("Update was successful"); // New log to check if this block is executed
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating question:", error);
      throw error;
    });
}

export function deletequestionApi(id) {
  return axios.patch(`${API_URL}/api/questions/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}

//---------------------------testtype-----------------------------
export function addtesttypeApi(testtype) {
  return axios.post(`${API_URL}/api/testtypes/create/`, {
    id: null,
    test_type: testtype.test_type,
    test_type_categories: testtype.test_type_categories

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function gettesttypeApi() {
  return axios.get(`${API_URL}/api/testtypes/`)
    .then(response => response.data)
}


export async function updatetesttypeApi(id, testtype) {
  return axios.put(`${API_URL}/api/testtypes/${id}/`, {

    test_type: testtype.test_type,
    test_type_categories: testtype.test_type_categories



  })
    .then(response => response.data);

}


export function deletetesttypeApi(id) {
  return axios.patch(`${API_URL}/api/testtypes/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//----------------------------question_type-----------------------------
export function addqstntypeApi(qstntype) {
  return axios.post(`${API_URL}/api/questiontypes/create/`, {
    id: null,
    question_type: qstntype.question_type,


  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getqstntypeApi() {
  return axios.get(`${API_URL}/api/questiontypes/`)
    .then(response => response.data)
}


export async function updateqstntypeApi(id, qstntype) {
  return axios.put(`${API_URL}/api/questiontypes/${id}/`, {

    question_type: qstntype.question_type,


  })
    .then(response => response.data);

}

export function deleteqstntypeApi(id) {
  return axios.patch(`${API_URL}/api/questiontypes/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//----------------------------------college-------------------------

export function addcollgeApi(college) {
  return axios.post(`${API_URL}/api/colleges/create/`, {
    id: null,
    college: college.college,


  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getcollegeApi() {
  return axios.get(`${API_URL}/api/colleges/`)
    .then(response => response.data)
}


export async function updatecollegeApi(id, college) {
  return axios.put(`${API_URL}/api/colleges/update/${id}/`, {

    college: college.college,


  })
    .then(response => response.data);

}

export function deletecollegApi(id) {
  return axios.patch(`${API_URL}/api/colleges/delete/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
// --------------------------------------------department-----------------------------
export function adddepartmentApi(department) {
  return axios.post(`${API_URL}/api/departments/create/`, {
    id: null,
    department: department.department,


  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getdepartmentApi() {
  return axios.get(`${API_URL}/api/departments/`)
    .then(response => response.data)
}


export async function updatedepartmentApi(id, department) {
  return axios.put(`${API_URL}/api/departments/update/${id}/`, {

    department: department.department,


  })
    .then(response => response.data);

}

export function deletedepartmentApi(id) {
  return axios.patch(`${API_URL}/api/departments/delete/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}

//----------------------------topic---------------------------------
export function addtopicApi(cat) {
  return axios.post(`${API_URL}/api/topic/create/`, {
    id: null,
    topic: cat.topic,
    sub_topic: cat.sub_topic

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function gettopicApi() {
  return axios.get(`${API_URL}/api/topic/`)
    .then(response => response.data)
}


export async function updatetopicApi(id, cat) {
  return axios.put(`${API_URL}/api/topic/${id}/`, {

    topic: cat.topic,
    sub_topic: cat.sub_topic


  })
    .then(response => response.data);

}

export function deletetopicApi(id) {
  return axios.patch(`${API_URL}/api/topic/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//_________________________________content___________________________________

export function addcontentApi(content) {
  console.log('Content', content)
  return axios.post(`${API_URL}/api/content/create/`, {
    id: null,
    //content_name: content.content_name,
    content_type: content.content_type,
    content_url: content.content_url,
    actual_content: content.actual_content,
    status: content.status,
    // added_by: content.added_by,
    topic: content.topic,
    sub_topic: content.sub_topic,
    skill_type_id: content.skill_type_id,
    question_type_id: content.question_type_id,
    // size: content.size,
    //guidelines: content.guidelines,
    dtm_active_from: content.dtm_active_from,
    dtm_validity: content.dtm_validity,
    // feedback: content.feedback
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add test trainee Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function getcontentApi() {
  return axios.get(`${API_URL}/api/content/`)
    .then(response => response.data)
}


export async function updatecontentApi(id, content) {
  return axios.put(`${API_URL}/api/content/${id}/`, {
    // content_name: content.content_name,
    content_type: content.content_type,
    content_url: content.content_url,
    actual_content: content.actual_content,
    status: content.status,
    // added_by: content.added_by,
    topic_id: content.topic_id,
    skill_type_id: content.skill_type_id,
    question_type_id: content.question_type_id,
    // size: content.size,
    // guidelines: content.guidelines,
    dtm_active_from: content.dtm_active_from,
    dtm_validity: content.dtm_validity,
    //feedback: content.feedback


  })
    .then(response => response.data);

}

export function deletecontentApi(id) {
  return axios.patch(`${API_URL}/api/content/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//__________________________Test_candidate_map___________________________
export function addTestcandidateApi(test) {
  return axios.post(`${API_URL}/api/testcandidate/create/`, {
    id: null,
    test_id: test.test_id,
    question_id: test.question_id,
    student_id: test.student_id,
    college_id: test.college_id,
    department_id: test.department_id,
    dtm_start: test.dtm_start,
    dtm_end: test.dtm_end,
    total_score: test.total_score,
    // attempt_count: test.attempt_count,
    is_camera_on: test.is_camera_on,
    duration: test.duration,
    year: test.year,
    rules_id: test.rules_id,
    // is_active: test.is_active,
    need_candidate_info: test.need_candidate_info

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function getTestcandidateApi() {
  return axios.get(`${API_URL}/api/testcandidate/`)
    .then(response => response.data)
}



export function deleteTestcadidateApi(id) {
  return axios.patch(`${API_URL}/api/testcandidate/${encodeURIComponent(id)}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}


//----------------------Course Schedule-------------------//

export function getCourseScheduleApi() {
  return axios.get(`${API_URL}/api/get/course_schedule/`)
    .then(response => response.data)
}
export function addCourseScheduleApi(log) {
  return axios.post(`${API_URL}/api/add/course_schedule/`, {
    id: null,
    student_id: log.student_id,
    course_id: log.course_id,
    trainer_id: log.trainer_id,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
    course_mode: log.course_mode,
    status: log.status,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateCourseScheduleApi(id, log) {
  return axios.put(`${API_URL}/api/update/course_schedule/${id}/`, {

    student_id: log.student_id,
    course_id: log.course_id,
    trainer_id: log.trainer_id,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
    course_mode: log.course_mode,
    status: log.status,
  })
    .then(response => response.data);
}


export function deleteCourseScheduleApi(id) {
  return axios.patch(`${API_URL}/api/delete/course_schedule/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}



//----------------------Attendance Master-------------------//

export function getAttendanceMasterApi() {
  return axios.get(`${API_URL}/api/get/attendance_master/`)
    .then(response => response.data)
}
export function addAttendanceMasterApi(log) {
  return axios.post(`${API_URL}/api/add/attendance_master/`, {
    id: null,
    student_id: log.student_id,
    course_id: log.course_id,
    test_id: log.test_id,
    dtm_attendance: log.dtm_attendance,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateAttendanceMasterApi(id, log) {
  return axios.put(`${API_URL}/api/update/attendance_master/${id}/`, {

    student_id: log.student_id,
    course_id: log.course_id,
    test_id: log.test_id,
    dtm_attendance: log.dtm_attendance,
  })
    .then(response => response.data);
}


export function deleteAttendanceMasterApi(id) {
  return axios.patch(`${API_URL}/api/delete/attendance_master/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}


//----------------------Announcement Master-------------------//

export function getAnnouncementMasterApi() {
  return axios.get(`${API_URL}/api/get/announcement_master/`)
    .then(response => response.data)
}
export function addAnnouncementMasterApi(log) {
  return axios.post(`${API_URL}/api/add/announcement_master/`, {
    id: null,
    college_id: log.college_id,
    trainer_id: log.trainer_id,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
    content: log.content,
    is_active: log.is_active,

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateAnnouncementMasterApi(id, log) {
  return axios.put(`${API_URL}/api/update/announcement_master/${id}/`, {

    college_id: log.college_id,
    trainer_id: log.trainer_id,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
    content: log.content,
    is_active: log.is_active,

  })
    .then(response => response.data);
}


export function deleteAnnouncementMasterApi(id) {
  return axios.patch(`${API_URL}/api/delete/announcement_master/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}

//----------------------Test Question Map-------------------//

export function getTestQuestionMapApi() {
  return axios.get(`${API_URL}/api/get/test_question_map/`)
    .then(response => response.data)
}
export function addTestQuestionMapApi(log) {
  return axios.post(`${API_URL}/api/add/test_question_map/`, {
    id: null,
    test_id: log.test_id,
    question_id: log.question_id,

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateTestQuestionApi(id, log) {
  return axios.put(`${API_URL}/api/update/test_question_map/${id}/`, {

    test_id: log.test_id,
    question_id: log.question_id,

  })
    .then(response => response.data);
}


export function deleteTestQuestionApi(id) {
  return axios.patch(`${API_URL}/api/delete/test_question_map/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}

//----------------------------------test-candidate-answer--------------


export function getTestAnswerMapApi(username, test_name) {
  return axios.get(`${API_URL}/api/tests-candidates-answers/`, {
    params: { username: username, testName: test_name }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching test answers:', error);
      throw error;
    });
}

export function addTestAnswerMapApi(log) {
  return axios.post(`${API_URL}/api/tests-candidates-answers/create/`, {
    id: null,
    test_id: log.test_id,
    question_id: log.question_id,
    student_id: log.student_id,
    answer: log.answer,
    result: log.result,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
    submission_compile_code: log.submission_compile_code,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function addTestAnswerMapApi_CodeOLD(log, ques_id, ans, code) {
  if (!log || !ques_id || !ans || !code) {
    console.error('Missing parameters for addTestAnswerMapApi', { log, ques_id, ans, code });

  }
  console.log('Endpoint entering.....');

  console.log('log: ', log);
  console.log('ques_id: ', ques_id);
  console.log('ans: ', ans);
  console.log('code: ', code);

  // Encode the code string
  const encodedCode = encodeURIComponent(code);

  return axios.post(`${API_URL}/api/tests-answer/${ques_id}/${ans}/${encodedCode}/`, {
    test_name: log.test_name,
    question_id: log.question_id,
    student_id: log.student_id,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end,
  })
    .then(response => response.data)
    .catch(error => {
      console.log('log: ', log);
      console.log('ques_id: ', ques_id);
      console.log('ans: ', ans);
      console.log('code: ', code);

      console.error('Error adding answer:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export function addTestAnswerMapApi_Code(log) {
  const { test_name, question_id, student_id, dtm_start, dtm_end, ans, code } = log;


  console.log('Endpoint entering.....');
  console.log('log: ', log);

  return axios.post(`${API_URL}/api/tests-answer/`, {
    test_name: test_name,
    question_id: question_id,
    student_id: student_id,
    dtm_start: dtm_start,
    dtm_end: dtm_end,
    ans: ans,
    code: code,
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding answer:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}


export function addTestAnswerMapApi_Code_Submit(log) {
  const { test_name, question_id, student_id, dtm_start, dtm_end, ans, code } = log;


  console.log('Endpoint entering.....');
  console.log('log: ', log);

  return axios.post(`${API_URL}/api/tests-answer/submit/`, {
    test_name: test_name,
    question_id: question_id,
    student_id: student_id,
    dtm_start: dtm_start,
    dtm_end: dtm_end,
    ans: ans,
    code: code,
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding answer:', error);
      //throw error; // Rethrow the error to propagate it further if needed
    });
}



export async function updateTestAnswerApi(id, log) {
  return axios.put(`${API_URL}/api/tests-candidates-answers/${id}/`, {

    test_id: log.test_id,
    question_id: log.question_id,
    student_id: log.student_id,
    answer: log.answer,
    result: log.result,
    dtm_start: log.dtm_start,
    dtm_end: log.dtm_end

  })
    .then(response => response.data);
}


export function deleteTestAnswerApi(id) {
  return axios.patch(`${API_URL}/api/tests-candidates-answers/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}




//----------------------------------Course Content Feedback--------------


export function getCourseContentFeedbackApi() {
  return axios.get(`${API_URL}/api/get/course_contenet_feedback/`)
    .then(response => response.data)
}

export function addCourseContentFeedbackApi(log) {
  return axios.post(`${API_URL}/api/add/course_contenet_feedback/`, {
    id: null,
    //course_id: log.course_id,
    student_id: log.student_id,
    topic_id: log.topic_id,
    dtm_session: log.dtm_session,
    trainer_id: log.trainer_id,
    feedback: log.feedback,
    // department_id:log.department_id
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}


export async function updateCourseContentFeedbackApi(id, log) {
  return axios.put(`${API_URL}/api/update/course_contenet_feedback/${id}/`, {

    course_id: log.course_id,
    student_id: log.student_id,
    topic_id: log.topic_id,
    dtm_session: log.dtm_session,
    trainer_id: log.trainer_id,
    feedback: log.feedback,
    department_id: log.department_id

  })
    .then(response => response.data);
}


export function deleteCourseContentFeedbackApi(id) {
  return axios.patch(`${API_URL}/api/delete/course_contenet_feedback/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}






//---------------------------------Import Api's----------------------------------------//
export const TestsExportAPI = async (formData) => {
  const response = await axios.post(`${API_URL}/api/test/import_excel/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

//export function TestsExportAPI(formData) {
//return axios.post(`${API_URL}/api/test/import_excel/`, formData, {
//headers: {
// 'Content-Type': 'multipart/form-data',
// },
// });
//}

export function CandidateExportAPI(formData) {
  return axios.post(`${API_URL}/api/Candidate/import_excel/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function QuestionsExportAPI(formData) {
  return axios.post(`${API_URL}/api/question/import_excel/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}



//----------------------Trainer_master-------------------------------------------


export function getTrainerApi() {
  return axios
    .get(`${API_URL}/api/trainers/all/`)
    .then((response) => response.data);
}

export function trainer_create_view(formData) {
  return axios
    .post(`${API_URL}/trainer/add/`, formData, {
      headers: {
        "X-CSRFToken": csrftoken,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding trainer:", error);
      throw error;
    });
}


export function trainer_update_view(id, formData) {
  return axios
    .post(`${API_URL}/trainer/edit/${id}/`, formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error editing trainer:", error);
      throw error;
    });
}


const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


export async function addTrainerApi(trainerData) {
  const base64File = await convertToBase64(trainerData.resume); //convert to bytestream
  return await axios
    .post(`${API_URL}/api/trainers/create/`, {
      trainer_name: trainerData.trainer_name,
      state: trainerData.state,
      city: trainerData.city,
      qualification: trainerData.qualification,
      experience: trainerData.experience,
      ready_to_relocate: trainerData.ready_to_relocate,
      mobile_no: trainerData.mobile_no,
      email_id: trainerData.email_id,
      skill_id: trainerData.skill_id,
      languages_known: trainerData.languages_known,
      bank_name: trainerData.bank_name,
      ifsc_code: trainerData.ifsc_code,
      branch_name: trainerData.branch_name,
      account_no: trainerData.account_no,
      resume: base64File,
      user_name: trainerData.user_name.username,
    })
    .then((response) => response.data)
    .catch((error) => {
      // Handle error
      console.error("Error adding login:", error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}


export async function updateTrainerApi(id, log) {
  return axios.put(`${API_URL}/api/trainers/${id}/`, {
    trainer_name: log.trainer_name,
    address: log.address,
    city: log.city,
    country: log.country,
    qualification: log.qualification,
    is_active: log.is_active,
    preferred_city: log.preferred_city,
    mobile_no: log.mobile_no,
    email_id: log.email_id,
    skill_id: log.skill_id,
    languages_known: log.languages_known,
    ifsc_code: log.ifsc_code,
    branch_name: log.branch_name,
    account_no: log.account_no,

  })
    .then(response => response.data);
}


export function deleteTrainerApi(id) {
  return axios
    .patch(`${API_URL}/api/trainers/${id}/delete/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating tests:", error);
      throw error;
    });
}

//------------------------------rules-----------------------------
export function addrulesApi(rules) {
  return axios.post(`${API_URL}/api/rules/create/`, {
    id: null,
    rule_name: rules.rule_name,
    instruction: rules.instruction


  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error to add Trainees Details:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function getrulesApi() {
  return axios.get(`${API_URL}/api/rules/`)
    .then(response => response.data)
}


export async function updaterulesApi(id, rules) {
  return axios.put(`${API_URL}/api/rules/${id}/`, {

    rule_name: rules.rule_name,
    instruction: rules.instruction
  })
    .then(response => response.data);

}

export function deleterulesApi(id) {
  return axios.patch(`${API_URL}/api/rules/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}


export function updateTestcadidateApi_is_active(id) {
  return axios.patch(`${API_URL}/api/testcandidate/${id}/updateIsActive/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}


export function updateTestcadidateApi_updatedDatabse(student_id_value) {
  return axios.patch(`${API_URL}/api/testcandidate/${student_id_value}/updatedDatabase/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}


export function updateTestcadidateApi_submitted(id) {
  return axios.patch(`${API_URL}/api/testcandidate/${id}/submitted/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}

export function updateTestcadidateApi_teststarted(id) {
  return axios.patch(`${API_URL}/api/testcandidate/${id}/teststarted/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}


export async function updateTotalScoreTestcandidateApi(id, test) {
  return axios.put(`${API_URL}/api/update/totalScore/${id}/`, {
    total_score: test.total_score
  })
    .then(response => response.data);
}


export async function updateAvgMarkTestcandidateApi(id, test) {
  return axios.put(`${API_URL}/api/update/avgMark/${id}/`, {
    avg_mark: test.avg_mark
  })
    .then(response => response.data);
}



//------------------------Non database testasign-------------------------------//

export function addNonDatabaseTest_API(test) {
  return axios.post(`${API_URL}/api/test-candidates-map/non-db/create/`, {
    id: null,
    test_name: test.test_name,
    question_id: test.question_id,
    dtm_start: test.dtm_start,
    dtm_end: test.dtm_end,
    college_id: test.college_id,
    dtm_upload: test.dtm_upload,
    
    is_camera_on: test.is_camera_on,
    duration: test.duration,
    duration_type: test.duration_type,
    rules_id: test.rules_id,
    need_candidate_info: test.need_candidate_info,

    test_type_id: test.test_type_id,
    question_type_id: test.question_type_id,
    skill_type_id: test.skill_type_id,

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function addSelectedTestAssign_API(test) {
  return axios.post(`${API_URL}/api/test-assign/selected/`, {
    stu_id: test.stu_id,
    id: null,
    test_name: test.test_name,
    question_id: test.question_id,
    dtm_start: test.dtm_start,
    dtm_end: test.dtm_end,
    is_camera_on: test.is_camera_on,
    duration: test.duration,
    duration_type: test.duration_type,
    rules_id: test.rules_id,
    dtm_created: test.dtm_created,

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}






export function getBatchNumber() {
  return axios.get(`${API_URL}/api/batch_list/`)
    .then(response => response.data)
}
export function getquestionname() {
  return axios.get(`${API_URL}/api/question_name_list/`)
    .then(response => response.data)
}


export function gettopic() {
  return axios.get(`${API_URL}/api/topic_list/`)
    .then(response => response.data)
}


export function getUniqueTestType() {
  return axios.get(`${API_URL}/api/unique_test_type/`)
    .then(response => response.data)
}


export function getMCQTestType() {
  return axios.get(`${API_URL}/api/MCQ_test_type/`)
    .then(response => response.data)
}


export function getCodingTestType() {
  return axios.get(`${API_URL}/api/Coding_test_type/`)
    .then(response => response.data)
}


export function getUniqueQuestionType() {
  return axios.get(`${API_URL}/api/unique_question_type/`)
    .then(response => response.data)
}


export function getSidebarMenu() {
  return axios.get(`${API_URL}/api/sidebar/main_menu/`)
    .then(response => response.data)
}


export function QuestionsExportCodeAPI(formData) {
  return axios.post(`${API_URL}/api/question/import_excel/code/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}


export async function updatecandidatestextApi(id, trainees) {
  return axios.put(`${API_URL}/api/candidates/text/update/${id}/`, {


    text: trainees.text,

  })
    .then(response => response.data);

}

export function addQuestionpaperApi(test) {
  return axios.post(`${API_URL}/api/create-question-paper/`, {
    id: null,
    question_paper_name: test.question_paper_name,
    duration_of_test: test.duration_of_test,
    upload_type: test.upload_type,
    no_of_questions: test.no_of_questions,
    test_type: test.test_type,
    topic: test.topic,
    sub_topic: test.sub_topic,


  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error.response.data);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function getQuestionPaperApi() {
  return axios.get(`${API_URL}/api/get-question-paper/`)
    .then(response => response.data)
}


export async function updateQuestionpaperApi(id, test) {
  return axios.put(`${API_URL}/api/update-question-paper/${id}/`, {
    question_paper_name: test.question_paper_name,
    duration_of_test: test.duration_of_test,
    upload_type: test.upload_type,
    no_of_questions: test.no_of_questions,
    test_type: test.test_type,
    topic_id: test.topic_id,

  })
    .then(response => response.data);

}
export function deleteQuestionpaperApi(id) {
  return axios.patch(`${API_URL}/api/delete-question-paper/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}



//--------------------------Last added question paper name-------------------------//


export function getLastQuestionPaperApi() {
  return axios.get(`${API_URL}/api/get_last_question_paper/`)
    .then(response => response.data)
}


//-------------Questions master with image-------------------//



// Function to fetch CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

export function addQuestionApi_IO_CSRF(test) {
  console.log('entering endpoint....');
  console.log('endpoint image data: ', test);

  const formData = new FormData();
  formData.append('id', null);
  formData.append('question_name_id', test.question_name_id);
  formData.append('question_text', test.question_text);
  if (test.question_image_data) {
    formData.append('question_image_data', test.question_image_data);
  }
  if (test.option_a_image_data) {
    formData.append('option_a_image_data', test.option_a_image_data);
  }
  if (test.option_b_image_data) {
    formData.append('option_b_image_data', test.option_b_image_data);
  }
  if (test.option_c_image_data) {
    formData.append('option_c_image_data', test.option_c_image_data);
  }
  if (test.option_d_image_data) {
    formData.append('option_d_image_data', test.option_d_image_data);
  }
  formData.append('option_a', test.option_a);
  formData.append('option_b', test.option_b);
  formData.append('option_c', test.option_c);
  formData.append('option_d', test.option_d);
  formData.append('answer', test.answer);
  formData.append('mark', test.mark);
  formData.append('explain_answer', test.explain_answer);

  return axios.post(`${API_URL}/api/questions_io/create/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    }
  )
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error('There was an error creating the question!', error);
    });
}

export function addQuestionApi_IO(test) {
  return axios.post(`${API_URL}/api/questions_io/create/Op/`, {
    id: null,
    question_name_id: test.question_name_id,
    question_text: test.question_text,
    question_image_data: test.question_image_data,
    option_a_image_data: test.option_a_image_data,
    option_b_image_data: test.option_b_image_data,
    option_c_image_data: test.option_c_image_data,
    option_d_image_data: test.option_d_image_data,
    option_a: test.option_a,
    option_b: test.option_b,
    option_c: test.option_c,
    option_d: test.option_d,
    answer: test.answer,
    negative_mark: test.negative_mark,
    mark: test.mark,
    explain_answer: test.explain_answer,


  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export async function updateQuestionApi_IO_OP(id, test) {
  console.log('test', test);
  return axios.put(`${API_URL}/api/questions_io/${id}/Op/`, {

    question_text: test.question_text,
    question_image_data: test.question_image_data,
    option_a_image_data: test.option_a_image_data,
    option_b_image_data: test.option_b_image_data,
    option_c_image_data: test.option_c_image_data,
    option_d_image_data: test.option_d_image_data,
    option_a: test.option_a,
    option_b: test.option_b,
    option_c: test.option_c,
    option_d: test.option_d,
    answer: test.answer,


  })
    .then(response => response.data);

}




export function getQuestionApi_IO() {
  return axios.get(`${API_URL}/api/questions_io/`)
    .then(response => response.data)
}


export async function updateQuestionApi_IO(id, test) {
  return axios.put(`${API_URL}/api/questions_io/${id}/`, {

    question_name_id: test.question_name_id,
    question_text: test.question_text,
    question_image_data: test.question_image_data,
    option_a_image_data: test.option_a_image_data,
    option_b_image_data: test.option_b_image_data,
    option_c_image_data: test.option_c_image_data,
    option_d_image_data: test.option_d_image_data,
    option_a: test.option_a,
    option_b: test.option_b,
    option_c: test.option_c,
    option_d: test.option_d,
    answer: test.answer,
    negative_mark: test.negative_mark,
    mark: test.mark,
    explain_answer: test.explain_answer,

  })
    .then(response => response.data);

}


export function deleteQuestionApi_IO(id) {
  return axios.patch(`${API_URL}/api/questions_io/${id}/delete/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}




//-------------Questions Code master with image-------------------//


export function addQuestionCodeApi(test) {
  return axios.post(`${API_URL}/api/questions_Code/create/`, {
    id: null,
    question_name_id: test.question_name_id,
    question_text: test.question_text,
    question_image_data: test.question_image_data,

    answer: test.answer,
    negative_mark: test.negative_mark,
    mark: test.mark,
    explain_answer: test.explain_answer,
    input_format: test.input_format

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}



export function getQuestionCodeApi() {
  return axios.get(`${API_URL}/api/questions_Code/`)
    .then(response => response.data)
}


export async function updateQuestionCodeApi(id, test) {
  return axios.put(`${API_URL}/api/questions_Code/${id}/update/`, {

    question_name_id: test.question_name_id,
    question_text: test.question_text,
    question_image_data: test.question_image_data,

    answer: test.answer,
    negative_mark: test.negative_mark,
    mark: test.mark,
    explain_answer: test.explain_answer,
    input_format: test.input_format
  })
    .then(response => response.data);

}


//---------------------getting Questions all where qp id-----------------------//


export function getQuestionsApi_QP_ID(id) {
  return axios.get(`${API_URL}/api/questions_all/${id}/`)
    .then(response => response.data)
}



export function getTestUpdateID_API(id) {
  return axios.get(`${API_URL}/api/test-update/${id}/`)
    .then(response => response.data)
}



export function CandidateuserExportAPI(formData) {
  return axios.post(`${API_URL}/api/Candidate/user/import_excel/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}



export function addQuestionApi_code(test) {
  return axios.post(`${API_URL}/api/questions_io/create/code/`, {
    id: null,
    question_name_id: test.question_name_id,
    question_text: test.question_text,
    question_image_data: test.question_image_data,

    answer: test.answer,
    mark: test.mark,
    explain_answer: test.explain_answer,
    input_format: test.input_format,


  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

export async function updateQuestionApi_IO_code(id, test) {
  console.log('test', test);
  return axios.put(`${API_URL}/api/questions_io/${id}/code/`, {

    question_text: test.question_text,
    question_image_data: test.question_image_data,
    option_a_image_data: test.option_a_image_data,
    option_b_image_data: test.option_b_image_data,
    option_c_image_data: test.option_c_image_data,
    option_d_image_data: test.option_d_image_data,
    option_a: test.option_a,
    option_b: test.option_b,
    option_c: test.option_c,
    option_d: test.option_d,
    answer: test.answer,
    input_format: test.input_format,
    explain_answer: test.explain_answer,


  })
    .then(response => response.data);

}

export async function updateNeedInfoApi(id, test) {
  return axios.put(`${API_URL}/api/update/need-info/${id}/`, {
    need_candidate_info: test.need_candidate_info,
    college_id: test.college_id,
    department_id: test.department_id,
    year: test.year,
  })
    .then(response => response.data);
}


export async function updateClgLogin(id, test) {
  return axios.put(`${API_URL}/api/update/clg_login/${id}/`, {
    college_id: test.college_id,
  })
    .then(response => response.data);
}






export function getCandidateLogin() {
  return axios.get(`${API_URL}/api/get_candidate_login/`)
    .then(response => response.data)
}


export function get_test_name_group_API() {
  <div></div>
  return axios.get(`${API_URL}/api/test_group/`)
    .then(response => response.data)
}

export async function updateTestcandidateApi(test) {
  try {

    console.log('test data: ', test);
    const response = await axios.put(`${API_URL}/api/testcandidate/update/`, {
      testName: test.testName,
      test_name: test.test_name,
      dtm_start: test.dtm_start,
      dtm_end: test.dtm_end,
      question_id: test.question_id,
      duration: test.duration,
      duration_type: test.duration_type,
      rules_id: test.rules_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating test candidate:', error);
    //  throw error;
  }
}

export async function updateTestMAsterTestNameApi(test) {
  try {
    console.log('test data: ', test);
    const response = await axios.put(`${API_URL}/api/testcandidate/update/test_master/`, {
      testName: test.testName,
      test_name: test.test_name,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating test master:', error);
    // throw error;
  }
}
export function getTestcandidateReportsApi() {
  return axios.get(`${API_URL}/api/test_reports/`)
    .then(response => response.data)
}


//----------------------company company-------------------//

export function getcompanyApi() {
  return axios.get(`${API_URL}/api/company/`)
    .then(response => response.data)
}
export function addcompanyApi(log) {
  return axios.post(`${API_URL}/api/company/create/`, {
    id: null,

    company_name: log.company_name,
    company_profile: log.company_profile,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updatecompanyApi(id, log) {
  return axios.put(`${API_URL}/api/company/${id}/`, {

    company_name: log.company_name,
    company_profile: log.company_profile,
  })
    .then(response => response.data);
}


export function deleteCompanyApi(id) {
  return axios.patch(`${API_URL}/api/company/delete/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}
//______________________________job_master______________________________

export function getjobApi() {
  return axios.get(`${API_URL}/api/job/`)
    .then(response => response.data)
}
export function addjobApi(log) {
  return axios.post(`${API_URL}/api/job/create/`, {
    id: null,

    company_name: log.company_name,
    company_profile: log.company_profile,
    job_type: log.job_type,
    post_name: log.post_name,
    intern_fulltime: log.intern_fulltime,
    on_off_campus: log.on_off_campus,
    college_id: log.college_id,

    department_id: log.department_id,
    skill_id: log.skill_id,
    marks_10th: log.marks_10th,
    marks_12th: log.marks_12th,
    cgpa: log.cgpa,
    year: log.year,
    interview_date: log.interview_date,
    gender: log.gender,
    history_of_arrears: log.history_of_arrears,
    standing_arrears: log.standing_arrears,
    location: log.location,
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updatejobApi(id, log) {
  return axios.put(`${API_URL}/api/job/${id}/`, {
    company_name: log.company_name,
    company_profile: log.company_profile,
    intern_fulltime: log.intern_fulltime,
    on_off_campus: log.on_off_campus,
    college_id: log.college_id,

    department_id: log.department_id,
    skill_id: log.skill_id,
    marks_10th: log.marks_10th,
    marks_12th: log.marks_12th,
    cgpa: log.cgpa,
    year: log.year,
    interview_date: log.interview_date,
    gender: log.gender,
    history_of_arrears: log.history_of_arrears,
    standing_of_arrears: log.standing_of_arrears,
    location: log.location,
  })
    .then(response => response.data);
}


export function deletejobApi(id) {
  return axios.patch(`${API_URL}/api/job/delete/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}

//______________________________Event_master______________________________

export function geteventApi() {
  return axios.get(`${API_URL}/api/event/`)
    .then(response => response.data)
}
export function addeventApi(log) {
  return axios.post(`${API_URL}/api/event/create/`, {
    id: null,

    event_nam: log.event_nam,
    event_desc: log.event_desc,
    dtm_start: log.dtm_start,
    department_id: log.department_id,

    college_id: log.college_id,

  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}
export async function updateeventApi(id, log) {
  return axios.put(`${API_URL}/api/event/${id}/`, {

    event_nam: log.event_nam,
    event_desc: log.event_desc,
    dtm_start: log.dtm_start,
    department_id: log.department_id,

    college_id: log.college_id,
  })
    .then(response => response.data);
}


export function deleteEventApi(id) {
  return axios.patch(`${API_URL}/api/event/delete/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}


//________________________________________Training_report_____________________________________//


export function getTrainingReportApi() {
  return axios.get(`${API_URL}/api/get-training-report/`)
    .then(response => response.data)
}



//_________________________Trainer Feedback_________________________

export function getTrainingfeedbackApi() {
  return axios.get(`${API_URL}/api/trainer-feedback/get/`)
    .then(response => response.data)
}




















//--------------------------------Compiler-------------------------//


export function addTestAnswerMapApi_Code_Com(log) {
  const { test_name, question_id, student_id, dtm_start, dtm_end, code, p_type, inputs } = log;


  console.log('Endpoint entering.....');
  console.log('log: ', log);

  return axios.post(`${API_URL}/api/tests-answer-com/`, {
    test_name: test_name,
    question_id: question_id,
    student_id: student_id,
    dtm_start: dtm_start,
    dtm_end: dtm_end,
    code: code,
    p_type: p_type,
    inputs: inputs,
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding answer:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}


export function addTestAnswerMapApi_Code_Submit_Com(log) {
  const { test_name, question_id, student_id, dtm_start, dtm_end, code, p_type, inputs, explain_answer, mark, answer } = log;


  console.log('Endpoint entering.....');
  console.log('log: ', log);

  return axios.post(`${API_URL}/api/tests-answer-com/submit/`, {
    test_name: test_name,
    question_id: question_id,
    student_id: student_id,
    dtm_start: dtm_start,
    dtm_end: dtm_end,
    code: code,
    p_type: p_type,
    inputs: inputs,
    explain_answer: explain_answer,
    mark: mark,
    answer: answer
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding answer:', error);
      //throw error; // Rethrow the error to propagate it further if needed
    });
}


export function getLastCompilerOutput(student_id) {
  return axios.get(`${API_URL}/api/get-last-compiler-output/${student_id}/`)
    .then(response => response.data)
}
//--------------------Training admin Dashboard Data ---------------//

//  Total Test Count


export function getTotalTestCount(college_id) {
  return axios.get(`${API_URL}/api/distinct-test-name-count/${college_id}/`)
    .then(response => response.data)
}

// Total company count


export function getTotalCompanyCount() {
  return axios.get(`${API_URL}/api/count-company-names/`)
    .then(response => response.data)
}




export function getDistinctTestNameCount(collegeId) {
  return axios.get(`${API_URL}/api/distinct-test-name-count/${collegeId}/`)
    .then(response => response.data);
}

export function getAvgScoreByDepartment(collegeId, dtmStart) {
  const formattedDate = format(dtmStart, 'yyyy-MM-dd'); // Format the date to 'YYYY-MM-DD'
  return axios.get(`${API_URL}/api/avg-score-by-department/${collegeId}/${formattedDate}/`)
    .then(response => response.data);
}

export function getAvgScoreByDepartmentCoding(collegeId, dtmStart) {

  const formattedDate = format(dtmStart, 'yyyy-MM-dd'); // Format the date to 'YYYY-MM-DD'
  return axios.get(`${API_URL}/api/avg-score-by-department-coding/${collegeId}/${formattedDate}/`)
    .then(response => response.data);
}

export function getMaxScoreByDepartment(collegeId) {
  return axios.get(`${API_URL}/api/max-score-by-department/${collegeId}/`)
    .then(response => response.data);
}

export function getMaxScoreByDepartmentCoding(collegeId) {
  return axios.get(`${API_URL}/api/max-score-by-department-coding/${collegeId}/`)
    .then(response => response.data);
}



export function getMaxScoreByDepartment_Placement(collegeId, typeCategory) {
  return axios.get(`${API_URL}/api/max-score-by-department/${collegeId}/placement/`, {
    params: { typeCategory: typeCategory }
  })
    .then(response => response.data);
}

export function getMaxScoreByDepartmentCoding_Placement(collegeId, typeCategory) {
  return axios.get(`${API_URL}/api/max-score-by-department-coding/${collegeId}/placement/`, {
    params: { typeCategory: typeCategory }
  })
    .then(response => response.data);
}






export function getDistinctTestNameCountToday() {
  return axios.get(`${API_URL}/api/distinct-test-name-count-today/`)
    .then(response => response.data);
}

export function getAvgTotalPresent() {
  return axios.get(`${API_URL}/api/avg-total-present/`)
    .then(response => response.data);
}

export function getAvgTotalAbsent() {
  return axios.get(`${API_URL}/api/avg-total-absent/`)
    .then(response => response.data);
}


export function upcommingInterviewApi(collegeId, departmentId) {
  return axios.get(`${API_URL}/api/interview-schedule/${collegeId}/${departmentId}/`)
    .then(response => response.data);
}


export function interviewStatusCountApi(collegeId, companyId) {
  return axios.get(`${API_URL}/api/interview-status-count/${collegeId}/${companyId}/`)
    .then(response => response.data);
}


export function interviewResultStudntApi(collegeId) {
  return axios.get(`${API_URL}/api/interview-result-stu/${collegeId}/`)
    .then(response => response.data);
}


export function interviewResultStudntEmailAddressApi(collegeId) {
  return axios.get(`${API_URL}/api/interview-result-stu-email/${collegeId}/`)
    .then(response => response.data);
}


export function totalNoOfOffersApi(collegeId) {
  return axios.get(`${API_URL}/api/total-no-of-offers/${collegeId}/`)
    .then(response => response.data);
}


export function getStudentsRequestApi() {
  return axios.get(`${API_URL}/api/pending-requests-count/`)
    .then(response => response.data);
}

//-------------------------------students dashboard------------------------------//

export function getEventsClgDept(collegeId, departmentId) {
  return axios.get(`${API_URL}/api/events/${collegeId}/${departmentId}/`)
    .then(response => response.data);
}


export function studentCourseProgressApi(student_id) {
  return axios.get(`${API_URL}/api/course-progress/${student_id}/`)
    .then(response => response.data);
}


export function StudentReportDashApi(student_id) {
  return axios.get(`${API_URL}/api/tests-by-student/${student_id}/`)
    .then(response => response.data);
}


export function MCQTestPerformanceApi(student_id) {
  return axios.get(`${API_URL}/api/avg-total-score-by-month/${student_id}/`)
    .then(response => response.data);
}

//_______________________________________tEST__________________________________________________//
export function addTestcandidateApiBatch(test) {
  return axios.post(`${API_URL}/api/test-candidates-map/create/`, {
    id: null,
    test_name: test.test_name,
    question_id: test.question_id,
    college_id: test.college_id,
    department_id: test.department_id,
    dtm_start: test.dtm_start,
    dtm_end: test.dtm_end,
    is_camera_on: test.is_camera_on,
    duration: test.duration,
    duration_type: test.duration_type,
    year: test.year,
    rules_id: test.rules_id,
    need_candidate_info: test.need_candidate_info,


    test_type_id: test.test_type_id,
    question_type_id: test.question_type_id,
    skill_type_id: test.skill_type_id,

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}

//-------update lms id-------------------//

export function getLMSIDApi(id) {
  return axios.get(`${API_URL}/api/update/lms/${id}/`)
    .then(response => response.data)
}


export function getLMS_Topic_IDApi(id) {
  return axios.get(`${API_URL}/api/topic/lms/${id}/`)
    .then(response => response.data)
}


export function getTestTypeCategory_testNameApi(test_name) {
  return axios.get(`${API_URL}/api/get-test-type-category/${test_name}/`)
    .then(response => response.data)
}



//-------------------Need Candidate info--students---------------------//


export function getNeedInfoStuApi(username) {
  return axios.get(`${API_URL}/api/api/test-candidates/${username}/need-info/`)
    .then(response => response.data)
}



export function InsertFirstOutput_API(student_id) {
  return axios.post(`${API_URL}/api/insert_empty_output/${student_id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      throw error;
    });
}


//-----------------Students Dasboard New------------------------------------//

//-----Total Test Taken

export function getTotalTestTaken_API(student_id) {
  return axios.get(`${API_URL}/api/active-tests-count/${student_id}/`)
    .then(response => response.data)
}


//------Total no.of offers


export function getTotalOffers_API(student_id) {
  return axios.get(`${API_URL}/api/number-of-offers/${student_id}/`)
    .then(response => response.data)
}

//-------Request Count

export function getRequestCount_API(student_id) {
  return axios.get(`${API_URL}/api/student-requests/count/${student_id}/`)
    .then(response => response.data)
}


//-------Aptitude Avg Score

export function getAptitudeAvgScore_API(student_id) {
  return axios.get(`${API_URL}/api/monthly-avg-total-score/${student_id}/apditute/`)
    .then(response => response.data)
}


//-------Softskills Avg Score

export function getSoftskill_AvgScore_API(student_id) {
  return axios.get(`${API_URL}/api/monthly-avg-total-score/${student_id}/softskill/`)
    .then(response => response.data)
}


//-------Technical Avg Score

export function getTechnical_AvgScore_API(student_id) {
  return axios.get(`${API_URL}/api/monthly-avg-total-score/${student_id}/technical/`)
    .then(response => response.data)
}


//-------Coding Avg Score

export function getCoding_AvgScore_API(student_id) {
  return axios.get(`${API_URL}/api/monthly-avg-total-score/${student_id}/coding/`)
    .then(response => response.data)
}




export function getOffer_College_id_API(college_id) {
  return axios.get(`${API_URL}/api/candidates/all/${college_id}/`)
    .then(response => response.data)
}







//------Total no.of offers-----college_id


export function getTotalOffers_college_id_API(college_id) {
  return axios.get(`${API_URL}/api/number-of-offers/${college_id}/college_id/`)
    .then(response => response.data)
}

//-------Request Count

export function getRequestCount_college_id_API(college_id) {
  return axios.get(`${API_URL}/api/student-requests/count/${college_id}/college_id/`)
    .then(response => response.data)
}


//-------Students plan

export function getStudentPlan_API(dtm_start, student_id) {
  return axios.get(`${API_URL}/api/schedule-with-tests/${dtm_start}/${student_id}/`)
    .then(response => response.data)
}

export function getTestcandidate_MCQ_Api(username) {
  return axios.get(`${API_URL}/api/testcandidate/mcq/${username}/`)
    .then(response => response.data)
}



export function getTestcandidate_CODING_Api(username) {
  return axios.get(`${API_URL}/api/testcandidate/coding/${username}/`)
    .then(response => response.data)
}


//-------PLACEMENT------------------//


export function getReports_College_API(collegeID) {
  return axios.get(`${API_URL}/api/tests-reports/${collegeID}/placement/`)
    .then(response => response.data)
}


export function getTestSchedules_College_API(collegeID) {
  return axios.get(`${API_URL}/api/tests-schedules/${collegeID}/placement/`)
    .then(response => response.data)
}



export function getReports_College_UserName_API(collegeID, userName) {
  return axios.get(`${API_URL}/api/tests-reports-candidates/${collegeID}/${userName}/placement/`)
    .then(response => response.data)
}



export function getCandidates_Job_API() {
  return axios.get(`${API_URL}/api/candidates-by-last-job/`)
    .then(response => response.data)
}


export function getTestSchedule_Student_API(userName) {
  return axios.get(`${API_URL}/api/students-test-schedule/${userName}/`)
    .then(response => response.data)
}



export function getQuestionApi_Filter_IO(question_id) {
  return axios.get(`${API_URL}/api/questions_io/${question_id}/filter/`)
    .then(response => response.data)
}

export function getQuestionApi_Filter_IO_MCQ(question_id) {
  return axios.get(`${API_URL}/api/questions_io/${question_id}/filter/MCQ/`)
    .then(response => response.data)
}

export function getQuestionApi_Filter_IO_CODE(question_id) {
  return axios.get(`${API_URL}/api/questions_io/${question_id}/filter/Code/`)
    .then(response => response.data)
}


export function getTestcandidate_LIST_Api(testName) {
  return axios.get(`${API_URL}/api/test-list/${testName}/`)
    .then(response => response.data)
}



export function getTestcandidateReports_candidates_Api(testName) {
  return axios.get(`${API_URL}/api/test_reports/candidates/${testName}/`)
    .then(response => response.data)
}



export function addlmsApiBatch(test) {
  return axios.post(`${API_URL}/api/course-schedule-map/`, {
    id: null,

    college_id: test.college_id,
    department_id: test.department_id,
    dtm_start_student: test.dtm_start_student,
    dtm_end_student: test.dtm_end_student,
    dtm_start_trainer: test.dtm_start_trainer,
    dtm_end_trainer: test.dtm_end_trainer,
    dtm_of_training: test.dtm_of_training,
    // student_id:test.student_id,
    year: test.year,
    topic_id: test.topic_id,
    trainer_id: test.trainer_id

  })
    .then(response => response.data)
    .catch(error => {

      // Handle error
      console.error('Error adding Test:', error);
      //throw error;// Rethrow the error to propagate it further if needed
    });
}


export function getSubTopic_API(topic) {
  return axios.get(`${API_URL}/api/sub_topic/${topic}/`)
    .then(response => response.data)
}




export function getStudents_Course_LMS_API(username) {
  return axios.get(`${API_URL}/api/course-content/students/`, {
    params: { user_name: username }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}




export function deleteQuestionPaperLast_API(questionPaperName) {
  return axios.delete(`${API_URL}/api/delete-question-paper/${questionPaperName}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting question paper:', error);
      throw error;
    });
}

export function getTrainer_Course_LMS_API(username) {
  return axios.get(`${API_URL}/api/course-content/Trainer/`, {
    params: { user_name: username }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


// Function to fetch student's need_candidate_info from API
export function getcandidates_UserName_Api(username) {
  return axios.get(`${API_URL}/api/candidates/username/?user_name=${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching student info:', error);
      // throw error; // Optionally handle errors further up the chain
    });
}



// Function to fetch student's need_candidate_info from API
export function getStudentNeedInfo(username) {
  return axios.get(`${API_URL}/api/candidate-info/?user_name=${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching student info:', error);
      // throw error; // Optionally handle errors further up the chain
    });
}

export function updateCandidateInfo(username, needCandidateInfo) {
  return axios.put(`${API_URL}/api/update-candidate-info/`, {
    user_name: username,
    need_candidate_info: needCandidateInfo
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating candidate info:', error);
      throw error; // Optionally handle errors further up the chain
    });
}



export function get_department_info_API(college_IDs) {
  console.log('college_ids endpoints....: ', college_IDs);

  // Convert college_IDs array to an object with repeated keys
  const params = college_IDs.reduce((acc, id) => {
    acc[`college_id`] = id;
    return acc;
  }, {});

  return axios.get(`${API_URL}/api/get-department-info/`, { params })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


export function get_department_info_LMS_API(college_IDs) {
  console.log('college_ids endpoints....: ', college_IDs);

  // Convert college_IDs array to an object with repeated keys
  const params = college_IDs.reduce((acc, id) => {
    acc[`college_id`] = id;
    return acc;
  }, {});

  return axios.get(`${API_URL}/api/get-department-info/LMS/`, { params })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      // throw error;
    });
}



//--------------------Word Import and Export functions----------------//



export function WordImportMCq_Api_OLD(test) {
  console.log('formData: ', test);

  const formData = new FormData();
  formData.append('file', test.file);
  formData.append('question_paper_name', test.question_paper_name);
  formData.append('duration_of_test', test.duration_of_test);
  formData.append('topic', test.topic);
  formData.append('sub_topic', test.sub_topic);
  formData.append('no_of_questions', test.no_of_questions);
  formData.append('upload_type', test.upload_type);
  formData.append('test_type', test.test_type);

  console.log('formData: ', formData);


  return axios.post(`${API_URL}/api/import-mcq-questions/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    }
  )
    .then(response => {
      console.log('API Response:', response); // Log full response to see details
      return response.data;
    })
    .catch(error => {
      console.error('Error response:', error.response); // Log the error response
      throw error; // Re-throw the error to be handled by calling code
    });
}



export function WordImportMCQ_Api(test) {
  console.log('Initial test object: ', test);

  const formData = new FormData();
  formData.append('docx_file', test.file);  // Updated field name
  formData.append('question_paper_name', test.question_paper_name);
  formData.append('duration_of_test', test.duration_of_test);
  formData.append('topic', test.topic);
  formData.append('sub_topic', test.sub_topic);
  formData.append('no_of_questions', test.no_of_questions);
  formData.append('upload_type', test.upload_type);
  formData.append('test_type', test.test_type);

  // Log the FormData key-value pairs
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  return axios.post(`${API_URL}/api/import-mcq-questions/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    }
  )
    .then(response => {
      console.log('API Response:', response); // Log full response to see details
      return response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response data:', error.response.data); // Log the error response data
        console.error('Error response status:', error.response.status); // Log the error response status
      } else {
        console.error('Error message:', error.message); // Log the error message if no response
      }
    });
}



export function WordImportCoding_Api(test) {
  console.log('Initial test object: ', test);

  const formData = new FormData();
  formData.append('docfile', test.file);  // Updated field name
  formData.append('question_paper_name', test.question_paper_name);
  formData.append('duration_of_test', test.duration_of_test);
  formData.append('topic', test.topic);
  formData.append('sub_topic', test.sub_topic);
  formData.append('no_of_questions', test.no_of_questions);
  formData.append('upload_type', test.upload_type);
  formData.append('test_type', test.test_type);

  // Log the FormData key-value pairs
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  return axios.post(`${API_URL}/api/import-coding-questions/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    }
  )
    .then(response => {
      console.log('API Response:', response); // Log full response to see details
      return response.data;
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response data:', error.response.data); // Log the error response data
        console.error('Error response status:', error.response.status); // Log the error response status
      } else {
        console.error('Error message:', error.message); // Log the error message if no response
      }
    });
}



export function getStudentDetails_API(username) {
  return axios.get(`${API_URL}/api/get_candidate_details/`, {
    params: { user_name: username }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}



//------------------------College With Logo------------------------------///

export function addCollege_logo_API(test) {
  console.log('entering endpoint....');
  console.log('endpoint image data: ', test);

  const formData = new FormData();
  formData.append('id', null);
  formData.append('college', test.college);
  if (test.college_logo) {
    formData.append('college_logo', test.college_logo);
  }
  return axios.post(`${API_URL}/api/colleges/uploads/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    }
  )
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error('There was an error creating the question!', error);
    });
}


export function getCollege_logo_API() {
  return axios.get(`${API_URL}/api/colleges/list/`)
    .then(response => response.data)
}


export function deleteCollege_logo_API(id) {
  return axios.patch(`${API_URL}/api/colleges/deletes/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating College with logo:', error);
      throw error;
    });
}


export async function updateCollege_logo_API_NEW(id, test) {
  const formData = new FormData();
  formData.append('college', test.college);
  if (test.college_logo) {
    formData.append('college_logo', test.college_logo);
  }

  return axios.post(`${API_URL}/api/colleges/updates/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrftoken
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating college:', error);
      throw error;
    });
}

export function getEligibleStudentCountApi(clg_id) {
  return axios.get(`${API_URL}/api/eligible-students/count/${clg_id}/`)
    .then(response => response.data)
}

export function getEligibleStudent_Registered_CountApi() {
  return axios.get(`${API_URL}/api/eligible-registered/count/`)
    .then(response => response.data)
}

/*
// Function to fetch student's need_candidate_info from API
export function geteligiblestudentsApi(jobid) {
  return axios.get(`${API_URL}/api/eligible-students/?job_id=${jobid}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching student info:', error);
     // throw error; // Optionally handle errors further up the chain
  });
}*/
export function geteligiblestudentsApi(job_id) {
  return axios.get(`${API_URL}/api/eligible-students/`, {
    params: { job_id: job_id }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


export function geteligiblestudentsAllApi() {
  return axios.get(`${API_URL}/api/eligible-students-list/all/`)
    .then(response => response.data)
}
export function getdbCandidates_API() {
  return axios.get(`${API_URL}/api/db-candidates/`)
    .then(response => response.data)
}


export function getNonDbCandidates_API() {
  return axios.get(`${API_URL}/api/nondb-candidates/`)
    .then(response => response.data)
}

export async function update_Announcement_API_NEW(id, test) {
  const formData = new FormData();
  formData.append('announcement', test.announcement);
  if (test.announcement_image) {
    formData.append('announcement_image', test.announcement_image);
  }

  return axios.post(`${API_URL}/api/eligible-student/update/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrftoken
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating Eligible  student list:', error);
      throw error;
    });
}

export function geteligiblestudentsroundApi(job_id) {
  return axios.get(`${API_URL}/api/eligible-students/round/`, {
    params: { round_of_interview: job_id }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


export function updateRoundOfInterview_Upload_API(formData) {
  return axios.post(`${API_URL}/api/update-eligible-student-list/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}



export function update_is_acceptApi(id) {
  return axios.patch(`${API_URL}/api/update-is-accept/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}


export function update_is_DeclineApi(id) {
  return axios.patch(`${API_URL}/api/update-is-decline/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating tests:', error);
      //throw error;
    });
}



export function getTestAnswerFilter_API() {
  return axios.get(`${API_URL}/api/tests-answer/filters/`)
    .then(response => response.data)
}


export function getTotalMarks_API(studentId, testName) {
  return axios.get(`${API_URL}/api/get_total_marks/${studentId}/${testName}/`)
    .then(response => response.data)
}


export function deleteTestAnswer_Api(id) {
  return axios.delete(`${API_URL}/api/delete-student-answers/${id}/`)
    .then(response => {
      // Log success if needed or perform any other actions with the response
      console.log('Successfully deleted:', response.data);
      return response.data;
    })
    .catch(error => {
      // Improved error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      throw error;
    });
}




export async function update_MCQ_images_API_NEW(id, test) {
  const formData = new FormData();
  formData.append('question_text', test.question_text);
  formData.append('option_a', test.option_a);
  formData.append('option_b', test.option_b);
  formData.append('option_c', test.option_c);
  formData.append('option_d', test.option_d);
  formData.append('answer', test.answer);

  if (test.question_image_data) {
    formData.append('question_image_data', test.question_image_data);
  }
  if (test.option_a_image_data) {
    formData.append('option_a_image_data', test.option_a_image_data);
  }
  if (test.option_b_image_data) {
    formData.append('option_b_image_data', test.option_b_image_data);
  }
  if (test.option_c_image_data) {
    formData.append('option_c_image_data', test.option_c_image_data);
  }
  if (test.option_d_image_data) {
    formData.append('option_d_image_data', test.option_d_image_data);
  }

  return axios.post(`${API_URL}/api/question_master/${id}/update/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrftoken
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating college:', error);
      throw error;
    });
}


export async function getTrainerByUsername(username) {
  console.log("inside endpoint");
  return await axios
    .get(`${API_URL}/api/trainer/${username}/`)
    .then((response) => response.data);
}



export function getDistinct_Upload_timing_API(id) {
  return axios.get(`${API_URL}/api/distinct-dtm-uploads/${id}/`)
    .then(response => response.data)
}



export function getTestcandidateCameraApi(id) {
  return axios.get(`${API_URL}/api/testcandidate/${id}/camera/`)
    .then(response => response.data)
}
 

export function getLoginView_API(username, password) {
  return axios.post(`${API_URL}/api/login-view/`, {
    username: username,
    password: password
  })
    .then(response => response.data) // Returning response.data directly
    .catch(error => {
      console.error('Error fetching data:', error);
      // throw error; // Throwing the error to be caught in handleLogin
    });
}



export function addLogin_Profile_API(log) {
  return axios.post(`${API_URL}/api/add/user-profiles/`, {
    user: {
      username: log.user.username,
      password: log.user.password,
      email: log.user.email
    },
    role: log.role,
    college_id: log.college_id
  })
    .then(response => response.data)
    .catch(error => {
      // Handle error
      console.error('Error adding login:', error);
      // Optionally throw the error to propagate it further if needed
      // throw error;
    });
}



export function log_out_API() {
  return axios.post(`${API_URL}/api/logout/`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error during logout:', error);
      // Optionally throw the error to propagate it further if needed
      throw error;
    });
}


export function getRounds_Students_Count_API(round_of_interview, cmpy_name) {
  return axios.get(`${API_URL}/api/rounds/eligible-student-count/`, {
    params: { round_of_interview: round_of_interview, job_name: cmpy_name }
  })
    .then(response => response.data.count) // Extract count directly
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


export async function updateAnnouncement_API(id, test,round_of_interview) {
  console.log("Preparing to send API request for updating announcement with ID:", id);

  const formData = new FormData();
  formData.append('announcement', test.announcement);
  console.log("Added announcement to FormData:", test.announcement);
 // formData.append('round_of_interview', test.round_of_interview);
  console.log('round updated',test.round_of_interview)
  // Include the logo if it's provided
  if (test.announcement_image) {
    formData.append('announcement_image', test.announcement_image);
    console.log("Added announcement image to FormData:", test.announcement_image);
  }

  try {
    console.log("Sending PUT request to update announcement");
    const response = await axios.post(`${API_URL}/api/eligible-student/update/${id}/${round_of_interview}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken  // Ensure CSRF token is valid
      }
    });

    console.log("PUT request successful, response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
}





export function getEligile_Students_job_Rounds_API(job_id, round_of_interview) {
  return axios.get(`${API_URL}/api/eligible-students/job-rounds/${job_id}/${round_of_interview}/`)
  .then(response => response.data)
}



export function get_Registered_CountbyCompanyApi(clg_id, dept_name) {
  return axios.get(`${API_URL}/api/registered-count-by-company/`, {
    params: { college_id: clg_id, department_name: dept_name }
  })
    .then(response => response.data)
}


export function get_Round_CountbyIdApi(clg_id, cmpy_name, department_id) {
  return axios.get(`${API_URL}/api/round-of-interview-count/`, {
    params: { college_id: clg_id, company_name: cmpy_name, department_name: department_id }
  })
    .then(response => response.data)
}




export function getDistinctCompany_API() {
  return axios.get(`${API_URL}/api/job-companies/`)
    .then(response => response.data)
}


export async function sendEmailToStudents(job_id_value, round_of_interview) {
  try {
    console.log("Preparing to send API request to send emails");
    
    // Construct the API URL with the provided job_id_value and round_of_interview_value
    const url = `${API_URL}/api/send-email/${job_id_value}/${round_of_interview}/`;
    
    // Send the request using axios (GET or POST as per the requirement)
    const response = await axios.get(url, {
      headers: {
        'X-CSRFToken': csrftoken  // Ensure CSRF token is passed, if required
      }
    });
    
    console.log("Emails sent successfully, response:", response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error sending emails:', error);
    // throw error;
  }
}



export function get_test_summary_API(clg_id, dtm_start) {
  return axios.get(`${API_URL}/api/test-attendance-summary/`, {
    params: { college_id: clg_id, dtm_start: dtm_start }
  })
    .then(response => response.data)
}


export function addCameraScreenshots_API(test_id, formData) {
  return axios.post(`${API_URL}/api/upload-screenshot/${test_id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error during screenshot upload:', error);
    throw error; // Optionally throw the error to propagate it further if needed
  });
}




export function get_studens_announcement_API(student_id) {
  return axios.get(`${API_URL}/api//students/announcement/${student_id}/`)
    .then(response => response.data)
}



export function getTestTypeCategory_API(testType) {
  return axios.get(`${API_URL}/api/get-test-type-categories/${testType}/`)
    .then(response => response.data)
}



export const getEligible_students_ReportAPI = (roundOfInterview, jobName) => {
  return axios.get(`${API_URL}/api/eligible-student-reports/`, {
    params: {
      round_of_interview: roundOfInterview,
      job_name: jobName
    }
  }).then(response => response.data) // Make sure you return the `response.data`
    .catch(error => {
      console.error('Error in API:', error);
      throw error;
    });
};

export function getRoundOfInterviews_API() {
  return axios.get(`${API_URL}/api/rounds/`)
    .then(response => response.data)
}


export function getcandidatesRequestsApi() {
  return axios.get(`${API_URL}/api/candidates/request/`)
    .then(response => response.data)
}


export function handleFormSubmit(dataToSubmit) {
  console.log("Data being submitted:", dataToSubmit); // Add this line
  return axios
      .post(`${API_URL}/api/student_request/create/`, dataToSubmit)
      .then((response) => response.data)
      .catch((error) => {
          console.error(
              "Error adding request:",
              error.response ? error.response.data : error.message
          );
          throw error;
      });
}

export function checkStudentRequestStatus(studentId) {
  return axios.get(`/api/student_request/${studentId}/check_status/`)
      .then(response => {
          if (response.status === 200) {
              return response.data;
          } else {
              throw new Error('Failed to fetch student request status');
          }
      })
      .catch(error => {
          console.error("Error fetching student request status:", error);
          throw error;
      });
}

export function getStudentRequestCount() {
  return axios
    .get(`${API_URL}/api/student_request/count/`)
    .then((response) => response.data.count)
    .catch((error) => {
      console.error(
        "Error fetching request count:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}

export function getStudentRequests() {
  return axios
    .get(`${API_URL}/api/student_request/list/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "Error fetching student requests:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
}


export async function updateStudentRequestStatusApi(studentId, status) {
  return axios
    .put(`${API_URL}/api/student_request/${studentId}/update_status/`, {
      status: status,
      
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error updating student request status:', error);
      throw error;
    });
}


