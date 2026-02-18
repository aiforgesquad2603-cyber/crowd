from pydantic import BaseModel
from typing import Optional

# ==========================================
# --- ACCOUNT-LINKED MODELS (Multi-Tenant) ---
# ==========================================
class GuardModel(BaseModel):
    user_email: str  # <-- Ithu thaan account-ah pirikkum!
    name: str
    mobile: str
    gate: str
    status: Optional[str] = "Active"

class CameraModel(BaseModel):
    user_email: str  # <-- Ithu thaan account-ah pirikkum!
    gate: str
    rtsp_url: str
    status: str = "Offline"


# ==========================================
# --- USER AUTHENTICATION MODELS ---
# ==========================================
class UserModel(BaseModel):
    name: str
    email: str
    mobile: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str

class ResetPasswordModel(BaseModel):
    email: str
    new_password: str