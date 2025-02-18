import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            content: "Hello! I'm your compliance assistant. I can help you understand your compliance results and answer questions about MiFID II regulations. How can I help you today?",
            role: 'assistant',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            content: inputMessage,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // TODO: Replace with actual API call to your backend
            const response = await new Promise(resolve =>
                setTimeout(() => resolve({
                    content: "I'm a placeholder response. In the real implementation, this would be connected to your backend API.",
                    role: 'assistant',
                    timestamp: new Date(),
                }), 1000)
            );

            setMessages(prev => [...prev, response as Message]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                content: 'Sorry, I encountered an error. Please try again.',
                role: 'assistant',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-[#2C2D32] p-4">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">Compliance Assistant</h2>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${message.role === 'user'
                                ? 'bg-blue-600'
                                : 'bg-[#2C2D32]'
                                }`}>
                                {message.role === 'user'
                                    ? <User className="h-4 w-4 text-white" />
                                    : <Bot className="h-4 w-4 text-blue-400" />
                                }
                            </div>
                            <div className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : ''
                                }`}>
                                <div className={`rounded-lg px-4 py-2 text-sm max-w-[100%] ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#2C2D32] text-gray-200'
                                    }`}>
                                    {message.content}
                                </div>
                                <span className="text-xs text-gray-500 px-2">
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C2D32]">
                                <Bot className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-[#2C2D32] px-4 py-2 text-sm text-gray-200">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-[#2C2D32] p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md bg-[#1A1B1E] border border-[#2C2D32] px-4 py-2 text-sm text-white 
                                 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        size="icon"
                        className="bg-[#2C2D32] hover:bg-[#383A3F] text-white"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;