#!/usr/bin/env python3
"""
Generate all 5 ULTIMATE CV themes at once
"""
import subprocess
import sys
import os

themes = {
    'brown-gold': 'Professional Brown-Gold',
    'blue-silver': 'Corporate Blue-Silver', 
    'purple-pink': 'Creative Purple-Pink',
    'green-teal': 'Modern Green-Teal',
    'red-orange': 'Elegant Red-Orange'
}

data_file = 'test-data-ultimate.json'

print("=" * 50)
print("Generating 5 ULTIMATE CV Themes")
print("=" * 50)
print()

for i, (theme_key, theme_name) in enumerate(themes.items(), 1):
    output_file = f'output/cv_theme_{i}_{theme_key}.pdf'
    print(f"[{i}/5] {theme_name}...")
    
    # Call pdfGenerator-ultimate.py (akan gw modif untuk terima theme param)
    result = subprocess.run([
        'python', 
        'src/pdfGenerator-ultimate.py',
        data_file,
        output_file
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"     ✓ Generated: {output_file}")
    else:
        print(f"     ✗ Error: {result.stderr}")
    print()

print("=" * 50)
print("All themes generated!")
print("=" * 50)
print("\nOpening samples...")

# Open first 3 PDFs
os.system('start output\\cv_theme_1_brown-gold.pdf')
os.system('timeout /t 2 >nul')
os.system('start output\\cv_theme_2_blue-silver.pdf')
os.system('timeout /t 2 >nul')
os.system('start output\\cv_theme_3_purple-pink.pdf')

print("\nCheck 'output' folder for all 5 PDFs!")
