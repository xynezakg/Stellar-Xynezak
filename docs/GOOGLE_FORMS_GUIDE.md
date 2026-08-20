# 📋 AidPact — User Onboarding Google Form & Sheets Setup Guide

This guide outlines how user feedback was collected, structured, and exported from Google Forms into Google Sheets for the **AidPact** Level 5 submission.

---

## 🛠️ Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com/) and create a new form titled **"AidPact — Stellar Disaster Relief dApp Feedback & Validation"**.
2. Set the Form Description:
   > *"Thank you for participating in the AidPact testnet trial! Your feedback helps us improve transparent disaster relief crowdfunding, multi-wallet onboarding, and verified aid distribution on Stellar."*

---

## 📝 Step 2: Form Questions & Export Schema

| Column | Google Form Field Title | Field Type | Validation / Options |
|:---:|---|---|---|
| **A** | **Timestamp** | Auto-Generated | `YYYY/MM/DD HH:MM:SS` (Google Forms standard) |
| **B** | **Full Name** | Short answer | Full User Name |
| **C** | **Email Address** | Short answer | Email validation (`@gmail.com`, `@ua.edu.ph`, etc.) |
| **D** | **Community Role / Location** | Short answer | e.g. *Student Volunteer (Pampanga, PH)* |
| **E** | **Stellar Testnet Wallet Public Key** | Short answer | Starts with `G...` (56 alphanumeric characters) |
| **F** | **Rate Your Overall Experience (1-5)** | Linear scale | 1 (Poor) to 5 (Exceptional) |
| **G** | **Feedback Category** | Multiple choice | • UI / UX Design<br>• Speed & Finality<br>• Wallet Connection<br>• Transparency & Trust<br>• Feature Request |
| **H** | **Preferred Language** | Multiple choice | • Tagalog / Taglish<br>• English |
| **I** | **Your Experience & Feedback** | Paragraph | Qualitative user review and feedback |
| **J** | **Feature Requests / Suggestions** | Paragraph | Suggested product improvements |
| **K** | **Transaction Hash Proof** | Short answer | 64-char Stellar Testnet transaction hash |
| **L** | **Stellar Expert Link** | Calculated / Short answer | `https://stellar.expert/explorer/testnet/tx/{hash}` |

---

## 📊 Step 3: Link Responses to Google Sheets & Export to CSV

1. In Google Forms, click on the **Responses** tab.
2. Click **"Link to Sheets"** (Create a new spreadsheet titled *AidPact User Responses*).
3. In Google Sheets, click **File ➔ Download ➔ Comma Separated Values (.csv)**.
4. Save the exported CSV file into your repository at:
   ```
   docs/user_feedback_responses.csv
   ```

---

## 🔗 Live Links:
- 📝 **Public Google Form**: [https://docs.google.com/forms/d/e/1FAIpQLSf4-FFwvD8WH9iRK1PbsWBLruTsBjVFMsxSuSKW-jZpN5WH8g/viewform](https://docs.google.com/forms/d/e/1FAIpQLSf4-FFwvD8WH9iRK1PbsWBLruTsBjVFMsxSuSKW-jZpN5WH8g/viewform)
- 📊 **Live Google Sheets Responses**: [https://docs.google.com/spreadsheets/d/1bau9N-urZcnYwmSuKNAZVMVlHzSowM8-dFo1BPo-Ze8/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1bau9N-urZcnYwmSuKNAZVMVlHzSowM8-dFo1BPo-Ze8/edit?usp=sharing)
- 📁 **Exported CSV Dataset**: [`docs/user_feedback_responses.csv`](user_feedback_responses.csv)
