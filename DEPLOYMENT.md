# Deployment Guide for StackCompare Monthly Update System

## Overview
This guide walks you through deploying the monthly automated update system.

## Prerequisites
1. Appwrite Cloud account
2. GitHub repository with Actions enabled
3. GitHub Personal Access Token
4. Appwrite CLI installed

## Step 1: Appwrite Setup
- Deploy the database and function
- Configure environment variables
- Set up API keys

## Step 2: GitHub Actions Setup
Add these secrets to your GitHub repository:
- APPWRITE_ENDPOINT
- APPWRITE_PROJECT_ID  
- APPWRITE_API_KEY
- APPWRITE_FUNCTION_ID

## Step 3: Testing
Test the workflow manually before the first automated run.

## Workflow Schedule
The monthly update runs on the 1st of every month at 2:00 AM UTC.
