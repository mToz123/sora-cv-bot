@echo off
echo Generating 5 ULTIMATE CV Themes...
echo.

echo [1/5] Brown-Gold Theme...
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_1_brown-gold.pdf
echo.

echo [2/5] Blue-Silver Theme...
copy src\pdfGenerator-ultimate.py src\temp-blue.py >nul
python src\temp-blue.py test-data-ultimate.json output\cv_theme_2_blue-silver.pdf
echo.

echo [3/5] Purple-Pink Theme...
copy src\pdfGenerator-ultimate.py src\temp-purple.py >nul
python src\temp-purple.py test-data-ultimate.json output\cv_theme_3_purple-pink.pdf
echo.

echo [4/5] Green-Teal Theme...
copy src\pdfGenerator-ultimate.py src\temp-green.py >nul
python src\temp-green.py test-data-ultimate.json output\cv_theme_4_green-teal.pdf
echo.

echo [5/5] Red-Orange Theme...
copy src\pdfGenerator-ultimate.py src\temp-red.py >nul
python src\temp-red.py test-data-ultimate.json output\cv_theme_5_red-orange.pdf
echo.

echo ========================================
echo All 5 themes generated successfully!
echo ========================================
echo.
echo Opening samples...
start output\cv_theme_1_brown-gold.pdf
timeout /t 2 >nul
start output\cv_theme_2_blue-silver.pdf
timeout /t 2 >nul
start output\cv_theme_3_purple-pink.pdf
echo.
echo Check output folder for all PDFs!
pause
