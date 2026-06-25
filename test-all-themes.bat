@echo off
echo ============================================
echo Generating 5 ULTIMATE CV Color Themes
echo ============================================
echo.

echo [1/5] Brown-Gold (Warm Professional)
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_1_brown-gold.pdf
echo.

echo [2/5] Blue-Silver (Corporate Modern) 
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_2_blue-silver.pdf
echo.

echo [3/5] Purple-Pink (Creative Bold)
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_3_purple-pink.pdf
echo.

echo [4/5] Green-Teal (Fresh Balanced)
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_4_green-teal.pdf
echo.

echo [5/5] Red-Orange (Energetic Confident)
python src\pdfGenerator-ultimate.py test-data-ultimate.json output\cv_theme_5_red-orange.pdf
echo.

echo ============================================
echo SUCCESS: All 5 themes generated!
echo ============================================
echo.
echo Opening sample PDFs...
start output\cv_theme_1_brown-gold.pdf
timeout /t 3 >nul
start output\cv_theme_2_blue-silver.pdf
timeout /t 3 >nul  
start output\cv_theme_3_purple-pink.pdf
echo.
echo Check output\ folder for all 5 PDFs!
pause
