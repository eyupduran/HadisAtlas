import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Hadeeth } from '../services/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { translations } from '../constants/translations';
import { HadithCard } from '../components';

export const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState<Hadeeth[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { currentLanguage } = useLanguage();
    const isDark = theme === 'dark';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const favoritesString = await AsyncStorage.getItem('favorites');
            if (favoritesString) {
                const favoritesData = JSON.parse(favoritesString);
                // Remove duplicates based on id
                const uniqueFavorites = favoritesData.filter((hadith: Hadeeth, index: number, self: Hadeeth[]) =>
                    index === self.findIndex((h: Hadeeth) => h.id === hadith.id)
                );
                // If we removed any duplicates, update storage
                if (uniqueFavorites.length !== favoritesData.length) {
                    await AsyncStorage.setItem('favorites', JSON.stringify(uniqueFavorites));
                }
                setFavorites(uniqueFavorites);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error('Favoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load favorites when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const handleFavoritePress = async (hadithId: string) => {
        const updatedFavorites = favorites.filter(fav => fav.id !== hadithId);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={[styles.container, styles.empty]}>
                <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {translations.noFavorites[currentLanguage]}
                </Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDark ? '#121212' : '#F5F5F5' }
        ]}>
            <FlatList
                data={favorites}
                renderItem={({ item }) => (
                    <HadithCard
                        hadith={item}
                        onPress={() => navigation.navigate('HadithDetail', {
                            hadithId: item.id,
                            title: item.title
                        })}
                        isFavorite={true}
                        onFavoritePress={() => handleFavoritePress(item.id)}
                    />
                )}
                keyExtractor={item => item.id}
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
    empty: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
});