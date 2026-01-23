import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import educationData from '../data/educational_structure.json';
import CustomSelect from '../components/UI/CustomSelect';
import './CalculatorPage.css';

export default function CalculatorPage() {
    const { currentLang } = useLanguage();
    const [searchParams] = useSearchParams();
    const isAr = currentLang.code === 'ar';

    // Selection State
    const [selectedYearId, setSelectedYearId] = useState(searchParams.get('year') || '');
    const [selectedStreamId, setSelectedStreamId] = useState('');

    // Multi-input grade state
    // { [subjectId]: { assessment, quiz, practical, exam, coeff } }
    const [grades, setGrades] = useState({});
    const [totalAverage, setTotalAverage] = useState(null);

    const year = educationData.years.find(y => y.id === selectedYearId);
    const stream = year?.streams.find(s => s.id === selectedStreamId);
    const subjects = stream?.subjects || [];

    // Initialize/Update grades when stream or year changes
    useEffect(() => {
        if (subjects.length > 0) {
            const initialGrades = {};
            subjects.forEach(sub => {
                initialGrades[sub.id] = {
                    assessment: '',
                    quiz: '',
                    practical: '',
                    exam: '',
                    coeff: sub.coefficient ?? ''
                };
            });
            setGrades(initialGrades);
            setTotalAverage(null);
        }
    }, [selectedYearId, selectedStreamId, subjects]);

    const handleInputChange = (subId, field, value) => {
        setGrades(prev => ({
            ...prev,
            [subId]: {
                ...prev[subId],
                [field]: value
            }
        }));
    };

    const calculateAverage = () => {
        let sumWeightedAvgs = 0;
        let sumCoeffs = 0;

        Object.keys(grades).forEach(subId => {
            const data = grades[subId];
            const { assessment, quiz, practical, exam, coeff } = data;

            if (assessment === '' && quiz === '' && exam === '') return;

            const a = parseFloat(assessment) || 0;
            const q = parseFloat(quiz) || 0;
            const p = practical !== '' ? parseFloat(practical) : null;
            const e = parseFloat(exam) || 0;
            const c = parseFloat(coeff) || 0;

            if (c === 0) return;

            const continuousCount = p !== null ? 3 : 2;
            const continuousSum = a + q + (p || 0);
            const continuousAvg = continuousSum / continuousCount;

            const subjectAvg = (continuousAvg + (e * 2)) / 3;

            sumWeightedAvgs += subjectAvg * c;
            sumCoeffs += c;
        });

        if (sumCoeffs === 0) return;
        setTotalAverage((sumWeightedAvgs / sumCoeffs).toFixed(2));
    };

    const resetGrades = () => {
        const resetData = {};
        subjects.forEach(sub => {
            resetData[sub.id] = {
                assessment: '', quiz: '', practical: '', exam: '',
                coeff: sub.coefficient ?? ''
            };
        });
        setGrades(resetData);
        setTotalAverage(null);
    };

    return (
        <div className="page-container calculator-page-dz">
            <div className="container">
                <header className="calc-hero-dz glass">
                    <h1>{isAr ? 'حساب المعدل' : 'Calculate Average'}</h1>
                    <p>{isAr ? 'أدخل علامات الفروض، الاختبارات، والتقويم لكل مادة' : 'Enter Quizzes, Exams, and Assessment marks for each subject'}</p>
                </header>

                <div className="calc-setup-card glass-card">
                    <div className="setup-grid-dz">
                        <CustomSelect
                            label={isAr ? 'السنة الدراسية' : 'Year'}
                            options={educationData.years.map(y => ({ value: y.id, label: y.title[currentLang.code] }))}
                            value={selectedYearId}
                            onChange={v => setSelectedYearId(v)}
                        />
                        <CustomSelect
                            label={isAr ? 'الشعبة' : 'Stream'}
                            options={year?.streams.map(s => ({ value: s.id, label: s.title[currentLang.code] })) || []}
                            value={selectedStreamId}
                            onChange={v => setSelectedStreamId(v)}
                        />
                    </div>
                </div>

                {selectedStreamId && subjects.length > 0 && (
                    <div className="calc-table-container glass">
                        <table className="dz-calc-table">
                            <thead>
                                <tr>
                                    <th>{isAr ? 'المادة' : 'Subject'}</th>
                                    <th>{isAr ? 'التقويم' : 'Assess'}</th>
                                    <th>{isAr ? 'الفرض' : 'Quiz'}</th>
                                    <th>{isAr ? 'أعمال تطبيقية' : 'Practical'}</th>
                                    <th>{isAr ? 'الاختبار' : 'Exam'}</th>
                                    <th>{isAr ? 'المعامل' : 'Coeff'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(sub => (
                                    <tr key={sub.id}>
                                        <td className="sub-name-cell">
                                            {sub.title[currentLang.code] || sub.title.en}
                                        </td>
                                        <td data-label={isAr ? 'التقويم' : 'Assess'}>
                                            <input
                                                type="number"
                                                placeholder="00.00"
                                                value={grades[sub.id]?.assessment || ''}
                                                onChange={e => handleInputChange(sub.id, 'assessment', e.target.value)}
                                            />
                                        </td>
                                        <td data-label={isAr ? 'الفرض' : 'Quiz'}>
                                            <input
                                                type="number"
                                                placeholder="00.00"
                                                value={grades[sub.id]?.quiz || ''}
                                                onChange={e => handleInputChange(sub.id, 'quiz', e.target.value)}
                                            />
                                        </td>
                                        <td data-label={isAr ? 'أعمال تطبيقية' : 'Practical'}>
                                            <input
                                                type="number"
                                                placeholder="---"
                                                value={grades[sub.id]?.practical ?? ''}
                                                onChange={e => handleInputChange(sub.id, 'practical', e.target.value)}
                                            />
                                        </td>
                                        <td data-label={isAr ? 'الاختبار' : 'Exam'}>
                                            <input
                                                type="number"
                                                placeholder="00.00"
                                                value={grades[sub.id]?.exam || ''}
                                                onChange={e => handleInputChange(sub.id, 'exam', e.target.value)}
                                            />
                                        </td>
                                        <td data-label={isAr ? 'المعامل' : 'Coeff'}>
                                            <input
                                                className="coeff-input"
                                                type="number"
                                                value={grades[sub.id]?.coeff || ''}
                                                onChange={e => handleInputChange(sub.id, 'coeff', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="calc-actions-footer">
                            <button className="db-primary-btn px-xl" onClick={calculateAverage}>
                                {isAr ? 'ابدأ الحساب' : 'Calculate Now'}
                            </button>
                            <button className="db-outline-btn px-lg" onClick={resetGrades} style={{ marginLeft: '1rem', marginRight: '1rem' }}>
                                {isAr ? 'إعادة تعيين' : 'Reset'}
                            </button>
                        </div>
                    </div>
                )}

                {totalAverage !== null && (
                    <div className={`dz-result-card ${parseFloat(totalAverage) >= 10 ? 'pass' : 'fail'}`}>
                        <div className="result-inner">
                            <h3>{isAr ? 'المعدل الفصلي النهائي' : 'Final Term Average'}</h3>
                            <div className="avg-main">{totalAverage}</div>
                            <div className="status-pill">
                                {parseFloat(totalAverage) >= 10 ? (isAr ? '🎉 ناجح' : '🎉 Pass') : (isAr ? '💪 واصل الاجتهاد' : '💪 Keep Trying')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
