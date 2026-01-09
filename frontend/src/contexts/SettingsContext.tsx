import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en';

interface Settings {
  language: Language;
  showLunar: boolean;
  notificationsEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  t: (key: string) => string;
}

const defaultSettings: Settings = {
  language: 'vi',
  showLunar: true,
  notificationsEnabled: true,
};

const translations: Record<Language, Record<string, string>> = {
  vi: {
    settings: 'Cài đặt',
    language: 'Ngôn ngữ',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    show_lunar: 'Hiển thị Âm lịch',
    notifications: 'Thông báo',
    enable_notifications: 'Bật thông báo',
    account: 'Tài khoản',
    help: 'Trợ giúp',
    sign_out: 'Đăng xuất',
    lunar: 'Âm lịch',
  },
  en: {
    settings: 'Settings',
    language: 'Language',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    show_lunar: 'Show Lunar Calendar',
    notifications: 'Notifications',
    enable_notifications: 'Enable notifications',
    account: 'Account',
    help: 'Help',
    sign_out: 'Sign Out',
    lunar: 'Lunar',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('warm-calendar-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('warm-calendar-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const t = (key: string): string => {
    return translations[settings.language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
