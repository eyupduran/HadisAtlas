import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { CategoryCard } from '../components/CategoryCard';
import { Category } from '../services/types';
import { translations } from '../constants/translations';

type CategoryDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

export const CategoryDetailScreen = () => {
    const navigation = useNavigation<CategoryDetailScreenNavigationProp>();
    const route = useRoute<CategoryDetailScreenRouteProp>();
    const { currentLanguage } = useLanguage();
    const { theme } = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const isDark = theme === 'dark';

    useEffect(() => {
        loadCategories();
    }, [currentLanguage]);

    const loadCategories = async () => {
        try {
            const response = await ApiService.getAllCategories(currentLanguage);
            const subCategories = response.data.filter(
                (category: Category) => category.parent_id === route.params.categoryId
            );
            setCategories(subCategories);
        } catch (error) {
            console.error('Alt kategoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category: Category) => {
        navigation.navigate('HadithList', {
            categoryId: category.id,
            title: category.title
        });
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
                    {translations.loadingSubcategories[currentLanguage]}
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
                data={categories}
                renderItem={({ item }) => (
                    <CategoryCard
                        category={item}
                        onPress={() => handleCategoryPress(item)}
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