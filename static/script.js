// グローバル変数
let map;
let markers = [];
let isPinMode = false;
let currentLatLng = null;
let currentLanguage = 'ja'; // デフォルトは日本語

// 翻訳辞書
const translations = {
    ja: {
        'page-title': 'ゴミ箱マップ - 日本のゴミ箱位置マッピング',
        'app-title': '🗑️ ゴミ箱マップ',
        'app-description': '日本のゴミ箱位置をマッピング・共有するアプリ',
        'add-mode-btn': '🗑️ ゴミ箱追加モード: OFF',
        'add-mode-btn-on': '🗑️ ゴミ箱追加モード: ON',
        'clear-all-btn': '🧹 全ゴミ箱削除',
        'trash-list-title': '🗑️ ゴミ箱一覧',
        'modal-title': '🗑️ 新しいゴミ箱を追加',
        'location-label': '場所・名称:',
        'location-placeholder': '例: 渋谷駅ハチ公前',
        'details-label': '詳細情報:',
        'details-placeholder': '例: 改札外、自動販売機横、24時間利用可能',
        'add-btn': '追加',
        'cancel-btn': 'キャンセル',
        'delete-btn': '削除',
        'no-trash-cans': 'ゴミ箱がありません',
        'fallback-title': 'ゴミ箱マップ',
        'fallback-desc1': 'Google Maps APIキーが設定されていません',
        'fallback-desc2': 'デモ用の簡易地図として動作します',
        'fallback-add-btn': '🗑️ ゴミ箱を追加（デモ）',
        'confirm-delete': 'このゴミ箱を削除しますか？',
        'confirm-delete-all': '全てのゴミ箱を削除しますか？',
        'alert-enable-mode': 'まずゴミ箱追加モードをONにしてください',
        'alert-location-error': '位置情報が取得できませんでした',
        'success-added': 'ゴミ箱が追加されました！',
        'success-deleted': 'ゴミ箱が削除されました',
        'success-cleared': '全てのゴミ箱が削除されました',
        'error-add': 'ゴミ箱の追加に失敗しました',
        'error-delete': 'ゴミ箱の削除に失敗しました',
        'error-load': 'ゴミ箱の読み込みに失敗しました'
    },
    en: {
        'page-title': 'Trash Can Map - Mapping Trash Can Locations in Japan',
        'app-title': '🗑️ Trash Can Map',
        'app-description': 'App for mapping and sharing trash can locations in Japan',
        'add-mode-btn': '🗑️ Add Trash Can Mode: OFF',
        'add-mode-btn-on': '🗑️ Add Trash Can Mode: ON',
        'clear-all-btn': '🧹 Clear All Trash Cans',
        'trash-list-title': '🗑️ Trash Can List',
        'modal-title': '🗑️ Add New Trash Can',
        'location-label': 'Location/Name:',
        'location-placeholder': 'e.g. Shibuya Station Hachiko Square',
        'details-label': 'Details:',
        'details-placeholder': 'e.g. Outside ticket gate, next to vending machine, 24/7 available',
        'add-btn': 'Add',
        'cancel-btn': 'Cancel',
        'delete-btn': 'Delete',
        'no-trash-cans': 'No trash cans found',
        'fallback-title': 'Trash Can Map',
        'fallback-desc1': 'Google Maps API key not configured',
        'fallback-desc2': 'Running in demo mode with simplified map',
        'fallback-add-btn': '🗑️ Add Trash Can (Demo)',
        'confirm-delete': 'Delete this trash can?',
        'confirm-delete-all': 'Delete all trash cans?',
        'alert-enable-mode': 'Please enable Add Trash Can Mode first',
        'alert-location-error': 'Could not get location information',
        'success-added': 'Trash can added successfully!',
        'success-deleted': 'Trash can deleted',
        'success-cleared': 'All trash cans deleted',
        'error-add': 'Failed to add trash can',
        'error-delete': 'Failed to delete trash can',
        'error-load': 'Failed to load trash cans'
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadPins();
    initializeLanguage();
});

// 言語初期化
function initializeLanguage() {
    // ブラウザの言語設定を確認
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('en')) {
        currentLanguage = 'en';
        switchLanguage('en');
    }
}

// 言語切り替え
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // HTMLのlang属性を更新
    document.documentElement.lang = lang;
    
    // data-lang属性を持つ要素を翻訳
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'TITLE') {
                element.textContent = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // data-lang-placeholder属性を持つ要素のプレースホルダーを翻訳
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // 言語切り替えボタンのテキストを更新
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'ja' ? '🌐 English' : '🌐 日本語';
    }
    
    // 動的コンテンツを再読み込み
    updatePinsList();
    
    // ピン追加モードボタンの状態を更新
    updatePinModeButton();
}

// ピン追加モードボタンの状態を更新
function updatePinModeButton() {
    const button = document.getElementById('togglePinMode');
    if (button) {
        const key = isPinMode ? 'add-mode-btn-on' : 'add-mode-btn';
        button.textContent = translations[currentLanguage][key];
    }
}

// イベントリスナーの初期化
function initializeEventListeners() {
    // ゴミ箱追加モードの切り替え
    document.getElementById('togglePinMode').addEventListener('click', togglePinMode);
    
    // 全ゴミ箱削除
    document.getElementById('clearAllPins').addEventListener('click', clearAllPins);
    
    // 言語切り替え
    document.getElementById('langToggle').addEventListener('click', function() {
        const newLang = currentLanguage === 'ja' ? 'en' : 'ja';
        switchLanguage(newLang);
    });
    
    // モーダル関連
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('pinModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // フォーム送信
    document.getElementById('pinForm').addEventListener('submit', handlePinSubmit);
}

// Google Maps初期化
function initMap() {
    // 東京駅を中心とした地図
    const center = { lat: 35.6812, lng: 139.7671 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // 地図クリックイベント
    map.addListener('click', function(e) {
        if (isPinMode) {
            currentLatLng = e.latLng;
            openModal();
        }
    });
    
    // 既存のゴミ箱を読み込み
    loadPins();
}

// フォールバック地図初期化（Google Maps APIが利用できない場合）
function initMapFallback() {
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = `
        <div class="fallback-map">
            <div class="icon">🗑️</div>
            <div>
                <h3>${translations[currentLanguage]['fallback-title']}</h3>
                <p>${translations[currentLanguage]['fallback-desc1']}</p>
                <p>${translations[currentLanguage]['fallback-desc2']}</p>
                <button onclick="simulateMapClick()" class="btn btn-primary" style="margin-top: 20px;">
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
    if (isPinMode) {
        // ランダムな座標を生成（東京周辺）
        const lat = 35.6812 + (Math.random() - 0.5) * 0.1;
        const lng = 139.7671 + (Math.random() - 0.5) * 0.1;
        currentLatLng = { lat: () => lat, lng: () => lng };
        openModal();
    } else {
        alert(translations[currentLanguage]['alert-enable-mode']);
    }
}

// ゴミ箱追加モードの切り替え
function togglePinMode() {
    isPinMode = !isPinMode;
    updatePinModeButton();
    
    // カーソルスタイルの変更
    document.getElementById('map').style.cursor = isPinMode ? 'crosshair' : 'default';
}

// モーダルを開く
function openModal() {
    document.getElementById('pinModal').style.display = 'block';
    document.getElementById('pinTitle').focus();
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('pinModal').style.display = 'none';
    document.getElementById('pinForm').reset();
    currentLatLng = null;
}

// ゴミ箱追加フォームの送信処理
async function handlePinSubmit(e) {
    e.preventDefault();
    
    if (!currentLatLng) {
        alert(translations[currentLanguage]['alert-location-error']);
        return;
    }
    
    const title = document.getElementById('pinTitle').value;
    const description = document.getElementById('pinDescription').value;
    
    const pinData = {
        lat: currentLatLng.lat(),
        lng: currentLatLng.lng(),
        title: title,
        description: description
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
            updatePinsList();
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

// 地図にマーカーを追加（ゴミ箱アイコン使用）
function addMarkerToMap(pin) {
    if (typeof google !== 'undefined' && map) {
        // カスタムゴミ箱アイコン
        const trashIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4CAF50">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
        };
        
        const marker = new google.maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map: map,
            title: pin.title,
            icon: trashIcon,
            animation: google.maps.Animation.DROP
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 250px;">
                    <h3 style="margin: 0 0 10px 0; color: #333; display: flex; align-items: center;">
                        🗑️ ${pin.title}
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #666;">${pin.description}</p>
                    <div style="font-size: 0.8em; color: #999; margin-bottom: 10px;">
                        📍 ${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}
                    </div>
                    <button onclick="deletePin('${pin.id}')" 
                            style="margin-top: 10px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${translations[currentLanguage]['delete-btn']}
                    </button>
                </div>
            `
        });
        
        marker.addListener('click', function() {
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
        
        updatePinsList();
    } catch (error) {
        console.error('Error loading pins:', error);
        showNotification(translations[currentLanguage]['error-load'], 'error');
    }
}

// ゴミ箱一覧の更新
async function updatePinsList() {
    try {
        const response = await fetch('/api/pins');
        const pins = await response.json();
        
        const pinsList = document.getElementById('pinsList');
        
        if (pins.length === 0) {
            pinsList.innerHTML = `<p style="color: #999; text-align: center;">${translations[currentLanguage]['no-trash-cans']}</p>`;
            return;
        }
        
        pinsList.innerHTML = pins.map(pin => `
            <div class="pin-item" onclick="focusPin('${pin.id}')">
                <h4>🗑️ ${pin.title}</h4>
                <p>${pin.description}</p>
                <div class="coordinates">
                    📍 ${pin.lat.toFixed(6)}, ${pin.lng.toFixed(6)}
                </div>
                <div class="pin-actions">
                    <button onclick="event.stopPropagation(); deletePin('${pin.id}')" 
                            class="btn btn-danger btn-small">${translations[currentLanguage]['delete-btn']}</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating pins list:', error);
    }
}

// ゴミ箱にフォーカス
function focusPin(pinId) {
    const markerData = markers.find(m => m.id === pinId);
    if (markerData && map) {
        map.setCenter(markerData.marker.getPosition());
        map.setZoom(16);
        markerData.infoWindow.open(map, markerData.marker);
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
            
            updatePinsList();
            showNotification(translations[currentLanguage]['success-deleted'], 'success');
        } else {
            throw new Error(translations[currentLanguage]['error-delete']);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(translations[currentLanguage]['error-delete'], 'error');
    }
}

// 全ゴミ箱を削除
async function clearAllPins() {
    if (!confirm(translations[currentLanguage]['confirm-delete-all'])) {
        return;
    }
    
    try {
        const response = await fetch('/api/pins');
        const pins = await response.json();
        
        // 全てのゴミ箱を削除
        for (const pin of pins) {
            await fetch(`/api/pins/${pin.id}`, { method: 'DELETE' });
        }
        
        clearMarkers();
        updatePinsList();
        showNotification(translations[currentLanguage]['success-cleared'], 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification(translations[currentLanguage]['error-delete'], 'error');
    }
}

// マーカーをクリア
function clearMarkers() {
    markers.forEach(markerData => {
        markerData.marker.setMap(null);
    });
    markers = [];
}

// 通知表示
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
    
    // 3秒後に自動削除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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