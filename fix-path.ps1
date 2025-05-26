$filePath = "src\pages\nosotros\equipo\[slug].astro"
$content = Get-Content $filePath -Raw
$newContent = $content -replace "from '../../../../layouts/MainLayout.astro'", "from '../../../layouts/MainLayout.astro'"
$newContent | Set-Content $filePath -Encoding UTF8
Write-Host "Ruta corregida en [slug].astro"
