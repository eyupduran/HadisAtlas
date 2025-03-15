import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { Category } from '../services/types';

interface CategoryCardProps {
    category: Category;
    onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
                    name="book-open-page-variant"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={[
                        styles.title,
                        { color: isDark ? '#FFFFFF' : '#000000' }
                    ]}>
                        {category.title}
                    </Text>
                    <Text style={[
                        styles.count,
                        { color: isDark ? '#CCCCCC' : '#666666' }
                    ]}>
                        {category.hadeeths_count} hadis
                    </Text>
                </View>
                <Icon
                    name="chevron-right"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                />
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
        fontWeight: '600',
    },
    count: {
        fontSize: 14,
        marginTop: 4,
    },
});