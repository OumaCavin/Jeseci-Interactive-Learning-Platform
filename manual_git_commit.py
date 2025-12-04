#!/usr/bin/env python3
"""
Manual Git commit using os.system
"""

import os
import sys


def main():
    """Manual git commit"""
    print("🔧 Manual Git Commit for JaC Fixes")
    print("=" * 40)
    
    os.chdir('/workspace')
    
    # Set git config
    print("Setting Git config...")
    os.system('git config user.name "OumaCavin" 2>/dev/null')
    os.system('git config user.email "cavin.otieno012@gmail.com" 2>/dev/null')
    
    # Add files
    print("Adding JaC files and test scripts...")
    files_to_add = [
        'backend/jac_layer/walkers/progress_tracker.jac',
        'backend/simple_jac_check.py',
        'backend/comprehensive_jac_test.py', 
        'backend/final_jac_fix_summary.py',
        'backend/test_jac_compilation.py'
    ]
    
    for file_path in files_to_add:
        if os.path.exists(file_path):
            cmd = f'git add "{file_path}"'
            print(f"Adding: {file_path}")
            result = os.system(cmd + ' 2>/dev/null')
    
    # Commit message
    commit_message = """fix(jac): resolve JaC compilation errors in progress_tracker walker

- Fix has declaration syntax in progress_tracker.jac (missing type annotations)
- Updated syntax from 'has user_id;' to 'has user_id: int;'
- Updated syntax from 'has lesson_id;' to 'has lesson_id: str;'  
- All 6 JaC walker files now compile successfully without errors
- Added comprehensive testing scripts for JaC syntax validation
- Django backend loads all walkers without compilation errors

This fixes the compilation failures reported when running 'jac build' commands."""
    
    # Create commit
    print("Creating commit...")
    commit_cmd = f'git commit -m "{commit_message}"'
    result = os.system(commit_cmd + ' 2>/dev/null')
    
    if result == 0:
        print("✅ Commit created successfully!")
        
        # Push to remote
        print("Pushing to GitHub...")
        push_result = os.system('git push origin main 2>/dev/null')
        
        if push_result == 0:
            print("✅ Successfully pushed to GitHub!")
            return True
        else:
            print("❌ Push failed")
            return False
    else:
        print("❌ Commit failed")
        return False


if __name__ == "__main__":
    main()