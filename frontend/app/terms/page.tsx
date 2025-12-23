export const metadata = {
  title: "Terms & Conditions - Dr. George",
  description: "Terms and Conditions for using Dr. George's health consultation services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="py-20 bg-white border-b-2 border-gray-100">
                <div className="mx-auto max-w-4xl px-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-gray-600">
                        Last Updated: December 23, 2024
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 lg:p-12 space-y-12">
                        
                        {/* Acceptance */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing and using the Dr. George Health Services website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                            </p>
                        </div>

                        {/* Services Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Dr. George Health Services provides:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Virtual medication reviews and consultations</li>
                                <li>Health and wellness guidance</li>
                                <li>Educational resources and content</li>
                                <li>Speaking and consulting services</li>
                                <li>Digital health products</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Our services are not a substitute for emergency medical care. In case of a medical emergency, call 911 or visit your nearest emergency room immediately.
                            </p>
                        </div>

                        {/* User Responsibilities */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the confidentiality of your account credentials</li>
                                <li>Use our services only for lawful purposes</li>
                                <li>Not misuse or attempt to gain unauthorized access to our systems</li>
                                <li>Respect intellectual property rights</li>
                                <li>Follow all applicable laws and regulations</li>
                            </ul>
                        </div>

                        {/* Medical Disclaimer */}
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Medical Disclaimer</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Important:</strong> Our services do not replace the relationship between you and your healthcare providers. Always consult with your physician before making any changes to your medications or treatment plan.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                The information provided through our services is for educational purposes and should not be considered medical advice. We are not responsible for any adverse outcomes resulting from the use of our information or services.
                            </p>
                        </div>

                        {/* Appointments & Cancellations */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Appointments and Cancellations</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Booking:</strong> Appointments can be scheduled through our online booking system or by contacting us directly.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Cancellation Policy:</strong> You may cancel or reschedule appointments up to 24 hours in advance without penalty. Cancellations made less than 24 hours before the appointment may incur a cancellation fee.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>No-Show Policy:</strong> Failure to attend a scheduled appointment without prior notice may result in a full session fee charge.
                            </p>
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Payment is required at the time of service unless other arrangements have been made. We accept major credit cards and other payment methods as displayed on our website.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Refunds:</strong> Refunds are handled on a case-by-case basis. Please contact us within 7 days if you believe you are entitled to a refund.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Insurance:</strong> If you are using insurance, you are responsible for understanding your coverage and any co-pays or deductibles.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                All content on our website, including text, graphics, logos, images, videos, and software, is the property of Dr. George Health Services and is protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                You may not reproduce, distribute, modify, or create derivative works from our content without explicit written permission.
                            </p>
                        </div>

                        {/* Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your privacy is important to us. Please review our <a href="/privacy" className="text-[#0066ff] hover:underline font-medium">Privacy Policy</a> to understand how we collect, use, and protect your personal information.
                            </p>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To the maximum extent permitted by law, Dr. George Health Services shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Our total liability to you for any claims arising from or related to our services shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                            </p>
                        </div>

                        {/* Indemnification */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You agree to indemnify and hold harmless Dr. George Health Services, its officers, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
                            </p>
                        </div>

                        {/* Termination */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to suspend or terminate your access to our services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason.
                            </p>
                        </div>

                        {/* Governing Law */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms and Conditions are governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                            </p>
                        </div>

                        {/* Dispute Resolution */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Any disputes arising from these terms shall first be attempted to be resolved through good-faith negotiations. If unsuccessful, disputes may be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                            </p>
                        </div>

                        {/* Changes to Terms */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 rounded-xl p-6 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> legal@drgeorge.com</p>
                                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                                <p><strong>Address:</strong> 123 Health Street, Medical Center, CA 90210</p>
                            </div>
                        </div>

                        {/* Agreement */}
                        <div className="border-t-2 border-gray-200 pt-8">
                            <p className="text-gray-600 leading-relaxed">
                                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
