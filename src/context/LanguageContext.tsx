import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../services/types';
import { SupportedLanguages } from '../constants/translations';

interface LanguageContextType {
    currentLanguage: SupportedLanguages;
    languages: Language[];
    setLanguage: (code: SupportedLanguages) => Promise<void>;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@language_preference';

const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'tr', native: 'Türkçe' },
    { code: 'en', native: 'English' },
    { code: 'ar', native: 'العربية' }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguages>('tr');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialLanguage();
    }, []);

    const loadInitialLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguages;
            if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
                setCurrentLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Dil yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setLanguage = async (code: SupportedLanguages) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
            setCurrentLanguage(code);
        } catch (error) {
            console.error('Dil kaydedilirken hata:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            languages: SUPPORTED_LANGUAGES,
            setLanguage,
            isLoading
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};