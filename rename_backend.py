#!/usr/bin/env python3
import shutil
import os

# Source and target paths
source = '/workspace/backend/backend'
target = '/workspace/backend/jeseci_platform'

# Remove target if it exists
if os.path.exists(target):
    shutil.rmtree(target)

# Create target directory
os.makedirs(target, exist_ok=True)

# Copy all files and subdirectories
for item in os.listdir(source):
    src_path = os.path.join(source, item)
    dst_path = os.path.join(target, item)
    if os.path.isdir(src_path):
        shutil.copytree(src_path, dst_path)
    else:
        shutil.copy2(src_path, dst_path)

print('Successfully copied backend to jeseci_platform')

# Remove old backend directory
shutil.rmtree(source)
print('Successfully removed old backend directory')

# Verify the new structure
print('\nNew structure:')
for item in os.listdir('/workspace/backend'):
    if os.path.isdir(os.path.join('/workspace/backend', item)):
        print(f'  {item}/')
        for subitem in os.listdir(os.path.join('/workspace/backend', item)):
            print(f'    {subitem}')
    else:
        print(f'  {item}')