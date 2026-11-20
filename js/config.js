/**
 * ==========================================
 * Map Configuration (Fork / Customization Settings)
 * ==========================================
 * 他地域へのフォークやイベントのカスタマイズを行う際は、
 * この設定ファイル内の値を変更してください。
 */

const MAP_CONFIG = {
    // サイト・アプリのタイトル情報
    appTitle: "UDC2026 中間シンポジウム＠長崎 おもてなしマップ",
    appSubtitle: "長崎から考える、<br>地域データとオープンデータの未来",
    eventSubtitle: "アーバンデータチャレンジ 2026 中間シンポジウム",
    eventPageUrl: "https://udc2026-2nd-symposium.peatix.com/",
    
    // メタ情報 (OGP等)
    metaDescription: "UDC2026 中間シンポジウム＠長崎の参加者のためのデジタルマップ。会場周辺のグルメ・観光・お土産情報を「形」と「明るさ」で分かりやすくお届けします。",
    ogpUrl: "https://tetsuji1122.github.io/nagasaki-map/",
    ogpImage: "https://tetsuji1122.github.io/nagasaki-map/img/ogp.png",

    // 地図の初期表示設定 (中心座標とズームレベル)
    defaultCenter: [32.7448, 129.8737], // 長崎スタジアムシティ周辺
    defaultZoom: 15,

    // お気に入り機能のローカルストレージキー (他のマップと競合しないよう固有のキーを指定)
    storageKeyFavorites: "nagasaki-map-favorites",

    // データソース設定
    spotsDataUrl: "data/spots.json"
};

/**
 * サブカテゴリー・フィルター設定（他地域フォーク時にアイコンや分類をカスタマイズ可能）
 */
const subCategoryConfigs = {
    food: [
        { id: 'all', label: 'すべて' },
        { id: 'champon', label: 'ちゃんぽん', icon: 'fa-solid fa-bowl-food', color: '#f97316' },
        { id: 'cafe', label: 'レトロ喫茶', icon: 'fa-solid fa-mug-hot', color: '#f97316' },
        { id: 'turkish', label: 'トルコライス', icon: 'fa-solid fa-utensils', color: '#f97316' },
        { id: 'ramen', label: 'ラーメン', icon: 'fa-solid fa-bowl-rice', color: '#f97316' },
        { id: 'others', label: 'その他', icon: 'fa-solid fa-utensils', color: '#f97316' }
    ],
    souvenir: [
        { id: 'all', label: 'すべて' },
        { id: 'castella', label: 'カステラ', icon: 'fa-solid fa-shop', color: '#eab308' },
        { id: 'kakuni', label: '角煮まん・ぶたまん', icon: 'fa-solid fa-gift', color: '#CF5376' },
        { id: 'sweets', label: '和菓子・スイーツ', icon: 'fa-solid fa-cake-candles', color: '#eab308' },
        { id: 'others', label: 'その他', icon: 'fa-solid fa-gift', color: '#CF5376' }
    ],
    sightseeing: [
        { id: 'all', label: 'すべて' },
        { id: 'history', label: '歴史・史跡', icon: 'fa-solid fa-scroll', color: '#92400e' },
        { id: 'church', label: '教会・祈り', icon: 'fa-solid fa-church', color: '#7e22ce' },
        { id: 'peace', label: '平和・原爆', icon: 'fa-solid fa-dove', color: '#3b82f6' },
        { id: 'view', label: '夜景・景観', icon: 'fa-solid fa-mountain-city', color: '#1e1b4b' },
        { id: 'nature', label: '自然・公園', icon: 'fa-solid fa-anchor', color: '#06b6d4' },
        { id: 'chinese', label: '和華蘭・中華', icon: 'fa-solid fa-fire-flame-curved', color: '#ef4444' },
        { id: 'others', label: 'その他', icon: 'fa-solid fa-camera', color: '#FF8559' }
    ]
};

