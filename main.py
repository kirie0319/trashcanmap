from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Float, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# .envファイルから環境変数を読み込み
load_dotenv()

app = FastAPI(title="ゴミ箱マップ", description="日本のゴミ箱位置をマッピングするアプリ")

# 静的ファイルの配信
app.mount("/static", StaticFiles(directory="static"), name="static")

# 環境変数からAPIキーとデータベースURLを取得
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemyの設定
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# データベースモデル
class TrashCan(Base):
    __tablename__ = "trash_cans"
    
    id = Column(String, primary_key=True, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    trash_types = Column(JSON, default=list)

# テーブル作成
Base.metadata.create_all(bind=engine)

# データベースセッション取得
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydanticモデル
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
async def get_pins(db: Session = Depends(get_db)):
    """全てのゴミ箱を取得"""
    trash_cans = db.query(TrashCan).all()
    return [
        PinResponse(
            id=trash_can.id,
            lat=trash_can.lat,
            lng=trash_can.lng,
            title=trash_can.title,
            description=trash_can.description,
            trashTypes=trash_can.trash_types or []
        )
        for trash_can in trash_cans
    ]

@app.post("/api/pins", response_model=PinResponse)
async def create_pin(pin: Pin, db: Session = Depends(get_db)):
    """新しいゴミ箱を追加"""
    pin_id = str(uuid.uuid4())
    
    db_trash_can = TrashCan(
        id=pin_id,
        lat=pin.lat,
        lng=pin.lng,
        title=pin.title,
        description=pin.description,
        trash_types=pin.trashTypes
    )
    
    db.add(db_trash_can)
    db.commit()
    db.refresh(db_trash_can)
    
    return PinResponse(
        id=db_trash_can.id,
        lat=db_trash_can.lat,
        lng=db_trash_can.lng,
        title=db_trash_can.title,
        description=db_trash_can.description,
        trashTypes=db_trash_can.trash_types or []
    )

@app.delete("/api/pins/{pin_id}")
async def delete_pin(pin_id: str, db: Session = Depends(get_db)):
    """ゴミ箱を削除"""
    db_trash_can = db.query(TrashCan).filter(TrashCan.id == pin_id).first()
    if not db_trash_can:
        raise HTTPException(status_code=404, detail="Pin not found")
    
    db.delete(db_trash_can)
    db.commit()
    return {"message": "Pin deleted successfully"}

@app.put("/api/pins/{pin_id}", response_model=PinResponse)
async def update_pin(pin_id: str, pin: Pin, db: Session = Depends(get_db)):
    """ゴミ箱情報を更新"""
    db_trash_can = db.query(TrashCan).filter(TrashCan.id == pin_id).first()
    if not db_trash_can:
        raise HTTPException(status_code=404, detail="Pin not found")
    
    db_trash_can.lat = pin.lat
    db_trash_can.lng = pin.lng
    db_trash_can.title = pin.title
    db_trash_can.description = pin.description
    db_trash_can.trash_types = pin.trashTypes
    
    db.commit()
    db.refresh(db_trash_can)
    
    return PinResponse(
        id=db_trash_can.id,
        lat=db_trash_can.lat,
        lng=db_trash_can.lng,
        title=db_trash_can.title,
        description=db_trash_can.description,
        trashTypes=db_trash_can.trash_types or []
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 