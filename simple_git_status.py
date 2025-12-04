#!/usr/bin/env python3
"""
Simple Git status check
"""

import subprocess
import sys
import os

def check_git_simple():
    """Simple git status check"""
    try:
        os.chdir('/workspace')
        
        # Check git status
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, timeout=5)
        
        print("Git Status:")
        print("=" * 30)
        
        if result.stdout.strip():
            print("Modified files:")
            print(result.stdout)
        else:
            print("No changes detected")
        
        # Check current branch
        try:
            branch_result = subprocess.run(['git', 'branch', '--show-current'], 
                                         capture_output=True, text=True, timeout=3)
            if branch_result.returncode == 0:
                print(f"\nCurrent branch: {branch_result.stdout.strip()}")
        except:
            print("Could not determine current branch")
            
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print("Git status check timed out")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    check_git_simple()