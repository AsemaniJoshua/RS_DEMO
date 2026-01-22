import { useState, useEffect, useRef } from 'react';
import { blogService } from '@/services/blog-service';
import { Plus, X, Component } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogCategorySelectProps {
    selectedCategories: { name: string; slug: string }[];
    onChange: (categories: { name: string; slug: string }[]) => void;
}

export default function BlogCategorySelect({ selectedCategories, onChange }: BlogCategorySelectProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Reset highlighted index when filtered options change
    useEffect(() => {
        setHighlightedIndex(0);
    }, [inputValue, showDropdown]);

    const loadCategories = async () => {
        try {
            const response = await blogService.getAllCategories();
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleAddCategory = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        if (selectedCategories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            toast.error('Category already added');
            setInputValue('');
            setShowDropdown(false);
            return;
        }

        onChange([...selectedCategories, { name, slug }]);
        setInputValue('');
        setShowDropdown(false);
        // keep input focus
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleRemoveCategory = (indexToRemove: number) => {
        onChange(selectedCategories.filter((_, index) => index !== indexToRemove));
    };

    const filteredCategories = categories.filter(category => 
        category.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedCategories.some(selected => selected.name.toLowerCase() === category.toLowerCase())
    );

    const showCreateOption = inputValue && !filteredCategories.includes(inputValue);
    const totalOptions = filteredCategories.length + (showCreateOption ? 1 : 0);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setShowDropdown(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % totalOptions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + totalOptions) % totalOptions);
                break;
            case 'Enter':
                e.preventDefault();
                if (totalOptions > 0) {
                    if (highlightedIndex < filteredCategories.length) {
                        handleAddCategory(filteredCategories[highlightedIndex]);
                    } else if (showCreateOption) {
                        handleAddCategory(inputValue);
                    }
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                break;
        }
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            
            {/* Selected Categories Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveCategory(index)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                        >
                            <span className="sr-only">Remove category {category.name}</span>
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Component className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 text-gray-900 placeholder-gray-500 border"
                        placeholder="Select or create category..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Dropdown */}
                {showDropdown && totalOptions > 0 && (
                    <div className="absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60">
                        {filteredCategories.map((category, index) => (
                            <div
                                key={category}
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                    index === highlightedIndex ? 'bg-blue-50 text-blue-900' : 'text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => handleAddCategory(category)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                <span className="block truncate">{category}</span>
                            </div>
                        ))}
                        
                        {showCreateOption && (
                            <div
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                    highlightedIndex === filteredCategories.length ? 'bg-blue-50' : 'hover:bg-gray-100'
                                } text-blue-600 font-semibold`}
                                onClick={() => handleAddCategory(inputValue)}
                                onMouseEnter={() => setHighlightedIndex(filteredCategories.length)}
                            >
                                Create "{inputValue}"
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Type to search. Use arrow keys to navigate, Enter to select.
            </p>
        </div>
    );
}
