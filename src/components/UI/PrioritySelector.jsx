import { useState, useRef, useEffect } from 'react';
import './PrioritySelector.css';

export default function PrioritySelector({ value, onChange, currentLang }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { id: 'high', label: { ar: 'أولوية عالية', en: 'High Priority' }, color: '#ef4444', icon: '🔴' },
        { id: 'medium', label: { ar: 'أولوية متوسطة', en: 'Medium Priority' }, color: '#f59e0b', icon: '🟡' },
        { id: 'low', label: { ar: 'أولوية منخفضة', en: 'Low Priority' }, color: '#10b981', icon: '🟢' }
    ];

    const currentOption = options.find(o => o.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="priority-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className={`priority-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="priority-dot" style={{ backgroundColor: currentOption.color }}></span>
                <span className="priority-label">{currentOption.label[currentLang.code] || currentOption.label.en}</span>
                <span className={`chevron ${isOpen ? 'up' : 'down'}`}>▼</span>
            </button>

            {isOpen && (
                <div className="priority-menu glass">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            className={`priority-option ${value === opt.id ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(opt.id);
                                setIsOpen(false);
                            }}
                        >
                            <span className="priority-icon">{opt.icon}</span>
                            {opt.label[currentLang.code] || opt.label.en}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
