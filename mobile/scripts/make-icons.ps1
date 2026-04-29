Add-Type -AssemblyName System.Drawing

function New-Icon {
    param(
        [string]$Path,
        [int]$Size,
        [bool]$Transparent = $false
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    if ($Transparent) {
        $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } else {
        $g.Clear([System.Drawing.Color]::FromArgb(255, 8, 10, 20))
    }

    $outerMargin = [int]($Size * 0.08)
    $outerSize = $Size - (2 * $outerMargin)
    $outerRect = New-Object System.Drawing.Rectangle($outerMargin, $outerMargin, $outerSize, $outerSize)

    if (-not $Transparent) {
        $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 124, 58, 237), [Math]::Max(8, [int]($Size * 0.03)))
        $g.DrawEllipse($ringPen, $outerRect)
        $ringPen.Dispose()
    }

    $innerMargin = [int]($Size * 0.22)
    $innerSize = $Size - (2 * $innerMargin)
    $innerRect = New-Object System.Drawing.Rectangle($innerMargin, $innerMargin, $innerSize, $innerSize)
    $innerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 34, 211, 238))
    $g.FillEllipse($innerBrush, $innerRect)
    $innerBrush.Dispose()

    $fontSize = [int]($Size * 0.23)
    $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 8, 10, 20))
    $fullRect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $g.DrawString('GD', $font, $textBrush, $fullRect, $sf)

    $textBrush.Dispose()
    $font.Dispose()
    $sf.Dispose()
    $g.Dispose()

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$root = 'C:/Users/eduar/OneDrive/Documentos/Faculdade/GameDex'
$mobileAssets = Join-Path $root 'mobile/assets'

New-Icon -Path (Join-Path $mobileAssets 'icon.png') -Size 1024 -Transparent:$false
New-Icon -Path (Join-Path $mobileAssets 'favicon.png') -Size 256 -Transparent:$false
New-Icon -Path (Join-Path $mobileAssets 'adaptive-icon.png') -Size 1024 -Transparent:$true
New-Icon -Path (Join-Path $mobileAssets 'splash-icon.png') -Size 1024 -Transparent:$false

$files = @('icon.png','favicon.png','adaptive-icon.png','splash-icon.png')
foreach ($f in $files) {
  $p = Join-Path $mobileAssets $f
  $img = [System.Drawing.Image]::FromFile($p)
  Write-Output "$f => $($img.Width)x$($img.Height)"
  $img.Dispose()
}
