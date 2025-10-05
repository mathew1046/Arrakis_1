"""
PDF Text Extraction Utility
Extracts text content from PDF files for script processing
"""

import io
import PyPDF2
from typing import Optional

class PDFExtractor:
    """Handles PDF text extraction"""
    
    def __init__(self):
        pass
    
    def extract_text_from_pdf(self, pdf_file) -> Optional[str]:
        """
        Extract text content from a PDF file
        
        Args:
            pdf_file: File object or bytes containing PDF data
            
        Returns:
            Extracted text as string, or None if extraction fails
        """
        try:
            # If pdf_file is bytes, wrap it in BytesIO
            if isinstance(pdf_file, bytes):
                pdf_file = io.BytesIO(pdf_file)
            
            # Create PDF reader
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extract text from all pages
            text_content = []
            total_pages = len(pdf_reader.pages)
            
            print(f"Extracting text from {total_pages} pages...")
            
            for page_num in range(total_pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                
                if text:
                    text_content.append(text)
                    print(f"Extracted page {page_num + 1}/{total_pages}")
            
            # Join all pages with double newline
            full_text = '\n\n'.join(text_content)
            
            # Clean up the text
            full_text = self._clean_text(full_text)
            
            print(f"Successfully extracted {len(full_text)} characters")
            return full_text
            
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
            return None
    
    def _clean_text(self, text: str) -> str:
        """
        Clean and format extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove excessive whitespace
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Strip whitespace from each line
            line = line.strip()
            
            # Skip empty lines but preserve intentional breaks
            if line:
                cleaned_lines.append(line)
        
        # Join lines with single newline
        cleaned_text = '\n'.join(cleaned_lines)
        
        # Replace multiple spaces with single space
        import re
        cleaned_text = re.sub(r' +', ' ', cleaned_text)
        
        return cleaned_text
    
    def extract_text_from_file_path(self, file_path: str) -> Optional[str]:
        """
        Extract text from PDF file given a file path
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text as string, or None if extraction fails
        """
        try:
            with open(file_path, 'rb') as file:
                return self.extract_text_from_pdf(file)
        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")
            return None
    
    def validate_pdf(self, pdf_file) -> bool:
        """
        Validate if the file is a valid PDF
        
        Args:
            pdf_file: File object or bytes containing PDF data
            
        Returns:
            True if valid PDF, False otherwise
        """
        try:
            if isinstance(pdf_file, bytes):
                pdf_file = io.BytesIO(pdf_file)
            
            # Try to create a PDF reader
            PyPDF2.PdfReader(pdf_file)
            return True
            
        except Exception as e:
            print(f"Invalid PDF file: {str(e)}")
            return False

# Global instance for easy access
pdf_extractor = PDFExtractor()
