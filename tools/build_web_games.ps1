param(
    [string]$PythonCommand = "python",
    [switch]$InstallPygbag
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$sourcesRoot = Join-Path $root "web_sources"
$buildRoot = Join-Path $root "dashboard\web_builds"
$localPython = "C:\Users\Admin\AppData\Local\Python\pythoncore-3.14-64\python.exe"

if ($PythonCommand -eq "python" -and (Test-Path $localPython)) {
    $PythonCommand = $localPython
}

$games = @(
    @{ Source = "bank_game.py"; Slug = "bank-game-current" },
    @{ Source = "bank_game copy 5.py"; Slug = "bank-game-copy-5" },
    @{ Source = "bank_game copy 4.py"; Slug = "bank-game-copy-4" },
    @{ Source = "bank_game copy 3.py"; Slug = "bank-game-copy-3" },
    @{ Source = "bank_game copy 2.py"; Slug = "bank-game-copy-2" },
    @{ Source = "bank_game copy.py"; Slug = "bank-game-copy" }
)

function Convert-ToPygbagMain {
    param(
        [string]$SourcePath,
        [string]$TargetPath
    )

    $lines = [System.Collections.Generic.List[string]]::new()
    foreach ($line in [System.IO.File]::ReadAllLines($SourcePath)) {
        $lines.Add($line)
    }

    if (-not ($lines -contains "import asyncio")) {
        $insertAt = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import " -or $lines[$i] -match "^from .* import ") {
                $insertAt = $i + 1
            }
        }
        if ($insertAt -ge 0) {
            $lines.Insert($insertAt, "import asyncio")
        }
    }

    $mainLoopIndex = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^# MAIN LOOP") {
            $mainLoopIndex = $i
            break
        }
    }
    if ($mainLoopIndex -lt 0) {
        Copy-Item -LiteralPath $SourcePath -Destination $TargetPath -Force
        return
    }

    $exitIndex = -1
    for ($i = $mainLoopIndex; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^sys\.exit\(\)") {
            $exitIndex = $i
            break
        }
    }
    if ($exitIndex -lt 0) {
        Copy-Item -LiteralPath $SourcePath -Destination $TargetPath -Force
        return
    }

    $output = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -le $mainLoopIndex; $i++) {
        $output.Add($lines[$i])
    }
    $output.Add("async def main():")
    $output.Add("    global paused, selected_car_index, selected_slot, time_accumulator")

    for ($i = $mainLoopIndex + 1; $i -le $exitIndex; $i++) {
        $output.Add("    " + $lines[$i])
        if ($lines[$i] -match "^(\s*)clock\.tick\(60\)\s*$") {
            $output.Add("    " + $Matches[1] + "await asyncio.sleep(0)")
        }
    }

    $output.Add("")
    $output.Add("asyncio.run(main())")

    for ($i = $exitIndex + 1; $i -lt $lines.Count; $i++) {
        $output.Add($lines[$i])
    }

    [System.IO.File]::WriteAllLines($TargetPath, $output)
}

New-Item -ItemType Directory -Force -Path $sourcesRoot | Out-Null
New-Item -ItemType Directory -Force -Path $buildRoot | Out-Null

if ($InstallPygbag) {
    & $PythonCommand -m pip install pygbag
}

foreach ($game in $games) {
    $sourcePath = Join-Path $root $game.Source
    if (-not (Test-Path $sourcePath)) {
        Write-Warning "Skipping missing source: $($game.Source)"
        continue
    }

    $stageDir = Join-Path $sourcesRoot $game.Slug
    $stageMain = Join-Path $stageDir "main.py"
    $stageBuild = Join-Path $stageDir "build\web"
    $targetDir = Join-Path $buildRoot $game.Slug

    New-Item -ItemType Directory -Force -Path $stageDir | Out-Null
    Convert-ToPygbagMain -SourcePath $sourcePath -TargetPath $stageMain

    Write-Host "Building $($game.Source) -> dashboard\web_builds\$($game.Slug)"
    & $PythonCommand -m pygbag --build $stageDir

    if (-not (Test-Path $stageBuild)) {
        throw "pygbag did not create expected build folder: $stageBuild"
    }

    if (Test-Path $targetDir) {
        Remove-Item -LiteralPath $targetDir -Recurse -Force
    }
    Copy-Item -LiteralPath $stageBuild -Destination $targetDir -Recurse
}

Write-Host ""
Write-Host "Build complete. Run .\tools\serve_dashboard.ps1 and open http://localhost:8000/dashboard/"
