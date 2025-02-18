import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

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
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'partially compliant':
                return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'non-compliant':
                return <XCircle className="w-6 h-6 text-red-500" />;
            default:
                return <Clock className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'compliant':
                return 'bg-green-50 border-green-200';
            case 'partially compliant':
                return 'bg-yellow-50 border-yellow-200';
            case 'non-compliant':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <ErrorBoundary>
            <Card className="w-full mb-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                        {result.filename}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                    </div>
                </CardHeader>
                <CardContent>
                    <ErrorBoundary>
                        <div className="grid gap-4">
                            <div className={`p-4 rounded-lg border ${getStatusColor(result.compliance_data.status)}`}>
                                <div className="flex items-center space-x-2 mb-2">
                                    {getStatusIcon(result.compliance_data.status)}
                                    <span className="font-semibold">{result.compliance_data.status}</span>
                                </div>
                                <p className="text-sm text-gray-600">{result.compliance_data.explanation}</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Transcription</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.transcription}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                                <div>
                                    <span className="font-medium">File Size:</span> {result.file_size} KB
                                </div>
                                <div>
                                    <span className="font-medium">Processing Time:</span> {result.processing_time}s
                                </div>
                            </div>
                        </div>
                    </ErrorBoundary>
                </CardContent>
            </Card>
        </ErrorBoundary>
    );
};

export default ComplianceResult;