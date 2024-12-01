"use client";

import { whitePaper } from "@/app/api/whitePaper";

/**
 * Renders a white paper page with structured sections.
 * @returns {JSX.Element} The WhitePaperPage component.
 */
export default function WhitePaperPage() {
    /**
     * Renders a section with nested content.
     * @param {string} title - The section title.
     * @param {Object|string} content - The content for the section, supports nested objects.
     */
    const renderSection = (title, content) => (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-600">{title}</h2>
            {typeof content === "string" ? (
                <p className="text-gray-700 leading-relaxed">{content}</p>
            ) : (
                Object.entries(content).map(([key, value]) => (
                    <div key={key} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{key}</h3>
                        {typeof value === "string" ? (
                            <p className="text-gray-600 leading-relaxed">{value}</p>
                        ) : (
                            Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey} className="ml-4">
                                    <h4 className="text-sm font-medium text-gray-700">{subKey}</h4>
                                    <p className="text-gray-600 leading-relaxed">{subValue}</p>
                                </div>
                            ))
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-black p-4 sm:p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-12">
                {/* Title */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
                    {whitePaper.title}
                </h1>
                <hr className="border-gray-300 mb-6" />

                {/* Introduction */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed">{whitePaper.introduction}</p>
                </section>

                {/* Dynamic Sections */}
                {renderSection("Technologies Used", whitePaper.technologies)}
                {renderSection("Core Features", whitePaper.core_features)}
                {renderSection("Application Workflow", whitePaper.application_workflow)}
                {renderSection("Design Principles", whitePaper.design_principles)}

                {/* Conclusion */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Conclusion</h2>
                    <p className="text-gray-700 leading-relaxed">{whitePaper.conclusion}</p>
                </section>
            </div>
        </div>
    );
}