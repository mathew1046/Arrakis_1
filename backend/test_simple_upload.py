#!/usr/bin/env python3
"""
Simple test for PDF upload endpoint
"""
import requests

def test_with_dummy_file():
    """Test with a simple text file pretending to be PDF"""
    
    # Create a simple text content
    content = b"This is a test PDF content"
    
    # Prepare the file for upload
    files = {
        'file': ('test.pdf', content, 'application/pdf')
    }
    
    try:
        print("Testing PDF upload endpoint...")
        print(f"Uploading file with {len(content)} bytes")
        
        response = requests.post(
            'http://localhost:5000/api/script/upload-pdf',
            files=files
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Upload successful!")
        else:
            print(f"❌ Upload failed with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    test_with_dummy_file()
