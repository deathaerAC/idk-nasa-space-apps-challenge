$runtime = Get-Command node -ErrorAction SilentlyContinue

if ($runtime) {
  $runtimePath = $runtime.Source
  Write-Host "Using $($runtime.Name): $runtimePath"
} else {
  throw "Please install Node to use this build script."
}

$packageManager = Get-Command pnpm -ErrorAction SilentlyContinue
$packageManagerName = "pnpm"

if (-not $packageManager) {
  $packageManager = Get-Command npm -ErrorAction SilentlyContinue
  $packageManagerName = "npm"
}

if ($packageManager) {
  $packageManagerPath = $packageManager.Source
  Write-Host "Using $($packageManager.Name): $packageManagerPath"
} else {
  throw "Neither pnpm nor npm was found on PATH. Please download one of them."
}

Push-Location "$PSScriptRoot\\Website"
try {
  & $packageManager.Source install
  & $packageManager.Source run build
  if ($packageManagerName -eq "pnpm") {
    & $packageManager.Source approve-builds --all
  } elseif ($packageManagerName -eq "npm") {
    & $packageManager.Source approve-scripts --all
  }
} finally {
  Pop-Location
}

& $runtime "$PSScriptRoot\\Backend"