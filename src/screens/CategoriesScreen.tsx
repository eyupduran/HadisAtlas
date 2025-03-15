import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { CategoryCard } from '../components/CategoryCard';
import { Category } from '../services/types';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { translations } from '../constants/translations';

type CategoriesScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Categories'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export const CategoriesScreen = () => {
    const navigation = useNavigation<CategoriesScreenNavigationProp>();
    const { currentLanguage } = useLanguage();
    const { theme } = useTheme();
    const [rootCategories, setRootCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';

    useEffect(() => {
        loadRootCategories();
    }, [currentLanguage]);

    const loadRootCategories = async () => {
        try {
            const response = await ApiService.getRootCategories(currentLanguage);
            setRootCategories(response.data);
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[
                styles.container,
                styles.loading,
                { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
            ]}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={[
                    styles.loadingText,
                    { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
                    {translations.loading[currentLanguage]}
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
                data={rootCategories}
                renderItem={({ item }) => (
                    <CategoryCard
                        category={item}
                        onPress={() => navigation.navigate('CategoryDetail', {
                            categoryId: item.id,
                            title: item.title
                        })}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
});