import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { HadeethListItem, Hadeeth } from '../services/types';
import { HadithCard } from '../components/HadithCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HadithListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HadithList'>;
type HadithListScreenRouteProp = RouteProp<RootStackParamList, 'HadithList'>;

export const HadithListScreen = () => {
    const navigation = useNavigation<HadithListScreenNavigationProp>();
    const route = useRoute<HadithListScreenRouteProp>();
    const { currentLanguage } = useLanguage();
    const { theme } = useTheme();
    const [hadiths, setHadiths] = useState<HadeethListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    const PER_PAGE = 20;
    const isDark = theme === 'dark';

    useEffect(() => {
        loadHadiths();
        loadFavorites();
    }, [currentLanguage, page]);

    const getCacheKey = () => `hadithList_${route.params.categoryId}_${currentLanguage}_${page}`;

    const loadHadiths = async () => {
        if (!hasMore) return;

        try {
            // Try to load from cache first
            const cacheKey = getCacheKey();
            const cachedData = await AsyncStorage.getItem(cacheKey);
            
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                if (page === 1) {
                    setHadiths(parsedData);
                } else {
                    setHadiths(prev => [...prev, ...parsedData]);
                }
                setLoading(false);
                return;
            }

            const response = await ApiService.getHadeethsList({
                language: currentLanguage,
                category_id: route.params.categoryId,
                page,
                per_page: PER_PAGE,
            });

            const newHadiths = response.data.data;

            if (page === 1) {
                setHadiths(newHadiths);
            } else {
                setHadiths(prev => [...prev, ...newHadiths]);
            }

            setHasMore(newHadiths.length === PER_PAGE);

            // Cache the results
            await AsyncStorage.setItem(cacheKey, JSON.stringify(newHadiths));
        } catch (error) {
            console.error('Hadisler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            const favoritesData = favoritesString ? JSON.parse(favoritesString) : [];
            setFavorites(favoritesData.map((fav: Hadeeth) => fav.id));
        } catch (error) {
            console.error('Favoriler yüklenirken hata:', error);
        }
    };

    const handleFavoritePress = async () => {
        await loadFavorites();
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const renderFooter = () => {
        if (!loading || page === 1) return null;

        return (
            <View style={styles.footer}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                        Daha fazla hadis yükleniyor...
                    </Text>
                </View>
            </View>
        );
    };

    // Ekran her odaklandığında favorileri yükle
    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    if (loading && page === 1) {
        return (
            <View style={[styles.container, styles.loading]}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDark ? '#121212' : '#F5F5F5' }
        ]}>
            <FlatList
                data={hadiths}
                renderItem={({ item }) => (
                    <HadithCard
                        hadith={item as unknown as Hadeeth}
                        onPress={() => navigation.navigate('HadithDetail', {
                            hadithId: item.id,
                            title: item.title
                        })}
                        isFavorite={favorites.includes(item.id)}
                        onFavoritePress={handleFavoritePress}
                    />
                )}
                keyExtractor={item => item.id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
    footer: {
        paddingVertical: 20,
        width: '100%',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
});