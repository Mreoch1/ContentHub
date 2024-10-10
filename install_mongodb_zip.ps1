# MongoDB manual installation script

# Set variables
$mongoVersion = "8.0.1"
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$mongoVersion.zip"
$zipPath = "$env:TEMP\mongodb.zip"
$installDir = "C:\MongoDB"
$dataPath = "$installDir\data\db"
$logPath = "$installDir\data\log"

# Download MongoDB zip
Write-Host "Downloading MongoDB $mongoVersion..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

# Extract MongoDB
Write-Host "Extracting MongoDB..."
Expand-Archive -Path $zipPath -DestinationPath $installDir -Force

# Rename the extracted folder
$extractedFolder = Get-ChildItem -Path $installDir | Where-Object { $_.PSIsContainer -and $_.Name -like "mongodb-win*" } | Select-Object -First 1
Rename-Item -Path $extractedFolder.FullName -NewName "MongoDBFiles"

# Create data and log directories
Write-Host "Creating data and log directories..."
New-Item -ItemType Directory -Force -Path $dataPath
New-Item -ItemType Directory -Force -Path $logPath

# Add MongoDB to the system PATH
$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$mongoPath = "$installDir\MongoDBFiles\bin"
if ($envPath -notlike "*$mongoPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$envPath;$mongoPath", "Machine")
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

Write-Host "MongoDB $mongoVersion installation complete!"
Write-Host "To start MongoDB, run: & '$mongoPath\mongod.exe' --dbpath '$dataPath' --logpath '$logPath\mongodb.log'"