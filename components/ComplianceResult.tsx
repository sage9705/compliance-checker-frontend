import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { formatFileSize } from '@/lib/fileSize';
import { cn } from '@/lib/utils';

interface ComplianceData {
    status: string;
    explanation: string;
}

interface ComplianceResult {
    filename: string;
    file_size: number;
    processing_time: number;
    transcription: string;
    compliance_data: ComplianceData;
    timestamp: string;
}

interface ComplianceResultProps {
    result: ComplianceResult;
}

const ComplianceResult: React.FC<ComplianceResultProps> = ({ result }) => {
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'compliant':
                return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
            case 'partially compliant':
                return <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
            case 'non-compliant':
                return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        const baseColors = {
            compliant: 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20',
            'partially compliant': 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20',
            'non-compliant': 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20',
            default: 'bg-gray-50 border-gray-200 dark:bg-gray-500/10 dark:border-gray-500/20'
        };

        return baseColors[status.toLowerCase() as keyof typeof baseColors] || baseColors.default;
    };

    return (
        <ErrorBoundary>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                            {result.filename}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                            {new Date(result.timestamp).toLocaleString()}
                        </span>
                    </div>

                    <div className={cn("rounded-lg border p-4 mb-4", getStatusColor(result.compliance_data.status))}>
                        <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(result.compliance_data.status)}
                            <span className="font-medium">
                                {result.compliance_data.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {result.compliance_data.explanation}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Transcription
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {result.transcription}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium">File Size:</span>{' '}
                                {formatFileSize(result.file_size)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium">Processing Time:</span>{' '}
                                {result.processing_time.toFixed(2)}s
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default ComplianceResult;