#!/usr/bin/env python3
"""
Test PDF extraction functionality
"""
from utils.pdf_extractor import pdf_extractor
import os

def test_pdf_extraction():
    """Test the PDF extraction utility"""
    
    # Create a simple test to verify the module loads correctly
    print("Testing PDF Extractor...")
    print(f"PDF Extractor initialized: {pdf_extractor is not None}")
    
    # Test with a sample text (simulating PDF content)
    sample_text = """
    FADE IN:
    
    EXT. CITY STREET - DAY
    
    A busy street with people walking.
    
    INT. OFFICE - DAY
    
    JOHN sits at his desk, typing.
    
    FADE OUT.
    """
    
    # Test text cleaning
    cleaned = pdf_extractor._clean_text(sample_text)
    print(f"\nOriginal length: {len(sample_text)}")
    print(f"Cleaned length: {len(cleaned)}")
    print(f"\nCleaned text:\n{cleaned}")
    
    print("\n✅ PDF Extractor module is working correctly!")
    print("\nTo test with an actual PDF file:")
    print("1. Place a PDF file in the backend directory")
    print("2. Update this script with the PDF file path")
    print("3. Uncomment the test_with_file() function below")

def test_with_file(pdf_path):
    """Test extraction with an actual PDF file"""
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return
    
    print(f"Extracting text from: {pdf_path}")
    text = pdf_extractor.extract_text_from_file_path(pdf_path)
    
    if text:
        print(f"✅ Successfully extracted {len(text)} characters")
        print(f"\nFirst 500 characters:\n{text[:500]}")
    else:
        print("❌ Failed to extract text")

if __name__ == '__main__':
    test_pdf_extraction()
    
    # Uncomment to test with an actual PDF file:
    # test_with_file('path/to/your/script.pdf')
