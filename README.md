# 🤖 Solores

A production-ready Gen-AI powered personal finance management application built using React Native (Expo).

## 🌐 Live Deployment

[Open Solores](https://dmkhb48726al6.cloudfront.net)

---

## ☁️ AWS Cloud Deployment

Solores is deployed on Amazon Web Services (AWS) using a scalable cloud architecture.

### AWS Services Used

#### Amazon S3

* Hosts the production web build of Solores.
* Stores static frontend assets including HTML, JavaScript, CSS, images, and application resources.

#### Amazon CloudFront

* Serves Solores through a global Content Delivery Network (CDN).
* Provides HTTPS access and low-latency content delivery.
* Improves application performance and scalability.

#### AWS IAM

* Used for secure access control and management of AWS resources during deployment.

### Deployment Architecture

User Browser
↓
Amazon CloudFront (CDN)
↓
Amazon S3 (Static Website Hosting)
↓
Solores Frontend (React Native Web)

### Cloud Features Demonstrated

* Cloud-based web application deployment
* Static website hosting
* Global content delivery using CDN
* HTTPS-secured access
* Scalable cloud infrastructure
* Mobile and desktop accessibility

---

## 🏗️ Folder Structure

Solores/
├── App.js                          # Root navigation + auth gate
├── app.json                        # Expo config
├── babel.config.js
├── package.json
└── src/
├── context/
│   └── AppContext.js
├── screens/
│   ├── OnboardingScreen.js
│   ├── DashboardScreen.js
│   ├── ExpenseTrackerScreen.js
│   ├── CalendarScreen.js
│   ├── AICopilotScreen.js
│   ├── HealthScoreScreen.js
│   └── AddExpenseScreen.js
├── services/
│   ├── StorageService.js
│   └── AIService.js
└── utils/
├── theme.js
└── financialUtils.js

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* Expo CLI
* Expo Go App

### Installation

```bash
cd Solores
npm install
npx expo start
```

### Run on Simulators

```bash
npx expo start --ios
npx expo start --android
```

---

## 🤖 AI-Powered Financial Copilot

Solores uses Generative AI to provide:

* Spending recommendations
* Safe spending analysis
* Budget optimization strategies
* Personalized financial insights
* Behavioral finance guidance

Without an API key, the application uses intelligent mock responses to demonstrate functionality.

---

## ✨ Features

### Onboarding

* User profile setup
* Monthly income capture
* Fixed expense configuration
* Savings goal planning

### Dashboard

* Budget overview
* Spending insights
* Savings tracking
* Recent transactions

### Expense Tracker

* Expense categorization
* Pie-chart visualization
* Transaction filtering
* Expense deletion

### Calendar Analytics

* Monthly spending calendar
* Daily spending analysis
* Overspending detection

### Solores AI Copilot

* Budget decision support
* Spending approval analysis
* Personalized financial advice
* Context-aware recommendations

### Financial Health Score

* Budget adherence scoring
* Savings progress analysis
* Spending consistency tracking
* Personalized improvement tips

---

## 🔧 Future Cloud Enhancements

Planned AWS integrations:

* Amazon Cognito (Authentication)
* AWS Lambda (Serverless Backend)
* Amazon SNS (Budget Alerts)
* Amazon SES (Email Notifications)
* Amazon RDS PostgreSQL (Persistent Data Storage)
* Amazon Bedrock (Advanced AI Features)

---

## 🏆 Project Highlights

* Gen-AI Powered Financial Assistant
* Dual-Mode User Experience
* Offline-First Architecture
* Cloud-Deployed Application
* Mobile-First Design
* Scalable AWS Infrastructure
* Production-Ready Code Structure

Built for Students, Working Professionals, and Budget-Conscious Users.
