import shutil
import os

# Remove old backend directory
backend_path = '/workspace/backend/backend'
if os.path.exists(backend_path):
    shutil.rmtree(backend_path)
    print("Successfully removed old backend directory")
else:
    print("backend directory does not exist")

# List remaining structure
print("\nFinal structure:")
for item in sorted(os.listdir('/workspace/backend')):
    if os.path.isdir(os.path.join('/workspace/backend', item)):
        print(f'  📁 {item}/')
    else:
        print(f'  📄 {item}')