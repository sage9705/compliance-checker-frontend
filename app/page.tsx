'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ComplianceResult from '@/components/ComplianceResult';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileWithPath } from 'react-dropzone';
import { formatFileSize } from '@/lib/fileSize';
import ChatInterface from '@/components/ChatInterface';


interface ComplianceData {
  status: string;
  explanation: string;
}

interface TranscriptionResult {
  filename: string;
  file_size: number;
  processing_time: number;
  transcription: string;
  compliance_data: ComplianceData;
  timestamp: string;
}

interface ProcessingError {
  fileName: string;
  error: string;
  details?: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [results, setResults] = useState<TranscriptionResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ProcessingError[]>([]);
  const [currentFile, setCurrentFile] = useState<string>("");

  const handleFileSelect = (selectedFiles: FileWithPath[]) => {
    setFiles(selectedFiles);
    setErrors([]);
    setResults([]);
    setProgress(0);
  };

  const handleError = (fileName: string, error: unknown): ProcessingError => {
    if (error instanceof Error) {
      return {
        fileName,
        error: 'Processing failed',
        details: error.message
      };
    }
    if (typeof error === 'string') {
      return {
        fileName,
        error: 'Processing failed',
        details: error
      };
    }
    return {
      fileName,
      error: 'An unknown error occurred',
      details: 'Please try again or contact support if the problem persists'
    };
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);
    setErrors([]);
    const newResults = [];
    const newErrors = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:8000/api/v1/compliance/analyze', {
            method: 'POST',
            body: formData,
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            const responseText = await response.text();
            throw new Error(responseText || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          newResults.push(result);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          newErrors.push(handleError(file.name, error));
        }

        setProgress(((i + 1) / files.length) * 100);
      }
    } finally {
      setResults(newResults);
      setErrors(newErrors);
      setProcessing(false);
      setCurrentFile("");
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

    try {
      const headers = [
        'Filename',
        'Timestamp',
        'File Size (KB)',
        'Processing Time (s)',
        'Transcription',
        'Compliance Status',
        'Compliance Explanation'
      ];

      const rows = results.map(result => ([
        result.filename,
        result.timestamp,
        result.file_size.toString(),
        result.processing_time.toString(),
        result.transcription,
        result.compliance_data.status,
        result.compliance_data.explanation
      ]));

      const csvContent = [
        headers,
        ...rows
      ].map(row =>
        row.map(cell =>
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compliance_results_${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV:', error);
      setErrors(prev => [...prev, handleError('CSV Generation', error)]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#25262B] text-white">
      {/* Top Navigation */}
      <nav className="bg-[#25262B] border-b border-[#2C2D32] px-4 sm:px-6 py-3 flex-none">
        <h1 className="text-xl font-semibold">MiFID II Compliance Checker</h1>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Panel - File Selection */}
        <div className="w-full lg:w-[400px] flex-none border-b lg:border-b-0 lg:border-r border-[#2C2D32] bg-[#25262B]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Configuration</h2>
              <p className="text-sm text-gray-400 mb-4">
                Select audio files for analysis
              </p>

              <ErrorBoundary>
                <FileUpload onFileSelect={handleFileSelect} />
              </ErrorBoundary>
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="bg-[#2C2D32] rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Selected Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-gray-400 ml-2">
                          {formatFileSize(file.size / 1024)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={processFiles}
                  disabled={processing}
                  className="w-full truncate bg-blue-600 hover:bg-blue-700"
                >
                  {processing
                    ? `Processing...`
                    : `Analyze ${files.length} File${files.length !== 1 ? 's' : ''}`}
                </Button>

                {processing && (
                  <div>
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-center text-gray-400">
                      {Math.round(progress)}% Complete
                      {currentFile && (
                        <span className="block text-xs mt-1">
                          Processing: {currentFile}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="flex-1 bg-[#1A1B1E] overflow-y-auto">
          <div className="p-4 sm:p-6">
            {errors.length > 0 && (
              <div className="space-y-2 mb-6">
                {errors.map((error, index) => (
                  <Alert key={index} variant="destructive" className="bg-red-900/20 border-red-900">
                    <AlertDescription>
                      <div className="font-medium">{error.fileName}</div>
                      <div className="text-sm">{error.error}</div>
                      {error.details && (
                        <div className="text-xs mt-1 opacity-80">{error.details}</div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold">
                    Analysis Results ({results.length} of {files.length})
                  </h2>
                  <Button
                    onClick={downloadCSV}
                    disabled={processing}
                    className="w-full sm:w-auto bg-[#2C2D32] hover:bg-[#383A3F] text-gray-300 border-none transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                <div className="space-y-4">
                  {results.map((result, index) => (
                    <ErrorBoundary key={`${result.filename}-${index}`}>
                      <ComplianceResult result={result} darkMode />
                    </ErrorBoundary>
                  ))}
                </div>
              </div>
            )}

            {!results.length && !errors.length && (
              <div className="flex items-center justify-center min-h-[200px] lg:min-h-[400px] text-gray-400">
                <p>Upload and analyze files to see results</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[400px] flex-none border-b lg:border-b-0 lg:border-r border-[#2C2D32] bg-[#25262B]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}