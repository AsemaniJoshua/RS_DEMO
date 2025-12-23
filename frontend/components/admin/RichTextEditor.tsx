"use client";

import { useRef, useState, useEffect } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing...", minHeight = "400px" }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const formatButtons = [
        {
            title: "Bold",
            command: "bold",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                </svg>
            )
        },
        {
            title: "Italic",
            command: "italic",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="4" x2="10" y2="4"/>
                    <line x1="14" y1="20" x2="5" y2="20"/>
                    <line x1="15" y1="4" x2="9" y2="20"/>
                </svg>
            )
        },
        {
            title: "Underline",
            command: "underline",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
                    <line x1="4" y1="21" x2="20" y2="21"/>
                </svg>
            )
        },
        {
            title: "Strike",
            command: "strikeThrough",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4H9a3 3 0 0 0-2.83 4"/>
                    <path d="M14 12a4 4 0 0 1 0 8H6"/>
                    <line x1="4" y1="12" x2="20" y2="12"/>
                </svg>
            )
        }
    ];

    const listButtons = [
        {
            title: "Bullet List",
            command: "insertUnorderedList",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
            )
        },
        {
            title: "Numbered List",
            command: "insertOrderedList",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="10" y1="6" x2="21" y2="6"/>
                    <line x1="10" y1="12" x2="21" y2="12"/>
                    <line x1="10" y1="18" x2="21" y2="18"/>
                    <path d="M4 6h1v4"/>
                    <path d="M4 10h2"/>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                </svg>
            )
        }
    ];

    const alignButtons = [
        {
            title: "Align Left",
            command: "justifyLeft",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="17" y1="10" x2="3" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="17" y1="18" x2="3" y2="18"/>
                </svg>
            )
        },
        {
            title: "Align Center",
            command: "justifyCenter",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="10" x2="6" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="18" y1="18" x2="6" y2="18"/>
                </svg>
            )
        },
        {
            title: "Align Right",
            command: "justifyRight",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="21" y1="10" x2="7" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="21" y1="18" x2="7" y2="18"/>
                </svg>
            )
        }
    ];

    const insertLink = () => {
        const url = prompt("Enter URL:");
        if (url) {
            execCommand("createLink", url);
        }
    };

    return (
        <div className={`border rounded-lg overflow-hidden ${isFocused ? 'border-[#00d4aa]' : 'border-gray-200'}`}>
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
                {/* Heading Dropdown */}
                <select
                    onChange={(e) => execCommand("formatBlock", e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-[#00d4aa]"
                    defaultValue="p"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Format Buttons */}
                {formatButtons.map((btn, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => execCommand(btn.command)}
                        title={btn.title}
                        className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                        {btn.icon}
                    </button>
                ))}

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* List Buttons */}
                {listButtons.map((btn, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => execCommand(btn.command)}
                        title={btn.title}
                        className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                        {btn.icon}
                    </button>
                ))}

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Align Buttons */}
                {alignButtons.map((btn, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => execCommand(btn.command)}
                        title={btn.title}
                        className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                        {btn.icon}
                    </button>
                ))}

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Link Button */}
                <button
                    type="button"
                    onClick={insertLink}
                    title="Insert Link"
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                </button>

                {/* Clear Formatting */}
                <button
                    type="button"
                    onClick={() => execCommand("removeFormat")}
                    title="Clear Formatting"
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 4v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4"/>
                        <line x1="3" y1="4" x2="21" y2="4"/>
                        <line x1="18" y1="18" x2="6" y2="6"/>
                    </svg>
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="p-4 outline-none prose max-w-none text-gray-900"
                style={{ minHeight }}
                data-placeholder={placeholder}
            />

            <style jsx>{`
                div[contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
