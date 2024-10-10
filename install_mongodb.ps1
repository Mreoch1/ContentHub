# MongoDB installation script

# Set variables
$mongoVersion = "6.0.13"
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$mongoVersion-signed.msi"
$installerPath = "$env:TEMP\mongodb-installer.msi"
$installDir = "C:\MongoDB"
$dataPath = "$installDir\data\db"
$logPath = "$installDir\data\log"

# Download MongoDB installer
Write-Host "Downloading MongoDB installer..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

# Install MongoDB
Write-Host "Installing MongoDB..."
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" INSTALLLOCATION=`"$installDir`" /qn" -Wait

# Create data and log directories
Write-Host "Creating data and log directories..."
New-Item -ItemType Directory -Force -Path $dataPath
New-Item -ItemType Directory -Force -Path $logPath

# Add MongoDB to the system PATH
$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$mongoPath = "$installDir\bin"
if ($envPath -notlike "*$mongoPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$envPath;$mongoPath", "Machine")
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

# Set up MongoDB as a Windows service
Write-Host "Setting up MongoDB as a Windows service..."
& "$installDir\bin\mongod.exe" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --dbpath $dataPath --logpath "$logPath\mongodb.log"

# Start the MongoDB service
Write-Host "Starting MongoDB service..."
Start-Service -Name "MongoDB"

Write-Host "MongoDB installation complete!"