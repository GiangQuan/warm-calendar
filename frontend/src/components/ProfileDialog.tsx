import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const { user, updateProfile } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when dialog opens
    useEffect(() => {
        if (open && user) {
            setDisplayName(user.displayName || '');
            setAvatarUrl(user.avatarUrl || '');
            setError(null);
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await updateProfile({
            displayName: displayName.trim() || undefined,
            avatarUrl: avatarUrl.trim() || undefined,
        });

        setIsLoading(false);

        if (result.error) {
            setError(result.error.message);
        } else {
            onOpenChange(false);
        }
    };

    const handleAvatarPreview = () => {
        // Trigger preview update when URL changes
        // The Avatar component handles broken URLs gracefully
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your display name and profile picture. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Preview Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <Avatar
                                src={avatarUrl || undefined}
                                alt={displayName || user?.email || 'User'}
                                fallback={displayName || user?.displayName || user?.email}
                                size="lg"
                                className="h-24 w-24 text-2xl"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                placeholder="Enter your display name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Input
                                id="avatarUrl"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={avatarUrl}
                                onChange={(e) => {
                                    setAvatarUrl(e.target.value);
                                    handleAvatarPreview();
                                }}
                                className="bg-background"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a URL to an image for your profile picture
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-sm text-destructive text-center">{error}</p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
