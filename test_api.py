import requests
import os

print("Testing Backend Database Endpoints...")

# Create a dummy image
with open("dummy.jpg", "wb") as f:
    f.write(b"dummy image content just for testing upload")

try:
    # Test POST /api/analyze
    print("1. Testing POST /api/analyze...")
    with open("dummy.jpg", "rb") as f:
        files = {"file": ("dummy.jpg", f, "image/jpeg")}
        response = requests.post("http://localhost:8000/api/analyze", files=files)
        
    print(f"Response Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Saved Record ID: {data.get('id')}")
        print(f"Prediction: {data.get('prediction')} (Conf: {data.get('confidence')})")
        print(f"Saved Image Path: {data.get('image_path')}")
    else:
        print(f"Error: {response.text}")

    # Test GET /api/history
    print("\n2. Testing GET /api/history...")
    response = requests.get("http://localhost:8000/api/history")
    print(f"Response Status: {response.status_code}")
    if response.status_code == 200:
        history = response.json()
        print(f"Success! Found {len(history)} records in the database.")
        if len(history) > 0:
            print(f"Most recent record: ID {history[0].get('id')} - {history[0].get('prediction')} on {history[0].get('date')}")
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Failed to connect to backend: {e}")
    print("Is the backend running? Try running: uvicorn backend.main:app --host 0.0.0.0 --port 8000")

# cleanup
if os.path.exists("dummy.jpg"):
    os.remove("dummy.jpg")
