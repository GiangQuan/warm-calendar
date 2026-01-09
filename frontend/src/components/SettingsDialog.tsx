import { useState } from 'react';
import { Settings, Globe, Moon, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings, Language } from '@/contexts/SettingsContext';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings, t } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t('language')}
            </div>
            <Select
              value={settings.language}
              onValueChange={(value: Language) => updateSettings({ language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">
                  <span className="flex items-center gap-2">
                    🇻🇳 {t('vietnamese')}
                  </span>
                </SelectItem>
                <SelectItem value="en">
                  <span className="flex items-center gap-2">
                    🇺🇸 {t('english')}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <hr className="border-border" />

          {/* Lunar Calendar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="lunar-toggle" className="text-sm font-medium">
                {t('show_lunar')}
              </Label>
            </div>
            <Switch
              id="lunar-toggle"
              checked={settings.showLunar}
              onCheckedChange={(checked) => updateSettings({ showLunar: checked })}
            />
          </div>

          <hr className="border-border" />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="notifications-toggle" className="text-sm font-medium">
                {t('enable_notifications')}
              </Label>
            </div>
            <Switch
              id="notifications-toggle"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
