from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict
import uuid
import os
from dotenv import load_dotenv

# .envファイルから環境変数を読み込み
load_dotenv()

app = FastAPI(title="ゴミ箱マップ", description="日本のゴミ箱位置をマッピングするアプリ")

# 静的ファイルの配信
app.mount("/static", StaticFiles(directory="static"), name="static")

# 環境変数からAPIキーを取得（セキュリティ向上のため）
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# ゴミ箱データを保存するメモリ内ストレージ（本来はDBを使用）
# 仮のゴミ箱データを初期化
pins_storage: Dict[str, Dict] = {
    "1": {
        "lat": 35.6812,
        "lng": 139.7671,
        "title": "東京駅 八重洲口 / Tokyo Station Yaesu Exit",
        "description": "改札外コンコース、自動販売機横 / Outside ticket gate, next to vending machines"
    },
    "2": {
        "lat": 35.6762,
        "lng": 139.7653,
        "title": "有楽町駅前 / Yurakucho Station Front",
        "description": "駅前広場、喫煙所近く / Station plaza, near smoking area"
    },
    "3": {
        "lat": 35.6586,
        "lng": 139.7454,
        "title": "新橋駅 SL広場 / Shimbashi Station SL Plaza",
        "description": "SL前の広場、ベンチ横 / Plaza in front of SL, next to benches"
    },
    "4": {
        "lat": 35.6284,
        "lng": 139.7387,
        "title": "品川駅 港南口 / Shinagawa Station Konan Exit",
        "description": "タクシー乗り場前 / In front of taxi stand"
    },
    "5": {
        "lat": 35.6580,
        "lng": 139.7016,
        "title": "渋谷駅 ハチ公前 / Shibuya Station Hachiko Square",
        "description": "ハチ公像近く、交番横 / Near Hachiko statue, next to police box"
    },
    "6": {
        "lat": 35.7295,
        "lng": 139.7109,
        "title": "池袋駅 東口 / Ikebukuro Station East Exit",
        "description": "東口駅前広場 / East exit station plaza"
    },
    "7": {
        "lat": 35.6895,
        "lng": 139.6917,
        "title": "新宿駅 南口 / Shinjuku Station South Exit",
        "description": "バスタ新宿前 / In front of Busta Shinjuku"
    },
    "8": {
        "lat": 35.7101,
        "lng": 139.8107,
        "title": "上野駅 公園口 / Ueno Station Park Exit",
        "description": "上野公園入口付近 / Near Ueno Park entrance"
    },
    "9": {
        "lat": 35.6803,
        "lng": 139.7690,
        "title": "秋葉原駅 電気街口 / Akihabara Station Electric Town Exit",
        "description": "駅前広場、バス停横 / Station plaza, next to bus stop"
    },
    "10": {
        "lat": 35.6938,
        "lng": 139.7036,
        "title": "原宿駅 竹下口 / Harajuku Station Takeshita Exit",
        "description": "竹下通り入口 / Takeshita Street entrance"
    }
}

class Pin(BaseModel):
    lat: float
    lng: float
    title: str
    description: str = ""

class PinResponse(BaseModel):
    id: str
    lat: float
    lng: float
    title: str
    description: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """メインページを返す"""
    with open("static/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/api/config")
async def get_config():
    """フロントエンド用の設定を返す（APIキーは含めない場合もある）"""
    # 本番環境では、APIキーをフロントエンドに送信しない方が安全
    # ここでは開発用として送信するが、本番では削除を推奨
    return {
        "google_maps_api_key": GOOGLE_MAPS_API_KEY if GOOGLE_MAPS_API_KEY != "YOUR_API_KEY" else None
    }

@app.get("/api/pins", response_model=List[PinResponse])
async def get_pins():
    """全てのゴミ箱を取得"""
    return [
        PinResponse(id=pin_id, **pin_data)
        for pin_id, pin_data in pins_storage.items()
    ]

@app.post("/api/pins", response_model=PinResponse)
async def create_pin(pin: Pin):
    """新しいゴミ箱を追加"""
    pin_id = str(uuid.uuid4())
    pin_data = pin.dict()
    pins_storage[pin_id] = pin_data
    return PinResponse(id=pin_id, **pin_data)

@app.delete("/api/pins/{pin_id}")
async def delete_pin(pin_id: str):
    """ゴミ箱を削除"""
    if pin_id not in pins_storage:
        raise HTTPException(status_code=404, detail="Pin not found")
    del pins_storage[pin_id]
    return {"message": "Pin deleted successfully"}

@app.put("/api/pins/{pin_id}", response_model=PinResponse)
async def update_pin(pin_id: str, pin: Pin):
    """ゴミ箱情報を更新"""
    if pin_id not in pins_storage:
        raise HTTPException(status_code=404, detail="Pin not found")
    pin_data = pin.dict()
    pins_storage[pin_id] = pin_data
    return PinResponse(id=pin_id, **pin_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 