import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PrioritySelector from '../components/UI/PrioritySelector';
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

    const isAr = currentLang.code === 'ar';

    return (
        <div className="page-container planner-page">
            <div className="container">
                <header className="planner-hero">
                    <h1>{isAr ? 'مخطط المراجعة القوي' : 'Power Study Planner'}</h1>
                    <p>{isAr ? 'نظم مهامك اليومية وحطم أهدافك بكفاءة' : 'Organize your daily tasks and crush your goals efficiently'}</p>
                </header>

                <div className="planner-content">
                    <form onSubmit={addTask} className="task-form-premium">
                        <div className="task-input-wrap">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder={isAr ? 'ما هي خطتك القادمة؟' : 'What is your next plan?'}
                                required
                            />
                        </div>
                        <PrioritySelector
                            value={priority}
                            onChange={setPriority}
                            currentLang={currentLang}
                        />
                        <button type="submit" className="add-task-btn-premium">
                            {isAr ? 'إضافة مهمة' : 'Add Task'}
                        </button>
                    </form>

                    <div className="tasks-grid-premium">
                        {tasks.length === 0 ? (
                            <div className="empty-plan-state">
                                <span className="empty-icon">🗓️</span>
                                <p>{isAr ? 'لا توجد مهام حالياً. ابدأ ببناء مستقبلك!' : 'No tasks yet. Start building your future!'}</p>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`task-item-premium ${task.completed ? 'completed' : ''}`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="task-check-circle" onClick={() => toggleTask(task.id)}>
                                        ✓
                                    </div>
                                    <div className="task-content-wrap">
                                        <span className="task-title">{task.text}</span>
                                        <div className="task-meta-premium">
                                            <span className={`priority-tag priority-${task.priority}`}>
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteTask(task.id)} className="delete-task-btn-premium" title="Delete">
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
