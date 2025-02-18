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
            <div className="w-full">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                    ${isDragActive
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-[#2C2D32] hover:border-blue-500/50'}`}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-300">
                        {isDragActive ? 'Drop the files here' : 'Drag & drop audio files here'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        or click to select files (MP3, WAV, M4A)
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                        Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
                    </p>
                </div>

                {fileRejections.length > 0 && (
                    <ErrorBoundary>
                        <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-900">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {fileRejections.map(({ file, errors }: FileRejection) => (
                                    <div key={file.name} className="text-sm">
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