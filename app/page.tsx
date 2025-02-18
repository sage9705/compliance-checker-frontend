'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ComplianceResult from '@/components/ComplianceResult';
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
}

export default function Home() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [results, setResults] = useState<TranscriptionResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ProcessingError[]>([]);

  const handleFileSelect = (selectedFiles: FileWithPath[]) => {
    setFiles(selectedFiles);
    setErrors([]);
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);
    setErrors([]);
    const newResults: TranscriptionResult[] = [];
    const newErrors: ProcessingError[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        try {
          const response = await fetch('/api/v1/compliance/analyze', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json()
              .catch(() => ({ detail: 'Server returned an error' }));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
          }

          const result: TranscriptionResult = await response.json();
          newResults.push(result);
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to process file';

          newErrors.push({
            fileName: files[i].name,
            error: errorMessage
          });

          console.error(`Error processing ${files[i].name}:`, error);
        }

        setProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Fatal error during processing:', error);
      newErrors.push({
        fileName: 'System Error',
        error: 'A system error occurred while processing files'
      });
    } finally {
      setResults(newResults);
      setErrors(newErrors);
      setProcessing(false);
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return;

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
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          MiFID II Compliance Checker
        </h1>

        <FileUpload onFileSelect={handleFileSelect} />

        {files.length > 0 && (
          <div className="mt-6">
            <Button
              onClick={processFiles}
              disabled={processing}
              className="w-full max-w-xs mx-auto block"
            >
              {processing ? 'Processing...' : `Analyze ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        )}

        {processing && (
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center mt-2 text-gray-500">
              Processing {Math.round(progress)}%
            </p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Failed to process {errors.length} file{errors.length !== 1 ? 's' : ''}:</p>
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      <strong>{error.fileName}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Results ({results.length} file{results.length !== 1 ? 's' : ''})
              </h2>
              <Button variant="outline" onClick={downloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
            {results.map((result, index) => (
              <ComplianceResult key={`${result.filename}-${index}`} result={result} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}