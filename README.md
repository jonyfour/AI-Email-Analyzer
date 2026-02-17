# AI Email Analyzer & Action Extractor

AI-powered Google Sheets automation that analyzes emails, extracts key information, and generates professional reply drafts automatically.

## Overview

This project integrates Google Apps Script with Groq LLM API to process incoming email text inside Google Sheets.

The system:
- Summarizes long emails
- Extracts action items
- Determines urgency level
- Categorizes message type
- Generates a polite reply draft
- Logs results automatically with timestamp
- Runs every 5 minutes via trigger

## Tech Stack

- Google Apps Script
- Groq LLM API (llama-3.1-8b-instant)
- Google Sheets
- Time-driven automation triggers

## Sheet Structure

| Column | Purpose |
|--------|----------|
| A | Email Text |
| B | Summary |
| C | Action Items |
| D | Urgency |
| E | Suggested Reply |
| F | Category |
| G | Date |
| H | Status |

## Architecture

1. User pastes email text into Column A
2. Script scans for unprocessed rows
3. Sends structured prompt to Groq API
4. Parses JSON response
5. Writes structured output to sheet
6. Marks row as DONE
7. Trigger runs every 5 minutes

## Features

- Structured JSON parsing
- Error handling with status tracking
- Scalable row processing
- Automatic workflow execution

## Status

Working prototype.  
Designed as a portfolio project demonstrating AI workflow automation.
