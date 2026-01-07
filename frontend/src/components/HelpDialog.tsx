import { useState } from 'react';
import { Mail, MessageCircle, BookOpen, ArrowLeft, Send, Loader2, CheckCircle } from 'lucide-react';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset form when dialog closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setViewMode('main');
            setSubject('');
            setMessage('');
            setSenderEmail('');
            setIsSuccess(false);
        }
        onOpenChange(newOpen);
    };

    const handleEmailSupport = () => {
        setSenderEmail(user?.email || '');
        setViewMode('email-form');
    };

    const handleBackToMain = () => {
        setViewMode('main');
        setSubject('');
        setMessage('');
        setIsSuccess(false);
    };

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create mailto link with form data
        const mailtoSubject = encodeURIComponent(`[Warm Calendar Support] ${subject}`);
        const mailtoBody = encodeURIComponent(
            `From: ${senderEmail}\n\n${message}\n\n---\nSent from Warm Calendar Help & Support`
        );
        const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Simulate a brief delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Open mail client
        window.location.href = mailtoLink;

        setIsSubmitting(false);
        setIsSuccess(true);
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
                                <div className="text-center space-y-2">
                                    <h3 className="font-semibold text-lg">Email Client Opened!</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Your default email app should now be open with your message. Simply click send to reach us.
                                    </p>
                                </div>
                                <Button onClick={handleBackToMain} variant="outline">
                                    Back to Help
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitEmail} className="flex-1 space-y-4">
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
                                        rows={5}
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
