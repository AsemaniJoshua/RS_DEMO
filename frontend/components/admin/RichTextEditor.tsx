"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;

export default function RichTextEditor({ value, onChange, placeholder = "Start writing...", minHeight = "400px" }: RichTextEditorProps) {

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height: minHeight, marginBottom: '50px' }}
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    font-size: 1rem;
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-color: #f9fafb;
                }
                .rich-text-editor .ql-editor {
                    min-height: ${minHeight};
                    color: #1f2937; /* gray-800 */
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #9ca3af; /* gray-400 for placeholder */
                    font-style: normal;
                }
            `}</style>
        </div>
    );
}
