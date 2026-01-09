import { useState } from 'react';
import { User, Settings, LogOut, HelpCircle, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileDialog } from '@/components/ProfileDialog';
import { HelpDialog } from '@/components/HelpDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

interface UserProfileDropdownProps {
    className?: string;
}

export function UserProfileDropdown({ className }: UserProfileDropdownProps) {
    const { user, signOut } = useAuth();
    const { t } = useSettings();
    const [profileOpen, setProfileOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}>
                    <Avatar
                        src={user?.avatarUrl}
                        alt={user?.displayName || user?.email || 'User'}
                        fallback={user?.displayName || user?.email}
                        size="sm"
                    />
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                            {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                            {user?.email}
                        </span>
                    </div>
                    <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('account')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('settings')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setHelpOpen(true)} className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>{t('help')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('sign_out')}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
            <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </>
    );
}

