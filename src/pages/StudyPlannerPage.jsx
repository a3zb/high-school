import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './StudyPlanner.css';

export default function StudyPlannerPage() {
    const { currentLang } = useLanguage();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        const savedTasks = localStorage.getItem('study_plan');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('study_plan', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const getPriorityLabel = (p) => {
        const labels = {
            high: { ar: 'عالية', en: 'High' },
            medium: { ar: 'متوسطة', en: 'Medium' },
            low: { ar: 'منخفضة', en: 'Low' }
        };
        return labels[p][currentLang.code] || labels[p].en;
    };

    return (
        <div className="page-container planner-page">
            <div className="container">
                <header className="planner-header">
                    <h1>{currentLang.code === 'ar' ? 'مخطط المراجعة' : 'Study Planner'}</h1>
                    <p>{currentLang.code === 'ar' ? 'نظم وقتك وحقق أهدافك الدراسية' : 'Organize your time and achieve your study goals'}</p>
                </header>

                <div className="planner-content">
                    <form onSubmit={addTask} className="task-form">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder={currentLang.code === 'ar' ? 'ماذا تريد أن تراجع اليوم؟' : 'What do you want to study today?'}
                        />
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="high">{currentLang.code === 'ar' ? 'أولوية عالية' : 'High Priority'}</option>
                            <option value="medium">{currentLang.code === 'ar' ? 'أولوية متوسطة' : 'Medium Priority'}</option>
                            <option value="low">{currentLang.code === 'ar' ? 'أولوية منخفضة' : 'Low Priority'}</option>
                        </select>
                        <button type="submit" className="add-task-btn">
                            {currentLang.code === 'ar' ? 'إضافة' : 'Add'}
                        </button>
                    </form>

                    <div className="tasks-list">
                        {tasks.length === 0 && (
                            <p className="empty-state">
                                {currentLang.code === 'ar' ? 'لا توجد مهام حالياً. ابدأ بإضافة خطتك!' : 'No tasks yet. Start adding your plan!'}
                            </p>
                        )}
                        {tasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
                                <div className="task-checkbox" onClick={() => toggleTask(task.id)}>
                                    {task.completed ? '✓' : ''}
                                </div>
                                <div className="task-details">
                                    <span className="task-text">{task.text}</span>
                                    <span className="task-priority-badge">{getPriorityLabel(task.priority)}</span>
                                </div>
                                <button onClick={() => deleteTask(task.id)} className="delete-task-btn">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
