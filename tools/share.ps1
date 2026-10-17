# Share the portfolio through a temporary Cloudflare quick-tunnel link.
# Usage (PowerShell, from the project folder):   .\tools\share.ps1
# Stop: press Ctrl+C in this window (it shuts the site and the tunnel down).
param([int]$Port = 8100)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Find cloudflared: PATH first, then bin\cloudflared.exe in this project.
$cf = (Get-Command cloudflared -ErrorAction SilentlyContinue).Source
if (-not $cf -and (Test-Path "$root\bin\cloudflared.exe")) { $cf = "$root\bin\cloudflared.exe" }
if (-not $cf) { throw "cloudflared not found. Run: winget install Cloudflare.cloudflared  (or put cloudflared.exe in the bin folder)." }

# Production-style settings with a throwaway secret key. Optional values: set them in your shell first, e.g.
#   $env:CONTACT_EMAIL = "me@example.com"; $env:IMAGEKIT_URL_ENDPOINT = "..."; $env:PROFILE_IMAGE_PATH = "..."
$env:DJANGO_SETTINGS_MODULE = "config.settings.prod"
$env:DJANGO_SECRET_KEY = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
$env:DJANGO_ALLOWED_HOSTS = ".trycloudflare.com,localhost,127.0.0.1"
$env:DJANGO_SSL_REDIRECT = "0"   # Cloudflare already serves HTTPS

& "$root\.venv\Scripts\python.exe" manage.py collectstatic --noinput | Out-Null

$server = Start-Process -PassThru -WindowStyle Hidden "$root\.venv\Scripts\python.exe" -ArgumentList "manage.py runserver $Port --noreload"
$log = Join-Path $env:TEMP "portfolio-tunnel.log"
if (Test-Path $log) { Remove-Item $log }
$tunnel = Start-Process -PassThru -WindowStyle Hidden $cf -ArgumentList "tunnel --url http://localhost:$Port --no-autoupdate" -RedirectStandardError $log

try {
    $url = $null
    for ($i = 0; $i -lt 40 -and -not $url; $i++) {
        Start-Sleep -Milliseconds 750
        if (Test-Path $log) { $m = Select-String -Path $log -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1; if ($m) { $url = $m.Matches[0].Value } }
    }
    if (-not $url) { throw "No tunnel link appeared. See $log" }
    Write-Host "`nYour public link:  $url`n(Ctrl+C to stop sharing)`n" -ForegroundColor Green
    while ($true) { Start-Sleep -Seconds 2; if ($server.HasExited -or $tunnel.HasExited) { throw "The server or the tunnel stopped." } }
}
finally {
    foreach ($p in @($tunnel, $server)) { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force } }
    Write-Host "Stopped." -ForegroundColor Yellow
}
