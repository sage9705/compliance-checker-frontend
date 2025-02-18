import React, { useCallback } from 'react';
import { useDropzone, FileRejection, FileWithPath } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ErrorBoundary from './ErrorBoundary';

interface FileUploadProps {
    onFileSelect: (files: FileWithPath[]) => void;
    maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    maxSize = 200 * 1024 * 1024
}) => {
    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            onFileSelect(acceptedFiles);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
            'audio/x-m4a': ['.m4a']
        },
        maxSize,
        multiple: true
    });

    return (
        <ErrorBoundary>
            <div className="w-full max-w-3xl mx-auto">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">
                        {isDragActive ? 'Drop the files here' : 'Drag & drop audio files here'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        or click to select files (MP3, WAV, M4A)
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
                    </p>
                </div>

                {fileRejections.length > 0 && (
                    <ErrorBoundary>
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {fileRejections.map(({ file, errors }: FileRejection) => (
                                    <div key={file.name}>
                                        {file.name}: {errors.map(e => e.message).join(', ')}
                                    </div>
                                ))}
                            </AlertDescription>
                        </Alert>
                    </ErrorBoundary>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default FileUpload;