# forms.py
from django import forms
from .models import question_master
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