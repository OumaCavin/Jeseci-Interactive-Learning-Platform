#!/usr/bin/env python3
"""
Simple script to test JaC file syntax using jaclang
"""
import sys
import os
from pathlib import Path

def test_jac_syntax(file_path):
    """Test JaC file syntax"""
    try:
        # Import jaclang modules
        from jaclang.compiler.parser import JacParser
        
        print(f"Testing syntax of: {file_path}")
        
        # Read the file
        with open(file_path, 'r') as f:
            content = f.read()
        
        print(f"File content length: {len(content)} characters")
        
        # Try to create a parser and parse the content
        try:
            # Create a JacParser instance
            parser = JacParser()
            
            # Try parsing the content
            result = parser.parse(content)
            print("✅ SUCCESS: JaC syntax is valid!")
            print(f"Parse result type: {type(result)}")
            
            return True
            
        except Exception as parse_error:
            print(f"❌ PARSE ERROR: {parse_error}")
            return False
            
    except Exception as e:
        print(f"❌ IMPORT ERROR: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_jac_syntax.py <jac_file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(f"❌ ERROR: File not found: {file_path}")
        sys.exit(1)
    
    success = test_jac_syntax(file_path)
    sys.exit(0 if success else 1)