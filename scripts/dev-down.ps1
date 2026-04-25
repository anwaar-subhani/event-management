$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$runtimeRoot = Join-Path $root '.runtime'

$pidFiles = @(
    (Join-Path $runtimeRoot 'mongodb\mongod.pid')
    (Join-Path $runtimeRoot 'backend\backend.pid')
    (Join-Path $runtimeRoot 'frontend\frontend.pid')
)

foreach ($pidFile in $pidFiles) {
    if (-not (Test-Path $pidFile)) {
        continue
    }

    $pidValue = Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $pidValue) {
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
        continue
    }

    $proc = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
    if ($proc) {
        Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped PID $pidValue from $pidFile" -ForegroundColor Green
    }

    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

Write-Host 'Done. If anything is still running, close related terminal tasks manually.' -ForegroundColor Cyan
