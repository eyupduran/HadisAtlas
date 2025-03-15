interface ThemeColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    accent: string;
}

interface ColorScheme {
    light: ThemeColors;
    dark: ThemeColors;
}

export const colors: ColorScheme = {
    light: {
        primary: '#2196F3',
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#000000',
        border: '#E0E0E0',
        accent: '#1976D2',
    },
    dark: {
        primary: '#2196F3',
        background: '#121212',
        card: '#2C2C2C',
        text: '#FFFFFF',
        border: '#404040',
        accent: '#64B5F6',
    }
};

export const lightTheme = {
    primary: '#2196F3',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    error: '#B00020',
    success: '#4CAF50',
    divider: '#E0E0E0',
    ripple: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
    primary: '#90CAF9',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    error: '#CF6679',
    success: '#81C784',
    divider: '#2C2C2C',
    ripple: 'rgba(255, 255, 255, 0.1)',
};

export type Theme = typeof lightTheme;

export const getTheme = (isDark: boolean): Theme => {
    return isDark ? darkTheme : lightTheme;
};