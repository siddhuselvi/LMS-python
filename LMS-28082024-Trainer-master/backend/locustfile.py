from locust import HttpUser, TaskSet, task, between
import random

class UserBehavior(TaskSet):

    def on_start(self):
        # Simulate login at the start of the test
        self.login()

    def login(self):
        response = self.client.post("/api/get/login/", json={"user_name": "user", "password": "pass"})
        if response.status_code == 200:
            # Assuming the response contains a token or session ID
            self.token = response.json().get("token")
        else:
            self.token = None

    @task(1)
    def get_tests_candidates_answer(self):
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.get("/api/tests-candidates-answers/", headers=headers)

    @task(2)
    def get_tests_candidates_map_Coding(self):
        user_name = self.get_random_user_name()
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.get(f"/api/testcandidate/coding/{user_name}/", headers=headers)

    @task(3)
    def update_totalScore_test_candidate_map(self):
        pk = random.randint(1, 10)
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.post(f"/api/update/totalScore/{pk}/", headers=headers)

    @task(4)
    def get_questions_IO_filter(self):
        question_id = random.randint(1, 100)
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.get(f"/api/questions_io/{question_id}/filter/", headers=headers)

    @task(5)
    def insert_empty_output_view(self):
        student_id = random.randint(1, 100)
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.post(f"/api/insert_empty_output/{student_id}/", headers=headers)

    @task(6)
    def get_questions_IO(self):
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.get("/api/questions_io/", headers=headers)

    @task(7)
    def test_candidates_answer_view_Submit_Com(self):
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        self.client.post("/api/tests-answer-com/submit/", headers=headers)

    def get_random_user_name(self):
        return "user" + str(random.randint(1, 100))

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)
