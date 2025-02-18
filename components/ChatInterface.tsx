import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';

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
        <Card className="h-full">
            <CardHeader className="border-b bg-card px-6">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold">Compliance Assistant</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100vh-16rem)]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                                }`}>
                                {message.role === 'user'
                                    ? <User className="h-5 w-5" />
                                    : <Bot className="h-5 w-5" />
                                }
                            </div>
                            <div className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : ''
                                }`}>
                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                <span className="text-xs text-muted-foreground px-4">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-background p-6">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            size="icon"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChatInterface;
