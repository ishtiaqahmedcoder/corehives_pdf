<?php

return [
    'qpdf' => env('QPDF_BINARY', 'qpdf'),
    'ghostscript' => env('GHOSTSCRIPT_BINARY', 'gswin64c'),
    'tesseract' => env('TESSERACT_BINARY', 'tesseract'),
    'libreoffice' => env('LIBREOFFICE_BINARY', 'soffice'),
    'wkhtmltoimage' => env('WKHTMLTOIMAGE_BINARY', 'wkhtmltoimage'),
    'python' => env('PYTHON_BINARY', 'python'),
    'realesrgan' => env('REALESRGAN_BINARY', 'realesrgan-ncnn-vulkan'),
    'realesrgan_models' => env('REALESRGAN_MODELS_PATH', base_path('bin/realesrgan/models')),
];
