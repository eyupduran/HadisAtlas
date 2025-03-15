import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<TabParamList, 'Categories'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[
            styles.container,
            { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
        ]}>
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}
                    onPress={() => navigation.navigate('Categories')}
                >
                    <Icon
                        name="book-open-variant"
                        size={32}
                        color={isDark ? '#FFFFFF' : '#000000'}
                    />
                    <Text style={[
                        styles.menuText,
                        { color: isDark ? '#FFFFFF' : '#000000' }
                    ]}>
                        Kategoriler
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Icon
                        name="cog"
                        size={32}
                        color={isDark ? '#FFFFFF' : '#000000'}
                    />
                    <Text style={[
                        styles.menuText,
                        { color: isDark ? '#FFFFFF' : '#000000' }
                    ]}>
                        Ayarlar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    menuItem: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    menuText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default HomeScreen;