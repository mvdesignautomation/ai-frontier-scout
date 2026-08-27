# Install ai-frontier-scout into ~/.hermes/skills/
# Usage:
#   .\install.ps1
#   irm https://raw.githubusercontent.com/OWNER/ai-frontier-scout/main/install.ps1 | iex
#   .\install.ps1 -Repo YOURUSER/ai-frontier-scout
[CmdletBinding()]
param(
    [string]$Repo = $env:AI_FRONTIER_SCOUT_REPO,
    [string]$Ref = $(if ($env:AI_FRONTIER_SCOUT_REF) { $env:AI_FRONTIER_SCOUT_REF } else { "main" }),
    [string]$HermesHome = $(if ($env:HERMES_HOME) { $env:HERMES_HOME } else { Join-Path $env:USERPROFILE ".hermes" })
)

$ErrorActionPreference = "Stop"
$SkillName = "ai-frontier-scout"
$Dest = Join-Path $HermesHome "skills\$SkillName"

function Copy-SkillTree([string]$Src) {
    if (Test-Path $Dest) {
        Remove-Item -Recurse -Force $Dest
    }
    New-Item -ItemType Directory -Force -Path $Dest | Out-Null
    Get-ChildItem -Force $Src | Where-Object { $_.Name -notin @(".git", "__pycache__") } | ForEach-Object {
        Copy-Item -Recurse -Force $_.FullName -Destination (Join-Path $Dest $_.Name)
    }
}

function Find-LocalSkill {
    if ($PSScriptRoot -and (Test-Path (Join-Path $PSScriptRoot "SKILL.md"))) {
        return $PSScriptRoot
    }
    if (Test-Path (Join-Path (Get-Location) "SKILL.md")) {
        return (Get-Location).Path
    }
    return $null
}

$src = Find-LocalSkill
$temp = $null

if (-not $src) {
    if (-not $Repo) {
        Write-Host @"
No local SKILL.md and no -Repo specified.

From an unzipped folder:
  .\install.ps1

From GitHub (after you push this folder):
  .\install.ps1 -Repo YOURUSER/ai-frontier-scout
  irm https://raw.githubusercontent.com/YOURUSER/ai-frontier-scout/main/install.ps1 | iex
  (set `$env:AI_FRONTIER_SCOUT_REPO first when piping)

Or copy the folder yourself:
  New-Item -ItemType Directory -Force -Path "$Dest"
  Copy-Item -Recurse -Force .\* "$Dest"
"@
        exit 1
    }
    $temp = Join-Path ([System.IO.Path]::GetTempPath()) ("afs-" + [guid]::NewGuid().ToString("n"))
    New-Item -ItemType Directory -Force -Path $temp | Out-Null
    $zip = Join-Path $temp "skill.zip"
    $url = "https://codeload.github.com/$Repo/zip/refs/heads/$Ref"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $temp -Force
    $extracted = Get-ChildItem $temp -Directory | Select-Object -First 1
    if (Test-Path (Join-Path $extracted.FullName "SKILL.md")) {
        $src = $extracted.FullName
    } elseif (Test-Path (Join-Path $extracted.FullName "$SkillName\SKILL.md")) {
        $src = Join-Path $extracted.FullName $SkillName
    } else {
        throw "Downloaded $Repo but could not find SKILL.md"
    }
}

if (-not (Test-Path (Join-Path $src "SKILL.md"))) {
    throw "SKILL.md missing in $src"
}

Copy-SkillTree $src

$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) { $py = Get-Command python3 -ErrorAction SilentlyContinue }
if (-not $py) { $py = Get-Command py -ErrorAction SilentlyContinue }
if ($py) {
    & $py.Source (Join-Path $Dest "scripts\scout.py") init | Out-Null
    $pyBin = $py.Source
} else {
    $pyBin = "python"
}

Write-Host ""
Write-Host "Installed $SkillName -> $Dest"
Write-Host ""
Write-Host "Verify:"
Write-Host "  hermes skills list"
Write-Host "  $pyBin `"$Dest\scripts\scout.py`" status"
Write-Host ""
Write-Host "Schedule:"
if ($py) {
    & $py.Source (Join-Path $Dest "scripts\scout.py") cron-help
} else {
    Write-Host 'hermes cron create "0 8 * * 1-5" --skill ai-frontier-scout --name "AI Frontier Scout" --deliver origin "Run the ai-frontier-scout skill exactly as written."'
}
Write-Host ""
Write-Host "In chat:  Every weekday at 8am, run ai-frontier-scout and send me the brief."

if ($temp) {
    Remove-Item -Recurse -Force $temp -ErrorAction SilentlyContinue
}
