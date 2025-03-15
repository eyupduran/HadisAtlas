import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SupportedLanguages } from '../constants/translations';

const LanguageSelectScreen = () => {
    const { languages, currentLanguage, setLanguage } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getLanguageIcon = (code: SupportedLanguages) => {
        switch (code) {
            case 'tr':
                return 'flag';
            case 'en':
                return 'earth';
            case 'ar':
                return 'sprout';
            default:
                return 'translate';
        }
    };

    const handleLanguageSelect = (code: string) => {
        if (code === 'tr' || code === 'en' || code === 'ar') {
            setLanguage(code);
        }
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
        ]}>
            <FlatList
                data={languages}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.languageItem,
                            { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' },
                            currentLanguage === item.code && styles.selectedLanguage
                        ]}
                        onPress={() => handleLanguageSelect(item.code)}
                    >
                        <View style={styles.languageContent}>
                            <Icon
                                name={getLanguageIcon(item.code as SupportedLanguages)}
                                size={24}
                                color={currentLanguage === item.code ? '#2196F3' : (isDark ? '#FFFFFF' : '#000000')}
                            />
                            <Text style={[
                                styles.languageText,
                                { color: isDark ? '#FFFFFF' : '#000000' },
                                currentLanguage === item.code && styles.selectedLanguageText
                            ]}>
                                {item.native}
                            </Text>
                            {currentLanguage === item.code && (
                                <Icon
                                    name="check-circle"
                                    size={24}
                                    color="#2196F3"
                                    style={styles.checkIcon}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.code}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    languageItem: {
        padding: 16,
        borderRadius: 12,
    },
    languageContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedLanguage: {
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    languageText: {
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
    },
    selectedLanguageText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    checkIcon: {
        marginLeft: 8,
    },
    separator: {
        height: 12,
    },
});

export default LanguageSelectScreen;