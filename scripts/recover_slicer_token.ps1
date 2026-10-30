# Run only for your own logged-in Slicer account. No administrator rights needed.
$ErrorActionPreference = 'Stop'
$slicerProcesses = @(Get-Process -Name AnycubicSlicerNext -ErrorAction SilentlyContinue)
if ($slicerProcesses.Count -ne 1) {
    throw 'Open exactly one Anycubic Slicer Next instance, log in and open the printer view, then retry.'
}
$pythonScript = Join-Path $PSScriptRoot 'recover_slicer_token.py'
$pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pythonLauncher) {
    & $pythonLauncher.Source -3 $pythonScript --process-id $slicerProcesses[0].Id
} else {
    $pythonLauncher = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonLauncher) {
        throw 'Install 64-bit Python 3.9 or newer from python.org, reopen PowerShell and retry.'
    }
    & $pythonLauncher.Source $pythonScript --process-id $slicerProcesses[0].Id
}
if ($LASTEXITCODE -ne 0) {
    throw 'Token recovery did not complete. Follow the message above; the clipboard may still contain an older value.'
}
