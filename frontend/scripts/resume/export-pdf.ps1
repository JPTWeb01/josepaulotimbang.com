# Converts the generated resume .docx to PDF with Microsoft Word and copies it
# to public/, where the resume page's "Download PDF" button links to.
$ErrorActionPreference = "Stop"
$docx = Join-Path $PSScriptRoot "out\jose-paulo-timbang-resume.docx"
$pdf = Join-Path $PSScriptRoot "..\..\public\jose-paulo-timbang-resume.pdf"
$pdf = [System.IO.Path]::GetFullPath($pdf)
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $doc = $word.Documents.Open($docx, $false, $true)
  Write-Host ("pages: " + $doc.ComputeStatistics(2))
  $doc.ExportAsFixedFormat($pdf, 17)
  $doc.Close($false)
} finally {
  $word.Quit()
}
Write-Host "wrote $pdf"
