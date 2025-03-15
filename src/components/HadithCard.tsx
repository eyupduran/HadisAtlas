import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { Hadeeth } from '../services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HadithCardProps {
    hadith: Hadeeth;
    onPress: () => void;
    isFavorite?: boolean;
    onFavoritePress?: () => void;
}

export const HadithCard: React.FC<HadithCardProps> = ({ 
    hadith, 
    onPress, 
    isFavorite = false,
    onFavoritePress
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isLocalFavorite, setIsLocalFavorite] = useState(isFavorite);

    useEffect(() => {
        setIsLocalFavorite(isFavorite);
    }, [isFavorite]);

    const toggleFavorite = async () => {
        try {
            const favoritesString = await AsyncStorage.getItem('favorites');
            let favorites = favoritesString ? JSON.parse(favoritesString) : [];
            
            if (isLocalFavorite) {
                favorites = favorites.filter((fav: Hadeeth) => fav.id !== hadith.id);
            } else {
                const existingIndex = favorites.findIndex((fav: Hadeeth) => fav.id === hadith.id);
                if (existingIndex === -1) {
                    favorites.push(hadith);
                }
            }
            
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setIsLocalFavorite(!isLocalFavorite);
            if (onFavoritePress) onFavoritePress();
        } catch (error) {
            console.error('Favori işlemi sırasında hata:', error);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF' }
            ]}
            onPress={onPress}
        >
            <View style={styles.content}>
                <Icon
                    name="format-quote-open"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            { color: isDark ? '#FFFFFF' : '#000000' }
                        ]}
                        numberOfLines={2}
                    >
                        {hadith.title}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                    <Icon
                        name={isLocalFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isLocalFavorite ? "#E91E63" : (isDark ? '#FFFFFF' : '#000000')}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    icon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    favoriteButton: {
        marginLeft: 12,
        padding: 4,
    },
});