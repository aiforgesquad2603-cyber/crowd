from pydantic import BaseModel
from typing import Optional

# Existing Models
class GuardModel(BaseModel):
    name: str
    mobile: str
    gate: str
    status: Optional[str] = "Active"

class CameraModel(BaseModel):
    gate: str
    rtsp_url: str
    status: str = "Offline"

# ==========================================
# --- NEW: USER AUTHENTICATION MODELS ---
# ==========================================
class UserModel(BaseModel):
    name: str
    email: str
    mobile: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str