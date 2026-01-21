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
    const wrapperRef = useRef<HTMLDivElement>(null);

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
        // Simple slug generation
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check if already selected
        if (selectedCategories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            toast.error('Category already added');
            setInputValue('');
            setShowDropdown(false);
            return;
        }

        onChange([...selectedCategories, { name, slug }]);
        setInputValue('');
        setShowDropdown(false);
    };

    const handleRemoveCategory = (indexToRemove: number) => {
        onChange(selectedCategories.filter((_, index) => index !== indexToRemove));
    };

    const filteredCategories = categories.filter(category => 
        category.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedCategories.some(selected => selected.name.toLowerCase() === category.toLowerCase())
    );

    return (
        <div className="w-full" ref={wrapperRef}>
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
                        type="text"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 text-gray-900 placeholder-gray-500 border"
                        placeholder="Select or create category..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (inputValue.trim()) {
                                    handleAddCategory(inputValue.trim());
                                }
                            }
                        }}
                    />
                </div>

                {/* Dropdown */}
                {showDropdown && (inputValue || filteredCategories.length > 0) && (
                    <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60">
                        {filteredCategories.map((category) => (
                            <div
                                key={category}
                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-gray-900"
                                onClick={() => handleAddCategory(category)}
                            >
                                <span className="block truncate">{category}</span>
                            </div>
                        ))}
                        
                        {inputValue && !filteredCategories.includes(inputValue) && (
                            <div
                                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-blue-600 font-semibold"
                                onClick={() => handleAddCategory(inputValue)}
                            >
                                Create "{inputValue}"
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Type to search or create a new category. Press Enter to add.
            </p>
        </div>
    );
}
