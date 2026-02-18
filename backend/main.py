from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from database import db
from models import GuardModel, CameraModel, UserModel, LoginModel, ResetPasswordModel
from bson import ObjectId
import time
import requests
import os
import tempfile
import cv2
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="CrowdGuardAI Backend")

# =====================================================
# BASIC HEALTH + DB TEST ROUTES  ✅ (NEW)
# =====================================================

@app.get("/")
def root():
    return {"status": "CrowdGuardAI Backend Running"}

@app.get("/test-db")
def test_db():
    db.test.insert_one({"status": "ok", "time": datetime.utcnow()})
    return {"msg": "MongoDB connected successfully"}

# =====================================================
# CORS FIX ✅ (UPDATED)
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Netlify + localhost + production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# OPENCV HUMAN DETECTOR
# =====================================================

print("Loading OpenCV AI Human Detector...")
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
print("✅ AI Model Loaded Successfully!")

# =====================================================
# HELPER
# =====================================================

def format_guard(guard) -> dict:
    return {
        "id": str(guard["_id"]),
        "name": guard["name"],
        "mobile": guard["mobile"],
        "gate": guard["gate"],
        "status": guard.get("status", "Active")
    }

# =====================================================
# 1. GUARDS API
# =====================================================

@app.post("/api/guards")
def create_guard(guard: GuardModel):
    new_guard = db.guards.insert_one(guard.dict())
    created_guard = db.guards.find_one({"_id": new_guard.inserted_id})
    return format_guard(created_guard)

@app.get("/api/guards")
def get_all_guards(user_email: str):
    return [format_guard(g) for g in db.guards.find({"user_email": user_email})]

@app.delete("/api/guards/{guard_id}")
def delete_guard(guard_id: str):
    if db.guards.delete_one({"_id": ObjectId(guard_id)}).deleted_count:
        return {"message": "Guard deleted successfully"}
    raise HTTPException(status_code=404, detail="Guard not found")

# =====================================================
# 2. CAMERAS API
# =====================================================

@app.post("/api/cameras")
def save_camera(camera: CameraModel):
    db.cameras.update_one(
        {"gate": camera.gate, "user_email": camera.user_email},
        {"$set": camera.dict()},
        upsert=True
    )
    return {"message": "Camera saved successfully"}

@app.get("/api/cameras")
def get_cameras(user_email: str):
    return [
        {
            "gate": cam["gate"],
            "rtsp_url": cam.get("rtsp_url", ""),
            "status": cam.get("status", "Offline")
        }
        for cam in db.cameras.find({"user_email": user_email})
    ]

# =====================================================
# 3. VIDEO ANALYSIS API
# =====================================================

@app.post("/api/analyze-video")
async def analyze_video(
    file: UploadFile = File(...),
    gate: str = Form(...),
    user_email: str = Form(...)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    cap = cv2.VideoCapture(temp_path)
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (640, 480))
        boxes, _ = hog.detectMultiScale(frame)
        count = max(count, len(boxes))

    cap.release()
    os.remove(temp_path)

    return {
        "gate": gate,
        "crowdCount": count,
        "thresholdExceeded": count > 3
    }

# =====================================================
# 4. LIVE STREAM API
# =====================================================

def generate_frames(rtsp):
    cap = cv2.VideoCapture(rtsp)
    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.resize(frame, (640, 480))
        boxes, _ = hog.detectMultiScale(frame)

        for (x, y, w, h) in boxes:
            cv2.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)

        ret, buffer = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )

@app.get("/api/video-feed/{gate}")
def video_feed(gate: str, user_email: str):
    cam = db.cameras.find_one({"gate": gate, "user_email": user_email})
    if not cam:
        raise HTTPException(status_code=404, detail="Camera not found")
    return StreamingResponse(
        generate_frames(cam["rtsp_url"]),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# =====================================================
# 5. ANALYTICS API
# =====================================================

@app.get("/api/analytics")
def analytics(user_email: str):
    guards = list(db.guards.find({"user_email": user_email}))
    cameras = list(db.cameras.find({"user_email": user_email}))
    return {
        "guards": len(guards),
        "cameras": len(cameras),
        "incidents": sum(1 for g in guards if g.get("status") == "Responding")
    }

# =====================================================
# 6. AUTH APIs
# =====================================================

@app.post("/api/signup")
def signup(user: UserModel):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")
    db.users.insert_one(user.dict())
    return {"message": "Signup success"}

@app.post("/api/login")
def login(data: LoginModel):
    user = db.users.find_one(data.dict())
    if not user:
        raise HTTPException(401, "Invalid credentials")
    return {"name": user["name"], "email": user["email"]}

@app.post("/api/reset-password")
def reset(data: ResetPasswordModel):
    db.users.update_one({"email": data.email}, {"$set": {"password": data.new_password}})
    return {"message": "Password updated"}
