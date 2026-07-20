# A AND C Order System - Google Cloud deployment

## Required before public launch

1. Create a Google Cloud project and enable billing.
2. Create Firestore in Native mode.
3. Replace browser-only `localStorage` data access with authenticated API calls.
4. Configure Firebase Authentication for customers and sales roles.
5. Import the JSON produced by `pages/A-C-Data-Backup.html` into Firestore.
6. Configure daily Firestore backups.

Do not launch the current browser-only storage model for production use. Different devices and origins do not share `localStorage`.

## Cloud Run deployment

After Firestore and authentication are connected:

```powershell
gcloud auth login
gcloud config set project PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com firestore.googleapis.com
gcloud run deploy a-c-order-system --source . --region asia-southeast1 --allow-unauthenticated
```

Use the generated HTTPS URL as the only production URL. Do not mix it with Live Server or localhost URLs.

## Verification

- Register a test customer on one device.
- Create a PO from that customer account.
- Open the sales dashboard on another device and verify the same PO appears.
- Create and save a quotation.
- Verify the customer sees the quotation status and delivery date.
- Verify Firestore contains the customer, PO, quotation, and audit log.
- Test a backup and restore before accepting real orders.
