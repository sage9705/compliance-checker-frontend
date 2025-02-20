import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { formatFileSize } from '@/lib/fileSize';
import { cn } from '@/lib/utils';


type ComplianceStatus = 'Compliant' | 'Non-compliant' | 'Partially compliant';

interface ComplianceData {
    status: ComplianceStatus;
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
    const normalizeStatus = (status: string): ComplianceStatus => {
        const normalizedStatus = status.trim().toLowerCase();

        if (normalizedStatus.includes('non-compliant')) {
            return 'Non-compliant';
        } else if (normalizedStatus.includes('partially')) {
            return 'Partially compliant';
        } else if (normalizedStatus.includes('compliant')) {
            return 'Compliant';
        }

        return 'Non-compliant';
    };

    const getStatusIcon = (status: ComplianceStatus) => {
        switch (status) {
            case 'Compliant':
                return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
            case 'Partially compliant':
                return <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
            case 'Non-compliant':
                return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />;
        }
    };

    const getStatusColor = (status: ComplianceStatus) => {
        switch (status) {
            case 'Compliant':
                return 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20';
            case 'Partially compliant':
                return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20';
            case 'Non-compliant':
                return 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20';
        }
    };

    const getStatusTextColor = (status: ComplianceStatus) => {
        switch (status) {
            case 'Compliant':
                return 'text-green-700 dark:text-green-400';
            case 'Partially compliant':
                return 'text-yellow-700 dark:text-yellow-400';
            case 'Non-compliant':
                return 'text-red-700 dark:text-red-400';
        }
    };


    const normalizedStatus = normalizeStatus(result.compliance_data.status);

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

                    <div className={cn(
                        "rounded-lg border p-4 mb-4",
                        getStatusColor(normalizedStatus)
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(normalizedStatus)}
                            <span className={cn(
                                "font-medium",
                                getStatusTextColor(normalizedStatus)
                            )}>
                                {normalizedStatus}
                            </span>
                        </div>
                        <p className={cn(
                            "text-sm",
                            getStatusTextColor(normalizedStatus)
                        )}>
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