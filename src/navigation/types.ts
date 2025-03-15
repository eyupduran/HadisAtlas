export type RootStackParamList = {
    TabHome: undefined;
    LanguageSelect: undefined;
    CategoryDetail: { categoryId: string; title: string };
    HadithList: { categoryId: string; title: string };
    HadithDetail: { hadithId: string; title: string };
};

export type TabParamList = {
    Categories: undefined;
    Favorites: undefined;
    Settings: undefined;
};