import { useState, useEffect, useRef } from 'react';
import { blogService } from '@/services/blog-service';
import { Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogTagInputProps {
    selectedTags: { name: string }[];
    onChange: (tags: { name: string }[]) => void;
}

export default function BlogTagInput({ selectedTags, onChange }: BlogTagInputProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTags();
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

    const loadTags = async () => {
        try {
            const response = await blogService.getAllTags();
            if (response.data) {
                setTags(response.data);
            }
        } catch (error) {
            console.error('Failed to load tags', error);
        }
    };

    const handleAddTag = (name: string) => {
        // Check if already selected
        if (selectedTags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
            toast.error('Tag already added');
            setInputValue('');
            setShowDropdown(false);
            return;
        }

        onChange([...selectedTags, { name }]);
        setInputValue('');
        setShowDropdown(false);
    };

    const handleRemoveTag = (indexToRemove: number) => {
        onChange(selectedTags.filter((_, index) => index !== indexToRemove));
    };

    const filteredTags = tags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.some(selected => selected.name.toLowerCase() === tag.toLowerCase())
    );

    return (
        <div className="w-full" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            
            {/* Selected Tags Chips */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tag.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="sr-only">Remove tag {tag.name}</span>
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 text-gray-900 placeholder-gray-500 border"
                        placeholder="Select or create tags..."
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
                                    handleAddTag(inputValue.trim());
                                }
                            }
                        }}
                    />
                </div>

                {/* Dropdown */}
                {showDropdown && (inputValue || filteredTags.length > 0) && (
                    <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60">
                        {filteredTags.map((tag) => (
                            <div
                                key={tag}
                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-gray-900"
                                onClick={() => handleAddTag(tag)}
                            >
                                <span className="block truncate">{tag}</span>
                            </div>
                        ))}
                        
                        {inputValue && !filteredTags.includes(inputValue) && (
                            <div
                                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 text-blue-600 font-semibold"
                                onClick={() => handleAddTag(inputValue)}
                            >
                                Create "{inputValue}"
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Type to search or create a new tag. Press Enter to add.
            </p>
        </div>
    );
}
