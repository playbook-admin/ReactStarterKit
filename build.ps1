# Ensure npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed."
    exit 1
}

# Navigate to the project directory
Set-Location -Path $PSScriptRoot

# Install npm packages
npm install

# Run npm build and copy scripts
npm run build:dev

