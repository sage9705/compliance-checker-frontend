// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
// import ErrorBoundary from './ErrorBoundary';
// import { formatFileSize } from '@/lib/fileSize';


// interface ComplianceData {
//     status: string;
//     explanation: string;
// }

// interface ComplianceResult {
//     filename: string;
//     file_size: number;
//     processing_time: number;
//     transcription: string;
//     compliance_data: ComplianceData;
//     timestamp: string;
// }

// interface ComplianceResultProps {
//     result: ComplianceResult;
// }

// const ComplianceResult: React.FC<ComplianceResultProps> = ({ result }) => {
//     const getStatusIcon = (status: string) => {
//         switch (status.toLowerCase()) {
//             case 'compliant':
//                 return <CheckCircle className="w-6 h-6 text-green-500" />;
//             case 'partially compliant':
//                 return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
//             case 'non-compliant':
//                 return <XCircle className="w-6 h-6 text-red-500" />;
//             default:
//                 return <Clock className="w-6 h-6 text-gray-500" />;
//         }
//     };

//     const getStatusColor = (status: string) => {
//         switch (status.toLowerCase()) {
//             case 'compliant':
//                 return 'bg-green-50 border-green-200';
//             case 'partially compliant':
//                 return 'bg-yellow-50 border-yellow-200';
//             case 'non-compliant':
//                 return 'bg-red-50 border-red-200';
//             default:
//                 return 'bg-gray-50 border-gray-200';
//         }
//     };

//     return (
//         <ErrorBoundary>
//             <Card className="w-full mb-4">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-lg font-medium">
//                         {result.filename}
//                     </CardTitle>
//                     <div className="text-sm text-gray-500">
//                         {new Date(result.timestamp).toLocaleString()}
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <ErrorBoundary>
//                         <div className="grid gap-4">
//                             <div className={`p-4 rounded-lg border ${getStatusColor(result.compliance_data.status)}`}>
//                                 <div className="flex items-center space-x-2 mb-2">
//                                     {getStatusIcon(result.compliance_data.status)}
//                                     <span className="font-semibold">{result.compliance_data.status}</span>
//                                 </div>
//                                 <p className="text-sm text-gray-600">{result.compliance_data.explanation}</p>
//                             </div>

//                             <div className="space-y-2">
//                                 <h4 className="font-medium">Transcription</h4>
//                                 <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.transcription}</p>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
//                                 <div>
//                                     <span className="font-medium">File Size:</span>{' '}
//                                     {formatFileSize(result.file_size)}
//                                 </div>
//                                 <div>
//                                     <span className="font-medium">Processing Time:</span>{' '}
//                                     {result.processing_time.toFixed(2)}s
//                                 </div>
//                             </div>
//                         </div>
//                     </ErrorBoundary>
//                 </CardContent>
//             </Card>
//         </ErrorBoundary>
//     );
// };

// export default ComplianceResult;

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { formatFileSize } from '@/lib/fileSize';


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
    darkMode?: boolean;
}

const ComplianceResult: React.FC<ComplianceResultProps> = ({ result, darkMode = false }) => {
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'compliant':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'partially compliant':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'non-compliant':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'compliant':
                return 'bg-green-500/10 border-green-500/20';
            case 'partially compliant':
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 'non-compliant':
                return 'bg-red-500/10 border-red-500/20';
            default:
                return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <ErrorBoundary>
            <div className={`rounded-lg border ${darkMode ? 'border-[#2C2D32] bg-[#25262B]' : 'border-gray-200 bg-white'} overflow-hidden`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {result.filename}
                        </h3>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(result.timestamp).toLocaleString()}
                        </span>
                    </div>

                    <div className={`rounded-lg border p-4 mb-4 ${getStatusColor(result.compliance_data.status)}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(result.compliance_data.status)}
                            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {result.compliance_data.status}
                            </span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {result.compliance_data.explanation}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Transcription
                            </h4>
                            <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {result.transcription}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span className="font-medium">File Size:</span>{' '}
                                {formatFileSize(result.file_size)}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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