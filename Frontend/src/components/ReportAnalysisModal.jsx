import React, { useState, useEffect } from 'react';
import { FiX, FiDownload, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ReportAnalysisModal = ({ show, report, analysis, loading, onClose }) => {
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!show || !report) return null;

  const handleDownloadSummary = async () => {
    try {
      setIsDownloading(true);
      
      if (downloadFormat === 'pdf') {
        // Create a simple text representation for now
        // In production, use jsPDF for better PDF generation
        const content = generateSummaryText();
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${report.originalFilename}-analysis.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Analysis summary downloaded successfully');
      }
    } catch (error) {
      toast.error('Failed to download summary');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const generateSummaryText = () => {
    const { analysis: data } = analysis || {};
    if (!data) return '';

    let text = `MEDICAL REPORT ANALYSIS SUMMARY\n`;
    text += `================================\n`;
    text += `Report: ${report.originalFilename}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `\n`;

    text += `REPORT SUMMARY\n`;
    text += `--------------\n`;
    text += `${data.summary || 'No summary available'}\n\n`;

    text += `KEY FINDINGS\n`;
    text += `-----------\n`;
    if (data.keyFindings && data.keyFindings.length > 0) {
      data.keyFindings.forEach((finding, i) => {
        text += `${i + 1}. ${finding}\n`;
      });
    } else {
      text += 'No key findings\n';
    }
    text += `\n`;

    text += `ABNORMAL VALUES (⚠️)\n`;
    text += `--------------------\n`;
    if (data.abnormalValues && data.abnormalValues.length > 0) {
      data.abnormalValues.forEach((value, i) => {
        text += `${i + 1}. ${value.name}: ${value.result}\n`;
        text += `   Normal Range: ${value.normal}\n`;
        text += `   Explanation: ${value.explanation}\n\n`;
      });
    } else {
      text += 'No abnormal values detected\n';
    }
    text += `\n`;

    text += `HEALTH SUGGESTIONS\n`;
    text += `------------------\n`;
    if (data.suggestions && data.suggestions.length > 0) {
      data.suggestions.forEach((suggestion, i) => {
        text += `${i + 1}. ${suggestion}\n`;
      });
    } else {
      text += 'No specific suggestions\n';
    }
    text += `\n`;

    text += `WHEN TO CONSULT A DOCTOR\n`;
    text += `------------------------\n`;
    text += `${data.doctorConsultation || 'Always consult your doctor for professional medical advice.'}\n`;

    return text;
  };

  const { analysis: data } = analysis || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 px-6 sm:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                🔬 Medical Report Analysis
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {report.originalFilename}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 sm:p-3 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2"></div>
            </div>
            <p className="text-gray-600 font-medium mt-6 text-lg">Analyzing your medical report...</p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Extracting report text
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }}></span>
                Understanding medical values
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }}></span>
                Generating explanation
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 sm:px-8 py-6 space-y-6">
            {/* Summary Section */}
            <section className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <FiInfo className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Report Summary</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {data.summary || 'No summary available'}
              </p>
            </section>

            {/* Key Findings Section */}
            {data.keyFindings && data.keyFindings.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xl font-bold text-gray-900">Key Findings</h3>
                </div>
                <ul className="space-y-2">
                  {data.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                        ✓
                      </span>
                      <span className="text-gray-700 text-base pt-0.5">{finding}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Abnormal Values Section */}
            {data.abnormalValues && data.abnormalValues.length > 0 && (
              <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">⚠️ Abnormal Values</h3>
                </div>
                <div className="space-y-4">
                  {data.abnormalValues.map((value, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-base">{value.name}</h4>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          {value.result}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Normal Range:</span> {value.normal}
                      </p>
                      <p className="text-gray-700 text-base">{value.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Normal Values Section */}
            {data.normalValues && data.normalValues.length > 0 && (
              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">✅ Normal Values</h3>
                </div>
                <div className="space-y-3">
                  {data.normalValues.map((value, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{value.name}</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {value.result}
                        </span>
                      </div>
                      <p className="text-gray-700 text-base">{value.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Health Concerns Section */}
            {data.healthConcerns && data.healthConcerns.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FiAlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900">Possible Health Concerns</h3>
                </div>
                <ul className="space-y-2">
                  {data.healthConcerns.map((concern, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                        ⚠
                      </span>
                      <span className="text-gray-700 text-base pt-0.5">{concern}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Suggestions Section */}
            {data.suggestions && data.suggestions.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FiCheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Health Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  {data.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                        💡
                      </span>
                      <span className="text-gray-700 text-base pt-0.5">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Doctor Consultation Section */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">👨‍⚕️ When to Consult a Doctor</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {data.doctorConsultation || 'Always consult your doctor for professional medical advice.'}
              </p>
            </section>

            {/* Disclaimer */}
            <div className="bg-blue-50 rounded-xl border border-blue-200/50 p-4 sm:p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>📋 Disclaimer:</strong> This AI-generated analysis is for informational purposes only.
                It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare provider for medical concerns.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200/50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
          <button
            onClick={handleDownloadSummary}
            disabled={loading || isDownloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiDownload className="w-5 h-5" />
            <span>Download Summary</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysisModal;
