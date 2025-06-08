// グローバル変数
let map;
let markers = [];
let currentLatLng = null;
let currentLanguage = 'ja'; // デフォルトは日本語
let userLocationMarker = null; // ユーザーの現在地マーカー
let currentLocationMarker = null; // 現在地マーカー（別名）
let watchId = null; // 位置監視のID
let isWatchingLocation = false; // 位置監視の状態
let lastKnownPosition = null; // 最後に取得した位置

// 翻訳辞書
const translations = {
    ja: {
        'page-title': 'ゴミ箱マップ - 日本のゴミ箱位置マッピング',
        'app-title': 'ゴミ箱マップ',
        'app-description': '日本のゴミ箱位置をマッピング・共有するアプリ',
        'search-placeholder': 'ゴミ箱を検索...',
        'add-mode-btn': '📍 ゴミ箱追加モード: OFF',
        'add-mode-btn-on': '📍 ゴミ箱追加モード: ON',
        'clear-all-btn': '🗑️ 全削除',
        'current-location-btn': '📍 現在地',
        'getting-location': '取得中...',
        'add-trash-btn': '追加',
        'delete-trash-btn': '削除',
        'start-tracking': '位置追跡開始',
        'stop-tracking': '位置追跡停止',
        'tracking-started': '位置追跡を開始しました',
        'tracking-stopped': '位置追跡を停止しました',
        'location-updated': '位置情報が更新されました',
        'trash-list-title': 'ゴミ箱一覧',
        'modal-title': '新しいゴミ箱を追加',
        'delete-modal-title': 'ゴミ箱を削除',
        'delete-modal-description': '削除するゴミ箱を選択してください：',
        'location-label': '場所・名称',
        'location-placeholder': '場所を取得中...',
        'location-help': '位置情報から自動で場所名を取得します',
        'details-label': '対応ゴミの種類',
        'trash-type-help': 'このゴミ箱で捨てられるゴミの種類を選択してください（複数選択可）',
        'trash-newspaper': '新聞・雑誌',
        'trash-plastic': 'ペットボトル',
        'trash-cans': 'カン・ビン',
        'trash-other': 'その他',
        'trash-burnable': '燃える',
        'trash-non-burnable': '燃えない',
        'location-fetching': '場所を取得中...',
        'location-fetch-error': '場所の取得に失敗しました',
        'location-unknown': '不明な場所',
        'current-location': '現在地',
        'current-location-title': 'あなたの現在地',
        'error-add': 'ゴミ箱の追加に失敗しました',
        'error-delete': 'ゴミ箱の削除に失敗しました',
        'error-load': 'ゴミ箱の読み込みに失敗しました',
        'error-location': '位置情報の取得に失敗しました',
        'error-geolocation': '位置情報がサポートされていません',
        'error-permission': '位置情報の使用が拒否されました',
        'error-unavailable': '位置情報が利用できません',
        'error-timeout': '位置情報の取得がタイムアウトしました',
        'add-btn': '追加',
        'cancel-btn': 'キャンセル',
        'delete-btn': '削除',
        'no-trash-cans': 'ゴミ箱がありません',
        'no-trash-cans-delete': '削除できるゴミ箱がありません',
        'fallback-title': 'ゴミ箱マップ',
        'fallback-desc1': 'Google Maps APIキーが設定されていません',
        'fallback-desc2': 'デモ用の簡易地図として動作します',
        'fallback-add-btn': '📍 ゴミ箱を追加（デモ）',
        'confirm-delete': 'このゴミ箱を削除しますか？',
        'confirm-delete-all': '全てのゴミ箱を削除しますか？',
        'alert-enable-mode': 'まずゴミ箱追加モードをONにしてください',
        'alert-location-error': '位置情報が取得できませんでした',
        'alert-no-location': '現在地が取得されていません。先に現在地を取得してください。',
        'success-added': 'ゴミ箱が追加されました！',
        'success-deleted': 'ゴミ箱が削除されました',
        'success-cleared': '全てのゴミ箱が削除されました',
        'success-location': '現在地を取得しました',
        'location-found': '現在地を取得しました',
        'add-tab': '追加',
        'delete-tab': '削除',
        'navigation-btn': 'ルート検索',
        'navigation-options': 'ナビゲーション方法を選択',
        'google-maps': 'Google Maps',
        'apple-maps': 'Apple Maps',
        'browser-maps': 'ブラウザで開く',
        'copy-coordinates': '座標をコピー',
        'coordinates-copied': '座標をコピーしました'
    },
    en: {
        'page-title': 'Trash Can Map - Mapping Trash Can Locations in Japan',
        'app-title': 'Trash Can Map',
        'app-description': 'App for mapping and sharing trash can locations in Japan',
        'search-placeholder': 'Search trash cans...',
        'add-mode-btn': '📍 Add Trash Can Mode: OFF',
        'add-mode-btn-on': '📍 Add Trash Can Mode: ON',
        'clear-all-btn': '🗑️ Clear All',
        'current-location-btn': '📍 My Location',
        'getting-location': 'Getting location...',
        'add-trash-btn': 'Add',
        'delete-trash-btn': 'Delete',
        'start-tracking': 'Start Tracking',
        'stop-tracking': 'Stop Tracking',
        'tracking-started': 'Tracking started',
        'tracking-stopped': 'Tracking stopped',
        'location-updated': 'Location updated',
        'trash-list-title': 'Trash Can List',
        'modal-title': 'Add New Trash Can',
        'delete-modal-title': 'Delete Trash Can',
        'delete-modal-description': 'Select trash can to delete:',
        'location-label': 'Location/Name',
        'location-placeholder': 'Getting location...',
        'location-help': 'Location name will be automatically retrieved from GPS',
        'details-label': 'Supported Trash Types',
        'trash-type-help': 'Select the types of trash that can be disposed in this bin (multiple selection)',
        'trash-newspaper': 'Newspaper/Magazine',
        'trash-plastic': 'Plastic Bottles',
        'trash-cans': 'Cans/Bottles',
        'trash-other': 'Other',
        'trash-burnable': 'Burnable',
        'trash-non-burnable': 'Non-burnable',
        'location-fetching': 'Getting location...',
        'location-fetch-error': 'Failed to get location',
        'location-unknown': 'Unknown location',
        'current-location': 'Current Location',
        'current-location-title': 'Your Current Location',
        'error-add': 'Failed to add trash can',
        'error-delete': 'Failed to delete trash can',
        'error-load': 'Failed to load trash cans',
        'error-location': 'Failed to get location',
        'error-geolocation': 'Geolocation not supported',
        'error-permission': 'Location access denied',
        'error-unavailable': 'Location unavailable',
        'error-timeout': 'Location request timed out',
        'add-btn': 'Add',
        'cancel-btn': 'Cancel',
        'delete-btn': 'Delete',
        'no-trash-cans': 'No trash cans',
        'no-trash-cans-delete': 'No trash cans to delete',
        'fallback-title': 'Trash Can Map',
        'fallback-desc1': 'Google Maps API key is not set',
        'fallback-desc2': 'Operates as a simple demo map',
        'fallback-add-btn': '📍 Add Trash Can (Demo)',
        'confirm-delete': 'Delete this trash can?',
        'confirm-delete-all': 'Delete all trash cans?',
        'alert-enable-mode': 'First, enable the trash can add mode',
        'alert-location-error': 'Location information cannot be obtained',
        'alert-no-location': 'Current location is not obtained. Please obtain the current location first',
        'success-added': 'Trash can added!',
        'success-deleted': 'Trash can deleted',
        'success-cleared': 'All trash cans deleted',
        'success-location': 'Current location obtained',
        'location-found': 'Current location obtained',
        'add-tab': 'Add',
        'delete-tab': 'Delete',
        'navigation-btn': 'Route Search',
        'navigation-options': 'Select Navigation Method',
        'google-maps': 'Google Maps',
        'apple-maps': 'Apple Maps',
        'browser-maps': 'Open in Browser',
        'copy-coordinates': 'Copy Coordinates',
        'coordinates-copied': 'Coordinates copied'
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadPins();
    initializeLanguage();
    
    // ページの可視性変更を監視
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // ページ離脱時の処理
    window.addEventListener('beforeunload', function() {
        stopLocationTracking();
    });
    
    // ページがフォーカスを失った時の処理
    window.addEventListener('blur', function() {
        // バックグラウンドでも追跡を続ける（ただし頻度を下げる）
        if (isWatchingLocation) {
            console.log('App went to background, continuing location tracking');
        }
    });
    
    // ページがフォーカスを得た時の処理
    window.addEventListener('focus', function() {
        if (isWatchingLocation) {
            console.log('App came to foreground, resuming normal location tracking');
        }
    });
});

// 言語初期化
function initializeLanguage() {
    // ローカルストレージから言語設定を取得
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        switchLanguage(savedLanguage);
    } else {
        // ブラウザの言語設定を確認
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('en')) {
            currentLanguage = 'en';
            switchLanguage('en');
        }
    }
}

// 言語切り替え
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // 全ての翻訳対象要素を更新
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // プレースホルダーの更新
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // 言語切り替えボタンのタイトル更新
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.title = lang === 'ja' ? 'Switch to English' : '日本語に切り替え';
    }
}

// イベントリスナーの初期化
function initializeEventListeners() {
    // 現在地に戻るボタン
    const recenterBtn = document.getElementById('recenterBtn');
    if (recenterBtn) {
        recenterBtn.addEventListener('click', recenterToCurrentLocation);
    }
    
    // 場所リフレッシュボタン
    const refreshLocationBtn = document.getElementById('refreshLocation');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', refreshLocationName);
    }
    
    // 言語切り替えボタン
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const newLang = currentLanguage === 'ja' ? 'en' : 'ja';
            switchLanguage(newLang);
        });
    }
    
    // 検索機能（リアルタイム検索）
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        // リアルタイム検索（入力時）
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // 検索実行
            handleSearch(e);
            
            // 検索候補表示
            if (searchTerm.length >= 2) {
                showSearchSuggestions(searchTerm);
            } else {
                hideSearchSuggestions();
            }
        });
        
        // 検索ボックスのクリア機能
        searchBox.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                showAllMarkers();
                hideSearchSuggestions();
                showNotification('検索をクリアしました', 'info');
            }
            
            // 矢印キーで候補選択（将来の拡張用）
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                // TODO: 候補選択機能
            }
        });
        
        // フォーカス時の処理
        searchBox.addEventListener('focus', function() {
            this.style.boxShadow = '0 4px 20px rgba(13, 83, 255, 0.3)';
            
            // フォーカス時に候補を表示
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm.length >= 2) {
                showSearchSuggestions(searchTerm);
            }
        });
        
        // フォーカス外れ時の処理
        searchBox.addEventListener('blur', function() {
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            
            // 少し遅延させて候補を非表示（クリック処理のため）
            setTimeout(() => {
                hideSearchSuggestions();
            }, 200);
        });
    }
    
    // モーダル関連
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        
        // キーボードアクセシビリティ対応
        closeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeModal();
            }
        });
    }
    
    // モーダル外クリックで閉じる
    const pinModal = document.getElementById('pinModal');
    if (pinModal) {
        pinModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // 削除モーダル外クリックで閉じる
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteModal();
        });
    }
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('pinModal').style.display === 'block') {
                closeModal();
            }
            if (document.getElementById('deleteModal').style.display === 'block') {
                closeDeleteModal();
            }
        }
    });
    
    // フォーム送信
    const pinForm = document.getElementById('pinForm');
    if (pinForm) {
        pinForm.addEventListener('submit', handlePinSubmit);
    }
    
    // タッチデバイス検出とイベント最適化
    if ('ontouchstart' in window) {
        addTouchOptimizations();
    }
    
    // ゴミ箱追加タブ
    const addTab = document.getElementById('addTab');
    if (addTab) {
        addTab.addEventListener('click', function() {
            switchTab('add');
            addTrashCanAtCurrentLocation();
        });
    }
    
    // ゴミ箱削除タブ
    const deleteTab = document.getElementById('deleteTab');
    if (deleteTab) {
        deleteTab.addEventListener('click', function() {
            switchTab('delete');
            openDeleteModal();
        });
    }
}

// タッチデバイス用の最適化
function addTouchOptimizations() {
    // ダブルタップズーム防止のためのファストクリック実装
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Google Maps初期化（Google Mapスタイル強化）
function initMap() {
    // 東京駅を中心とした地図
    const center = { lat: 35.6812, lng: 139.7671 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false, // カスタムズームコントロールを使用
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'simplified' }]
            },
            {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // 地図クリックイベント（常にピン追加可能）
    map.addListener('click', function(e) {
        currentLatLng = e.latLng;
        openModal();
    });
    
    // 既存のゴミ箱を読み込み
    loadPins();
    
    // 自動的に現在地を取得（エラーは静かに処理）
    autoGetCurrentLocation();
}

// フォールバック地図初期化（Google Mapスタイル）
function initMapFallback() {
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = `
        <div class="fallback-map">
            <div class="icon">🗺️</div>
            <div>
                <h3>${translations[currentLanguage]['fallback-title']}</h3>
                <p>${translations[currentLanguage]['fallback-desc1']}</p>
                <p>${translations[currentLanguage]['fallback-desc2']}</p>
                <button onclick="simulateMapClick()" class="btn btn-primary" style="margin-top: 20px;"
                        aria-label="${translations[currentLanguage]['fallback-add-btn']}">
                    ${translations[currentLanguage]['fallback-add-btn']}
                </button>
            </div>
        </div>
    `;
    
    // 既存のゴミ箱を読み込み
    loadPins();
}

// デモ用の地図クリックシミュレーション
function simulateMapClick() {
    // ランダムな座標を生成（東京周辺）
    const lat = 35.6812 + (Math.random() - 0.5) * 0.1;
    const lng = 139.7671 + (Math.random() - 0.5) * 0.1;
    currentLatLng = { lat: () => lat, lng: () => lng };
    openModal();
}

// モーダルを開く
function openModal() {
    const modal = document.getElementById('pinModal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // フォーカス管理（アクセシビリティ向上）
    const titleInput = document.getElementById('pinTitle');
    setTimeout(() => {
        titleInput.focus();
    }, 100);
    
    // 場所名を自動取得
    if (currentLatLng) {
        getLocationName(currentLatLng.lat(), currentLatLng.lng());
    }
    
    // モバイル対応: body のスクロールを無効化
    document.body.style.overflow = 'hidden';
}

// モーダルを閉じる
function closeModal() {
    const modal = document.getElementById('pinModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('pinForm').reset();
    currentLatLng = null;
    
    // 場所名入力フィールドをリセット
    const titleInput = document.getElementById('pinTitle');
    titleInput.value = '';
    titleInput.placeholder = translations[currentLanguage]['location-placeholder'];
    
    // body のスクロールを有効化
    document.body.style.overflow = '';
    
    // フォーカス管理（検索ボックスにフォーカス）
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.focus();
    }
}

// 場所名を取得する関数
function getLocationName(lat, lng) {
    const titleInput = document.getElementById('pinTitle');
    const refreshBtn = document.getElementById('refreshLocation');
    
    // ローディング状態を表示
    titleInput.value = translations[currentLanguage]['location-fetching'];
    if (refreshBtn) {
        refreshBtn.disabled = true;
    }
    
    // Google Maps Geocoding APIを使用
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: lat, lng: lng };
        
        geocoder.geocode({ location: latlng }, function(results, status) {
            if (refreshBtn) {
                refreshBtn.disabled = false;
            }
            
            if (status === 'OK' && results[0]) {
                // 最適な場所名を選択
                let locationName = extractBestLocationName(results);
                titleInput.value = locationName;
            } else {
                console.warn('Geocoding failed:', status);
                titleInput.value = translations[currentLanguage]['location-unknown'];
            }
        });
    } else {
        // Geocoding APIが利用できない場合
        if (refreshBtn) {
            refreshBtn.disabled = false;
        }
        titleInput.value = translations[currentLanguage]['location-unknown'];
    }
}

// 最適な場所名を抽出する関数
function extractBestLocationName(results) {
    // 優先順位: 施設名 > 住所 > 地域名
    for (let result of results) {
        // POI（Point of Interest）や施設名を優先
        if (result.types.includes('establishment') || 
            result.types.includes('point_of_interest') ||
            result.types.includes('transit_station')) {
            return result.name || result.formatted_address;
        }
    }
    
    // 住所を使用
    for (let result of results) {
        if (result.types.includes('street_address') || 
            result.types.includes('premise')) {
            return result.formatted_address;
        }
    }
    
    // 地域名を使用
    for (let result of results) {
        if (result.types.includes('sublocality') || 
            result.types.includes('locality')) {
            return result.formatted_address;
        }
    }
    
    // フォールバック: 最初の結果を使用
    return results[0].formatted_address;
}

// 場所名をリフレッシュする関数
function refreshLocationName() {
    if (currentLatLng) {
        getLocationName(currentLatLng.lat(), currentLatLng.lng());
    } else {
        showNotification(translations[currentLanguage]['alert-location-error'], 'error');
    }
}

// ゴミ箱追加フォームの送信処理
async function handlePinSubmit(e) {
    e.preventDefault();
    
    if (!currentLatLng) {
        alert(translations[currentLanguage]['alert-location-error']);
        return;
    }
    
    const title = document.getElementById('pinTitle').value;
    
    // 選択されたゴミ種類を取得
    const selectedTrashTypes = [];
    const checkboxes = document.querySelectorAll('input[name="trashType"]:checked');
    checkboxes.forEach(checkbox => {
        const value = checkbox.value;
        const label = translations[currentLanguage][`trash-${value}`];
        selectedTrashTypes.push({ value, label });
    });
    
    // ゴミ種類が選択されていない場合の警告
    if (selectedTrashTypes.length === 0) {
        showNotification('少なくとも1つのゴミ種類を選択してください', 'error');
        return;
    }
    
    // 説明文を生成
    const description = selectedTrashTypes.map(type => type.label).join('、');
    
    const pinData = {
        lat: currentLatLng.lat(),
        lng: currentLatLng.lng(),
        title: title,
        description: description,
        trashTypes: selectedTrashTypes.map(type => type.value)
    };
    
    try {
        const response = await fetch('/api/pins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pinData)
        });
        
        if (response.ok) {
            const newPin = await response.json();
            addMarkerToMap(newPin);
            closeModal();
            showNotification(translations[currentLanguage]['success-added'], 'success');
        } else {
            throw new Error(translations[currentLanguage]['error-add']);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(translations[currentLanguage]['error-add'], 'error');
    }
}

// 地図にマーカーを追加（Google Mapスタイル）
function addMarkerToMap(pin) {
    if (typeof google !== 'undefined' && map) {
        // Google Map風のカスタムアイコン
        const trashIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#EA4336">
                    <circle cx="12" cy="12" r="11" fill="#ffffff" stroke="#EA4336" stroke-width="2"/>
                    <path d="M9 7h6l-1-1h-4l-1 1zm-1 2v8c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V9H8z" fill="#EA4336"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 24)
        };
        
        const marker = new google.maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map: map,
            title: pin.title,
            icon: trashIcon,
            animation: google.maps.Animation.DROP
        });
        
        // マーカーに検索用データを追加
        marker.searchData = {
            title: pin.title,
            description: pin.description,
            trashTypes: pin.trashTypes || []
        };
        
        // ゴミ種類のアイコンを生成
        const trashTypeIcons = {
            'newspaper': '📰',
            'plastic': '🍶',
            'cans': '🥫',
            'other': '🗑️',
            'burnable': '🔥',
            'non-burnable': '🚫🔥'
        };
        
        let trashTypesDisplay = '';
        if (pin.trashTypes && pin.trashTypes.length > 0) {
            trashTypesDisplay = pin.trashTypes.map(type => {
                const icon = trashTypeIcons[type] || '🗑️';
                const label = translations[currentLanguage][`trash-${type}`] || type;
                return `${icon} ${label}`;
            }).join('<br>');
        } else {
            // 従来の説明文を使用
            trashTypesDisplay = pin.description;
        }
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 12px; max-width: 250px; font-family: 'Roboto', Arial, sans-serif;">
                    <h3 style="margin: 0 0 8px 0; color: #EA4336; font-size: 14px; font-weight: 500;">
                        ${pin.title}
                    </h3>
                    <div style="margin: 0 0 8px 0; color: #5f6368; font-size: 13px; line-height: 1.4;">
                        <strong>対応ゴミ:</strong><br>
                        ${trashTypesDisplay}
                    </div>
                    <div style="font-size: 12px; color: #9aa0a6; margin-bottom: 12px;">
                        📍 ${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <button onclick="startNavigation(${pin.lat}, ${pin.lng}, '${pin.title.replace(/'/g, "\\'")}')" 
                                style="flex: 1; padding: 8px 12px; background: #0D53FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-family: 'Roboto', Arial, sans-serif; font-weight: 500;">
                            🧭 ${translations[currentLanguage]['navigation-btn']}
                        </button>
                    </div>
                    <button onclick="deletePin('${pin.id}')" 
                            style="width: 100%; padding: 6px 12px; background: #ea4335; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-family: 'Roboto', Arial, sans-serif;">
                        ${translations[currentLanguage]['delete-btn']}
                    </button>
                </div>
            `
        });
        
        marker.addListener('click', function() {
            // 他の情報ウィンドウを閉じる
            markers.forEach(markerData => {
                markerData.infoWindow.close();
            });
            infoWindow.open(map, marker);
        });
        
        markers.push({ id: pin.id, marker: marker, infoWindow: infoWindow });
    }
}

// 全てのゴミ箱を読み込み
async function loadPins() {
    try {
        const response = await fetch('/api/pins');
        const pins = await response.json();
        
        // 既存のマーカーをクリア
        clearMarkers();
        
        // 新しいマーカーを追加
        pins.forEach(pin => {
            addMarkerToMap(pin);
        });
    } catch (error) {
        console.error('Error loading pins:', error);
        showNotification(translations[currentLanguage]['error-load'], 'error');
    }
}

// マーカーをクリア
function clearMarkers() {
    markers.forEach(markerData => {
        markerData.marker.setMap(null);
    });
    markers = [];
}

// 通知表示（モバイル用改善）
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // モバイル用のスタイル調整
    const isMobile = window.innerWidth <= 768;
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? '70px' : '80px'};
        right: ${isMobile ? '10px' : '20px'};
        left: ${isMobile ? '10px' : 'auto'};
        padding: ${isMobile ? '12px 16px' : '15px 20px'};
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: ${isMobile ? 'none' : '300px'};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-size: ${isMobile ? '0.9rem' : '1rem'};
    `;
    
    // タイプに応じた背景色
    const colors = {
        success: 'linear-gradient(45deg, #4CAF50, #45a049)',
        error: 'linear-gradient(45deg, #f44336, #d32f2f)',
        info: 'linear-gradient(45deg, #2196F3, #1976D2)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // モバイルでは少し長めに表示
    const displayTime = isMobile ? 4000 : 3000;
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, displayTime);
}

// CSS アニメーションを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// 検索機能
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 検索語が空の場合、全てのマーカーを表示
        showAllMarkers();
        return;
    }
    
    // 検索にマッチするマーカーを見つける
    const matchingMarkers = [];
    const nonMatchingMarkers = [];
    
    markers.forEach(markerData => {
        const marker = markerData.marker;
        const searchData = marker.searchData;
        
        if (!searchData) {
            // 検索データがない場合はタイトルのみで検索
            const title = marker.getTitle().toLowerCase();
            if (title.includes(searchTerm)) {
                matchingMarkers.push(markerData);
            } else {
                nonMatchingMarkers.push(markerData);
            }
            return;
        }
        
        let isMatch = false;
        
        // タイトルでの検索
        if (searchData.title.toLowerCase().includes(searchTerm)) {
            isMatch = true;
        }
        
        // 説明文での検索
        if (searchData.description.toLowerCase().includes(searchTerm)) {
            isMatch = true;
        }
        
        // ゴミ種類での検索
        if (searchData.trashTypes && searchData.trashTypes.length > 0) {
            const trashTypeKeywords = {
                'newspaper': ['新聞', '雑誌', 'newspaper', 'magazine'],
                'plastic': ['ペット', 'ボトル', 'plastic', 'bottle', 'pet'],
                'cans': ['カン', 'ビン', '缶', 'can', 'bottle', 'glass'],
                'other': ['その他', 'ゴミ', 'other', 'trash', 'garbage'],
                'burnable': ['燃える', '可燃', 'burnable', 'combustible'],
                'non-burnable': ['燃えない', '不燃', 'non-burnable', 'incombustible']
            };
            
            for (const trashType of searchData.trashTypes) {
                const keywords = trashTypeKeywords[trashType] || [trashType];
                if (keywords.some(keyword => 
                    keyword.toLowerCase().includes(searchTerm) || 
                    searchTerm.includes(keyword.toLowerCase())
                )) {
                    isMatch = true;
                    break;
                }
            }
        }
        
        // 地域名での検索（タイトルに含まれる駅名など）
        const locationKeywords = ['駅', '公園', '広場', '口', 'station', 'park', 'plaza', 'exit'];
        if (locationKeywords.some(keyword => 
            searchData.title.toLowerCase().includes(keyword) && 
            searchTerm.includes(keyword.toLowerCase())
        )) {
            isMatch = true;
        }
        
        if (isMatch) {
            matchingMarkers.push(markerData);
        } else {
            nonMatchingMarkers.push(markerData);
        }
    });
    
    // マッチしないマーカーを非表示
    nonMatchingMarkers.forEach(markerData => {
        markerData.marker.setVisible(false);
    });
    
    // マッチするマーカーを表示
    matchingMarkers.forEach(markerData => {
        markerData.marker.setVisible(true);
    });
    
    // 検索結果の通知
    if (matchingMarkers.length === 0) {
        showNotification(`"${event.target.value}" に一致するゴミ箱が見つかりませんでした`, 'info');
    } else {
        showNotification(`${matchingMarkers.length}件のゴミ箱が見つかりました`, 'success');
        
        // 複数のマーカーがある場合、地図の表示範囲を調整
        if (matchingMarkers.length > 1) {
            const bounds = new google.maps.LatLngBounds();
            matchingMarkers.forEach(markerData => {
                bounds.extend(markerData.marker.getPosition());
            });
            map.fitBounds(bounds);
            
            // ズームが近すぎる場合は調整
            google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
                if (map.getZoom() > 16) {
                    map.setZoom(16);
                }
            });
        } else {
            // 1件の場合は中央に表示
            const firstMarker = matchingMarkers[0].marker;
            map.setCenter(firstMarker.getPosition());
            map.setZoom(16);
        }
    }
}

// 全てのマーカーを表示
function showAllMarkers() {
    markers.forEach(markerData => {
        markerData.marker.setVisible(true);
    });
}

// ズーム機能
function zoomIn() {
    if (map) {
        map.setZoom(map.getZoom() + 1);
    }
}

function zoomOut() {
    if (map) {
        map.setZoom(map.getZoom() - 1);
    }
}

// 位置追跡を開始
function startLocationTracking() {
    if (!navigator.geolocation || isWatchingLocation) {
        return;
    }
    
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // 1分間はキャッシュを使用
    };
    
    watchId = navigator.geolocation.watchPosition(
        function(position) {
            // 位置が大きく変わった場合のみ更新（バッテリー節約）
            if (shouldUpdateLocation(position)) {
                updateLocationMarker(position);
                lastKnownPosition = position;
                
                // 控えめな通知（頻繁すぎないように）
                if (Math.random() < 0.1) { // 10%の確率で通知
                    showNotification(translations[currentLanguage]['location-updated'], 'info');
                }
            }
        },
        function(error) {
            console.warn('Location tracking error:', error);
            // エラーが続く場合は追跡を停止
            if (error.code === error.PERMISSION_DENIED) {
                stopLocationTracking();
            }
        },
        options
    );
    
    isWatchingLocation = true;
    console.log('Location tracking started');
}

// 位置追跡を停止
function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        isWatchingLocation = false;
        console.log('Location tracking stopped');
    }
}

// 位置を更新すべきかどうかを判定
function shouldUpdateLocation(newPosition) {
    if (!lastKnownPosition) {
        return true;
    }
    
    const lastPos = lastKnownPosition.coords;
    const newPos = newPosition.coords;
    
    // 距離を計算（メートル単位）
    const distance = calculateDistance(
        lastPos.latitude, lastPos.longitude,
        newPos.latitude, newPos.longitude
    );
    
    // 10メートル以上移動した場合、または精度が大幅に改善した場合に更新
    return distance > 10 || (newPos.accuracy < lastPos.accuracy * 0.7);
}

// 2点間の距離を計算（ハーバーサイン公式）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// 位置マーカーを更新
function updateLocationMarker(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    if (map) {
        const currentLocation = new google.maps.LatLng(lat, lng);
        
        // 初回のみ地図の中心を移動
        if (!lastKnownPosition) {
            map.setCenter(currentLocation);
            map.setZoom(16);
        }
        
        // 既存の現在地マーカーを削除
        if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
            if (currentLocationMarker.accuracyCircle) {
                currentLocationMarker.accuracyCircle.setMap(null);
            }
        }
        
        // 青い丸のマーカーを作成
        const currentLocationIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="#0D53FF" stroke="#ffffff" stroke-width="3"/>
                    <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                    <circle cx="16" cy="16" r="3" fill="#0D53FF"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
        };
        
        currentLocationMarker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            title: translations[currentLanguage]['current-location-title'],
            icon: currentLocationIcon,
            zIndex: 10000
        });
        
        // 精度円を表示（精度が良い場合のみ）
        if (accuracy < 100) {
            const accuracyCircle = new google.maps.Circle({
                strokeColor: '#0D53FF',
                strokeOpacity: 0.4,
                strokeWeight: 2,
                fillColor: '#0D53FF',
                fillOpacity: 0.15,
                map: map,
                center: currentLocation,
                radius: accuracy
            });
            
            // マーカーと一緒に精度円も管理
            currentLocationMarker.accuracyCircle = accuracyCircle;
        }
        
        // 情報ウィンドウ
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 12px; max-width: 250px; font-family: 'Roboto', Arial, sans-serif;">
                    <h3 style="margin: 0 0 8px 0; color: #0D53FF; font-size: 14px; font-weight: 500;">
                        ${translations[currentLanguage]['current-location-title']}
                    </h3>
                    <div style="font-size: 12px; color: #9aa0a6; margin-bottom: 8px;">
                        📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}
                    </div>
                    <div style="font-size: 12px; color: #9aa0a6; margin-bottom: 8px;">
                        精度: 約${Math.round(accuracy)}m
                    </div>
                    <div style="font-size: 12px; color: #9aa0a6;">
                        ${isWatchingLocation ? '🔄 追跡中' : '📍 手動取得'}
                    </div>
                </div>
            `
        });
        
        currentLocationMarker.addListener('click', function() {
            infoWindow.open(map, currentLocationMarker);
        });
        
        if (!lastKnownPosition) {
            showNotification(translations[currentLanguage]['location-found'], 'success');
        }
    }
}

// 位置情報エラーを処理
function handleLocationError(error) {
    console.error('Geolocation error:', error);
    let errorMessage = translations[currentLanguage]['error-location'];
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = translations[currentLanguage]['error-permission'];
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = translations[currentLanguage]['error-unavailable'];
            break;
        case error.TIMEOUT:
            errorMessage = translations[currentLanguage]['error-timeout'];
            break;
    }
    
    showNotification(errorMessage, 'error');
}

// 現在地を自動取得する関数（オプション）
function autoGetCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                updateLocationMarker(position);
                lastKnownPosition = position;
                
                if (map) {
                    const currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(currentLocation);
                }
                
                // 自動的に位置追跡を開始
                startLocationTracking();
                console.log('Auto location detection successful, tracking started');
            },
            function(error) {
                // エラーは静かに処理（ユーザーに通知しない）
                console.log('Auto location detection failed:', error);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 600000 // 10分間はキャッシュを使用
            }
        );
    }
}

// ゴミ箱を削除
async function deletePin(pinId) {
    if (!confirm(translations[currentLanguage]['confirm-delete'])) {
        return;
    }
    
    try {
        const response = await fetch(`/api/pins/${pinId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // マーカーを地図から削除
            const markerIndex = markers.findIndex(m => m.id === pinId);
            if (markerIndex !== -1) {
                markers[markerIndex].marker.setMap(null);
                markers.splice(markerIndex, 1);
            }
            
            showNotification(translations[currentLanguage]['success-deleted'], 'success');
        } else {
            throw new Error(translations[currentLanguage]['error-delete']);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(translations[currentLanguage]['error-delete'], 'error');
    }
}

// 現在地にゴミ箱を追加
function addTrashCanAtCurrentLocation() {
    if (!currentLocationMarker) {
        showNotification(translations[currentLanguage]['alert-no-location'], 'error');
        return;
    }
    
    const position = currentLocationMarker.getPosition();
    currentLatLng = position;
    openModal();
}

// 削除モーダルを開く
function openDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // 削除リストを更新
    updateDeleteList();
    
    // モバイル対応: body のスクロールを無効化
    document.body.style.overflow = 'hidden';
}

// 削除モーダルを閉じる
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // body のスクロールを有効化
    document.body.style.overflow = '';
}

// 削除リストを更新
async function updateDeleteList() {
    try {
        const response = await fetch('/api/pins');
        const pins = await response.json();
        
        const deleteList = document.getElementById('deleteList');
        
        if (pins.length === 0) {
            deleteList.innerHTML = `
                <div class="empty-delete-list">
                    ${translations[currentLanguage]['no-trash-cans-delete']}
                </div>
            `;
            return;
        }
        
        deleteList.innerHTML = pins.map(pin => `
            <div class="delete-item">
                <div class="delete-item-info">
                    <div class="delete-item-title">${pin.title}</div>
                    <div class="delete-item-description">${pin.description}</div>
                </div>
                <button class="delete-item-btn" onclick="deleteTrashCan('${pin.id}')" 
                        aria-label="削除: ${pin.title.replace(/"/g, '&quot;')}">
                    ${translations[currentLanguage]['delete-btn']}
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading pins for deletion:', error);
        const deleteList = document.getElementById('deleteList');
        deleteList.innerHTML = `
            <div class="empty-delete-list">
                ${translations[currentLanguage]['error-load']}
            </div>
        `;
    }
}

// ゴミ箱を削除（削除モーダルから）
async function deleteTrashCan(pinId) {
    if (!confirm(translations[currentLanguage]['confirm-delete'])) {
        return;
    }
    
    try {
        const response = await fetch(`/api/pins/${pinId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // マーカーを地図から削除
            const markerIndex = markers.findIndex(m => m.id === pinId);
            if (markerIndex !== -1) {
                markers[markerIndex].marker.setMap(null);
                markers.splice(markerIndex, 1);
            }
            
            // 削除リストを更新
            updateDeleteList();
            
            showNotification(translations[currentLanguage]['success-deleted'], 'success');
        } else {
            throw new Error(translations[currentLanguage]['error-delete']);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(translations[currentLanguage]['error-delete'], 'error');
    }
}

// ページの可視性変更を処理
function handleVisibilityChange() {
    if (document.hidden) {
        // ページが非表示になった時
        console.log('Page hidden, location tracking continues in background');
    } else {
        // ページが表示された時
        console.log('Page visible, location tracking active');
        
        // 位置情報を即座に更新
        if (isWatchingLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    if (shouldUpdateLocation(position)) {
                        updateLocationMarker(position);
                        lastKnownPosition = position;
                    }
                },
                function(error) {
                    console.warn('Failed to get current position on visibility change:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 30000
                }
            );
        }
    }
}

// タブ切り替え機能
function switchTab(tabName) {
    // 全てのタブからactiveクラスを削除
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 選択されたタブにactiveクラスを追加
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// 現在地に戻るボタン
function recenterToCurrentLocation() {
    if (currentLocationMarker) {
        // 現在地マーカーがある場合、そこに戻る
        map.setCenter(currentLocationMarker.getPosition());
        map.setZoom(16);
        showNotification(translations[currentLanguage]['location-found'], 'success');
    } else {
        // 現在地マーカーがない場合、現在地を取得
        showNotification(translations[currentLanguage]['getting-location'], 'info');
        
        if (!navigator.geolocation) {
            showNotification(translations[currentLanguage]['error-geolocation'], 'error');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                updateLocationMarker(position);
                // 位置追跡を開始
                startLocationTracking();
            },
            function(error) {
                handleLocationError(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }
}

// ナビゲーション機能
function startNavigation(lat, lng, title) {
    // 現在地が取得されているかチェック
    let startLat, startLng;
    if (currentLocationMarker) {
        const position = currentLocationMarker.getPosition();
        startLat = position.lat();
        startLng = position.lng();
    }
    
    // デバイス判定
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    if (isMobile) {
        // モバイルデバイスの場合、選択肢を表示
        showNavigationOptions(lat, lng, title, startLat, startLng);
    } else {
        // デスクトップの場合、Google Mapsを開く
        openGoogleMaps(lat, lng, title, startLat, startLng);
    }
}

// ナビゲーション選択肢を表示
function showNavigationOptions(lat, lng, title, startLat, startLng) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    let options = `
        <div style="padding: 16px; font-family: 'Roboto', Arial, sans-serif;">
            <h3 style="margin: 0 0 16px 0; color: #3c4043; font-size: 16px; font-weight: 500;">
                ${translations[currentLanguage]['navigation-options']}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="openGoogleMaps(${lat}, ${lng}, '${title.replace(/'/g, "\\'")}', ${startLat}, ${startLng}); closeNavigationModal();" 
                        style="padding: 12px 16px; background: #4285f4; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    🗺️ ${translations[currentLanguage]['google-maps']}
                </button>
    `;
    
    if (isIOS) {
        options += `
                <button onclick="openAppleMaps(${lat}, ${lng}, '${title.replace(/'/g, "\\'")}', ${startLat}, ${startLng}); closeNavigationModal();" 
                        style="padding: 12px 16px; background: #007AFF; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    🍎 ${translations[currentLanguage]['apple-maps']}
                </button>
        `;
    }
    
    options += `
                <button onclick="openBrowserMaps(${lat}, ${lng}, '${title.replace(/'/g, "\\'")}', ${startLat}, ${startLng}); closeNavigationModal();" 
                        style="padding: 12px 16px; background: #34a853; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    🌐 ${translations[currentLanguage]['browser-maps']}
                </button>
                <button onclick="copyCoordinates(${lat}, ${lng}); closeNavigationModal();" 
                        style="padding: 12px 16px; background: #9aa0a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    📋 ${translations[currentLanguage]['copy-coordinates']}
                </button>
            </div>
            <button onclick="closeNavigationModal();" 
                    style="width: 100%; padding: 8px; background: transparent; color: #5f6368; border: none; cursor: pointer; font-size: 14px; margin-top: 12px;">
                ${translations[currentLanguage]['cancel-btn']}
            </button>
        </div>
    `;
    
    // モーダルを作成して表示
    showNavigationModal(options);
}

// Google Mapsを開く
function openGoogleMaps(lat, lng, title, startLat, startLng) {
    let url;
    if (startLat && startLng) {
        // 現在地からのルート検索
        url = `https://www.google.com/maps/dir/${startLat},${startLng}/${lat},${lng}`;
    } else {
        // 目的地のみ
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    window.open(url, '_blank');
}

// Apple Mapsを開く（iOS）
function openAppleMaps(lat, lng, title, startLat, startLng) {
    let url;
    if (startLat && startLng) {
        // 現在地からのルート検索
        url = `http://maps.apple.com/?saddr=${startLat},${startLng}&daddr=${lat},${lng}`;
    } else {
        // 目的地のみ
        url = `http://maps.apple.com/?q=${lat},${lng}`;
    }
    window.location.href = url;
}

// ブラウザでGoogle Mapsを開く
function openBrowserMaps(lat, lng, title, startLat, startLng) {
    let url;
    if (startLat && startLng) {
        // 現在地からのルート検索
        url = `https://maps.google.com/maps?saddr=${startLat},${startLng}&daddr=${lat},${lng}`;
    } else {
        // 目的地のみ
        url = `https://maps.google.com/maps?q=${lat},${lng}`;
    }
    window.open(url, '_blank');
}

// 座標をコピー
function copyCoordinates(lat, lng) {
    const coordinates = `${lat},${lng}`;
    navigator.clipboard.writeText(coordinates).then(() => {
        showNotification(translations[currentLanguage]['coordinates-copied'], 'success');
    }).catch(() => {
        // フォールバック: テキストエリアを使用
        const textArea = document.createElement('textarea');
        textArea.value = coordinates;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification(translations[currentLanguage]['coordinates-copied'], 'success');
    });
}

// ナビゲーションモーダルを表示
function showNavigationModal(content) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById('navigationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'navigationModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 320px;
        width: calc(100% - 32px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeNavigationModal();
        }
    });
}

// ナビゲーションモーダルを閉じる
function closeNavigationModal() {
    const modal = document.getElementById('navigationModal');
    if (modal) {
        modal.remove();
    }
}

// 検索候補を表示する関数
function showSearchSuggestions(searchTerm) {
    if (searchTerm.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    const suggestions = [];
    const addedSuggestions = new Set();
    
    // マーカーから候補を収集
    markers.forEach(markerData => {
        const marker = markerData.marker;
        const searchData = marker.searchData;
        
        if (searchData) {
            // タイトルから候補を抽出
            const title = searchData.title;
            if (title.toLowerCase().includes(searchTerm) && !addedSuggestions.has(title)) {
                suggestions.push({ text: title, type: 'location' });
                addedSuggestions.add(title);
            }
            
            // ゴミ種類から候補を抽出
            if (searchData.trashTypes) {
                searchData.trashTypes.forEach(trashType => {
                    const label = translations[currentLanguage][`trash-${trashType}`];
                    if (label && label.toLowerCase().includes(searchTerm) && !addedSuggestions.has(label)) {
                        suggestions.push({ text: label, type: 'trash' });
                        addedSuggestions.add(label);
                    }
                });
            }
        }
    });
    
    // 一般的な検索キーワードを追加
    const commonKeywords = [
        { text: '新聞', type: 'trash' },
        { text: 'ペットボトル', type: 'trash' },
        { text: 'カン・ビン', type: 'trash' },
        { text: '燃えるゴミ', type: 'trash' },
        { text: '燃えないゴミ', type: 'trash' },
        { text: '駅', type: 'location' },
        { text: '公園', type: 'location' }
    ];
    
    commonKeywords.forEach(keyword => {
        if (keyword.text.toLowerCase().includes(searchTerm) && !addedSuggestions.has(keyword.text)) {
            suggestions.push(keyword);
            addedSuggestions.add(keyword.text);
        }
    });
    
    // 候補を表示（最大5件）
    displaySearchSuggestions(suggestions.slice(0, 5));
}

// 検索候補を表示
function displaySearchSuggestions(suggestions) {
    let suggestionBox = document.getElementById('searchSuggestions');
    
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'searchSuggestions';
        suggestionBox.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(suggestionBox);
        }
    }
    
    if (suggestions.length === 0) {
        suggestionBox.style.display = 'none';
        return;
    }
    
    suggestionBox.innerHTML = suggestions.map((suggestion, index) => {
        const icon = suggestion.type === 'trash' ? '🗑️' : '📍';
        return `
            <div class="suggestion-item" data-suggestion="${suggestion.text}" 
                 style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #3c4043;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${suggestion.text}</span>
            </div>
        `;
    }).join('');
    
    suggestionBox.style.display = 'block';
    
    // 候補クリック時の処理
    suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const suggestionText = this.getAttribute('data-suggestion');
            const searchBox = document.getElementById('searchBox');
            searchBox.value = suggestionText;
            handleSearch({ target: searchBox });
            hideSearchSuggestions();
        });
        
        // ホバー効果
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// 検索候補を非表示
function hideSearchSuggestions() {
    const suggestionBox = document.getElementById('searchSuggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
} 