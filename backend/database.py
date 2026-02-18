import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Connect to MongoDB (Defaults to local if no .env is found)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# PRO-TIP: Added a 5-second timeout. If MongoDB is off, it won't hang your terminal forever!
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

# Select the database named "crowdguardai"
db = client.crowdguardai

try:
    # Ping the database to verify the connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
    
    # Optional: Just to print what collections exist when server starts
    collections = db.list_collection_names()
    print(f"📂 Active Collections: {collections}")
    
except Exception as e:
    print(f"❌ MongoDB connection error (Is MongoDB running?): {e}")