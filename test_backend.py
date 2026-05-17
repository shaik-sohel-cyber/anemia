import os
import sys
import numpy as np
import cv2

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from model_utils import analyze_image_with_model

# Create a dummy image
img = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
is_success, buffer = cv2.imencode(".jpg", img)
image_bytes = buffer.tobytes()

print("Testing analyze_image_with_model...")
result = analyze_image_with_model(image_bytes)
print("Prediction:", result['prediction'])
print("Confidence:", result['confidence'])
print("Features:", result['features'])
print("Waveform length:", len(result['waveform']))
print("SUCCESS!")
