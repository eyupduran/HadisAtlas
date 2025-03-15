import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
    fontSize: number;
    arabicFontSize: number;
    offlineMode: boolean;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
    isUpdating: boolean;
}

const defaultSettings: Settings = {
    fontSize: 16,
    arabicFontSize: 20,
    offlineMode: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = '@settings_preferences';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
            if (savedSettings) {
                setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            }
        } catch (error) {
            console.error('Ayarlar yüklenirken hata:', error);
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            setIsUpdating(true);
            const updatedSettings = { ...settings, ...newSettings };
            await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
            setSettings(updatedSettings);
        } catch (error) {
            console.error('Ayarlar kaydedilirken hata:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            isUpdating
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};