#!/bin/bash

# Migration script to convert .py Jac files to .jac extension
# Usage: ./scripts/migrate_py_to_jac.sh

set -e

echo "🔄 Starting migration from .py to .jac files..."

# Find all .py files in the backend/jac_layer directory
PY_JAC_FILES=$(find /workspace/backend/jac_layer -name "*.py" -type f)

if [ -z "$PY_JAC_FILES" ]; then
    echo "ℹ️  No .py files found in backend/jac_layer directory. All walkers already have .jac extension."
    exit 0
fi

for py_file in $PY_JAC_FILES; do
    if [[ "$py_file" == *"walker"* ]] || [[ "$py_file" == *"motivator"* ]] || [[ "$py_file" == *"evaluator"* ]]; then
        jac_file="${py_file%.py}.jac"
        
        echo "📁 Converting: $py_file → $jac_file"
        
        # Check if .jac file already exists
        if [ -f "$jac_file" ]; then
            echo "⚠️  $jac_file already exists. Skipping conversion."
            continue
        fi
        
        # Copy content and rename extension
        cp "$py_file" "$jac_file"
        
        # Update imports in the .jac file
        sed -i 's/\.py/.jac/g' "$jac_file"
        sed -i 's/from \.\([a-zA-Z_][a-zA-Z0-9_]*\)\. import/from \1.jac import/g' "$jac_file"
        
        echo "✅ Successfully converted: $jac_file"
        
        # Backup original .py file
        mv "$py_file" "${py_file}.backup"
        echo "📦 Backed up original: ${py_file}.backup"
    fi
done

echo "🎉 Migration completed! All Jac walker files now have .jac extension."
echo "📋 Verification: Running walker check..."
find /workspace/backend/jac_layer -name "*.jac" | wc -l | xargs echo "Total .jac files found:"

echo "✅ Migration script completed successfully."