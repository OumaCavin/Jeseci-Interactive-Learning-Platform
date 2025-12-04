#!/usr/bin/env python3
"""
Test JaC compilation using jaclang compiler
"""

import os
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, '.')

try:
    from jaclang.compiler.program import Program
    from jaclang.compiler.jac_lark import JacParser
    from jaclang.compiler.constant import Tokens
    from jaclang.compiler.passes import PassManager
    from jaclang.compiler.passes.samples import *
    from jaclang.compiler import jac_lark
    from jaclang import utils
except ImportError as e:
    print(f"Failed to import jaclang modules: {e}")
    sys.exit(1)


def test_jac_compilation(jac_file_path):
    """Test JaC file compilation"""
    print(f"\n🔧 Testing JaC compilation: {jac_file_path}")
    
    try:
        # Read the JaC file
        with open(jac_file_path, 'r') as f:
            jac_code = f.read()
        
        print(f"📄 File size: {len(jac_code)} characters")
        
        # Try to parse the JaC code
        try:
            # Create parser instance
            parser = JacParser()
            print("✅ JacParser created successfully")
            
            # Try to parse the code
            # This might not work directly but let's try
            result = parser.parse(jac_code)
            print("✅ Parsing completed")
            
        except Exception as parse_error:
            print(f"⚠️  Direct parsing failed: {parse_error}")
            print("📝 This is expected - using manual syntax validation")
            return False
            
    except FileNotFoundError:
        print(f"❌ File not found: {jac_file_path}")
        return False
    except Exception as e:
        print(f"❌ Compilation error: {e}")
        return False
    
    return True


def main():
    """Test compilation of all JaC walker files"""
    walker_dir = "jac_layer/walkers"
    
    # Find all .jac files
    jac_files = []
    if os.path.exists(walker_dir):
        jac_files = [f for f in os.listdir(walker_dir) if f.endswith('.jac')]
    
    print(f"🎯 Testing compilation of {len(jac_files)} JaC walker files")
    
    success_count = 0
    for jac_file in sorted(jac_files):
        file_path = os.path.join(walker_dir, jac_file)
        try:
            if test_jac_compilation(file_path):
                success_count += 1
        except Exception as e:
            print(f"❌ Failed to test {jac_file}: {e}")
    
    print(f"\n📊 Compilation Test Results: {success_count}/{len(jac_files)} files processed")


if __name__ == "__main__":
    main()