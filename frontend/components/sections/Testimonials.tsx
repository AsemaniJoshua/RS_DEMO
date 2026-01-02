export default function Testimonials() {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        What People Are <span className="text-[#0066ff]">Saying</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Real stories from patients and partners who have benefited from expert guidance
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Sarah Johnson",
                            role: "Patient",
                            quote: "Dr. George's guidance on medication management completely transformed my health journey. His clear explanations made complex medical information easy to understand.",
                            rating: 5
                        },
                        {
                            name: "Michael Chen",
                            role: "Healthcare Administrator",
                            quote: "Working with Dr. George on our community health initiative was exceptional. His expertise and dedication to patient education is unmatched.",
                            rating: 5
                        },
                        {
                            name: "Emily Rodriguez",
                            role: "Wellness Coach",
                            quote: "Dr. George's speaking sessions are always engaging and informative. He has a unique ability to make evidence-based health education accessible to everyone.",
                            rating: 5
                        }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#0066ff">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-700 leading-relaxed mb-6 italic">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
