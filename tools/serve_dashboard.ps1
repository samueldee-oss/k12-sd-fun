param(
    [string]$PythonCommand = "python",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$localPython = "C:\Users\Admin\AppData\Local\Python\pythoncore-3.14-64\python.exe"

if ($PythonCommand -eq "python" -and (Test-Path $localPython)) {
    $PythonCommand = $localPython
}

# serve_dashboard.py also forwards the Pygbag runtime requests (/cdn/...) so the Bank Game builds load.
& $PythonCommand (Join-Path $PSScriptRoot "serve_dashboard.py") --port $Port
