from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ScanRecordBase(BaseModel):
    prediction: str
    confidence: float
    psv: float
    edv: float
    ri: float
    pi: float
    sd_ratio: float
    gradcam_path: Optional[str] = None

class ScanRecordCreate(ScanRecordBase):
    patient_id: Optional[int] = None
    image_path: str
    waveform_json: str

class ScanRecord(ScanRecordBase):
    id: int
    patient_id: Optional[int]
    image_path: str
    waveform_json: str
    created_at: datetime

    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    name: str
    age: Optional[int] = None
    gestational_age: Optional[int] = None
    medical_notes: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: datetime
    scans: List[ScanRecord] = []

    class Config:
        from_attributes = True

class NotesGenerationRequest(BaseModel):
    prediction: str
    confidence: float
    psv: float
    edv: float
    ri: float
    pi: float
    sd_ratio: float
