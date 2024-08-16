from rest_framework import serializers
from .models import appinfo,course_schedule,login,user_profile,eligible_student_list,course_trainer_feedback,student_request,training_attendance_sheet,course_content_feedback,question_master_temp,company_master,job_master,event_master, attendance_master, announcement_master, test_question_map,tests_candidates_map,tests_candidates_answers,topic_master,question_master,skill_type,trainer_master,test_master,test_type,question_type,candidate_master,skills_master,content_master,college_master,department_master, rules, question_paper_master, compiler_output
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.models import User
from datetime import datetime
from django.utils.timezone import localtime
from django.template.defaultfilters import date as django_format_date



class appinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = appinfo
        fields = '__all__'
class testtypeSerializers(serializers.ModelSerializer):
    class Meta:
        model = test_type
        fields = ['id', 'test_type', 'test_type_categories']

class questiontypeSerializers(serializers.ModelSerializer):
    class Meta:
        model = question_type
        fields = [ 'id', 'question_type']
class collegeSerializers(serializers.ModelSerializer):
    class Meta:
        model = college_master
        fields = [ 'id', 'college']

class departmentSerializers(serializers.ModelSerializer):
    class Meta:
        model = department_master
        fields = [ 'id', 'department']
class topicSerializers(serializers.ModelSerializer):
    class Meta:
        model = topic_master
        fields = [ 'id', 'topic','sub_topic']
class skilltypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = skill_type
        fields = ['id','skill_type']

class skillSerializer(serializers.ModelSerializer):
    class Meta:
        model = skills_master
        fields = ['id','skill_name']


class candidatesSerializerOLd(serializers.ModelSerializer):
    skill_id = serializers.PrimaryKeyRelatedField(
       many=True,
        queryset=skills_master.objects.all()
    )

    class Meta:
        model = candidate_master
        fields = ['id', 'college_id',  'students_name','skill_id', 'registration_number', 'gender', 'email_id', 'mobile_number',
                  'department_id', 'year', 'cgpa', 'marks_10th', 'marks_12th', 'marks_semester_wise',
                  'history_of_arrears', 'standing_arrears', 'number_of_offers', 'user_name', 'text', 'it_of_offers', 'core_of_offers']

class candidatesSerializer(serializers.ModelSerializer):
    skill_id = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=skills_master.objects.all()
    )

    class Meta:
        model = candidate_master
        fields = ['id', 'college_id', 'students_name', 'skill_id', 'registration_number', 'gender', 'email_id', 'mobile_number',
                  'department_id', 'year', 'cgpa', 'marks_10th', 'marks_12th',
                  'history_of_arrears', 'standing_arrears', 'number_of_offers', 'user_name', 'text', 'it_of_offers', 'core_of_offers', 'is_database']

   
    def update(self, instance, validated_data):
        validated_data['is_database'] = True
        return super().update(instance, validated_data)
class contentSerializers_OLD2007(serializers.ModelSerializer):
    dtm_validity_formatted = serializers.SerializerMethodField()

    class Meta:
        model = content_master
        fields = ['id', 'content_url', 'actual_content', 'status', 'topic', 'sub_topic', 'content_type', 'skill_type_id', 'question_type_id',
                  'dtm_active_from', 'dtm_validity', 'dtm_validity_formatted']
        # Optionally, you can exclude 'dtm_validity' if you don't need the raw field
        # fields = ['id', 'content_url', 'actual_content', 'status', 'topic_id', 'content_type', 'skill_type_id', 'question_type_id',
        #           'dtm_active_from', 'dtm_validity_formatted']

    def get_dtm_validity_formatted(self, obj):
        return django_format_date(localtime(obj.dtm_validity), 'd-m-Y h:i A')

class contentSerializers(serializers.ModelSerializer):
    dtm_validity_formatted = serializers.SerializerMethodField()

    class Meta:
        model = content_master
        fields = ['id', 'content_url', 'actual_content', 'status', 'topic','sub_topic', 'content_type', 'skill_type_id', 'question_type_id',
                  'dtm_active_from', 'dtm_validity', 'dtm_validity_formatted']
       
    def get_dtm_validity_formatted(self, obj):
        return django_format_date(localtime(obj.dtm_validity), 'd-m-Y h:i A')
    def create(self, validated_data):
        topic_name = validated_data.get('topic')
        sub_topic_name = validated_data.get('sub_topic')

        # Create or get the topic_master entry
        topic_master_obj, created = topic_master.objects.get_or_create(
            topic=topic_name,
            sub_topic=sub_topic_name
        )

        # Assign the topic_master object to the question paper
        validated_data['topic'] = topic_master_obj.topic
        validated_data['sub_topic'] = topic_master_obj.sub_topic
        validated_data['dtm_created'] = datetime.now()
        return super().create(validated_data)



class testsSerializers(serializers.ModelSerializer):
    test_type_id = testtypeSerializers()
    class Meta:
        model = test_master
        fields = ['id','test_name', 'test_type_id','question_type_id','skill_type_id',
         ]

class testsSerializersAddUpdate(serializers.ModelSerializer):
    class Meta:
        model = test_master
        fields =['id','test_name', ]


class testsSerializersAdd(serializers.ModelSerializer):
    class Meta:
        model = test_master
        fields =['id','test_name', 'test_type_id','question_type_id','skill_type_id', ]


class testcandidatemapSerializersupdate(serializers.ModelSerializer):
    class Meta:
        model = tests_candidates_map
        fields = ['id', 'test_name', 'question_id', 'student_id', 'college_id', 'dtm_start','dtm_login','dtm_submit','dtm_start_test','status',
                  'dtm_end', 'attempt_count', 'is_actual_test', 'department_id', 'duration',
                  'year', 'rules_id', 'is_active', 'need_candidate_info', 'total_score', 
                  'avg_mark', 'duration_type', 'dtm_created']

    def to_internal_value(self, data):
        # Handle dtm_start
        dtm_start = data.get('dtm_start')
        if dtm_start and isinstance(dtm_start, str):
            try:
                dtm_start = datetime.strptime(dtm_start, '%d-%m-%Y %I:%M %p')
                print('dtm_start s....1: ', dtm_start)
                data['dtm_start'] = dtm_start
            except ValueError as e:
                raise serializers.ValidationError({'dtm_start': f'Invalid date format: {e}'})

        # Handle dtm_end
        dtm_end = data.get('dtm_end')
        if dtm_end and isinstance(dtm_end, str):
            try:
                dtm_end = datetime.strptime(dtm_end, '%d-%m-%Y %I:%M %p')
                print('dtm_end s....1: ', dtm_end)
                data['dtm_end'] = dtm_end
            except ValueError as e:
                raise serializers.ValidationError({'dtm_end': f'Invalid date format: {e}'})

        return super().to_internal_value(data)






class questionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields = [ 'id','question_name' ,'question_text','view_hint', 'option_a', 'option_b', 'option_c', 'option_d', 'answer', 'negative_mark','mark','explain_answer', 'input_format']


class questionsSerializerMasterData(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields = [ 'id','question_name' ,'question_text','view_hint', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'option_f', 'question_type_id', 'skill_id','answer', 'negative_mark','mark','explain_answer', 'input_format']


class testcandidatemapSerializers(serializers.ModelSerializer):
    class Meta:
        model = tests_candidates_map
        fields = ['id','test_name','question_id','student_id','college_id', 'dtm_start',
        'dtm_end','dtm_login','dtm_submit','dtm_start_test','status',
        'attempt_count','is_actual_test','department_id','duration','year','rules_id','is_active','need_candidate_info', 'total_score', 'avg_mark', 'duration_type', 'dtm_created']

class NonDbTestAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model = tests_candidates_map
        fields = ['id','test_name','question_id','student_id', 'college_id', 'dtm_start','dtm_login','dtm_submit','dtm_start_test','status',
        'dtm_end',
        'attempt_count','is_actual_test', 'duration','rules_id','is_active','need_candidate_info', 'total_score', 'avg_mark', 'duration_type', 'dtm_created']



class tests_candidates_answerSerializer(serializers.ModelSerializer):
    class Meta:
        model = tests_candidates_answers
        fields = ['id','student_id','question_id','answer','test_name','result', 'dtm_start', 'dtm_end', 'submission_compile_code', 'compile_code_editor']

class loginSerializer(serializers.ModelSerializer):
    class Meta:
        model = login
        fields = '__all__'
    
 
class attendanceMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = attendance_master
        fields = ['student_id',
                
                  'test_id',
                  'dtm_attendance']


class announcementSerializer(serializers.ModelSerializer):
    class Meta:
        model = announcement_master
        fields = ['college_id',
                 
                  'dtm_start',
                  'dtm_end',
                  'content',
                  'is_active']




class testQuestionMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = test_question_map
        fields = ['test_id',
                  'question_id']




#-------------------Import Serializers---------------------------------------#


class questionsSerializerImport_OLD3105(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields = [ 'question_name', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d',  'answer', 'negative_mark',  'view_hint', 'explain_answer', 'mark']

    def create(self, validated_data):
        return question_master.objects.create(**validated_data)
    

class questionsSerializerImport_OLD3107(serializers.ModelSerializer):
    question_name_id = serializers.PrimaryKeyRelatedField(queryset=question_paper_master.objects.all(), write_only=True)

    class Meta:
        model = question_master
        fields = ['question_name_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'answer', 'explain_answer', 'mark']

    def create(self, validated_data):
        question_name_id = validated_data.pop('question_name_id')
        return question_master.objects.create(question_name_id=question_name_id, **validated_data)


class MultiTypeField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, (int, float, bool, str)):
            return data
        try:
            # Try converting data to float
            return float(data)
        except (ValueError, TypeError):
            raise serializers.ValidationError('Not a valid input.')

    def to_representation(self, value):
        return value


class questionsSerializerImport(serializers.ModelSerializer):
    question_name_id = serializers.PrimaryKeyRelatedField(queryset=question_paper_master.objects.all(), write_only=True)
    question_text = MultiTypeField(allow_null=True, required=False)
    option_a = MultiTypeField(allow_null=True, required=False)
    option_b = MultiTypeField(allow_null=True, required=False)
    option_c = MultiTypeField(allow_null=True, required=False)
    option_d = MultiTypeField(allow_null=True, required=False)
    answer = serializers.CharField(allow_blank=True, allow_null=True, max_length=1000, required=False, style={'base_template': 'textarea.html'})
    explain_answer = serializers.CharField(allow_blank=True, allow_null=True, max_length=1000, required=False, style={'base_template': 'textarea.html'})
    mark = serializers.IntegerField(allow_null=True, max_value=2147483647, min_value=-2147483648, required=False)

    class Meta:
        model = question_master
        fields = '__all__'

    def create(self, validated_data):
        question_name_id = validated_data.pop('question_name_id')
        return question_master.objects.create(question_name_id=question_name_id, **validated_data)





class candidateSerializerImport(serializers.ModelSerializer):
    
    cgpa = serializers.FloatField(default=0.0, allow_null=True, required=False)
    marks_10th = serializers.FloatField(default=0.0, allow_null=True, required=False)
    marks_12th = serializers.FloatField(default=0.0, allow_null=True, required=False)
    history_of_arrears = serializers.IntegerField(default=0, allow_null=True, required=False)
    standing_arrears = serializers.IntegerField(default=0, allow_null=True, required=False)
    it_of_offers = serializers.IntegerField(default=0, allow_null=True, required=False)
    core_of_offers = serializers.IntegerField(default=0, allow_null=True, required=False)
    number_of_offers = serializers.IntegerField(default=0, allow_null=True, required=False)

    class Meta:
        model = candidate_master
        fields = ['college_id', 'students_name', 'registration_number', 'gender', 'email_id', 'mobile_number',
                  'department_id', 'year', 'cgpa', 'marks_10th', 'marks_12th', 'marks_semester_wise',
                  'history_of_arrears', 'standing_arrears', 'number_of_offers', 'user_name', 'text', 'it_of_offers','core_of_offers', 'is_database']
    def create(self, validated_data):
        return candidate_master.objects.create(**validated_data)
class testsSerializersImport(serializers.ModelSerializer):
    class Meta:
        model = test_master
        fields = ['test_name', 'test_type_id','question_type_id', 'skill_type_id']

    def create(self, validated_data):
        return test_master.objects.create(**validated_data)





class ruleSerializers(serializers.ModelSerializer):
    class Meta:
        model =rules 
        fields = ['id', 'rule_name','instruction']


class loginSerializerStu(serializers.ModelSerializer):
    role = serializers.CharField(default='Student')

    class Meta:
        model = login
        fields = '__all__'


class questionsSerializerCodeImport_OLD3105(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields =['question_name' ,'question_text','view_hint','answer', 'negative_mark','mark','explain_answer', 'input_format']

    def create(self, validated_data):
        return question_master.objects.create(**validated_data)

class questionsSerializerCodeImport1(serializers.ModelSerializer):
    question_name_id = serializers.PrimaryKeyRelatedField(queryset=question_paper_master.objects.all(), write_only=True)

    class Meta:
        model = question_master
        fields =['question_name_id', 'question_text','answer','mark','explain_answer','input_format']

    def create(self, validated_data):
        question_name_id = validated_data.pop('question_name_id')
        return question_master.objects.create(question_name_id=question_name_id, **validated_data)


class questionsSerializerCodeImport(serializers.ModelSerializer):
    question_name_id = serializers.PrimaryKeyRelatedField(queryset=question_paper_master.objects.all(), write_only=True)

    class Meta:
        model = question_master
        fields = ['question_name_id', 'question_text', 'answer', 'mark', 'explain_answer', 'input_format']

    def create(self, validated_data):
        question_name_id = validated_data.pop('question_name_id')
        return question_master.objects.create(question_name_id=question_name_id, **validated_data)


class candidatesoneSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = candidate_master
        fields = ['id','text']


class questionsPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = question_paper_master
        fields = [ 'id','question_paper_name','no_of_questions','duration_of_test','upload_type','test_type','topic', 'sub_topic']

    def create(self, validated_data):
        topic_name = validated_data.get('topic')
        sub_topic_name = validated_data.get('sub_topic')

        # Create or get the topic_master entry
        topic_master_obj, created = topic_master.objects.get_or_create(
            topic=topic_name,
            sub_topic=sub_topic_name
        )

        # Assign the topic_master object to the question paper
        validated_data['topic'] = topic_master_obj.topic
        validated_data['sub_topic'] = topic_master_obj.sub_topic
        validated_data['dtm_created'] = datetime.now()
        return super().create(validated_data)


class questionsSerializer_IO(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields = [ 'id',
                  'question_name_id' ,
                  'question_text',
                  'question_image_data',
                  'option_a_image_data',
                  'option_b_image_data',
                  'option_c_image_data',
                  'option_d_image_data',
                  'option_a', 
                  'option_b', 
                  'option_c', 
                  'option_d', 
                  'answer', 
                  'negative_mark',
                  'mark',
                  'explain_answer', 
                  'input_format']



class candidateuserSerializerImport_OLD0406(serializers.ModelSerializer):
    class Meta:
        model = candidate_master
        fields = [ 'user_name','is_database']
    def create(self, validated_data):
        return candidate_master.objects.create(**validated_data)


class candidateuserSerializerImport(serializers.ModelSerializer):
    class Meta:
        model = candidate_master
        fields = [ 'user_name','is_database', 'college_id', 'dtm_upload']

class loginSerializerStuser_OLD0406(serializers.ModelSerializer):
    role = serializers.CharField(default='Student')

    class Meta:
        model = login
        fields =  [ 'user_name','role','password']       


class loginSerializerStuser(serializers.ModelSerializer):
    role = serializers.CharField(default='Student')

    class Meta:
        model = login
        fields =  [ 'user_name','role','password', 'college_id']


class questionsSerializer_code(serializers.ModelSerializer):
    class Meta:
        model = question_master
        fields = [ 'id',
                  'question_name_id' ,
                  'question_text',
                  'question_image_data',
                  
                  'answer', 
                  'negative_mark',
                  'mark',
                  'explain_answer', 
                  'input_format']

class jobSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = job_master
        fields = ['id','company_name','company_profile','interview_date','year', 'post_name', 'intern_fulltime', 'on_off_campus', 'skill_id',
                  'department_id','college_id', 'cgpa', 'marks_10th', 'marks_12th',
                  'history_of_arrears', 'standing_arrears', 'gender', 'location', ]

class eligible_studentSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = eligible_student_list
        fields = ['id','students_id','announcement','job_id','round_of_interview','whatsapp_text','is_accept']

class eventSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = event_master
        fields = ['id','event_name', 'event_desc', 'dtm_start', 'college_id',
                  'department_id'  ]
class companySerializer(serializers.ModelSerializer):
   
    class Meta:
        model = company_master
        fields = ['id','company_name', 'company_profile', ]

class QuestionMasterTempSerializer(serializers.ModelSerializer):
    class Meta:
        model = question_master_temp
        fields = '__all__'

class trainingreportsheetSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = training_attendance_sheet
        fields = ['id','course_schedule_id', 'dtm_attendance','present','absent' ]

 
class courseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_schedule
        fields = ['college_id',
                  'department_id',
                  'trainer_id',
                  'topic_id',
                  'student_id',
                  'year',
                  'dtm_start_student',
                  'dtm_end_student',
                  'dtm_start_trainer',
                  'dtm_end_trainer',
                  'dtm_of_training',
                ]
  
class courseContentFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_content_feedback
        fields = [
                  'student_id',
                  'topic_id',
                  'dtm_session',
                  'trainer_id',
                  'feedback']
 
class trainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = trainer_master
        fields = ['id','trainer_name','city','state','qualification', 'experience','mobile_no','email_id','skill_id',
                  'languages_known','bank_name','ifsc_code','branch_name','account_no', 'resume', 'user_name']

                  
class trainerfeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_trainer_feedback
        fields = ['college_id',
                  'department_id',
                  'trainer_id',
                  'topic_id',
                 # 'year',
                  'dtm_complete',
                  
                  'completion_status',
                  'feedback']


class studentRequestSerializer(serializers.ModelSerializer):
    class Meta: 
        model = student_request
        fields = ['student_id',
                  'dtm_request',
                  'student_query',
                  'approved_by',
                  'dtm_approved',
                  'dtm_student_update',
                  'status',
                  ]

#------------------Django Login-----------------------#


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True} }
    

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        if request and request.method == 'GET':
            # Include password in GET request response
            data['password'] = instance.password
        
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    college = collegeSerializers(source='college_id', read_only=True)

    class Meta:
        model = user_profile  # Use correct model name
        fields = ['id', 'user', 'role', 'college_id', 'college' ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        try:
            user = User.objects.create(**user_data)
            user.set_password(user_data['password'])
            user.save()
        except IntegrityError as e:
            raise ValidationError({'user': {'username': ['A user with that username already exists.']}})

        # Use correct model reference UserProfile
        ch_user_profile = user_profile.objects.create(user=user, **validated_data)
        return ch_user_profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        instance.role = validated_data.get('role', instance.role)
        instance.college_id = validated_data.get('college_id', instance.college_id)
        instance.save()

        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        if 'password' in user_data:
            user.set_password(user_data['password'])
        user.save()

        return instance


class compilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = compiler_output
        fields = '__all__'




class TestCandidateMapSerializerNeedInfo(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student_id.students_name')
    user_name = serializers.CharField(source='student_id.user_name')

    class Meta:
        model = tests_candidates_map
        fields = ['test_name', 'student_id', 'student_name', 'user_name', 'need_candidate_info']





