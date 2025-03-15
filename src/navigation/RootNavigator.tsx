import React from 'react';
import { StatusBar, Animated, Easing } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, StackCardInterpolationProps, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, TabParamList } from './types';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { CategoryDetailScreen } from '../screens/CategoryDetailScreen';
import { HadithListScreen } from '../screens/HadithListScreen';
import { HadithDetailScreen } from '../screens/HadithDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import 'react-native-gesture-handler';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    const { theme } = useTheme();
    const { currentLanguage } = useLanguage();
    const isDark = theme === 'dark';

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: isDark ? '#FFFFFF' : '#000000',
                tabBarStyle: {
                    backgroundColor: isDark ? '#121212' : '#FFFFFF',
                    borderTopColor: isDark ? '#2C2C2C' : '#E0E0E0',
                },
                headerStyle: {
                    backgroundColor: isDark ? '#121212' : '#FFFFFF',
                },
                headerTintColor: isDark ? '#FFFFFF' : '#000000',
                tabBarHideOnKeyboard: true,
            }}
            initialRouteName="Categories"
        >
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    title: translations.appName[currentLanguage],
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="book-open-variant" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    title: translations.favorites[currentLanguage],
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: translations.settings[currentLanguage],
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cog" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const { theme } = useTheme();
    const { currentLanguage } = useLanguage();
    const isDark = theme === 'dark';

    const navigatorTheme = React.useMemo(() => ({
        ...isDark ? DarkTheme : DefaultTheme,
        colors: {
            ...(isDark ? DarkTheme : DefaultTheme).colors,
            background: isDark ? '#121212' : '#FFFFFF',
            card: isDark ? '#121212' : '#FFFFFF',
            text: isDark ? '#FFFFFF' : '#000000',
            border: isDark ? '#2C2C2C' : '#E0E0E0',
        },
    }), [isDark]);

    const screenOptions = React.useMemo<StackNavigationOptions>(() => ({
        headerStyle: {
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        cardStyle: { backgroundColor: isDark ? '#121212' : '#FFFFFF' },
        cardStyleInterpolator: ({ current, layouts }: StackCardInterpolationProps) => ({
            cardStyle: {
                transform: [{
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                }],
                opacity: current.progress,
            },
        }),
        transitionSpec: {
            open: {
                animation: 'timing',
                config: {
                    duration: 250,
                },
            },
            close: {
                animation: 'timing',
                config: {
                    duration: 200,
                },
            },
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal' as const,
    }), [isDark]);

    return (
        <NavigationContainer 
            theme={navigatorTheme}
            onStateChange={() => {
                StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
                StatusBar.setBackgroundColor(isDark ? '#121212' : '#FFFFFF', true);
            }}
        >
            <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen
                    name="TabHome"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LanguageSelect"
                    component={LanguageSelectScreen}
                    options={{
                        title: translations.languageSelection[currentLanguage],
                    }}
                />
                <Stack.Screen
                    name="CategoryDetail"
                    component={CategoryDetailScreen}
                    options={({ route }) => ({
                        title: route.params.title,
                    })}
                />
                <Stack.Screen
                    name="HadithList"
                    component={HadithListScreen}
                    options={({ route }) => ({
                        title: route.params.title,
                    })}
                />
                <Stack.Screen
                    name="HadithDetail"
                    component={HadithDetailScreen}
                    options={({ route }) => ({
                        title: route.params.title,
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};