import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuizzes } from '../../context/QuizContext';
import { useLanguage } from '../../context/LanguageContext';
import educationData from '../../data/educational_structure.json';
import { canEditContent } from '../../utils/permissions';
import './QuizStyles.css';

export default function QuizCreationForm() {
    const { user } = useAuth();
    const { addQuiz } = useQuizzes();
    const { currentLang } = useLanguage();

    const [formData, setFormData] = useState({
        title: '',
        yearId: '',
        streamId: '',
        subjectId: '',
        questions: []
    });

    // Temporary state for adding a single question
    const [currentQuestion, setCurrentQuestion] = useState({
        text: '',
        options: ['', ''],
        correctOptionIndex: 0
    });

    if (!user) return null;

    const handleAddQuestion = () => {
        if (!currentQuestion.text || currentQuestion.options.some(opt => !opt)) {
            alert("Please check question data");
            return;
        }
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { ...currentQuestion, id: `q-${Date.now()}` }]
        }));
        setCurrentQuestion({ text: '', options: ['', ''], correctOptionIndex: 0 });
    };

    const updateOption = (idx, val) => {
        const newOpts = [...currentQuestion.options];
        newOpts[idx] = val;
        setCurrentQuestion(prev => ({ ...prev, options: newOpts }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.subjectId || formData.questions.length === 0) {
            alert("Please fill all quiz details");
            return;
        }
        addQuiz(formData);
        alert("Quiz Created!");
        setFormData({ title: '', yearId: '', streamId: '', subjectId: '', questions: [] });
    };

    // Logic to get subjects same as TeacherDashboard
    const selectedYear = educationData.years.find(y => y.id === formData.yearId);
    const selectedStream = selectedYear?.streams.find(s => s.id === formData.streamId);
    const availableSubjects = selectedStream?.subjects?.filter(sub => canEditContent(user, sub.id)) || [];

    return (
        <div className="quiz-creation-container">
            <h3>Create New Quiz</h3>
            <form onSubmit={handleSubmit} className="quiz-form">
                {/* Metadata Select definitions similar to Dashboard */}
                <div className="form-group">
                    <select value={formData.yearId} onChange={e => setFormData({ ...formData, yearId: e.target.value })}>
                        <option value="">Select Year</option>
                        {educationData.years.map(y => <option key={y.id} value={y.id}>{y.title[currentLang.code]}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <select value={formData.streamId} disabled={!formData.yearId} onChange={e => setFormData({ ...formData, streamId: e.target.value })}>
                        <option value="">Select Stream</option>
                        {selectedYear?.streams.map(s => <option key={s.id} value={s.id}>{s.title[currentLang.code]}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <select value={formData.subjectId} disabled={!formData.streamId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })}>
                        <option value="">Select Subject</option>
                        {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.title[currentLang.code]}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Quiz Title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Question Builder */}
                <div className="question-builder">
                    <h4>Add Question</h4>
                    <input
                        type="text"
                        placeholder="Question Text"
                        value={currentQuestion.text}
                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                    />
                    {currentQuestion.options.map((opt, idx) => (
                        <div key={idx} className="option-row">
                            <input
                                type="radio"
                                name="correct-opt"
                                checked={currentQuestion.correctOptionIndex === idx}
                                onChange={() => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: idx })}
                            />
                            <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(idx, e.target.value)}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => setCurrentQuestion(p => ({ ...p, options: [...p.options, ''] }))}>+ Option</button>
                    <button type="button" className="add-question-btn" onClick={handleAddQuestion}>Add Question to Quiz</button>
                </div>

                {/* Preview */}
                <div className="quiz-preview">
                    <p>Questions Added: {formData.questions.length}</p>
                </div>

                <button type="submit" className="submit-quiz-btn"><strong>Create Quiz</strong></button>
            </form>
        </div>
    );
}
