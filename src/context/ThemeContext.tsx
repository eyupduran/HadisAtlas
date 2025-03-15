import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => Promise<void>;
    isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemePreference] = useState<ThemeType>(systemColorScheme || 'light');
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    useEffect(() => {
        loadInitialTheme();
    }, []);

    useEffect(() => {
        // Tema değiştiğinde StatusBar'ı güncelle
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content', true);
        if (theme === 'dark') {
            StatusBar.setBackgroundColor('#121212');
        } else {
            StatusBar.setBackgroundColor('#FFFFFF');
        }
    }, [theme]);

    const loadInitialTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
            if (savedTheme) {
                setThemePreference(savedTheme);
            } else {
                // Eğer kayıtlı tema yoksa sistem temasını kullan
                setThemePreference(systemColorScheme || 'light');
            }
        } catch (error) {
            console.error('Tema yüklenirken hata:', error);
            // Hata durumunda sistem temasını kullan
            setThemePreference(systemColorScheme || 'light');
        } finally {
            setIsThemeLoaded(true);
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setThemePreference(newTheme);
        } catch (error) {
            console.error('Tema kaydedilirken hata:', error);
        }
    };

    if (!isThemeLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            isThemeLoaded
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};