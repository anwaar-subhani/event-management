# Backend (Beginner Friendly)

This backend is organized to be easy for 2 teammates:

- Organizer auth and profile
- Event CRUD for organizers
- Ticket purchase by normal users **without signup/login**

## Simple folder map

- `src/config` -> DB and environment setup
- `src/models` -> MongoDB schemas
- `src/controllers` -> request handlers
- `src/routes` -> API endpoints
- `src/middleware` -> auth/validation helpers
- `src/services` -> business logic (optional but clean)
- `src/docs` -> schema + API notes

## First run (later)

1. Install dependencies in `backend`
2. Ensure root `.env` has `MONGO_URI`, `JWT_SECRET`, `PORT`
3. Start with `npm run dev`

## Core rule for this project

- Normal users can purchase tickets as guests.
- Only organizers need auth to create/manage events.
