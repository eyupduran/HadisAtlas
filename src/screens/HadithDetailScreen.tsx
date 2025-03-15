import React, { useEffect, useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator,
    TouchableOpacity,
    Share,
    Image,
    Dimensions,
    Platform,
    Alert,
    Modal
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Hadeeth } from '../services/types';
import { SupportedLanguages, translations } from '../constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView as HScrollView } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const MAX_TITLE_LENGTH = 100; // Maksimum title uzunluğu
const SCREEN_WIDTH = Dimensions.get('window').width;

type HadithDetailScreenRouteProp = RouteProp<RootStackParamList, 'HadithDetail'>;

export const HadithDetailScreen = () => {
    const route = useRoute<HadithDetailScreenRouteProp>();
    const { currentLanguage } = useLanguage();
    const { theme } = useTheme();
    const { settings } = useSettings();
    const [hadith, setHadith] = useState<Hadeeth | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const viewShotRef = useRef<ViewShot | null>(null);
    const [showShareOptions, setShowShareOptions] = useState(false);

    const isDark = theme === 'dark';

    useEffect(() => {
        loadHadith();
        checkFavoriteStatus();
    }, [currentLanguage]);

    const checkFavoriteStatus = async () => {
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            const favorites = favoritesString ? JSON.parse(favoritesString) : [];
            setIsFavorite(favorites.some((fav: Hadeeth) => fav.id === route.params.hadithId));
        } catch (error) {
            console.error('Favori durumu kontrol edilirken hata:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!hadith) return;

        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            let favorites = favoritesString ? JSON.parse(favoritesString) : [];
            
            if (isFavorite) {
                favorites = favorites.filter((fav: Hadeeth) => fav.id !== hadith.id);
            } else {
                favorites.push(hadith);
            }
            
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);

            // Cache the hadith for offline use
            const cachedHadiths = await AsyncStorage.getItem('cachedHadiths') || '{}';
            const cached = JSON.parse(cachedHadiths);
            cached[hadith.id] = hadith;
            await AsyncStorage.setItem('cachedHadiths', JSON.stringify(cached));
        } catch (error) {
            console.error('Favori işlemi sırasında hata:', error);
        }
    };

    const loadHadith = async () => {
        try {
            // First try to load from cache
            const cachedHadiths = await AsyncStorage.getItem('cachedHadiths');
            const cached = cachedHadiths ? JSON.parse(cachedHadiths) : {};
            
            if (cached[route.params.hadithId]) {
                setHadith(cached[route.params.hadithId]);
                setLoading(false);
                return;
            }

            // If not in cache, fetch from API
            const response = await ApiService.getHadeethById({
                language: currentLanguage,
                id: route.params.hadithId
            });
            setHadith(response.data);

            // Cache the result
            cached[route.params.hadithId] = response.data;
            await AsyncStorage.setItem('cachedHadiths', JSON.stringify(cached));
        } catch (error) {
            console.error('Hadis detayı yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const shareHadith = async () => {
        if (!hadith) return;
        setShowShareOptions(true);
    };

    const shareHadithAsText = async () => {
        if (!hadith) return;
        
        try {
            // Share as plain text
            const shareText = `${hadith.hadeeth}\n\n${hadith.attribution}\n${hadith.grade}`;
            await Share.share({
                message: shareText,
            });
        } catch (error) {
            console.error('Paylaşım sırasında hata:', error);
        }
    };

    const shareHadithAsImage = async () => {
        if (!hadith || !viewShotRef.current) return;
        
        try {
            // Capture the ViewShot component as an image
            const uri = await captureRef(viewShotRef);
            
            // Get the directory and file name
            const dirName = uri.substring(0, uri.lastIndexOf('/'));
            const fileName = 'hadisatlas_share_' + new Date().getTime() + '.jpg';
            const newUri = dirName + '/' + fileName;
            
            // On Android, we can rename the file
            if (Platform.OS === 'android') {
                try {
                    await FileSystem.moveAsync({
                        from: uri,
                        to: newUri
                    });
                } catch (fileError) {
                    console.error('File rename error:', fileError);
                    // Continue with original URI if rename fails
                }
            }
            
            // Check if sharing is available
            const isAvailable = await Sharing.isAvailableAsync();
            
            if (isAvailable) {
                // Share the image
                await Sharing.shareAsync(Platform.OS === 'android' ? newUri : uri);
            } else {
                // Fallback to standard Share API with text
                await shareHadithAsText();
            }
        } catch (error) {
            console.error('Paylaşım sırasında hata:', error);
            // Fallback to text sharing if image sharing fails
            await shareHadithAsText();
        }
    };

    const translate = (key: keyof typeof translations) => {
        return translations[key][currentLanguage as SupportedLanguages];
    };

    const truncateTitle = (title: string) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };

    // Calculate optimal text size for share image based on text length
    const getOptimalFontSize = (text: string) => {
        if (!text) return 40;
        
        const length = text.length;
        if (length > 1500) return 22;     // Çok uzun metinler için daha büyük boyut
        if (length > 1200) return 24;
        if (length > 1000) return 26;
        if (length > 800) return 28;
        if (length > 600) return 30;
        if (length > 400) return 32;
        if (length > 200) return 36;
        return 40;                        // Kısa metinler için daha da büyük font
    };

    // Truncate hadith text if it's too long for sharing
    const formatHadithForSharing = (text: string) => {
        if (!text) return "";
        
        // Çok çok uzun metinleri kısalt (uzunluğu 2000 karakterden fazlaysa)
        if (text.length > 2000) {
            return text.substring(0, 1950) + "...";
        }
        
        return text;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (!hadith) {
        return (
            <View style={[styles.container, styles.loading]}>
                <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
                    {translate('hadithNotFound')}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}
            contentContainerStyle={styles.content}
        >
            {/* Share Options Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showShareOptions}
                onRequestClose={() => setShowShareOptions(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                            {translate('shareOptions')}
                        </Text>
                        
                        <View style={styles.shareOptionButtons}>
                            <TouchableOpacity 
                                style={[styles.shareOptionButton, { backgroundColor: isDark ? '#3C3C3C' : '#F0F0F0' }]}
                                onPress={() => {
                                    setShowShareOptions(false);
                                    shareHadithAsText();
                                }}
                            >
                                <Icon name="text-box-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                                <Text style={[styles.shareOptionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                                    {translate('shareAsText')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.shareOptionButton, { backgroundColor: isDark ? '#3C3C3C' : '#F0F0F0' }]}
                                onPress={() => {
                                    setShowShareOptions(false);
                                    shareHadithAsImage();
                                }}
                            >
                                <Icon name="image-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                                <Text style={[styles.shareOptionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                                    {translate('shareAsImage')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cancelButtonContainer}>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setShowShareOptions(false)}
                            >
                                <Text style={styles.cancelButtonText}>
                                    {translate('cancel')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Hidden ViewShot component for capturing share image */}
            <ViewShot
                ref={viewShotRef}
                options={{ quality: 1, format: 'jpg' }}
                style={{ position: 'absolute', top: -9999, width: 720, height: 1280 }}
            >
                <View style={styles.shareContainer}>
                    <Image 
                        source={require('../../assets/share-template.png')} 
                        style={styles.shareBackground} 
                        resizeMode="cover"
                    />
                    <View style={styles.shareTextContainer}>
                        <Text 
                            style={[
                                styles.shareText, 
                                { 
                                    fontSize: getOptimalFontSize(hadith.hadeeth),
                                    lineHeight: getOptimalFontSize(hadith.hadeeth) * 1.3,
                                }
                            ]}
                            numberOfLines={0}
                        >
                            {formatHadithForSharing(hadith.hadeeth)}
                        </Text>
                        <Text style={styles.shareAttribution}>
                            {hadith.attribution}
                        </Text>
                    </View>
                </View>
            </ViewShot>
            
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[
                        styles.title,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: settings.fontSize + 4 // title biraz daha büyük olsun
                        }
                    ]}>
                        {truncateTitle(hadith.title)}
                    </Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={shareHadith} style={styles.actionButton}>
                            <Icon 
                                name="share-variant"
                                size={24}
                                color={isDark ? '#FFFFFF' : '#000000'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
                            <Icon 
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? "#E91E63" : (isDark ? '#FFFFFF' : '#000000')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
                {hadith.hadeeth_ar && (
                    <Text style={[
                        styles.arabicText,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: settings.arabicFontSize 
                        }
                    ]}>
                        {hadith.hadeeth_ar}
                    </Text>
                )}
                <Text style={[
                    styles.text,
                    { 
                        color: isDark ? '#FFFFFF' : '#000000',
                        fontSize: settings.fontSize
                    }
                ]}>
                    {currentLanguage === 'ar' ? hadith.hadeeth_ar || hadith.hadeeth : hadith.hadeeth}
                </Text>
            </View>

            <HScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={true}
                style={styles.metaInfoContainer}
            >
                <View style={styles.metaInfo}>
                    <View style={[styles.metaItem, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
                        <Icon name="book-account" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                        <Text style={[styles.metaText, { color: isDark ? '#FFFFFF' : '#000000' }]}> 
                            {currentLanguage === 'ar' ? (hadith.attribution_ar || hadith.attribution) : hadith.attribution}
                        </Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={[styles.metaItem, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
                        <Icon name="certificate" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                        <Text style={[styles.metaText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                            {currentLanguage === 'ar' ? (hadith.grade_ar || hadith.grade) : hadith.grade}
                        </Text>
                    </View>
                </View>
            </HScrollView>

            {hadith.explanation && (
                <View style={[styles.section, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
                    <Text style={[
                        styles.sectionTitle,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: settings.fontSize + 2
                        }
                    ]}>
                        {translate('explanation')}
                    </Text>
                    <Text style={[
                        styles.text,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: settings.fontSize
                        }
                    ]}>
                        {currentLanguage === 'ar' ? (hadith.explanation_ar || hadith.explanation) : hadith.explanation}
                    </Text>
                </View>
            )}

            {hadith.hints && hadith.hints.length > 0 && (
                <View style={[styles.section, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
                    <Text style={[
                        styles.sectionTitle,
                        { 
                            color: isDark ? '#FFFFFF' : '#000000',
                            fontSize: settings.fontSize + 2
                        }
                    ]}>
                        {translate('hints')}
                    </Text>
                    {(currentLanguage === 'ar' ? (hadith.hints_ar || []) : hadith.hints).map((hint, index) => (
                        <View key={index} style={styles.hintItem}>
                            <Icon name="lightbulb-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                            <Text style={[
                                styles.text,
                                styles.hintText,
                                { 
                                    color: isDark ? '#FFFFFF' : '#000000',
                                    fontSize: settings.fontSize
                                }
                            ]}>
                                {hint}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 16,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    section: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    arabicText: {
        textAlign: 'right',
        marginBottom: 16,
        lineHeight: 32,
        fontFamily: 'System',
    },
    text: {
        lineHeight: 24,
    },
    metaInfoContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    metaDivider: {
        width: 12,
    },
    metaText: {
        marginLeft: 8,
        fontSize: 14,
    },
    hintItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    hintText: {
        flex: 1,
        marginLeft: 12,
    },
    // New styles for share image
    shareContainer: {
        width: 720,
        height: 1280,
        position: 'relative',
    },
    shareBackground: {
        width: 720,
        height: 1280,
        position: 'absolute',
    },
    shareTextContainer: {
        position: 'absolute',
        top: 150,
        bottom: 150,  // Alt boşluk olarak 150px
        left: 100,
        right: 100,   // Sağ boşluk olarak 100px
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // Sabit height değerini kaldırdık
        // width değerini kaldırdık
    },
    shareText: {
        color: '#2C3E50', // Daha koyu bir renk
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 36,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    shareAttribution: {
        color: '#34495E',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '500',
        marginTop: 8,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    shareOptionButtons: {
        alignItems: 'center',
        marginBottom: 20,
    },
    shareOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        width: '100%',
    },
    shareOptionText: {
        fontSize: 16,
        marginLeft: 12,
    },
    cancelButtonContainer: {
        alignItems: 'flex-end',
    },
    cancelButton: {
        padding: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#2196F3',
    },
});