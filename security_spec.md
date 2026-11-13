# MedFlow PH Security Specification

1. **Multi-User Clinician Accounts (`/clinicians/{clinicianId}`)**:
   - Stores registered Doctors, Medical Clerks, and Medical Interns along with their username, email, phone, facility, affiliation school, supervising doctor, PRC/PTR/S2, and `approvalStatus` (`pending`, `approved`, `rejected`) so a separate Admin Portal can review and approve/remove subscriptions.
   - Validated on write for required fields and string length limits.
2. **Per-Clinician Isolated Workspaces (`/workspaces/{clinicianId}`)**:
   - Stores each clinician's private patient records (`patientsJson`) keyed by their unique `clinicianId` so that every doctor, clerk, and intern only accesses their own patient charts, SOAP notes, lab requests, and prescriptions.
