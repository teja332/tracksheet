# Tracksheet

Tracksheet is a Next.js web app with a Python-based ML service and a MongoDB backend. It supports student and staff dashboards and reads data from MongoDB. This README explains how to set up and run the project on Windows based on the provided project instructions.

## Tech stack
- Frontend: Next.js 16, React 19, Tailwind CSS
- Backend data: MongoDB
- ML service: Python 3.12 + FastAPI/Uvicorn

## Prerequisites (Windows)
1. Install Python 3.12 from the Microsoft Store:
   https://apps.microsoft.com/detail/9NCVDN91XZQP?hl=en-us&gl=IN&ocid=pdpshare
2. Install MongoDB Community Edition:
   https://www.mongodb.com/try/download/community
3. Install MongoDB Database Tools (mongodump/mongorestore):
   https://www.mongodb.com/try/download/database-tools
4. Install Node.js 18+ and pnpm (optional, npm is fine).

## MongoDB setup
1. Open MongoDB Compass (keep it running).
2. Create a new connection:
   - URI: mongodb://localhost:27017
   - Save the connection.

### Restore the database (Tracksheet)
1. Add the MongoDB tools bin folder to your PATH.
2. Open Command Prompt or PowerShell (not mongosh).
3. Run mongorestore:

```
mongorestore --db=Tracksheet <path-to-backup-folder>
```

Examples:
- If you have the backup in this repo: `Database_backup/Tracksheet`
- If your backup is elsewhere: `C:\Users\YourName\Desktop\Tracksheet`

## Project setup
1. Open this folder in VS Code.
2. Check versions:

```
node --version
python --version
pnpm --version
```

If `python --version` is not 3.12 but you installed Python 3.12 from the Microsoft Store, continue.

3. Install dependencies:

```
pnpm install
```

or

```
npm install
```

4. Create the Python virtual environment:

```
py -3.12 -m venv .venv
```

5. Activate the virtual environment:

```
.\.venv\Scripts\activate
```

6. Install ML service dependencies:

```
pip install -r ml-service\requirements.txt
```

## Environment variables
Create a file named `.env.local` in the project root:

```
MONGODB_URI=mongodb://localhost:27017/Tracksheet
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN="1h"
ML_SERVICE_URL=http://localhost:8001
```

Tip: You can generate a secure JWT secret using a password generator.

## Run the project
### 1) Start the ML service (port 8001)
Use the provided script in a VS Code terminal:

```
.\start-ml-service.ps1
```

Expected output:
- INFO: Uvicorn running on http://127.0.0.1:8001
- INFO: Application startup complete.

### 2) Start the Next.js dev server (port 3000)
Open another terminal and run:

```
npm run dev
```

Expected output:
- Ready on http://localhost:3000

## Access the app
Open your browser:
- http://localhost:3000

Logins:
- Student password: `student123`
- Staff password: `staff123`

## Troubleshooting
- If MongoDB does not connect, confirm `mongod` is running and the URI is `mongodb://localhost:27017`.
- If the ML service fails, ensure the virtual environment is activated and dependencies are installed.
- If ports are busy, stop the conflicting process or change the port and update `.env.local`.
