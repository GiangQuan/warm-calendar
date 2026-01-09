import { useState } from 'react';
import { Mail, MessageCircle, BookOpen, ArrowLeft, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';

interface HelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// EmailJS Configuration - Read from environment variables
// Create a .env file in frontend/ with these values from https://emailjs.com
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const SUPPORT_EMAIL = 'gquan97@gmail.com';

const FAQ_ITEMS = [
    {
        question: "How do I create a new event?",
        answer: "Click on any date in the calendar to select it, then click the '+' button or use the 'Add Event' form in the sidebar (desktop) or floating button (mobile). Fill in the event details and click 'Add Event'."
    },
    {
        question: "Can I drag and drop events?",
        answer: "Yes! Simply click and hold on any event, then drag it to a new date or time slot. The event will automatically update to the new position."
    },
    {
        question: "How do I switch between month and week view?",
        answer: "Use the view toggle buttons in the calendar header. Click 'Month' for a monthly overview or 'Week' for a detailed weekly view with hourly time slots."
    },
    {
        question: "How do I edit or delete an event?",
        answer: "Click on any event to open the edit dialog. From there, you can modify the event details or click the delete button to remove it permanently."
    },
    {
        question: "How do I update my profile?",
        answer: "Click on your profile picture in the top-right corner, then select 'Account' from the dropdown menu. You can change your display name and avatar URL from there."
    },
    {
        question: "Is my data saved automatically?",
        answer: "Yes, all your events and profile changes are saved automatically. Your data persists across sessions and page refreshes."
    },
];

type ViewMode = 'main' | 'email-form';

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('main');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [senderName, setSenderName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [usedMailto, setUsedMailto] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when dialog closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setViewMode('main');
            setSubject('');
            setMessage('');
            setSenderEmail('');
            setSenderName('');
            setIsSuccess(false);
            setUsedMailto(false);
            setError(null);
        }
        onOpenChange(newOpen);
    };

    const handleEmailSupport = () => {
        setSenderEmail(user?.email || '');
        setSenderName(user?.displayName || '');
        setViewMode('email-form');
    };

    const handleBackToMain = () => {
        setViewMode('main');
        setSubject('');
        setMessage('');
        setIsSuccess(false);
        setUsedMailto(false);
        setError(null);
    };

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Check if EmailJS is configured correctly
        const isConfigured = EMAILJS_SERVICE_ID && 
                           EMAILJS_TEMPLATE_ID && 
                           EMAILJS_PUBLIC_KEY && 
                           !EMAILJS_SERVICE_ID.includes('xxxxxxx');

        if (!isConfigured) {
            // Fallback to mailto if EmailJS not configured
            const mailtoSubject = encodeURIComponent(`[Warm Calendar Support] ${subject}`);
            const mailtoBody = encodeURIComponent(
                `From: ${senderName} <${senderEmail}>\n\n${message}\n\n---\nSent from Warm Calendar Help & Support`
            );
            window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
            setIsSubmitting(false);
            setUsedMailto(true);
            setIsSuccess(true);
            return;
        }

        try {
            // Send email using EmailJS
            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: senderName,
                    from_email: senderEmail,
                    subject: subject,
                    message: message,
                    to_email: SUPPORT_EMAIL,
                },
                EMAILJS_PUBLIC_KEY
            );
            
            if (result.status === 200) {
                setUsedMailto(false);
                setIsSuccess(true);
            } else {
                throw new Error(`EmailJS returned status ${result.status}`);
            }
        } catch (err: any) {
            console.error('EmailJS error:', err);
            const errorMsg = err?.text || err?.message || 'Unknown error';
            setError(`Failed to send email: ${errorMsg}. Please check your .env keys and restart.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col">
                {viewMode === 'main' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <span>Help & Support</span>
                            </DialogTitle>
                            <DialogDescription>
                                Find answers to common questions or reach out to our support team.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
                            {/* FAQ Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Frequently Asked Questions
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {FAQ_ITEMS.map((item, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left text-sm hover:no-underline hover:text-primary">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            {/* Contact Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Contact Us
                                </h3>
                                <div className="grid gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start h-auto py-3 px-4"
                                        onClick={handleEmailSupport}
                                    >
                                        <Mail className="h-5 w-5 mr-3 text-primary" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">Email Support</span>
                                            <span className="text-xs text-muted-foreground">
                                                Send us a message
                                            </span>
                                        </div>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start h-auto py-3 px-4 opacity-60 cursor-not-allowed"
                                        disabled
                                    >
                                        <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium flex items-center gap-2">
                                                Live Chat
                                                <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                    Coming Soon
                                                </span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Chat with our team
                                            </span>
                                        </div>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start h-auto py-3 px-4 opacity-60 cursor-not-allowed"
                                        disabled
                                    >
                                        <BookOpen className="h-5 w-5 mr-3 text-primary" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium flex items-center gap-2">
                                                Documentation
                                                <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                    Coming Soon
                                                </span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Read our guides
                                            </span>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            {/* Version Info */}
                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground text-center">
                                    Warm Calendar v1.0.0 • Made with ❤️
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleBackToMain}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Email Support
                                    </DialogTitle>
                                    <DialogDescription>
                                        Send a message to our support team
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {isSuccess ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-center space-y-2 px-4">
                                    <h3 className="font-semibold text-lg">
                                        {usedMailto ? 'Email Client Opened!' : 'Message Sent!'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        {usedMailto 
                                            ? 'Your default email app should now be open with your message. Simply click send to reach us.'
                                            : 'Thank you for reaching out! Our support team has received your message and will get back to you soon.'}
                                    </p>
                                </div>
                                <Button onClick={handleBackToMain} variant="outline" className="mt-4">
                                    Back to Help
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitEmail} className="flex-1 space-y-4">
                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="senderName">Your Name</Label>
                                    <Input
                                        id="senderName"
                                        placeholder="John Doe"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        required
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="senderEmail">Your Email</Label>
                                    <Input
                                        id="senderEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={senderEmail}
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                        required
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What do you need help with?"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        placeholder="Describe your issue or question in detail..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBackToMain}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Opening...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Email
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    This will open your default email app with the message pre-filled.
                                </p>
                            </form>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
