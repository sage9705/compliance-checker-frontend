import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface ChatInterfaceProps {
    regulation: string;
}

const getRegulationName = (value: string): string => {
    const regulationMap: { [key: string]: string } = {
        'mifid2': 'MiFID II',
        'gdpr': 'GDPR',
        'hipaa': 'HIPAA',
        'pci': 'PCI DSS',
    };
    return regulationMap[value] || value.toUpperCase();
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ regulation }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when regulation changes
    useEffect(() => {
        const regulationName = getRegulationName(regulation);
        setMessages([{
            content: `Hello! I'm your compliance assistant specializing in ${regulationName} regulations. How can I help you today?`,
            role: 'assistant',
            timestamp: new Date(),
        }]);
    }, [regulation]);

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
            const response = await fetch('http://localhost:8000/api/v1/compliance/followup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    question: inputMessage,
                    regulation: regulation,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Network response was not ok');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                content: data.answer,
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            const assistantMessage: Message = {
                content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
                role: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-border p-4 bg-card">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">
                        {getRegulationName(regulation)} Assistant
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background">
                <div className="space-y-6 p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-start gap-3",
                                message.role === 'user' && "flex-row-reverse"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                                message.role === 'user'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-primary"
                            )}>
                                {message.role === 'user'
                                    ? <User className="h-4 w-4" />
                                    : <Bot className="h-4 w-4" />
                                }
                            </div>
                            <div className={cn(
                                "flex flex-col gap-1",
                                message.role === 'user' && "items-end"
                            )}>
                                <div className={cn(
                                    "rounded-lg px-4 py-2 text-sm max-w-[100%]",
                                    message.role === 'user'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-foreground"
                                )}>
                                    {message.content}
                                </div>
                                <span className="text-xs text-muted-foreground px-2">
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
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-foreground">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t border-border p-4 bg-card">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        size="icon"
                        variant="secondary"
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