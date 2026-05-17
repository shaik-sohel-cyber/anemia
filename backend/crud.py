from sqlalchemy.orm import Session
import models, schemas
import json

def get_patient(db: Session, patient_id: int):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def create_scan_record(db: Session, scan: schemas.ScanRecordCreate):
    db_scan = models.ScanRecord(
        patient_id=scan.patient_id,
        image_path=scan.image_path,
        prediction=scan.prediction,
        confidence=scan.confidence,
        psv=scan.psv,
        edv=scan.edv,
        ri=scan.ri,
        pi=scan.pi,
        sd_ratio=scan.sd_ratio,
        waveform_json=scan.waveform_json
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

def get_scan_history(db: Session, skip: int = 0, limit: int = 100):
    # Returns scans ordered by newest first
    return db.query(models.ScanRecord).order_by(models.ScanRecord.created_at.desc()).offset(skip).limit(limit).all()

def get_or_create_default_patient(db: Session):
    patient = db.query(models.Patient).filter(models.Patient.name == "Unknown Patient").first()
    if not patient:
        patient = models.Patient(name="Unknown Patient", medical_notes="Automatically created default profile.")
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient
