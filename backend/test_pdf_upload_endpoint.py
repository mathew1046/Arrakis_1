#!/usr/bin/env python3
"""
Test PDF upload endpoint
"""
import requests
import io
from PyPDF2 import PdfWriter, PdfReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_test_pdf():
    """Create a simple test PDF with script content"""
    # Create a PDF in memory
    buffer = io.BytesIO()
    
    # Create PDF with reportlab
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Add script content
    script_text = """
    FADE IN:
    
    EXT. CITY STREET - DAY
    
    A busy street with people walking by.
    
    INT. OFFICE - DAY
    
    JOHN sits at his desk, typing on his computer.
    
                    JOHN
        This is a test script for PDF extraction.
    
    FADE OUT.
    """
    
    # Write text to PDF
    text_object = c.beginText(50, 750)
    text_object.setFont("Courier", 12)
    
    for line in script_text.split('\n'):
        text_object.textLine(line)
    
    c.drawText(text_object)
    c.save()
    
    # Get PDF bytes
    buffer.seek(0)
    return buffer.getvalue()

def test_pdf_upload():
    """Test the PDF upload endpoint"""
    
    try:
        # Create a test PDF
        print("Creating test PDF...")
        pdf_content = create_test_pdf()
        print(f"Created PDF with {len(pdf_content)} bytes")
        
        # Prepare the file for upload
        files = {
            'file': ('test_script.pdf', pdf_content, 'application/pdf')
        }
        
        # Make the request
        print("\nUploading PDF to backend...")
        response = requests.post(
            'http://localhost:5000/api/script/upload-pdf',
            files=files
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"\n✅ PDF upload successful!")
                print(f"Extracted {data['data']['length']} characters")
                print(f"\nExtracted text preview:")
                print(data['data']['content'][:200])
            else:
                print(f"❌ Upload failed: {data.get('message')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    print("Testing PDF upload endpoint...")
    
    # Check if reportlab is available
    try:
        import reportlab
        test_pdf_upload()
    except ImportError:
        print("Note: reportlab not installed. Install with: pip install reportlab")
        print("Alternatively, test with a real PDF file using curl:")
        print('curl -X POST -F "file=@your_script.pdf" http://localhost:5000/api/script/upload-pdf')
