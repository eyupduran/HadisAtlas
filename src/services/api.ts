import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Category, HadeethListResponse, Hadeeth } from './types';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://hadeethenc.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

// Cache keys
const CACHE_KEYS = {
    ROOT_CATEGORIES: (language: string) => `root_categories_${language}`,
    ALL_CATEGORIES: (language: string) => `all_categories_${language}`,
    HADEETHS_LIST: (params: any) => `hadeeths_list_${JSON.stringify(params)}`,
    HADEETH: (language: string, id: string) => `hadeeth_${language}_${id}`,
};

// Cache durations (in milliseconds)
const CACHE_DURATION = {
    CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
    HADEETHS: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const isDataExpired = (timestamp: number, duration: number) => {
    return Date.now() - timestamp > duration;
};

export const ApiService = {
    // Çevrimdışı mod durumunu kontrol et
    async isOfflineMode() {
        try {
            const settings = await AsyncStorage.getItem('@settings_preferences');
            if (settings) {
                const { offlineMode } = JSON.parse(settings);
                return offlineMode;
            }
        } catch (error) {
            console.error('Çevrimdışı mod durumu kontrol edilirken hata:', error);
        }
        return false;
    },

    // İnternet bağlantısını kontrol et
    async checkConnection() {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected;
    },

    // Ana kategorileri getir
    async getRootCategories(language: string) {
        const cacheKey = CACHE_KEYS.ROOT_CATEGORIES(language);
        let cachedData: string | null = null;
        
        try {
            // Önbellekten veriyi kontrol et
            cachedData = await AsyncStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isExpired = isDataExpired(timestamp, CACHE_DURATION.CATEGORIES);
                
                // Çevrimdışı modda veya önbellek süresi dolmamışsa önbellekten ver
                if (await ApiService.isOfflineMode() || !isExpired) {
                    return { data };
                }
            }

            // İnternet bağlantısı yoksa hata fırlat
            if (!(await ApiService.checkConnection())) {
                throw new Error('İnternet bağlantısı yok');
            }

            // API'den yeni veriyi al
            const response = await api.get<Category[]>('/categories/roots', {
                params: { language }
            });

            // Önbelleğe kaydet
            await AsyncStorage.setItem(cacheKey, JSON.stringify({
                data: response.data,
                timestamp: Date.now()
            }));

            return response;
        } catch (error) {
            // Çevrimdışı modda veya internet yoksa ve önbellekte veri varsa onu kullan
            if (((error instanceof Error && error.message === 'İnternet bağlantısı yok') || 
                await ApiService.isOfflineMode()) && cachedData) {
                const { data } = JSON.parse(cachedData);
                return { data };
            }
            throw error;
        }
    },

    // Tüm kategorileri getir
    async getAllCategories(language: string) {
        const cacheKey = CACHE_KEYS.ALL_CATEGORIES(language);
        let cachedData: string | null = null;
        
        try {
            const cachedData = await AsyncStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isExpired = isDataExpired(timestamp, CACHE_DURATION.CATEGORIES);
                
                if (await ApiService.isOfflineMode() || !isExpired) {
                    return { data };
                }
            }

            if (!(await ApiService.checkConnection())) {
                throw new Error('İnternet bağlantısı yok');
            }

            const response = await api.get<Category[]>('/categories/list', {
                params: { language }
            });

            await AsyncStorage.setItem(cacheKey, JSON.stringify({
                data: response.data,
                timestamp: Date.now()
            }));

            return response;
        } catch (error) {
            if (((error instanceof Error && error.message === 'İnternet bağlantısı yok') || 
                await ApiService.isOfflineMode()) && cachedData) {
                const { data } = JSON.parse(cachedData);
                return { data };
            }
            throw error;
        }
    },

    // Hadis listesini getir
    async getHadeethsList(params: {
        language: string,
        category_id: string,
        page: number,
        per_page: number
    }) {
        const cacheKey = CACHE_KEYS.HADEETHS_LIST(params);
        let cachedData: string | null = null;
        
        try {
            cachedData = await AsyncStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isExpired = isDataExpired(timestamp, CACHE_DURATION.HADEETHS);
                
                if (await ApiService.isOfflineMode() || !isExpired) {
                    return { data };
                }
            }

            if (!(await ApiService.checkConnection())) {
                throw new Error('İnternet bağlantısı yok');
            }

            const response = await api.get<HadeethListResponse>('/hadeeths/list', { params });

            await AsyncStorage.setItem(cacheKey, JSON.stringify({
                data: response.data,
                timestamp: Date.now()
            }));

            return response;
        } catch (error) {
            if (((error instanceof Error && error.message === 'İnternet bağlantısı yok') || 
                await ApiService.isOfflineMode()) && cachedData) {
                const { data } = JSON.parse(cachedData);
                return { data };
            }
            throw error;
        }
    },

    // Hadis detayını getir
    async getHadeethById(params: {
        language: string,
        id: string
    }) {
        const cacheKey = CACHE_KEYS.HADEETH(params.language, params.id);
        let cachedData: string | null = null;
        
        try {
            cachedData = await AsyncStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const isExpired = isDataExpired(timestamp, CACHE_DURATION.HADEETHS);
                
                if (await ApiService.isOfflineMode() || !isExpired) {
                    return { data };
                }
            }

            if (!(await ApiService.checkConnection())) {
                throw new Error('İnternet bağlantısı yok');
            }

            const response = await api.get<Hadeeth>('/hadeeths/one', { params });

            await AsyncStorage.setItem(cacheKey, JSON.stringify({
                data: response.data,
                timestamp: Date.now()
            }));

            return response;
        } catch (error) {
            if (((error instanceof Error && error.message === 'İnternet bağlantısı yok') || 
                await ApiService.isOfflineMode()) && cachedData) {
                const { data } = JSON.parse(cachedData);
                return { data };
            }
            throw error;
        }
    }
};