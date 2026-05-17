# GeoProteoNet: Fetal Anemia Diagnostic Dashboard

## Overview
The Fetal Anemia Diagnostic Dashboard is a full-stack, clinical-grade medical application designed to analyze Doppler ultrasound images using a deep learning model (GeoProteoNet). It automatically extracts hemodynamic features (PSV, EDV, RI, PI, S/D Ratio) and provides a real-time assessment of fetal anemia risk.

## Key Features
- **AI-Powered Diagnostics:** Uses the GeoProteoNet architecture to segment and analyze ultrasound images.
- **Dynamic Waveform Analysis:** Generates and plots the characteristic Doppler waveforms for key features matching Jupyter notebook benchmarks.
- **Correlation Heatmaps:** Visualizes the correlation between extracted parameters using an industry-standard 6x6 correlation grid.
- **High-Resolution PDF Reports:** Exports clinical-grade diagnostic reports using scaled `html2canvas` (4x scale) for crisp medical record keeping.
- **Responsive UI:** Built with React and Tailwind CSS, featuring dark mode, animations, and a modern medical interface.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend:** Python, FastAPI, Uvicorn, TensorFlow, OpenCV
- **Exporting:** jsPDF, html2canvas

---

## How to Run in VS Code

To run this application locally, you will need to start both the **Backend** and the **Frontend** simultaneously. You can easily do this using the built-in terminals in VS Code.

### Option 1: The Automated Way (Recommended)
We have provided an automated script that launches both servers for you.
1. Open your project folder (`Fetal Anemia Major Project`) in VS Code.
2. Open a new Terminal (`Terminal > New Terminal` or `Ctrl + \``).
3. Run the following command exactly as written:
```powershell
powershell -ExecutionPolicy Bypass -File .\start_app.ps1
```
This will automatically open two new command windows and start both services.

---

### Option 2: The Manual Way (Two Terminals)

If you prefer to run the commands manually or want to see the logs directly inside VS Code:

**Step 1: Start the Backend (FastAPI AI Server)**
1. Open a new Terminal in VS Code.
2. Navigate into the backend folder:
```powershell
cd backend
```
3. Run the Python server:
```powershell
python main.py
```
*The backend will start running on `http://localhost:8000`.*

**Step 2: Start the Frontend (React UI Server)**
1. Open a **second, separate Terminal** in VS Code (click the `+` button in the terminal panel to split or open a new one).
2. Navigate into the frontend folder:
```powershell
cd frontend
```
3. Start the Vite development server:
```powershell
npm.cmd run dev
```
*The frontend will start running on `http://localhost:5173`.*

### Step 3: Access the Application
Once both terminals are running without errors, open your web browser (Chrome, Edge, etc.) and go to:
👉 **http://localhost:5173**

---

### Troubleshooting
- **Unable to fetch / API Errors:** Ensure the python backend (`main.py`) is actively running. If the backend terminal was closed, the application will automatically fall back to generating dynamic offline simulation data to prevent crashes.
- **Missing Dependencies:** If you get module errors, ensure you run `pip install -r requirements.txt` in the backend folder and `npm install` in the frontend folder.
