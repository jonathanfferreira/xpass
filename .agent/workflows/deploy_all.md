---
description: Deploy all XPASS applications to Firebase Hosting
---

# Deploy XPASS Ecosystem

This workflow builds and deploys all 4 applications to their respective Firebase Hosting sites.

## 1. Deploy Landing Page
// turbo
cd d:/xpass/xpass-landing
npm install
npm run build
firebase deploy --only hosting:landing

## 2. Deploy Admin Panel
// turbo
cd d:/xpass/xpass-admin
npm install
npm run build
firebase deploy --only hosting:admin

## 3. Deploy Student App
// turbo
cd d:/xpass/xpass-app-aluno
npm install
npm run build
firebase deploy --only hosting:student

## 4. Deploy Partner App
// turbo
cd d:/xpass/xpass-app-parceiro
npm install
npm run build
firebase deploy --only hosting:partner
