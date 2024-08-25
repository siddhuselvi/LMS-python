# forms.py
from django import forms
from .models import question_master, college_master, eligible_student_list, Screenshots
from django import forms

class QuestionImportForm(forms.Form):
    docx_file = forms.FileField()

class DocumentForm(forms.Form):
    docfile = forms.FileField()
class QuestionForm(forms.ModelForm):
    question_image_data = forms.FileField(required=False)
    option_a_image_data = forms.FileField(required=False)
    option_b_image_data = forms.FileField(required=False)
    option_c_image_data = forms.FileField(required=False)
    option_d_image_data = forms.FileField(required=False)

    class Meta:
        model = question_master
        fields = ['id',
                  'question_name_id' ,
                  'question_text',
                                   
                  'option_a', 
                  'option_b', 
                  'option_c', 
                  'option_d', 
                  'answer', 
                  'negative_mark',
                  'mark',
                  'explain_answer', 
                  
                  
                 ]
        

class QuestionCodeForm(forms.ModelForm):
    question_image_data = forms.FileField(required=False)
   
    class Meta:
        model = question_master
        fields = ['id',
                  'question_name_id' ,
                  'question_text',
                   'answer', 
                  'negative_mark',
                  'mark',
                  'explain_answer', 
                  'input_format',
                  
                 ]


class CollegeForm(forms.ModelForm):
    college_logo = forms.FileField(required=False)
   
    class Meta:
        model = college_master
        fields = ['id',
                  'college',
                 ]



class EligibleStudentListForm(forms.ModelForm):
    announcement_image = forms.FileField(required=False)

    class Meta:
        model = eligible_student_list
        fields = ['announcement']




class QuestionFormMCQ(forms.ModelForm):
    question_image_data = forms.FileField(required=False)
    option_a_image_data = forms.FileField(required=False)
    option_b_image_data = forms.FileField(required=False)
    option_c_image_data = forms.FileField(required=False)
    option_d_image_data = forms.FileField(required=False)

    class Meta:
        model = question_master
        fields = ['id',
                  'question_text',
                  'option_a', 
                  'option_b', 
                  'option_c', 
                  'option_d', 
                  'answer', 
                 ]

class ScreenshotsForm(forms.ModelForm):
    screenshots = forms.FileField(required=False)
   
    class Meta:
        model = Screenshots
        fields = ['id',
                  'test_candidate_id',
                  
                 ]

