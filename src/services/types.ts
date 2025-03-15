export interface Language {
    code: string;
    native: string;
}

export interface Category {
    id: string;
    title: string;
    hadeeths_count: string;
    parent_id: string | null;
}

export interface HadeethListItem {
    id: string;
    title: string;
    translations: string[];
}

export interface HadeethListResponse {
    data: HadeethListItem[];
}

export interface Hadeeth {
    id: string;
    title: string;
    hadeeth: string;
    attribution: string;
    grade: string;
    explanation: string;
    hints: string[];
    categories: string[];
    translations: string[];
    hadeeth_intro: string;
    hadeeth_ar: string;
    hadeeth_intro_ar: string;
    explanation_ar: string;
    hints_ar: string[];
    attribution_ar: string;
    grade_ar: string;
}