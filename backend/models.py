from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import database

Base = database.Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer, nullable=True)
    gestational_age = Column(Integer, nullable=True) # in weeks
    medical_notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scans = relationship("ScanRecord", back_populates="patient")

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    image_path = Column(String)
    gradcam_path = Column(String)
    
    # Analysis Results
    prediction = Column(String) # Anemia or Normal
    confidence = Column(Float)
    
    # Clinical Features
    psv = Column(Float)
    edv = Column(Float)
    ri = Column(Float)
    pi = Column(Float)
    sd_ratio = Column(Float)
    
    # UI Waveform Data (stored as JSON string)
    waveform_json = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="scans")
