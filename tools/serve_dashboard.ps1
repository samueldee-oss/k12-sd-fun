param(
    [string]$PythonCommand = "python",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$localPython = "C:\Users\Admin\AppData\Local\Python\pythoncore-3.14-64\python.exe"

if ($PythonCommand -eq "python" -and (Test-Path $localPython)) {
    $PythonCommand = $localPython
}

Set-Location $root

Write-Host "Serving dashboard at http://localhost:$Port/dashboard/"
& $PythonCommand -m http.server $Port
