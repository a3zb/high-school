import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import educationData from '../data/educational_structure.json';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import './CalculatorPage.css';

export default function CalculatorPage() {
    const { currentLang } = useLanguage();

    // Selection State
    const [selectedYearId, setSelectedYearId] = useState('');
    const [selectedStreamId, setSelectedStreamId] = useState('');

    // Calculation State
    const [grades, setGrades] = useState({}); // { subjectId: number }
    const [average, setAverage] = useState(null);

    // Derived Data
    const selectedYear = educationData.years.find(y => y.id === selectedYearId);
    const selectedStream = selectedYear?.streams.find(s => s.id === selectedStreamId);
    const subjects = selectedStream?.subjects || [];

    // Reset grades when stream changes
    useEffect(() => {
        setGrades({});
        setAverage(null);
    }, [selectedStreamId]);

    const handleGradeChange = (subjectId, value) => {
        const numVal = parseFloat(value);
        setGrades(prev => ({
            ...prev,
            [subjectId]: isNaN(numVal) ? '' : Math.min(Math.max(numVal, 0), 20)
        }));
    };

    const calculateAverage = () => {
        let totalScore = 0;
        let totalCoeff = 0;

        subjects.forEach(sub => {
            const grade = grades[sub.id] || 0;
            const coeff = sub.coefficient || 1; // Default to 1 if missing
            totalScore += grade * coeff;
            totalCoeff += coeff;
        });

        if (totalCoeff === 0) return 0;
        const avg = totalScore / totalCoeff;
        setAverage(avg.toFixed(2));
    };

    return (
        <div className="page-container calculator-page">
            <Breadcrumbs />
            <div className="container">
                <h1 className="page-title">
                    {currentLang.code === 'ar' ? 'حساب المعدل الفصلي' : 'Calculate Average'}
                </h1>

                <div className="calculator-card">
                    {/* Controls */}
                    <div className="calc-controls">
                        <div className="form-group">
                            <label>{currentLang.code === 'ar' ? 'السنة الدراسية' : 'Academic Year'}</label>
                            <select
                                value={selectedYearId}
                                onChange={e => { setSelectedYearId(e.target.value); setSelectedStreamId(''); }}
                            >
                                <option value="">---</option>
                                {educationData.years.map(y => (
                                    <option key={y.id} value={y.id}>{y.title[currentLang.code] || y.title.en}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{currentLang.code === 'ar' ? 'الشعبة' : 'Stream'}</label>
                            <select
                                value={selectedStreamId}
                                disabled={!selectedYearId}
                                onChange={e => setSelectedStreamId(e.target.value)}
                            >
                                <option value="">---</option>
                                {selectedYear?.streams.map(s => (
                                    <option key={s.id} value={s.id}>{s.title[currentLang.code] || s.title.en}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subject List */}
                    {selectedStream && (
                        <div className="calc-content">
                            <div className="subjects-grid">
                                {subjects.map(sub => (
                                    <div key={sub.id} className="subject-input-row">
                                        <div className="sub-info">
                                            <span className="sub-name">{sub.title[currentLang.code] || sub.title.en}</span>
                                            <span className="sub-coeff badge">x{sub.coefficient || 1}</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            placeholder="/20"
                                            value={grades[sub.id] !== undefined ? grades[sub.id] : ''}
                                            onChange={e => handleGradeChange(sub.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="calc-actions">
                                <button className="calculate-btn" onClick={calculateAverage}>
                                    {currentLang.code === 'ar' ? 'احسب المعدل' : 'Calculate'}
                                </button>
                            </div>

                            {average !== null && (
                                <div className={`result-box ${parseFloat(average) >= 10 ? 'pass' : 'fail'}`}>
                                    <h3>{currentLang.code === 'ar' ? 'المعدل الخاص بك:' : 'Your Average:'}</h3>
                                    <div className="average-display">{average} / 20</div>
                                    <p>{parseFloat(average) >= 10 ? '🎉 Congratulations!' : '📚 Keep Studying!'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
