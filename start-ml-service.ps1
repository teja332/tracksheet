$env:MONGODB_URI = "mongodb://localhost:27017/Tracksheet"
$env:DB_NAME = "Tracksheet"

Set-Location -Path "$PSScriptRoot\ml-service"

& "$PSScriptRoot\.venv\Scripts\python.exe" -m uvicorn app:app --port 8001 --reload
