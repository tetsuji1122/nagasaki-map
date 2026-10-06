const categoryConfig = {
    venue: { label: '会場', color: '#E65447', icon: 'fa-solid fa-location-dot' },
    food: { label: 'グルメ', color: '#f97316', icon: 'fa-solid fa-utensils' },
    sightseeing: { label: '観光', color: '#FF8559', icon: 'fa-solid fa-camera' },
    souvenir: { label: 'お土産', color: '#CF5376', icon: 'fa-solid fa-gift' },
    all: { label: 'すべて', color: '#1a2a3a' }
};

function getSpotConfig(spot) {
    const cat = spot.category;
    const subId = spot.subcategory || '';
    const name = spot.name || '';
    const desc = spot.desc || '';
    
    // 1. subCategoryConfigs から設定を探す
    const config = subCategoryConfigs[cat]?.find(s => s.id === subId);
    
    if (config && config.id !== 'all') {
        return { icon: config.icon, color: config.color };
    }

    // 2. 設定が見つからない場合のデフォルト（categoryConfig）
    let icon = categoryConfig[cat]?.icon || 'fa-solid fa-location-dot';
    let color = categoryConfig[cat]?.color || '#777';

    // 3. キーワードによるフォールバック（既存の挙動を維持しつつ補完）
    if (cat === 'food') {
        if (name.includes('ちゃんぽん')) icon = 'fa-solid fa-bowl-food';
    } else if (cat === 'souvenir') {
        if (name.includes('カステラ')) {
            icon = 'fa-solid fa-cake-candles';
            color = '#eab308';
        }
    } else if (cat === 'sightseeing') {
        if (name.includes('平和') || name.includes('原爆') || desc.includes('平和')) {
            icon = 'fa-solid fa-dove';
            color = '#3b82f6';
        }
        else if (name.includes('天主堂') || name.includes('教会') || name.includes('堂')) {
            icon = 'fa-solid fa-church';
            color = '#7e22ce';
        }
        else if (name.includes('龍馬') || name.includes('史跡') || name.includes('奉行所') || name.includes('出島')) {
            icon = 'fa-solid fa-scroll';
            color = '#92400e';
        }
        else if (name.includes('中華街') || name.includes('孔子廟')) {
            icon = 'fa-solid fa-fire-flame-curved';
            color = '#ef4444';
        }
        else if (name.includes('夜景') || name.includes('展望') || name.includes('稲佐山')) {
            icon = 'fa-solid fa-mountain-city';
            color = '#1e1b4b';
        }
        else if (name.includes('港') || name.includes('海') || name.includes('船') || name.includes('水辺')) {
            icon = 'fa-solid fa-anchor';
            color = '#06b6d4';
        }
    }

    return { icon, color };
}

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
let favoriteIds = JSON.parse(localStorage.getItem('nagasaki-map-favorites') || '[]');

function toggleFavorite(id, event) {
    if (event) event.stopPropagation();
    const index = favoriteIds.indexOf(id);
    if (index === -1) {
        favoriteIds.push(id);
    } else {
        favoriteIds.splice(index, 1);
    }
    localStorage.setItem('nagasaki-map-favorites', JSON.stringify(favoriteIds));
    
    // UIを更新
    const heartBtns = document.querySelectorAll(`.heart-btn[data-id="${id}"]`);
    heartBtns.forEach(btn => {
        btn.classList.toggle('active');
        const svg = btn.querySelector('svg');
        if (favoriteIds.includes(id)) {
            svg.setAttribute('fill', '#e74c3c');
        } else {
            svg.setAttribute('fill', 'none');
        }
    });

    // お気に入りフィルター中なら表示を更新
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.dataset.category === 'favorites') {
        displaySpots('favorites');
    }
}

let spots = [];

async function loadSpots() {
    try {
        const response = await fetch('data/spots.json');
        spots = await response.json();
        displaySpots();
    } catch (error) {
        console.error('Error loading spots:', error);
    }
}


const map = L.map('map', { zoomControl: false }).setView([32.7448, 129.8737], 15);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

let markerLayer = L.layerGroup().addTo(map);
let markers = {};

function createIcon(spot, active) {
    const { icon, color } = getSpotConfig(spot);
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-base ${active ? 'active' : ''}" style="background-color: ${color};"><i class="${icon}"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

function displaySpots(catFilter = 'all', subCatFilter = 'all') {
    markerLayer.clearLayers();
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';
    markers = {};

    spots.forEach(spot => {
        let matchCat = false;
        if (catFilter === 'all') {
            matchCat = true;
        } else if (catFilter === 'favorites') {
            matchCat = favoriteIds.includes(spot.id);
        } else {
            matchCat = spot.category === catFilter;
        }
        
        let matchSub = false;
        if (subCatFilter === 'all') {
            matchSub = true;
        } else if (subCatFilter === 'others') {
            matchSub = !spot.subcategory || spot.subcategory === '' || spot.subcategory === 'others';
        } else {
            matchSub = spot.subcategory === subCatFilter;
        }

        if (matchCat && matchSub) {
            // マーカー作成
            const marker = L.marker([spot.lat, spot.lng], {
                icon: createIcon(spot, false)
            }).addTo(markerLayer);
            
            markers[spot.id] = marker;

            marker.on('click', () => {
                focusSpot(spot.id);
            });

            // カルーセルカード作成
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `card-${spot.id}`;
            
            const isFavorite = favoriteIds.includes(spot.id);
            const heartColor = isFavorite ? '#e74c3c' : 'none';
            const { color: spotColor } = getSpotConfig(spot);
            
            let subCatLabel = '';
            if (spot.subcategory && subCategoryConfigs[spot.category]) {
                const subConfig = subCategoryConfigs[spot.category].find(s => s.id === spot.subcategory);
                if (subConfig && subConfig.id !== 'all') {
                    subCatLabel = subConfig.label;
                }
            }
            const subCatBadge = subCatLabel ? `<div class="card-subcategory">${subCatLabel}</div>` : '';

            let actionButtons = `<a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}" target="_blank" class="card-btn btn-gmaps"><svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>経路案内</a>`;
            if (spot.url) {
                actionButtons += `<a href="${spot.url}" target="_blank" class="card-btn btn-web"><svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>Web</a>`;
            }

            card.innerHTML = `
                <div class="card-tag-container">
                    <div class="card-category" style="background:${spotColor}">${categoryConfig[spot.category].label}</div>
                    ${subCatBadge}
                </div>
                <div class="card-title">${spot.name}</div>
                <div class="card-desc">${spot.desc}</div>
                <div class="card-footer">
                    <div class="card-bottom">
                        <button class="heart-btn ${isFavorite ? 'active' : ''}" data-id="${spot.id}" onclick="toggleFavorite(${spot.id}, event)">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="${heartColor}" stroke="#e74c3c" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="card-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
            card.onclick = (e) => {
                // ボタンクリック時は発火させない
                if (e.target.tagName === 'A') return;
                focusSpot(spot.id);
            };
            carousel.appendChild(card);
        }
    });
}

function renderSubFilters(cat) {
    const container = document.getElementById('sub-filter-container');
    const locateBtn = document.querySelector('.locate-btn');
    const configs = subCategoryConfigs[cat];

    if (!configs) {
        container.classList.add('hidden');
        container.innerHTML = '';
        if (locateBtn) locateBtn.classList.remove('shifted');
        return;
    }

    container.classList.remove('hidden');
    if (locateBtn) locateBtn.classList.add('shifted');
    container.innerHTML = '';
    
    configs.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = `sub-filter-btn ${sub.id === 'all' ? 'active' : ''}`;
        btn.innerText = sub.label;
        
        // カテゴリーに応じたアクティブ色を設定
        const activeColor = categoryConfig[cat].color;
        if (sub.id === 'all') {
            btn.style.backgroundColor = activeColor;
            btn.style.borderColor = activeColor;
            btn.style.color = 'white';
        }

        btn.onclick = () => {
            document.querySelectorAll('.sub-filter-btn').forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'white';
                b.style.borderColor = '#ddd';
                b.style.color = '#777';
            });
            btn.classList.add('active');
            btn.style.backgroundColor = activeColor;
            btn.style.borderColor = activeColor;
            btn.style.color = 'white';
            displaySpots(cat, sub.id);
        };
        container.appendChild(btn);
    });
}

// フィルターボタンのイベント
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        displaySpots(cat);
        renderSubFilters(cat);
    });
});

function focusSpot(id) {
    const spot = spots.find(s => s.id == id);
    if (!spot) return;

    // 全カードとマーカーをリセット
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    Object.keys(markers).forEach(k => {
        const s = spots.find(sp => sp.id == k);
        markers[k].setIcon(createIcon(s, k == id));
        if (k == id) markers[k].setZIndexOffset(1000);
        else markers[k].setZIndexOffset(0);
    });

    // 選択されたものを強調
    const card = document.getElementById(`card-${id}`);
    if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // 地図の移動（カルーセルを避けて中央に配置）
    const carousel = document.getElementById('carousel');
    const carouselHeight = carousel.offsetHeight || 200; // カルーセルの高さを取得
    
    // カルーセルの高さの半分だけ中心を下にずらす計算
    // これにより、マーカーが「地図の最上部」と「カルーセルの上端」の中間に表示される
    const targetPoint = map.project([spot.lat, spot.lng], map.getZoom()).add([0, carouselHeight / 2]);
    const targetLatLng = map.unproject(targetPoint, map.getZoom());
    map.setView(targetLatLng, map.getZoom(), { animate: true });
}

function locateUser() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#4285F4',
            color: 'white',
            weight: 2,
            fillOpacity: 0.8
        }).addTo(map);
        map.setView([latitude, longitude], 16);
    });
}

function shuffleSlides() {
    const slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;
    const slides = Array.from(slideshow.children);
    for (let i = slides.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        slideshow.appendChild(slides[j]);
    }
}


// 初期実行
shuffleSlides();
loadSpots();

// マップへの入場
function enterMap() {
    const landing = document.getElementById('landing-page');
    landing.classList.add('fade-out');
    
    // アニメーションが終わった後に要素を完全に消す
    setTimeout(() => {
        landing.style.display = 'none';
        // マップのサイズを再計算（表示崩れ防止）
        map.invalidateSize();
    }, 1500);
}

