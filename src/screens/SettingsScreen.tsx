import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../constants/translations';

type SettingsScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Settings'>,
    NativeStackNavigationProp<RootStackParamList>
>;

const SettingsScreen = () => {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const { theme, setTheme } = useTheme();
    const { currentLanguage } = useLanguage();
    const { settings, updateSettings, isUpdating } = useSettings();
    const isDark = theme === 'dark';

    const [localFontSize, setLocalFontSize] = useState(settings.fontSize);
    const [localArabicFontSize, setLocalArabicFontSize] = useState(settings.arabicFontSize);

    useEffect(() => {
        setLocalFontSize(settings.fontSize);
        setLocalArabicFontSize(settings.arabicFontSize);
    }, [settings.fontSize, settings.arabicFontSize]);

    const [debouncedUpdate] = useState(() => {
        let timeoutId: NodeJS.Timeout;
        return (updateFn: () => void) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                updateFn();
            }, 800); // 800ms'ye çıkardım, daha az güncelleme için
        };
    });

    const handleFontSizeChange = useCallback((value: number) => {
        const roundedValue = Math.round(value); // Değeri yuvarla
        setLocalFontSize(roundedValue);
        debouncedUpdate(() => {
            if (!isUpdating) {
                updateSettings({ fontSize: roundedValue });
            }
        });
    }, [isUpdating]);

    const handleArabicFontSizeChange = useCallback((value: number) => {
        const roundedValue = Math.round(value); // Değeri yuvarla
        setLocalArabicFontSize(roundedValue);
        debouncedUpdate(() => {
            if (!isUpdating) {
                updateSettings({ arabicFontSize: roundedValue });
            }
        });
    }, [isUpdating]);

    return (
        <ScrollView 
            style={[
                styles.container,
                { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
            ]}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Tema Seçimi */}
            <View style={[
                styles.section,
                { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }
            ]}>
                <Text style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
                    {translations.theme[currentLanguage]}
                </Text>
                <View style={styles.themeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.themeOption,
                            theme === 'light' && styles.selectedTheme,
                            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                        ]}
                        onPress={() => setTheme('light')}
                    >
                        <Icon name="white-balance-sunny" size={24} color={theme === 'light' ? '#2196F3' : (isDark ? '#FFFFFF' : '#000000')} />
                        <Text style={[
                            styles.themeText,
                            { color: theme === 'light' ? '#2196F3' : (isDark ? '#FFFFFF' : '#000000') }
                        ]}>
                            {translations.lightMode[currentLanguage]}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.themeOption,
                            theme === 'dark' && styles.selectedTheme,
                            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                        ]}
                        onPress={() => setTheme('dark')}
                    >
                        <Icon name="moon-waning-crescent" size={24} color={theme === 'dark' ? '#2196F3' : (isDark ? '#FFFFFF' : '#000000')} />
                        <Text style={[
                            styles.themeText,
                            { color: theme === 'dark' ? '#2196F3' : (isDark ? '#FFFFFF' : '#000000') }
                        ]}>
                            {translations.darkMode[currentLanguage]}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dil Seçimi */}
            <TouchableOpacity
                style={[
                    styles.section,
                    { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }
                ]}
                onPress={() => navigation.navigate('LanguageSelect')}
            >
                <Text style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
                    {translations.languageSelection[currentLanguage]}
                </Text>
                <View style={styles.languageInfo}>
                    <Text style={[
                        styles.languageText,
                        { color: isDark ? '#FFFFFF' : '#000000' }
                    ]}>
                        {translations.currentLanguage[currentLanguage]}: {translations.languageNames[currentLanguage]}
                    </Text>
                    <Icon name="chevron-right" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </View>
            </TouchableOpacity>

            {/* Yazı Boyutları */}
            <View style={[
                styles.section,
                { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }
            ]}>
                <Text style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
                    {translations.fontSize[currentLanguage]}
                </Text>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        {localFontSize}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={12}
                        maximumValue={24}
                        step={1}
                        value={localFontSize}
                        onValueChange={handleFontSizeChange}
                        minimumTrackTintColor="#2196F3"
                        maximumTrackTintColor={isDark ? '#666666' : '#CCCCCC'}
                        thumbTintColor="#2196F3"
                        tapToSeek={true} // Tap to seek özelliğini ekledim
                    />
                </View>
                <View style={styles.sampleTextContainer}>
                    <Text style={[
                        styles.sampleText,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: localFontSize
                        }
                    ]}>
                        {translations.sampleText[currentLanguage]}
                    </Text>
                </View>

                <Text style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFFFFF' : '#000000', marginTop: 16 }
                ]}>
                    {translations.arabicFontSize[currentLanguage]}
                </Text>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        {localArabicFontSize}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={16}
                        maximumValue={32}
                        step={1}
                        value={localArabicFontSize}
                        onValueChange={handleArabicFontSizeChange}
                        minimumTrackTintColor="#2196F3"
                        maximumTrackTintColor={isDark ? '#666666' : '#CCCCCC'}
                        thumbTintColor="#2196F3"
                        tapToSeek={true} // Tap to seek özelliğini ekledim
                    />
                </View>
                <View style={styles.sampleTextContainer}>
                    <Text style={[
                        styles.sampleText,
                        styles.arabicSampleText,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: localArabicFontSize
                        }
                    ]}>
                        {translations.sampleArabicText[currentLanguage]}
                    </Text>
                </View>
            </View>

            {/* Çevrimdışı Mod */}
            <View style={[
                styles.section,
                { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }
            ]}>
                <View style={styles.settingRow}>
                    <Text style={[
                        styles.settingText,
                        { color: isDark ? '#FFFFFF' : '#000000' }
                    ]}>
                        {translations.offlineMode[currentLanguage]}
                    </Text>
                    <Switch
                        value={settings.offlineMode}
                        onValueChange={(value) => updateSettings({ offlineMode: value })}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={settings.offlineMode ? '#2196F3' : '#f4f3f4'}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 24, // Alt kısımda ekstra padding
    },
    section: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeOption: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    selectedTheme: {
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    themeText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    languageText: {
        fontSize: 16,
    },
    sliderContainer: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        height: 40,
    },
    sliderValue: {
        width: 40,
        textAlign: 'center',
        marginRight: 8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingText: {
        fontSize: 16,
        flex: 1,
    },
    sampleTextContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderRadius: 8,
        alignItems: 'center'
    },
    sampleText: {
        textAlign: 'center',
    },
    arabicSampleText: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
        writingDirection: 'rtl',
    },
});

export default SettingsScreen;