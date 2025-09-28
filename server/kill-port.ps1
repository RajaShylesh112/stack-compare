# PowerShell script to kill process using port 3001
param(
    [int]$Port = 3001
)

Write-Host "Checking for processes using port $Port..." -ForegroundColor Yellow

# Get process using the port
$processInfo = netstat -ano | Select-String ":$Port"

if ($processInfo) {
    Write-Host "Found processes using port $Port" -ForegroundColor Green
    $processInfo | ForEach-Object {
        Write-Host $_.Line -ForegroundColor Cyan
        
        # Extract PID (last column)
        $parts = $_.Line -split '\s+' | Where-Object { $_ -ne '' }
        $processId = $parts[-1]
        
        if ($processId -match '^\d+$' -and $processId -ne '0') {
            try {
                Write-Host "Killing process with PID: $processId" -ForegroundColor Red
                Stop-Process -Id $processId -Force
                Write-Host "Successfully killed process $processId" -ForegroundColor Green
            }
            catch {
                Write-Host "Failed to kill process $processId : $_" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "No processes found using port $Port" -ForegroundColor Green
}

Write-Host "Done!" -ForegroundColor Yellow
