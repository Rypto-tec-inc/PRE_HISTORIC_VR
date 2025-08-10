# PRE_HISTORIC_VR Backend

## Overview
Express.js backend for the Prehistoric Liberia VR application, providing APIs for cultural content, user management, and VR experiences.

## Features
- User authentication and authorization
- Cultural content management (tribes, artifacts, languages)
- VR experience management
- Achievement system
- File upload handling
- SQLite database

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Initialize database:
   ```bash
   npm run seed
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tribes` - Get all tribes
- `GET /api/artifacts` - Get all artifacts
- `GET /api/vr` - Get VR experiences
- `GET /api/languages` - Get languages

## Database Models

- User - User accounts and profiles
- Tribe - Liberian tribal information
- Artifact - Cultural artifacts
- VRExperience - VR experiences
- Achievement - User achievements
- Language - Tribal languages

## Environment Variables

See `.env.example` for all available configuration options.
