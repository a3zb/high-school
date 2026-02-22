import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './SearchBar.css';

export default function SearchBar() {
    const [term, setTerm] = useState('');
    const navigate = useNavigate();
    const { currentLang } = useLanguage();

    const handleSearch = (e) => {
        e.preventDefault();
        if (term.trim()) {
            navigate(`/search?q=${encodeURIComponent(term)}`);
            setTerm('');
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder={currentLang.code === 'ar' ? 'بحث عن دروس، مواد...' : 'Search lessons, subjects...'}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
        </form>
    );
}
