import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuizzes } from '../../context/QuizContext';
import { useLanguage } from '../../context/LanguageContext';
import educationData from '../../data/educational_structure.json';
import { canEditContent } from '../../utils/permissions';
import CustomSelect from '../UI/CustomSelect';
import './QuizStyles.css';

export default function QuizCreationForm() {
    const { user } = useAuth();
    const { addQuiz } = useQuizzes();
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    const [formData, setFormData] = useState({
        title: '',
        yearId: '',
        streamId: '',
        subjectId: '',
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        text: '',
        options: ['', ''],
        correctOptionIndex: 0
    });

    if (!user) return null;

    const handleAddQuestion = () => {
        if (!currentQuestion.text || currentQuestion.options.some(opt => !opt)) {
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
            return;
        }
        addQuiz(formData);
        setFormData({ title: '', yearId: '', streamId: '', subjectId: '', questions: [] });
    };

    const selectedYear = educationData.years.find(y => y.id === formData.yearId);
    const selectedStream = selectedYear?.streams.find(s => s.id === formData.streamId);
    const availableSubjects = selectedStream?.subjects?.filter(sub => canEditContent(user, sub.id)) || [];

    return (
        <div className="quiz-premium-container">
            <div className="section-header">
                <h2>{isAr ? 'إنشاء اختبار تفاعلي' : 'Create Interactive Quiz'}</h2>
                <p>{isAr ? 'قم ببناء أسئلة برمجية لتقييم الطلاب' : 'Build automated questions to evaluate students'}</p>
            </div>

            <form onSubmit={handleSubmit} className="premium-compact-form">
                <div className="form-row-three">
                    <CustomSelect
                        label={isAr ? 'السنة' : 'Year'}
                        options={educationData.years.map(y => ({ value: y.id, label: y.title[currentLang.code] }))}
                        value={formData.yearId}
                        onChange={val => setFormData({ ...formData, yearId: val, streamId: '', subjectId: '' })}
                    />
                    <CustomSelect
                        label={isAr ? 'الشعبة' : 'Stream'}
                        options={selectedYear?.streams.map(s => ({ value: s.id, label: s.title[currentLang.code] })) || []}
                        value={formData.streamId}
                        onChange={val => setFormData({ ...formData, streamId: val, subjectId: '' })}
                    />
                    <CustomSelect
                        label={isAr ? 'المادة' : 'Subject'}
                        options={availableSubjects.map(sub => ({ value: sub.id, label: sub.title[currentLang.code] }))}
                        value={formData.subjectId}
                        onChange={val => setFormData({ ...formData, subjectId: val })}
                    />
                </div>

                <div className="input-field-db">
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder=" "
                        id="quiz-title"
                    />
                    <label htmlFor="quiz-title">{isAr ? 'عنوان الاختبار' : 'Quiz Title'}</label>
                    <div className="db-input-line"></div>
                </div>

                {/* Question Builder */}
                <div className="question-builder-premium glass-card">
                    <h3>{isAr ? 'إضافة سؤال' : 'Add Question'}</h3>

                    <div className="input-field-db">
                        <input
                            type="text"
                            required
                            value={currentQuestion.text}
                            onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                            placeholder=" "
                            id="q-text"
                        />
                        <label htmlFor="q-text">{isAr ? 'نص السؤال' : 'Question Text'}</label>
                        <div className="db-input-line"></div>
                    </div>

                    <div className="options-grid-premium">
                        {currentQuestion.options.map((opt, idx) => (
                            <div key={idx} className="option-row-premium">
                                <input
                                    type="radio"
                                    name="correct-opt"
                                    checked={currentQuestion.correctOptionIndex === idx}
                                    onChange={() => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: idx })}
                                />
                                <input
                                    type="text"
                                    placeholder={isAr ? `الخيار ${idx + 1}` : `Option ${idx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                    className="option-input"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="builder-actions">
                        <button type="button" className="db-icon-btn" onClick={() => setCurrentQuestion(p => ({ ...p, options: [...p.options, ''] }))}>
                            ➕ {isAr ? 'خيار جديد' : 'New Option'}
                        </button>
                        <button type="button" className="db-primary-btn mini" onClick={handleAddQuestion}>
                            {isAr ? 'تثبيت السؤال' : 'Confirm Question'}
                        </button>
                    </div>
                </div>

                {formData.questions.length > 0 && (
                    <div className="quiz-summary-mini glass">
                        <span>📝 {isAr ? 'الأسئلة المضافة:' : 'Questions added:'} <strong>{formData.questions.length}</strong></span>
                    </div>
                )}

                <button type="submit" className="db-primary-btn" disabled={formData.questions.length === 0}>
                    {isAr ? 'حفظ ونشر الاختبار' : 'Save & Publish Quiz'}
                </button>
            </form>
        </div>
    );
}
