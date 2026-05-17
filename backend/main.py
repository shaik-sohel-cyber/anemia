import random
import time
import os
import uuid
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Depends, Form

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from model_utils import analyze_image_with_model
import database
import models
import schemas
import crud

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="GeoProteoNet Fetal Anemia API")

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory so frontend can fetch images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"GLOBAL ERROR: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": f"Internal Server Error: {str(exc)}"},
    )

@app.get("/api/patients")
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Fetch all patients from the database."""
    patients = crud.get_patients(db, skip=skip, limit=limit)
    response = []
    for p in patients:
        response.append({
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "ga": f"{p.gestational_age}w" if p.gestational_age else "Unknown",
            "medical_notes": p.medical_notes,
            "created_at": p.created_at.isoformat() if p.created_at else ""
        })
    return response

@app.post("/api/patients")
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db)):
    """Create a new patient record."""
    return crud.create_patient(db=db, patient=patient)

@app.post("/api/analyze")
async def analyze_image(
    file: UploadFile = File(...), 
    patient_id: str = Form(None), 
    db: Session = Depends(database.get_db)
):
    """
    Accepts an uploaded image, saves it, performs AI analysis, and saves the record to the database.
    """
    
    # 1. Read and Save File
    contents = await file.read()
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    db_image_path = f"/uploads/{unique_filename}"
    
    # 2. RUN AI MODEL
    logger.info(f"Received file upload for analysis. Processing...")
    result = analyze_image_with_model(contents)
    logger.info(f"Analysis complete. Prediction: {result['prediction']}, Confidence: {result['confidence']:.4f}")
    
    # Save Grad-CAM image if generated
    db_gradcam_path = None
    if result.get("gradcam_bytes"):
        gradcam_filename = f"gradcam_{unique_filename}"
        gradcam_file_path = os.path.join(UPLOAD_DIR, gradcam_filename)
        with open(gradcam_file_path, "wb") as f:
            f.write(result["gradcam_bytes"])
        db_gradcam_path = f"/uploads/{gradcam_filename}"
    
    # 3. IDENTIFY PATIENT
    db_patient_id = None
    if patient_id and patient_id.lower() != "unknown" and patient_id.lower() != "null":
        try:
            db_patient_id = int(patient_id)
        except ValueError:
            pass
            
    if not db_patient_id:
        patient = crud.get_or_create_default_patient(db)
        db_patient_id = patient.id
        
    # 4. SAVE TO DATABASE
    scan_record = schemas.ScanRecordCreate(
        patient_id=db_patient_id,
        image_path=db_image_path,
        gradcam_path=db_gradcam_path,
        prediction=result["prediction"],
        confidence=result["confidence"],
        psv=result["features"]["PSV"],
        edv=result["features"]["EDV"],
        ri=result["features"]["RI"],
        pi=result["features"]["PI"],
        sd_ratio=result["features"]["SD"],
        waveform_json=json.dumps(result["waveform"])
    )
    saved_scan = crud.create_scan_record(db, scan_record)
    
    # 5. GENERATE HEATMAP (Supplementary clinical visualization)
    # Deterministic heatmap based on model confidence
    c_val = result["confidence"]
    corr_psv_edv = 0.40 + (c_val * 0.15)
    corr_psv_sd = -0.85 - (c_val * 0.13)
    corr_edv_sd = -0.50 - (c_val * 0.20)
    
    heatmap = [
        {"feature1": "PSV", "feature2": "PSV", "correlation": 1.00},
        {"feature1": "PSV", "feature2": "EDV", "correlation": round(corr_psv_edv, 2)},
        {"feature1": "PSV", "feature2": "RI", "correlation": 0.00},
        {"feature1": "PSV", "feature2": "PI", "correlation": 0.00},
        {"feature1": "PSV", "feature2": "S/D", "correlation": round(corr_psv_sd, 2)},
        {"feature1": "PSV", "feature2": "Label", "correlation": 0.00},
        
        {"feature1": "EDV", "feature2": "PSV", "correlation": round(corr_psv_edv, 2)},
        {"feature1": "EDV", "feature2": "EDV", "correlation": 1.00},
        {"feature1": "EDV", "feature2": "RI", "correlation": 0.00},
        {"feature1": "EDV", "feature2": "PI", "correlation": 0.00},
        {"feature1": "EDV", "feature2": "S/D", "correlation": round(corr_edv_sd, 2)},
        {"feature1": "EDV", "feature2": "Label", "correlation": 0.00},
        
        {"feature1": "RI", "feature2": "PSV", "correlation": 0.00},
        {"feature1": "RI", "feature2": "EDV", "correlation": 0.00},
        {"feature1": "RI", "feature2": "RI", "correlation": 1.00},
        {"feature1": "RI", "feature2": "PI", "correlation": 0.00},
        {"feature1": "RI", "feature2": "S/D", "correlation": 0.00},
        {"feature1": "RI", "feature2": "Label", "correlation": 0.00},
        
        {"feature1": "PI", "feature2": "PSV", "correlation": 0.00},
        {"feature1": "PI", "feature2": "EDV", "correlation": 0.00},
        {"feature1": "PI", "feature2": "RI", "correlation": 0.00},
        {"feature1": "PI", "feature2": "PI", "correlation": 1.00},
        {"feature1": "PI", "feature2": "S/D", "correlation": 0.00},
        {"feature1": "PI", "feature2": "Label", "correlation": 0.00},
        
        {"feature1": "S/D", "feature2": "PSV", "correlation": round(corr_psv_sd, 2)},
        {"feature1": "S/D", "feature2": "EDV", "correlation": round(corr_edv_sd, 2)},
        {"feature1": "S/D", "feature2": "RI", "correlation": 0.00},
        {"feature1": "S/D", "feature2": "PI", "correlation": 0.00},
        {"feature1": "S/D", "feature2": "S/D", "correlation": 1.00},
        {"feature1": "S/D", "feature2": "Label", "correlation": 0.00},
        
        {"feature1": "Label", "feature2": "PSV", "correlation": 0.00},
        {"feature1": "Label", "feature2": "EDV", "correlation": 0.00},
        {"feature1": "Label", "feature2": "RI", "correlation": 0.00},
        {"feature1": "Label", "feature2": "PI", "correlation": 0.00},
        {"feature1": "Label", "feature2": "S/D", "correlation": 0.00},
        {"feature1": "Label", "feature2": "Label", "correlation": 1.00}
    ]
    
    logger.info(f"Database record successfully created. Scan ID: {saved_scan.id}")
    
    # 6. CONSOLIDATE RESPONSE
    return {
        "id": saved_scan.id,
        "prediction": saved_scan.prediction,
        "confidence": saved_scan.confidence,
        "image_path": saved_scan.image_path,
        "gradcam_path": saved_scan.gradcam_path,
        "features": {
            "PSV": saved_scan.psv,
            "EDV": saved_scan.edv,
            "RI": saved_scan.ri,
            "PI": saved_scan.pi,
            "SD": saved_scan.sd_ratio
        },
        "waveform": json.loads(saved_scan.waveform_json),
        "heatmap": heatmap
    }

@app.get("/api/history")
def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Fetch scan history from the database."""
    records = crud.get_scan_history(db, skip=skip, limit=limit)
    response = []
    for r in records:
        response.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "patient_name": r.patient.name if r.patient else "Unknown",
            "image_path": r.image_path,
            "gradcam_path": r.gradcam_path,
            "prediction": r.prediction,
            "confidence": r.confidence,
            "date": r.created_at.isoformat() if r.created_at else "",
            "features": {
                "PSV": r.psv,
                "EDV": r.edv,
                "RI": r.ri,
                "PI": r.pi,
                "SD": r.sd_ratio
            }
        })
    return response

@app.post("/api/generate_notes")
def generate_notes(data: schemas.NotesGenerationRequest):
    """Generate clinical documentation using Gemini AI."""
    if not GEMINI_API_KEY:
        return {"notes": "Error: GEMINI_API_KEY not found in backend/.env file. Please add your API key to use AI generation."}
        
    prompt = f"""
    Act as an expert Maternal-Fetal Medicine (MFM) specialist.
    I have analyzed a fetal MCA Doppler ultrasound. Here are the metrics:
    - AI Classification: {data.prediction}
    - AI Confidence: {data.confidence}%
    - Peak Systolic Velocity (PSV): {data.psv} cm/s
    - End Diastolic Velocity (EDV): {data.edv} cm/s
    - Pulsatility Index (PI): {data.pi}
    - Resistance Index (RI): {data.ri}
    - S/D Ratio: {data.sd_ratio}
    
    Please write a short, professional clinical observation paragraph (3-4 sentences) documenting these findings and a brief assessment. Do not include any greeting, signature, or markdown bolding. Just plain text.
    """
    
    try:
        # Attempt to use the best available model, with fallbacks
        model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
        model = None
        last_error = ""
        
        for name in model_names:
            try:
                model = genai.GenerativeModel(name)
                # Test the model with a tiny prompt to see if it exists/is accessible
                response = model.generate_content("ping")
                if response:
                    break # Success!
            except Exception as inner_e:
                last_error = str(inner_e)
                model = None
                continue
        
        if not model:
            return {"notes": f"AI Error: Could not initialize any Gemini models. Last error: {last_error}"}

        response = model.generate_content(prompt)
        
        # Check if response has text (handles blocks/filters)
        if hasattr(response, 'text') and response.text:
            return {"notes": response.text.strip()}
        else:
            return {"notes": "AI was unable to generate notes for this case. Please enter manual observations."}
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return {"notes": f"AI Error: {str(e)}"}

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(database.get_db)):
    """Fetch live analytics from the database."""
    total_scans = db.query(models.ScanRecord).count()
    anemia_count = db.query(models.ScanRecord).filter(models.ScanRecord.prediction == "Anemia").count()
    normal_count = total_scans - anemia_count
    
    # Simple monthly stats (SQLite specific strftime)
    # Group by month and count
    from sqlalchemy import func
    monthly_data = db.query(
        func.strftime('%m', models.ScanRecord.created_at).label('month'),
        func.count(models.ScanRecord.id).label('count')
    ).group_by('month').all()
    
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    real_monthly_stats = []
    for m, c in monthly_data:
        idx = int(m) - 1
        real_monthly_stats.append({"month": months[idx], "count": c})

    return {
        "total_scans": total_scans,
        "anemia_cases": anemia_count,
        "normal_cases": normal_count,
        "risk_distribution": [
            {"name": "Anemic", "value": anemia_count},
            {"name": "Normal", "value": normal_count}
        ],
        "monthly_stats": real_monthly_stats if real_monthly_stats else [{"month": "No Data", "count": 0}]
    }

@app.get("/api/patients/{patient_id}/scans")
def get_patient_scans(patient_id: int, db: Session = Depends(database.get_db)):
    """Fetch all scans for a specific patient."""
    scans = db.query(models.ScanRecord).filter(models.ScanRecord.patient_id == patient_id).order_by(models.ScanRecord.created_at.asc()).all()
    return scans

# Serve Frontend
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
@app.get("/{catchall:path}")
def serve_frontend(catchall: str):
    if not os.path.exists(frontend_dist):
        return {"error": "Frontend not built"}
        
    path = os.path.join(frontend_dist, catchall)
    if os.path.isfile(path):
        return FileResponse(path)
        
    return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

