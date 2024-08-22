import React, { useState } from 'react';
import Next from '../../../assets/Images/next.png'
import Back from '../../../assets/Images/back.png'
const RenderReviewSection = ({ questions, answers }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 1;

    const nextPage = () => {
        if ((currentPage + 1) * questionsPerPage < questions.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderedQuestion = questions[currentPage];
    console.log('renderedQuestion: ', renderedQuestion);

    const isAnswerCorrect = (question) => {
        return answers[question.id] === question.answer;
    };

    const getOptionText = (question, option) => {
        switch (option) {
            case 'A':
                return question.option_a;
            case 'B':
                return question.option_b;
            case 'C':
                return question.option_c;
            case 'D':
                return question.option_d;
            default:
                return '';
        }
    };

    return (
        <div style={{ padding: "10px", border: '1px solid white', width: '100%', boxSizing: "border-box", boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)" }}>
            <div key={renderedQuestion.id}>
                <h6><strong>{currentPage + 1}) {renderedQuestion.question_text}</strong></h6>
                <h6><strong>Correct Answer: {getOptionText(renderedQuestion, renderedQuestion.answer)}</strong></h6>
                {/* Check if the question id exists in answers */}
                {answers[renderedQuestion.id] !== undefined && (
                    <p style={{ fontSize: "15px", color: isAnswerCorrect(renderedQuestion) ? "#DDFB35" : "#FF474c" }}>
                        Submitted Answer: {getOptionText(renderedQuestion, answers[renderedQuestion.id])}
                    </p>
                    
                )}
                <p>
                    Explanation : {renderedQuestion.explain_answer}
                </p>
            </div>
            <div>
              <div  onClick={prevPage} disabled={currentPage === 0} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    <img src={Back} alt="Back" style={{ width: '30px', height: '30px' }} />
                </div>
                <div  onClick={nextPage} disabled={currentPage === questions.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer',float:"right",marginTop:'-30px' }}>
                    <img src={Next} alt="Next" style={{ width: '30px', height: '30px' }} />
                </div>  </div>
        </div>
    );
};

const CombinedReviewSection = ({ questions, answers }) => {
    return (
        <RenderReviewSection questions={questions} answers={answers} />
    );
};

export default CombinedReviewSection;
