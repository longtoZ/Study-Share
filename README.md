# StudyShare - Educational Document Sharing Platform

## 1. Project Overview

StudyShare is a modern, full-stack web application designed as an educational document sharing platform, similar to Studocu. The platform enables students to upload, share, and access academic materials while leveraging AI-powered features for enhanced learning experiences. Built with a microservices architecture, the application ensures scalability, maintainability, and high performance.

## 2. Key Features
### 2.1. User Authorization
Allow basic user registration and login or via Google OAuth.

### 2.2. Document Upload and Sharing
Users can upload, share, and download educational documents in various formats (PDF, DOCX).

### 2.3. AI-Powered Summarization
Integrate AI to provide document summarization and key point extraction. User can ask questions about the document and get answers.

### 2.4. Payment Integration
Implement Stripe payment gateway for selling and purchasing premium documents. The payment flows are implemented as follows:
- Buyer initiates purchase of a material and enters Stripe checkout page.
- Platform creates Stripe checkout session with application fee and transfer data (product details, buyer and seller info, etc.).
- Stripe processes the payment from the buyer's card. Platform takes a 10% commission, and the remaining amount is transferred directly to the seller's Stripe account. No manual transfer of funds is required.

    ![Stripe Payment Flow](./images/stripe-payment-flow.png)

- Seller checks their Stripe dashboard to see the received payment.

    ![Stripe Dashboard](./images/stripe-dashboard.png)
    
### 2.5. Search and Filter
Implement advanced search functionality with filters based on document type, subject, and popularity.