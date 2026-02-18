import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load variables from .env file (for local testing)
load_dotenv()

# Get the URI from Render Environment Variables (Fallback to local)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

print(f"🔗 Attempting to connect to MongoDB... (URI starts with: {MONGO_URI[:15]}...)")

# PRO-TIP: Added a 5-second timeout.
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

try:
    # Force a ping to verify the Cloud connection immediately
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas Cloud!")
    
    # Safely select the exact database
    db = client.get_database("crowdguardai")
    
    # Optional: Print collections when server starts
    collections = db.list_collection_names()
    print(f"📂 Active Collections: {collections}")
    
except Exception as e:
    print("❌ MongoDB connection error!")
    print(f"Error Details: {e}")
    print("⚠️ Check if your Render MONGO_URI is correct and IP Whitelist is 0.0.0.0/0")