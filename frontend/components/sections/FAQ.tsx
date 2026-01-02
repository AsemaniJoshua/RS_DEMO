"use client";

import { useState } from "react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "What services do you offer?",
            answer: "I offer comprehensive medication therapy management, telepharmacy consultations, health education programs, speaking engagements, and personalized wellness guidance. All services are evidence-based and tailored to individual needs."
        },
        {
            question: "How do virtual consultations work?",
            answer: "Virtual consultations are conducted via secure video calls at your convenience. After booking, you'll receive a link to join the session. We'll discuss your health concerns, review medications, and develop a personalized action plan."
        },
        {
            question: "Do you accept insurance?",
            answer: "While I don't directly bill insurance, I can provide detailed receipts and documentation that you can submit to your insurance provider for potential reimbursement. Many health savings accounts (HSA/FSA) cover consultation services."
        },
        {
            question: "How long is a typical consultation?",
            answer: "Initial consultations typically last 45-60 minutes to ensure we thoroughly address your health concerns. Follow-up sessions are usually 30 minutes. Complex cases may require additional time, which we'll discuss upfront."
        },
        {
            question: "Can you prescribe medications?",
            answer: "As a clinical pharmacist, I work collaboratively with your physicians to optimize your medication regimen. I can make recommendations to your prescriber but cannot prescribe medications directly. My focus is on medication management and education."
        },
        {
            question: "Are you available for speaking engagements?",
            answer: "Yes! I regularly speak at health conferences, corporate wellness events, and community organizations. Topics range from medication safety to chronic disease prevention. Contact me to discuss your event needs."
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="text-[#0066ff]">Questions</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Get answers to common questions about services, consultations, and how we can help
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-left"
                            >
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg pr-4">{faq.question}</h3>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className={`shrink-0 text-[#0066ff] transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                >
                                    <path
                                        d="M6 9l6 6 6-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <div
                                className={`px-4 sm:px-8 overflow-hidden transition-all duration-300 ${openIndex === index ? "pb-4 sm:pb-6 max-h-96" : "max-h-0"
                                    }`}
                            >
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
