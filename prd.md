# Hadis Atlas - Product Requirements Document (PRD)

## Genel Bakış

Hadis Atlas, hadeethenc.com API'sini kullanarak çeşitli dillerde hadisleri arama, okuma ve kaydetme imkanı sağlayan bir mobil uygulamadır. Kullanıcılar farklı kategorilerdeki hadisleri keşfedebilir, detaylı açıklamalarını okuyabilir ve favorilerine ekleyebilirler.

## API Endpoints

Uygulama aşağıdaki API endpointlerini kullanmaktadır:

### 1. Dil Listesi
**Endpoint:** `https://hadeethenc.com/api/v1/languages`

**Dönen Response:**
```json
[
    {
        "code": "ar",
        "native": "العربية"
    },
    {
        "code": "en",
        "native": "English"
    },
    {
        "code": "tr",
        "native": "Türkçe"
    },
    ...
]
```

### 2. Kategori Listesi
**Endpoint:** `https://hadeethenc.com/api/v1/categories/list/?language=tr`

**Dönen Response:**
```json
[
    {
        "id": "1",
        "title": "Kur'an-ı Kerim ve Kur'an İlimleri",
        "hadeeths_count": "56",
        "parent_id": null
    },
    ...
]
```

### 3. Ana Kategoriler
**Endpoint:** `https://hadeethenc.com/api/v1/categories/roots/?language=tr`

**Dönen Response:**
```json
[
    {
        "id": "1",
        "title": "Kur'an-ı Kerim ve Kur'an İlimleri",
        "hadeeths_count": "56",
        "parent_id": null
    },
    ...
]
```

### 4. Hadis Listesi
**Endpoint:** `https://hadeethenc.com/api/v1/hadeeths/list/?language=tr&category_id=1&page=1&per_page=20`

**Dönen Response:**
```json
{
    "data": [
        {
            "id": "5907",
            "title": "Şu Kur'an'ı hafızanızda korumaya özen gösteriniz...",
            "translations": ["ar", "en", "tr", ...]
        },
        ...
    ]
}
```

### 5. Hadis Detayı
**Endpoint:** `https://hadeethenc.com/api/v1/hadeeths/one/?language=tr&id=2962`

**Dönen Response:**
```json
{
    "id": "2962",
    "title": "Kıyamet gününde insanlar arasında görülecek ilk dava...",
    "hadeeth": "Abdullah b. Mes'ud -radıyallahu anh-'dan rivayet edildiğine göre...",
    "attribution": "Muttefekun Aleyh",
    "grade": "Sahih Hadis",
    "explanation": "Peygamber Efendimiz -sallallahu aleyhi ve sellem- kıyamet gününde...",
    "hints": [
        "Kan dökme meselesi çok büyük bir meseledir...",
        "Günahlar, verdikleri zararın büyüklüğüne göre büyür..."
    ],
    "categories": ["85", "219"],
    "translations": ["ar", "en", "tr", ...],
    "hadeeth_intro": "Abdullah b. Mes'ud -radıyallahu anh-'dan rivayet edildiğine göre...",
    "hadeeth_ar": "عَنْ عَبْدِ اللهِ بنِ مَسْعُودٍ رضي الله عنه قَالَ...",
    "hadeeth_intro_ar": "عَنْ عَبْدِ اللهِ بنِ مَسْعُودٍ رضي الله عنه قَالَ...",
    "explanation_ar": "ذَكَرَ النبيُّ صلى الله عليه وسلم أنَّ أوَّلَ ما يُحْكَمُ بين الناس...",
    "hints_ar": [
        "عِظَمُ أمر الدِّماء، فإنَّ البَدَاءةَ تكونُ بالأهم.",
        "الذنوب تَعْظُمُ بحسب عِظَمِ المَفسدة الواقعة بها..."
    ],
    "attribution_ar": "متفق عليه",
    "grade_ar": "صحيح"
}
```

## Özellikler

### Yapıldı / Tamamlanan Özellikler

#### Faz 1 - Temel Kurulum ve Yapılandırma ✅
- Proje başlangıç yapısı oluşturuldu (React Native Expo)
- Gerekli paketler kuruldu:
  - @react-navigation/native
  - @react-navigation/native-stack
  - react-native-screens
  - react-native-safe-area-context
  - @react-native-async-storage/async-storage
  - axios
- Temel klasör yapısı oluşturuldu:
  - src/
    - screens/ (Ekranlar)
    - components/ (Yeniden kullanılabilir bileşenler)
    - navigation/ (Navigasyon yapılandırması)
    - services/ (API servisleri)
    - utils/ (Yardımcı fonksiyonlar)
    - constants/ (Sabit değerler)
    - hooks/ (Custom React Hooks)
    - context/ (React Context yapıları)
    - theme/ (Tema yapılandırması)
    - assets/ (Görsel ve diğer statik dosyalar)
- API servisleri oluşturuldu (/languages, /categories/list, /categories/roots, /hadeeths/list, /hadeeths/one)
- Dil yönetimi implementasyonu tamamlandı
  - Dil seçim ekranı
  - Dil tercihlerinin saklanması
  - Context yapısı
- Tema seçimi implementasyonu tamamlandı
  - Açık/Koyu/Sistem teması desteği
  - Tema tercihlerinin saklanması
  - Context yapısı
- Ana sayfa temel UI tasarımı
  - Temel navigasyon yapısı
  - Ayarlar ekranı
  - Dil seçim ekranı

#### Faz 2 - Kategori Sistemi ve Hadis Görüntüleme ✅
1. **Kategori Sistemi**
   - Ana kategorilerin listelenmesi (/categories/roots)
   - Alt kategorilerin gösterimi (/categories/list)
   - Her kategorideki hadis sayısının gösterimi
   - Seçilen kategoriye ait hadislerin listelenmesi (/hadeeths/list)
   - MaterialCommunityIcons entegrasyonu
   - Kategori kartları UI tasarımı

2. **Hadis Görüntüleme**
   - Hadis listesi görünümü
   - Hadis başlığı ve özet bilgileri
   - Mevcut çeviri dillerinin gösterimi
   - Sayfalama yapısı (page ve per_page parametreleri)
   - Sonsuz kaydırma (infinite scroll)
   - Yükleme göstergeleri
   - Tema desteği ile karanlık/aydınlık mod

#### Faz 3 - Gelişmiş Özellikler ve Performans İyileştirmeleri ✅
1. **Çevrimdışı Kullanım**
   - Seçilen hadisleri local storage'a kaydetme ✅
   - Temel kategori verilerini önbellekleme ✅
   - Çevrimdışı mod kontrolü ✅
   - Senkronizasyon yönetimi ✅

2. **Favoriler**
   - Hadisleri local storage'da saklama ✅
   - Favori listesi görünümü ✅
   - Favorilerden çıkarma ✅
   - Favoriler için bottom navigationda gösterme ✅

3. **Paylaşım**
- Hadis metnini metin olarak paylaşma ✅
- Kaynak bilgisiyle paylaşım ✅
- Sistem paylaşım menüsü entegrasyonu ✅

4. **Kullanıcı Tercihleri**
   - Yazı boyutu ayarlama ✅
   - Görünüm tercihleri ✅
   - Offline mod ayarları ✅
   - Tercihlerin local storage'da saklanması ✅

## Teknik Gereksinimler

- Minimum Android 6.0 (API level 23)
- Minimum iOS 11
- Internet bağlantısı (offline mod hariç)
- Local Storage kullanımı
- API endpoint versiyonu: v1

## Hedef Kitle

- İslami bilgi edinmek isteyenler
- Hadis öğrencileri ve araştırmacılar
- Dini içerik arayan genel kullanıcılar

## İş Takvimi

- Alpha sürüm (Faz 1): Temel UI, dil yönetimi ve tema desteği
- Beta sürüm (Faz 2): Kategori sistemi ve hadis görüntüleme
- 1.0 sürüm (Faz 3): Çevrimdışı kullanım ve favoriler
- Sonraki sürümler: Kullanıcı geri bildirimlerine göre iyileştirmeler
