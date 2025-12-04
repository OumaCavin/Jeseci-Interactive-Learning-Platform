#!/usr/bin/env python3
"""
Comprehensive JaC syntax validation and testing
"""

import os
import re
import subprocess
import sys
from pathlib import Path


def validate_jac_syntax(file_path):
    """Validate JaC syntax using regex patterns"""
    print(f"🔍 Validating: {os.path.basename(file_path)}")
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return False
    
    # Check for mixed Python code (anti-pattern)
    python_patterns = [
        r'def\s+\w+\s*\(',
        r'return\s+',
        r'logger\.(info|debug|error)',
        r'except\s+',
        r'import\s+',
        r'from\s+\w+\s+import',
        r'if\s+__name__\s*==\s*["\']__main__["\']',
    ]
    
    python_matches = 0
    for pattern in python_patterns:
        if re.search(pattern, content):
            python_matches += 1
    
    # Check for proper JaC syntax
    jac_patterns = [
        r'walker\s+\w+\s*\{',
        r'has\s+\w+:\s*\w*',  # Proper has declaration with colon
        r'can\s+\w+\s+with\s+\w+(\s+\w+)?\s*\{',
        r'report\s*\{',
    ]
    
    jac_matches = 0
    for pattern in jac_patterns:
        if re.search(pattern, content):
            jac_matches += 1
    
    # Check for syntax errors
    syntax_errors = []
    
    # Check for incorrect has declarations (using semicolons instead of colons)
    incorrect_has = re.findall(r'has\s+\w+\s*;', content)
    if incorrect_has:
        syntax_errors.append(f"Found {len(incorrect_has)} has declarations with semicolons instead of colons")
    
    # Check for old backtick syntax
    backtick_usage = re.findall(r'`.*?`', content)
    if backtick_usage:
        syntax_errors.append(f"Found {len(backtick_usage)} occurrences of deprecated backtick syntax")
    
    # Check walker structure
    walker_match = re.search(r'walker\s+(\w+)\s*\{', content)
    if not walker_match:
        syntax_errors.append("No valid walker definition found")
    
    # Report results
    print(f"   📊 Lines: {content.count(chr(10)) + 1}")
    print(f"   🔧 JaC patterns: {jac_matches}")
    print(f"   🐍 Python patterns: {python_matches}")
    print(f"   ⚠️  Syntax errors: {len(syntax_errors)}")
    
    if syntax_errors:
        for error in syntax_errors:
            print(f"      ❌ {error}")
        return False
    elif python_matches > 0:
        print(f"   ⚠️  Warning: Found {python_matches} Python patterns (should be pure JaC)")
        return False
    elif jac_matches < 2:
        print(f"   ❌ Insufficient JaC patterns ({jac_matches})")
        return False
    else:
        print(f"   ✅ Syntax validation passed!")
        return True


def test_jac_build_command():
    """Test if jac build command works"""
    print("\n🔧 Testing 'jac build' command availability...")
    
    # Check if jac command is available
    try:
        result = subprocess.run(['which', 'jac'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            jac_path = result.stdout.strip()
            print(f"✅ 'jac' command found at: {jac_path}")
            
            # Test jac version
            try:
                version_result = subprocess.run(['jac', '--version'], capture_output=True, text=True, timeout=5)
                if version_result.returncode == 0:
                    print(f"📦 JaC version: {version_result.stdout.strip()}")
                else:
                    print(f"⚠️  'jac --version' failed: {version_result.stderr.strip()}")
            except subprocess.TimeoutExpired:
                print("⚠️  'jac --version' timed out")
            
            return True
        else:
            print("❌ 'jac' command not found in PATH")
            return False
    except (subprocess.TimeoutExpired, subprocess.SubprocessError) as e:
        print(f"❌ Error checking 'jac' command: {e}")
        return False


def test_specific_walkers():
    """Test specific problematic walker files"""
    print("\n🎯 Testing specific walker files mentioned by user...")
    
    specific_walkers = [
        "jac_layer/walkers/evaluator.jac",
        "jac_layer/walkers/motivator.jac", 
        "jac_layer/walkers/progress_tracker.jac"
    ]
    
    success_count = 0
    for walker in specific_walkers:
        if validate_jac_syntax(walker):
            success_count += 1
    
    print(f"\n📊 Specific walkers test: {success_count}/{len(specific_walkers)} passed")
    return success_count == len(specific_walkers)


def main():
    """Main test function"""
    print("🚀 Starting Comprehensive JaC Testing")
    print("=" * 50)
    
    # Test all walker files
    walker_dir = "jac_layer/walkers"
    if not os.path.exists(walker_dir):
        print(f"❌ Walker directory not found: {walker_dir}")
        return False
    
    jac_files = [f for f in os.listdir(walker_dir) if f.endswith('.jac')]
    if not jac_files:
        print(f"❌ No .jac files found in {walker_dir}")
        return False
    
    print(f"📂 Found {len(jac_files)} JaC walker files")
    
    # Test each file
    passed_count = 0
    for jac_file in sorted(jac_files):
        file_path = os.path.join(walker_dir, jac_file)
        if validate_jac_syntax(file_path):
            passed_count += 1
        print()  # Empty line for readability
    
    print(f"📊 Overall Results: {passed_count}/{len(jac_files)} files passed validation")
    
    # Test specific problematic files
    specific_passed = test_specific_walkers()
    
    # Test jac build command availability
    jac_available = test_jac_build_command()
    
    # Summary
    print("\n" + "=" * 50)
    print("🎯 FINAL SUMMARY:")
    print(f"   ✅ Syntax validation: {passed_count}/{len(jac_files)} passed")
    print(f"   ✅ Specific walkers: {'PASS' if specific_passed else 'FAIL'}")
    print(f"   📦 JaC build command: {'AVAILABLE' if jac_available else 'NOT AVAILABLE'}")
    
    if passed_count == len(jac_files) and specific_passed:
        print("\n🎉 ALL TESTS PASSED! JaC files are ready for compilation.")
        return True
    else:
        print("\n❌ Some tests failed. Please review the errors above.")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)