'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ComplianceResult from '@/components/ComplianceResult';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileWithPath } from 'react-dropzone';

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

        // Log the request details for debugging
        console.log('Sending request for file:', file.name);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        try {
          // Direct request to backend without proxy
          const response = await fetch('http://localhost:8000/api/v1/compliance/analyze', {
            method: 'POST',
            body: formData,
            // Add CORS headers
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            },
          });

          // Log the response for debugging
          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          if (!response.ok) {
            const responseText = await response.text();
            console.error('Error response body:', responseText);
            throw new Error(responseText || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          newResults.push(result);
        } catch (error) {
          console.error(`Detailed error for ${file.name}:`, error);
          newErrors.push({
            fileName: file.name,
            error: error instanceof Error ? error.message : 'Failed to process file',
            details: error instanceof Error ? error.stack : undefined
          });
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
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          MiFID II Compliance Checker
        </h1>

        <ErrorBoundary>
          <FileUpload onFileSelect={handleFileSelect} />
        </ErrorBoundary>

        {files.length > 0 && (
          <div className="mt-6">
            <Button
              onClick={processFiles}
              disabled={processing}
              className="w-full max-w-xs mx-auto block"
            >
              {processing
                ? `Processing ${currentFile || '...'}`
                : `Analyze ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        )}

        {processing && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center mt-2 text-gray-500">
              {Math.round(progress)}% Complete
              {currentFile && <span className="block text-xs">Processing: {currentFile}</span>}
            </p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4 space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>
                  <div className="font-medium">{error.fileName}</div>
                  <div className="text-sm">{error.error}</div>
                  {error.details && (
                    <div className="text-xs mt-1 text-gray-200">{error.details}</div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Results ({results.length} of {files.length} files processed)
              </h2>
              <Button
                variant="outline"
                onClick={downloadCSV}
                disabled={processing}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
            {results.map((result, index) => (
              <ErrorBoundary key={`${result.filename}-${index}`}>
                <ComplianceResult result={result} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}