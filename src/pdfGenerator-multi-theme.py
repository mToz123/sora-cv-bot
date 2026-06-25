#!/usr/bin/env python3
"""
ULTIMATE 20-COLOR PREMIUM CV GENERATOR
Sora CV Bot - Maximum Detail Professional Template
Created: 2026-06-25
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color, HexColor
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image, ImageDraw, ImageFilter
import json
import sys
import os

class UltimateColorPalette:
    """20-Color Premium Palette"""
    
    # PRIMARY PALETTE (Browns - Warmth & Trust)
    DEEP_ESPRESSO = HexColor('#3E2723')     # 1
    RICH_CHOCOLATE = HexColor('#5D4037')    # 2
    WARM_BROWN = HexColor('#6D4C41')        # 3
    COFFEE = HexColor('#795548')            # 4
    LIGHT_MOCHA = HexColor('#A1887F')       # 5
    
    # SECONDARY PALETTE (Golds - Luxury & Elegance)
    DEEP_GOLD = HexColor('#B8860B')         # 6
    AMBER = HexColor('#FFA000')             # 7
    GOLDEN_YELLOW = HexColor('#FFB300')     # 8
    CHAMPAGNE = HexColor('#F9A825')         # 9
    PALE_GOLD = HexColor('#FFD54F')         # 10
    
    # ACCENT PALETTE (Blacks & Grays - Contrast & Structure)
    PURE_BLACK = HexColor('#000000')        # 11
    CHARCOAL = HexColor('#212121')          # 12
    DARK_GRAY = HexColor('#424242')         # 13
    MEDIUM_GRAY = HexColor('#757575')       # 14
    LIGHT_GRAY = HexColor('#BDBDBD')        # 15
    
    # SUPPORTING PALETTE (Neutrals - Balance & Readability)
    CREAM = HexColor('#FFF8E1')             # 16
    IVORY = HexColor('#FFFDE7')             # 17
    OFF_WHITE = HexColor('#FAFAFA')         # 18
    SNOW = HexColor('#FFFFFF')              # 19
    SAND = HexColor('#EFEBE9')              # 20

class UltimateCVGenerator:
    def __init__(self):
        self.colors = UltimateColorPalette()
        self.page_width, self.page_height = A4
        self.margin = 20 * mm
        
    def draw_gradient_rect(self, c, x, y, width, height, color1, color2, steps=50):
        """Draw vertical gradient rectangle"""
        step_height = height / steps
        for i in range(steps):
            ratio = i / steps
            # Interpolate between colors
            r = color1.red + (color2.red - color1.red) * ratio
            g = color1.green + (color2.green - color1.green) * ratio
            b = color1.blue + (color2.blue - color1.blue) * ratio
            c.setFillColor(Color(r, g, b))
            c.rect(x, y + (height - (i + 1) * step_height), width, step_height, fill=1, stroke=0)
    
    def draw_gradient_line(self, c, x1, y1, x2, y2, color1, color2, thickness=1):
        """Draw horizontal gradient line"""
        steps = 100
        step_width = (x2 - x1) / steps
        for i in range(steps):
            ratio = i / steps
            r = color1.red + (color2.red - color1.red) * ratio
            g = color1.green + (color2.green - color1.green) * ratio
            b = color1.blue + (color2.blue - color1.blue) * ratio
            c.setStrokeColor(Color(r, g, b))
            c.setLineWidth(thickness)
            c.line(x1 + i * step_width, y1, x1 + (i + 1) * step_width, y2)
    
    def draw_rounded_rect_with_shadow(self, c, x, y, width, height, radius, fill_color, shadow_color):
        """Draw rounded rectangle with shadow effect"""
        # Shadow
        c.setFillColor(shadow_color)
        c.roundRect(x + 2, y - 2, width, height, radius, fill=1, stroke=0)
        
        # Main rectangle
        c.setFillColor(fill_color)
        c.roundRect(x, y, width, height, radius, fill=1, stroke=0)
    
    def draw_decorative_corner(self, c, x, y, size, color):
        """Draw decorative triangle corner"""
        c.setFillColor(color)
        p = c.beginPath()
        p.moveTo(x, y)
        p.lineTo(x + size, y)
        p.lineTo(x, y - size)
        p.close()
        c.drawPath(p, fill=1, stroke=0)
    
    def process_circular_photo(self, photo_path, output_size=60):
        """Process photo into circular format with decorative frame"""
        try:
            # Open image
            img = Image.open(photo_path).convert('RGBA')
            
            # Resize to square
            size = output_size * 10  # Higher resolution for quality
            img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Create circular mask
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, size, size), fill=255)
            
            # Apply mask
            output = Image.new('RGBA', (size, size), (255, 255, 255, 0))
            output.paste(img, (0, 0), mask)
            
            # Add glow effect
            glow = Image.new('RGBA', (size + 40, size + 40), (255, 160, 0, 0))
            glow_draw = ImageDraw.Draw(glow)
            for i in range(20):
                alpha = int(100 - i * 5)
                glow_draw.ellipse((i, i, size + 40 - i, size + 40 - i), 
                                outline=(255, 160, 0, alpha), width=2)
            
            # Composite
            final = Image.new('RGBA', (size + 40, size + 40), (255, 255, 255, 0))
            final.paste(glow, (0, 0))
            final.paste(output, (20, 20), output)
            
            # Save temp
            base = os.path.splitext(photo_path)[0]
            ext = os.path.splitext(photo_path)[1]
            temp_path = f"{base}_circular{ext}"
            final.save(temp_path, 'PNG')
            return temp_path
            
        except Exception as e:
            print(f"[ERROR] Error processing photo: {e}")
            return None
    
    def generate(self, data, output_path):
        """Generate ULTIMATE 20-COLOR Premium CV"""
        
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4
        
        # ==========================================
        # HEADER SECTION (30% of page with 3-color gradient)
        # ==========================================
        header_height = 85 * mm
        
        # Triple gradient background (Colors 1, 2, 3)
        self.draw_gradient_rect(c, 0, height - header_height, width, header_height/3, 
                               self.colors.DEEP_ESPRESSO, self.colors.RICH_CHOCOLATE)
        self.draw_gradient_rect(c, 0, height - 2*header_height/3, width, header_height/3,
                               self.colors.RICH_CHOCOLATE, self.colors.WARM_BROWN)
        self.draw_gradient_rect(c, 0, height - header_height, width, header_height/3,
                               self.colors.WARM_BROWN, self.colors.COFFEE)
        
        # Decorative gold border at bottom (Colors 6, 7)
        self.draw_gradient_line(c, 0, height - header_height, width, height - header_height,
                               self.colors.DEEP_GOLD, self.colors.AMBER, thickness=3)
        
        # ==========================================
        # PHOTO (70mm with gold frame)
        # ==========================================
        photo_size = 70 * mm
        photo_x = self.margin
        photo_y = height - self.margin - photo_size
        
        if data.get('photoPath') and os.path.exists(data['photoPath']):
            processed_photo = self.process_circular_photo(data['photoPath'], 70)
            if processed_photo:
                # Gold frame (Color 6)
                c.setStrokeColor(self.colors.DEEP_GOLD)
                c.setLineWidth(4)
                c.circle(photo_x + photo_size/2, photo_y + photo_size/2, photo_size/2 + 2, stroke=1, fill=0)
                
                # Amber glow (Color 7)
                c.setStrokeColor(self.colors.AMBER)
                c.setLineWidth(1)
                c.circle(photo_x + photo_size/2, photo_y + photo_size/2, photo_size/2 + 5, stroke=1, fill=0)
                
                # Insert photo
                c.drawImage(processed_photo, photo_x, photo_y, photo_size, photo_size, mask='auto')
        else:
            # Placeholder circle
            c.setStrokeColor(self.colors.DEEP_GOLD)
            c.setLineWidth(3)
            c.circle(photo_x + photo_size/2, photo_y + photo_size/2, photo_size/2, stroke=1, fill=0)
        
        # ==========================================
        # NAME & TITLE (right of photo)
        # ==========================================
        text_x = photo_x + photo_size + 15 * mm
        text_y = photo_y + photo_size - 15 * mm
        
        # Name with shadow effect (Colors 11, 12, 19)
        c.setFont('Times-Bold', 36)
        # Shadow (Color 12)
        c.setFillColor(self.colors.CHARCOAL)
        c.drawString(text_x + 1, text_y - 1, data['name'].upper())
        # White glow (Color 19)
        c.setFillColor(self.colors.SNOW)
        c.drawString(text_x + 0.5, text_y + 0.5, data['name'].upper())
        # Main text (Color 11)
        c.setFillColor(self.colors.PURE_BLACK)
        c.drawString(text_x, text_y, data['name'].upper())
        
        # Decorative underline (Colors 6, 10 gradient)
        name_width = c.stringWidth(data['name'].upper(), 'Times-Bold', 36)
        self.draw_gradient_line(c, text_x, text_y - 3, text_x + name_width, text_y - 3,
                               self.colors.DEEP_GOLD, self.colors.PALE_GOLD, thickness=2)
        
        # Title (Color 19)
        c.setFont('Times-Italic', 16)
        c.setFillColor(self.colors.SNOW)
        c.drawString(text_x, text_y - 12 * mm, data['title'])
        
        # ==========================================
        # CONTACT INFO BOX (with cream background)
        # ==========================================
        contact_box_y = text_y - 25 * mm
        contact_box_width = width - text_x - self.margin
        contact_box_height = 22 * mm
        
        # Background with shadow (Colors 16, 12)
        self.draw_rounded_rect_with_shadow(c, text_x - 3, contact_box_y, contact_box_width, contact_box_height,
                                          4, self.colors.CREAM, self.colors.CHARCOAL)
        
        # Decorative corner (Color 8)
        self.draw_decorative_corner(c, text_x - 3, contact_box_y + contact_box_height, 8 * mm, self.colors.GOLDEN_YELLOW)
        
        # Contact details
        c.setFont('Times-Bold', 10)
        c.setFillColor(self.colors.DEEP_GOLD)  # Color 6
        contact_y = contact_box_y + contact_box_height - 6 * mm
        
        c.drawString(text_x + 3, contact_y, 'EMAIL:')
        c.setFont('Times-Roman', 10)
        c.setFillColor(self.colors.PURE_BLACK)  # Color 11
        c.drawString(text_x + 18, contact_y, data['email'])
        
        c.setFont('Times-Bold', 10)
        c.setFillColor(self.colors.DEEP_GOLD)
        c.drawString(text_x + 3, contact_y - 6 * mm, 'PHONE:')
        c.setFont('Times-Roman', 10)
        c.setFillColor(self.colors.PURE_BLACK)
        c.drawString(text_x + 18, contact_y - 6 * mm, data.get('phone', 'N/A'))
        
        c.setFont('Times-Bold', 10)
        c.setFillColor(self.colors.DEEP_GOLD)
        c.drawString(text_x + 3, contact_y - 12 * mm, 'LOCATION:')
        c.setFont('Times-Roman', 10)
        c.setFillColor(self.colors.PURE_BLACK)
        c.drawString(text_x + 23, contact_y - 12 * mm, data.get('location', 'N/A'))
        
        # ==========================================
        # CONTENT SECTIONS
        # ==========================================
        y_position = height - header_height - 15 * mm
        
        # Helper function for section headers
        def draw_section_header(title, y_pos):
            # Background box (Colors 17, 20)
            self.draw_rounded_rect_with_shadow(c, self.margin - 2, y_pos - 2, 
                                              width - 2 * self.margin + 4, 12 * mm,
                                              3, self.colors.IVORY, self.colors.SAND)
            
            # Triangle accent (Color 8)
            self.draw_decorative_corner(c, self.margin - 2, y_pos + 10 * mm, 6 * mm, self.colors.GOLDEN_YELLOW)
            
            # Title (Color 2)
            c.setFont('Times-Bold', 16)
            c.setFillColor(self.colors.RICH_CHOCOLATE)
            c.drawString(self.margin + 5, y_pos + 5 * mm, title.upper())
            
            # Top border (Color 6)
            c.setStrokeColor(self.colors.DEEP_GOLD)
            c.setLineWidth(2)
            c.line(self.margin, y_pos + 10 * mm, width - self.margin, y_pos + 10 * mm)
            
            # Bottom gradient border (Colors 7, 10)
            self.draw_gradient_line(c, self.margin, y_pos, width - self.margin, y_pos,
                                   self.colors.AMBER, self.colors.PALE_GOLD, thickness=1)
            
            return y_pos - 5 * mm
        
        # PROFESSIONAL SUMMARY
        if data.get('summary'):
            y_position = draw_section_header('PROFESSIONAL SUMMARY', y_position)
            
            c.setFont('Times-Roman', 11)
            c.setFillColor(self.colors.PURE_BLACK)
            
            # Word wrap
            lines = []
            words = data['summary'].split()
            line = ''
            max_width = width - 2 * self.margin - 10
            
            for word in words:
                test_line = line + word + ' '
                if c.stringWidth(test_line, 'Times-Roman', 11) < max_width:
                    line = test_line
                else:
                    if line:
                        lines.append(line.strip())
                    line = word + ' '
            if line:
                lines.append(line.strip())
            
            for line in lines:
                y_position -= 5 * mm
                c.drawString(self.margin + 5, y_position, line)
            
            y_position -= 10 * mm
        
        # EXPERIENCE
        if data.get('sections', {}).get('experience'):
            y_position = draw_section_header('EXPERIENCE', y_position)
            
            for exp in data['sections']['experience']:
                y_position -= 8 * mm
                
                # Square bullet (Color 9)
                c.setFillColor(self.colors.CHAMPAGNE)
                c.rect(self.margin + 5, y_position + 1, 2, 2, fill=1, stroke=0)
                
                # Job title (Color 11)
                c.setFont('Times-Bold', 13)
                c.setFillColor(self.colors.PURE_BLACK)
                c.drawString(self.margin + 10, y_position, exp.get('title', 'Position').upper())
                
                y_position -= 6 * mm
                
                # Company (Color 12 italic)
                c.setFont('Times-Italic', 11)
                c.setFillColor(self.colors.CHARCOAL)
                company_text = f"{exp.get('company', 'Company')} • {exp.get('period', 'N/A')}"
                c.drawString(self.margin + 10, y_position, company_text)
                
                # Description
                if exp.get('description'):
                    y_position -= 6 * mm
                    c.setFont('Times-Roman', 10)
                    c.setFillColor(self.colors.PURE_BLACK)
                    
                    # Bullet point
                    c.setFillColor(self.colors.CHAMPAGNE)
                    c.circle(self.margin + 12, y_position + 1.5, 1, fill=1, stroke=0)
                    
                    c.setFillColor(self.colors.PURE_BLACK)
                    desc_lines = exp['description'][:200]  # Truncate for space
                    c.drawString(self.margin + 16, y_position, desc_lines)
                
                y_position -= 6 * mm
            
            y_position -= 5 * mm
        
        # Save PDF
        c.save()
        print(f"[SUCCESS] ULTIMATE 20-COLOR Premium CV generated: {output_path}")
        return output_path

def main():
    if len(sys.argv) < 3:
        print("Usage: python pdfGenerator-ultimate.py <data.json> <output.pdf>")
        sys.exit(1)
    
    data_file = sys.argv[1]
    output_file = sys.argv[2]
    
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    generator = UltimateCVGenerator()
    generator.generate(data, output_file)

if __name__ == '__main__':
    main()
