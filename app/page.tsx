'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ComplianceResult from '@/components/ComplianceResult';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileWithPath } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              MiFID II Compliance Checker
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload audio files for MiFID II compliance analysis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - File Processing */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Files
                </CardTitle>
                <CardDescription>
                  Upload your audio files for compliance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <FileUpload onFileSelect={handleFileSelect} />
                </ErrorBoundary>

                {files.length > 0 && (
                  <div className="mt-6">
                    <Button
                      onClick={processFiles}
                      disabled={processing}
                      className="w-full"
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
                      {currentFile && (
                        <span className="block text-xs mt-1">
                          Processing: {currentFile}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {errors.length > 0 && (
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <Alert key={index} variant="destructive">
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl">
                    Analysis Results ({results.length} of {files.length})
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={downloadCSV}
                    disabled={processing}
                    className="ml-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.map((result, index) => (
                    <ErrorBoundary key={`${result.filename}-${index}`}>
                      <ComplianceResult result={result} />
                    </ErrorBoundary>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:h-[calc(100vh-10rem)] sticky top-8">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}