from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict
import uuid
import os
import json
from dotenv import load_dotenv

# .envファイルから環境変数を読み込み
load_dotenv()

app = FastAPI(title="ゴミ箱マップ", description="日本のゴミ箱位置をマッピングするアプリ")

# 静的ファイルの配信
app.mount("/static", StaticFiles(directory="static"), name="static")

# 環境変数からAPIキーを取得（セキュリティ向上のため）
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# JSONファイルのパス
DATA_FILE = "pins_data.json"

def load_pins_from_file() -> Dict[str, Dict]:
    """JSONファイルからゴミ箱データを読み込み"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            return {}
    except (json.JSONDecodeError, IOError) as e:
        print(f"Error loading pins data: {e}")
        return {}

def save_pins_to_file(pins_data: Dict[str, Dict]) -> None:
    """ゴミ箱データをJSONファイルに保存"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(pins_data, f, ensure_ascii=False, indent=2)
    except IOError as e:
        print(f"Error saving pins data: {e}")

# ゴミ箱データを保存するストレージ（JSONファイルから読み込み）
pins_storage: Dict[str, Dict] = load_pins_from_file()

class Pin(BaseModel):
    lat: float
    lng: float
    title: str
    description: str = ""
    trashTypes: List[str] = []

class PinResponse(BaseModel):
    id: str
    lat: float
    lng: float
    title: str
    description: str
    trashTypes: List[str] = []

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
    save_pins_to_file(pins_storage)
    return PinResponse(id=pin_id, **pin_data)

@app.delete("/api/pins/{pin_id}")
async def delete_pin(pin_id: str):
    """ゴミ箱を削除"""
    if pin_id not in pins_storage:
        raise HTTPException(status_code=404, detail="Pin not found")
    del pins_storage[pin_id]
    save_pins_to_file(pins_storage)
    return {"message": "Pin deleted successfully"}

@app.put("/api/pins/{pin_id}", response_model=PinResponse)
async def update_pin(pin_id: str, pin: Pin):
    """ゴミ箱情報を更新"""
    if pin_id not in pins_storage:
        raise HTTPException(status_code=404, detail="Pin not found")
    pin_data = pin.dict()
    pins_storage[pin_id] = pin_data
    save_pins_to_file(pins_storage)
    return PinResponse(id=pin_id, **pin_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 