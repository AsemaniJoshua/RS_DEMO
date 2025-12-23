export const metadata = {
  title: "Privacy Policy - Dr. George",
  description: "Privacy Policy and data protection information for Dr. George's health consultation services.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="py-20 bg-white border-b-2 border-gray-100">
                <div className="mx-auto max-w-4xl px-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Privacy Policy
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
                        
                        {/* Introduction */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                At Dr. George Health Services ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Register for an account</li>
                                <li>Book a consultation or appointment</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Contact us through our forms</li>
                                <li>Purchase products or services</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                This information may include: name, email address, phone number, mailing address, date of birth, medical information, payment information, and any other information you choose to provide.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you visit our website, we may automatically collect certain information about your device, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>IP address and browser type</li>
                                <li>Operating system and device information</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>

                        {/* How We Use Your Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Providing, maintaining, and improving our services</li>
                                <li>Processing your appointments and consultations</li>
                                <li>Sending you important updates and notifications</li>
                                <li>Responding to your inquiries and support requests</li>
                                <li>Personalizing your experience on our website</li>
                                <li>Analyzing usage patterns to improve our services</li>
                                <li>Complying with legal obligations</li>
                                <li>Protecting against fraud and security threats</li>
                            </ul>
                        </div>

                        {/* Information Sharing */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We do not sell your personal information. We may share your information in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                                <li><strong>Healthcare Providers:</strong> With other healthcare professionals involved in your care (with your consent)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                            </ul>
                        </div>

                        {/* HIPAA Compliance */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">HIPAA Compliance</h2>
                            <p className="text-gray-700 leading-relaxed">
                                As a healthcare provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA) and protect your Protected Health Information (PHI) according to federal regulations. Your medical information is kept confidential and secure, and is only shared as permitted by HIPAA and with your explicit authorization.
                            </p>
                        </div>

                        {/* Data Security */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect your personal information, including encryption, secure servers, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You have the following rights regarding your personal information:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Access:</strong> Request access to your personal information</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                                <li><strong>Restrict Processing:</strong> Request limitation on how we use your data</li>
                            </ul>
                        </div>

                        {/* Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Terms of Service</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Please also review our <a href="/terms" className="text-[#0066ff] hover:underline font-medium">Terms & Conditions</a> which govern your use of our services and website.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. Types of cookies we use:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                            </ul>
                        </div>

                        {/* Children's Privacy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn we have collected information from a child without parental consent, we will delete it promptly.
                            </p>
                        </div>

                        {/* International Users */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Users</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you are accessing our services from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
                            </p>
                        </div>

                        {/* Changes to Policy */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 rounded-xl p-6 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Email:</strong> privacy@drgeorge.com</p>
                                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                                <p><strong>Address:</strong> 123 Health Street, Medical Center, CA 90210</p>
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="border-t-2 border-gray-200 pt-8">
                            <p className="text-gray-600 leading-relaxed">
                                By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
