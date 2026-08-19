<?php

return [
    'qpdf' => env('QPDF_BINARY', 'qpdf'),
    'ghostscript' => env('GHOSTSCRIPT_BINARY', 'gswin64c'),
    'tesseract' => env('TESSERACT_BINARY', 'tesseract'),
    'libreoffice' => env('LIBREOFFICE_BINARY', 'soffice'),
    'wkhtmltoimage' => env('WKHTMLTOIMAGE_BINARY', 'wkhtmltoimage'),
];
