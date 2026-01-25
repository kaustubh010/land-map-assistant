# 🗺️ Land Record Digitization Assistant

A web-based GIS application that bridges spatial land parcel maps with textual ownership records to automatically detect discrepancies and enable safe digital corrections.

---

## 📌 Overview

Land records in many regions are maintained across separate systems:

- Spatial survey maps defining parcel boundaries
- Textual ownership registers containing plot details

Over time, these datasets diverge, resulting in:
- Area mismatches
- Missing or duplicated plot
- Incorrect ownership information

This project provides an interactive platform to reconcile these datasets visually and programmatically, helping authorities identify inconsistencies and correct them efficiently.

---

## 🎯 Problem Statement

Manual reconciliation of land maps and ownership records is slow, error-prone, and difficult to audit.

### The goal is to:

- Link parcel geometry with ownership records
- Automatically flag inconsistencies
- Provide a secure interface for authorized corrections
- Maintain an audit trail for all changes

---

## ✅ Key Features (MVP)

### 🗺️ Interactive Parcel Map

- Displays village land parcels as irregular polygons
- Zoom and pan functionality
- Click any parcel to view plot details

### 🔍 Search

- Search parcels by plot_id
- Automatically centers and highlights selected plots

---

## ⚠️ Automated Discrepancy Detection

### Detects and flags:

- Plots present in maps but missing in records
- Plots present in records but missing in maps
- Area mismatches beyond configurable thresholds

### Parcels are color-coded:

- 🟢 Matched
- 🔴 Mismatch
- ⚪ Missing data

## ✏️ Basic Record Editing

- Update ownership or area values
- Changes are logged for traceability

---

## 🧱 System Architecture

```bash
    Frontend (Next.js + leaflet)
        ↓
    Backend API (Node.js)
        ↓
    PostgreSQL
```
- Ownership records are imported from CSV
- Discrepancies are computed by comparing both datasets

## 🛠️ Tech Stack

### Frontend
- Next.js / React
- Tailwind CSS
- Leaflet
- GeoJSON

### Backend
- Node.js
- REST APIs

### Database
- PostgreSQL

### Utilities
- CSV parsing
- Raw SQL for spatial queries
- Prisma ORM

---

## 📂 Data Sources
### Spatial Data

- Sample village parcel boundaries in GeoJSON format
- Each parcel includes plot_id and polygon geometry

### Textual Records

- CSV files containing:
    - plot_id
    - owner_name
    - area

These two datasets are treated as independent sources and reconciled within the system.

---

## 🔄 Data Flow

1. Load parcel geometry into PostGIS
2. Upload CSV ownership records
3. Run reconciliation logic
4. Store detected discrepancies
5. Visualize results on map
6. Allow authorized edits
7. Log all changes

---
## 🧪 Discrepancy Logic (Simplified)

- Missing plot in map or records
- Area difference exceeding threshold
- Ownership mismatch

Detected issues are stored and visualized in real time.

---
## 🔐 Authorization (Planned)
The MVP uses simplified access control.

Future versions will include:

- Role-based authentication:
    - Viewer (read-only)
    - Editor (propose changes)
    - Admin (approve changes)
- JWT-based login
- Approval workflows
- Versioned records

---
## 🗄️ Database Design (Planned)
Core tables:
- users
- parcel_map
- parcel_record
- discrepancies
- edit_logs

All edits will be auditable with timestamps and user attribution.

## 🚀 Future Enhancements

- Owner-name search
- Approval workflows for edits
- Reconciliation reports (PDF/CSV)
- Dashboard analytics

---

## 📖 User Guide (High Level)

- Open map and explore parcels
- Search by plot ID
- View discrepancy indicators
- Select parcel and edit incorrect fields
- Save changes (logged automatically)

---

## 📊 Sample Outputs

- Interactive discrepancy map
- Reconciliation table
- Edit history logs

## 🧭 Project Scope

This MVP demonstrates core reconciliation and visualization capabilities using representative sample data. It is designed as a foundation for larger-scale digital land governance systems.