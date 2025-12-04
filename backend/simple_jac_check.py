#!/usr/bin/env python3
"""
Simple syntax check for JaC files
Checks for basic structure and common syntax errors
"""
import re

def simple_jac_check(file_path):
    """Simple syntax check for JaC files"""
    print(f"Checking JaC file: {file_path}")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    issues = []
    
    # Check for basic walker structure
    walker_pattern = r'walker\s+\w+\s*\{'
    if not re.search(walker_pattern, content):
        issues.append("❌ No walker definition found")
    
    # Check for Python-style function definitions
    python_func_pattern = r'def\s+\w+\s*\('
    if re.search(python_func_pattern, content):
        issues.append("❌ Python-style function definitions found (should be 'can' functions)")
    
    # Check for Python-style variable assignments
    python_assign_pattern = r'\w+\s*=\s*\w+\s*\('
    if re.search(python_assign_pattern, content):
        issues.append("❌ Python-style variable assignments found")
    
    # Check for Python logging
    python_log_pattern = r'logger\.(info|error|warning)'
    if re.search(python_log_pattern, content):
        issues.append("❌ Python-style logging found")
    
    # Check for Python return statements
    python_return_pattern = r'return\s+'
    if re.search(python_return_pattern, content):
        issues.append("❌ Python-style return statements found (should be 'report')")
    
    # Check for Python exception handling
    python_except_pattern = r'except\s+Exception'
    if re.search(python_except_pattern, content):
        issues.append("❌ Python-style exception handling found")
    
    # Check for proper JaC can functions
    jac_can_pattern = r'can\s+\w+\s+with\s+\w+'
    if not re.search(jac_can_pattern, content):
        issues.append("❌ No proper JaC 'can' functions found")
    
    # Check for proper JaC report statements
    jac_report_pattern = r'report\s*\{'
    if not re.search(jac_report_pattern, content):
        issues.append("❌ No proper JaC 'report' statements found")
    
    # Check file structure - should not have mixed Python/JaC
    lines = content.split('\n')
    python_lines = 0
    jac_lines = 0
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('def ') or stripped.startswith('logger.') or stripped.startswith('return ') or stripped.startswith('except '):
            python_lines += 1
        elif stripped.startswith('walker ') or stripped.startswith('can ') or stripped.startswith('report '):
            jac_lines += 1
    
    if python_lines > 0 and jac_lines > 0:
        issues.append(f"❌ Mixed Python ({python_lines}) and JaC ({jac_lines}) code found")
    
    if issues:
        print("❌ SYNTAX ISSUES FOUND:")
        for issue in issues:
            print(f"  {issue}")
        return False
    else:
        print("✅ SUCCESS: Basic JaC syntax appears correct!")
        print(f"✅ Found {jac_lines} JaC lines, {python_lines} Python lines")
        print("✅ No obvious syntax errors detected")
        return True

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python simple_jac_check.py <jac_file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = simple_jac_check(file_path)
    sys.exit(0 if success else 1)