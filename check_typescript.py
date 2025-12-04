#!/usr/bin/env python3
import subprocess
import os
import sys

def run_typescript_check():
    """Check TypeScript compilation in frontend"""
    frontend_dir = "/workspace/frontend"
    
    # Change to frontend directory
    os.chdir(frontend_dir)
    
    try:
        # Run TypeScript compiler check
        print("🔍 Checking TypeScript compilation...")
        result = subprocess.run(
            ["npx", "tsc", "--noEmit", "--project", "tsconfig.json"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print("✅ TypeScript compilation successful!")
            print("No type errors found.")
            return True
        else:
            print("❌ TypeScript compilation failed!")
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("⏰ TypeScript check timed out")
        return False
    except Exception as e:
        print(f"❌ Error running TypeScript check: {e}")
        return False

if __name__ == "__main__":
    success = run_typescript_check()
    sys.exit(0 if success else 1)