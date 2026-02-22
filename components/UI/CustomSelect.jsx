import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

export default function CustomSelect({ options, value, onChange, placeholder = 'Select an option', label }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(o => o.value === value);

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
        <div className="custom-select-container" ref={dropdownRef}>
            {label && <label className="custom-select-label">{label}</label>}
            <button
                type="button"
                className={`custom-select-trigger ${isOpen ? 'active' : ''} ${!value ? 'placeholder' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="selected-text">{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={`chevron ${isOpen ? 'up' : 'down'}`}>▼</span>
            </button>

            {isOpen && (
                <div className="custom-select-menu glass">
                    {options.length === 0 ? (
                        <div className="custom-select-no-options">No options available</div>
                    ) : (
                        options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                {opt.label}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
