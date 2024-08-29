from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_eligible_student_list_is_accept'),  # Adjust this to match your last migration
    ]

    operations = [
        migrations.RunSQL(
            """
            CREATE OR REPLACE FUNCTION GetQuestionsByQuestionNameId(questionNameId INT)
            RETURNS TABLE (
                id INT,
                question_text TEXT,
                question_image_data BYTEA,
                mark INT
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    id,
                    question_text,
                    mark
                FROM 
                    question_master
                WHERE 
                    deleted = 0 AND question_name_id = questionNameId;
            END;
            $$ LANGUAGE plpgsql;
            """
        ),
    ]
