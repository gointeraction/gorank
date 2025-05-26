# Script para recuperar la estructura de páginas desde dist a src/pages
$distDir = Join-Path $PSScriptRoot "dist"
$pagesDir = Join-Path $PSScriptRoot "src\pages"

# Crear directorio de páginas si no existe
if (-not (Test-Path $pagesDir)) {
    New-Item -ItemType Directory -Path $pagesDir -Force | Out-Null
}

# Función para copiar la estructura de directorios
function Copy-DirectoryStructure {
    param (
        [string]$source,
        [string]$destination
    )
    
    # Crear directorio de destino si no existe
    if (-not (Test-Path $destination)) {
        New-Item -ItemType Directory -Path $destination -Force | Out-Null
    }
    
    # Copiar archivos HTML y convertirlos a .astro
    Get-ChildItem -Path $source -File -Filter "*.html" | ForEach-Object {
        $relativePath = $_.FullName.Substring($distDir.Length + 1)
        $targetFile = Join-Path $pagesDir $relativePath -replace '\.html$', '.astro'
        $targetDir = Split-Path $targetFile -Parent
        
        # Crear directorio de destino si no existe
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Leer contenido HTML
        $content = Get-Content $_.FullName -Raw
        
        # Extraer título
        $title = if ($content -match '<title>(.*?)</title>') { $matches[1] } else { "Nueva Página" }
        
        # Crear contenido Astro
        $astroContent = @"
---
// Archivo recuperado: $($_.Name)
const title = "$($title.Replace('"', '\"'))";
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <!-- Contenido de la página -->
    <div>
      $($content -replace '(?s)<!DOCTYPE.*?<body[^>]*>', '' -replace '</body>.*', '')
    </div>
  </body>
</html>
"@
        
        # Guardar archivo .astro
        Set-Content -Path $targetFile -Value $astroContent -Encoding UTF8
        Write-Host "✅ $($_.Name) -> $(Split-Path $targetFile -Leaf)"
    }
    
    # Procesar subdirectorios
    Get-ChildItem -Path $source -Directory | Where-Object { $_.Name -notin @('_astro', 'images', 'img', 'assets') } | ForEach-Object {
        $relativePath = $_.FullName.Substring($distDir.Length + 1)
        $targetDir = Join-Path $pagesDir $relativePath
        Copy-DirectoryStructure -source $_.FullName -destination $targetDir
    }
}

# Iniciar la recuperación
Write-Host "🚀 Iniciando recuperación de páginas desde $distDir a $pagesDir" -ForegroundColor Cyan
Copy-DirectoryStructure -source $distDir -destination $pagesDir
Write-Host "\n✅ ¡Proceso completado! Las páginas se han guardado en: $pagesDir" -ForegroundColor Green
