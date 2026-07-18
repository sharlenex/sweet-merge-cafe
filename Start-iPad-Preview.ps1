$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonCandidates = @(
  (Get-Command python -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
  (Get-Command py -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
  'C:\Users\sharl\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $pythonCandidates) {
  throw 'Python was not found. Install Python or deploy the project to HTTPS static hosting.'
}

$python = $pythonCandidates[0]
$ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1 -ExpandProperty IPAddress

Set-Location $projectRoot
Write-Host ''
Write-Host 'Sweet Merge Cafe iPad preview server is running.' -ForegroundColor Green
if ($ip) {
  Write-Host "Connect the iPad to the same Wi-Fi, then open: http://${ip}:8080" -ForegroundColor Yellow
}
Write-Host 'Keep this window open. Press Ctrl+C to stop the server.' -ForegroundColor Cyan
Write-Host ''

& $python -m http.server 8080 --bind 0.0.0.0
