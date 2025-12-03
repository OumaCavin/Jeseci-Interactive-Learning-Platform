#!/bin/bash

echo "=== Frontend Syntax Error Check ==="
echo "Testing TypeScript compilation for major files..."

cd /workspace/frontend

# Test if we can at least verify the syntax of key files
echo "Testing collaborationStore syntax..."
node -e "
try {
  require('@babel/parser').parseFileSync('src/stores/collaborationStore.ts', {
    sourceType: 'module',
    plugins: ['typescript', 'decorators-legacy']
  });
  console.log('✅ collaborationStore.ts - Syntax OK');
} catch (e) {
  console.log('❌ collaborationStore.ts - Syntax Error:', e.message);
}
"

echo "Testing API client syntax..."
node -e "
try {
  require('@babel/parser').parseFileSync('src/services/api.ts', {
    sourceType: 'module',
    plugins: ['typescript', 'decorators-legacy']
  });
  console.log('✅ api.ts - Syntax OK');
} catch (e) {
  console.log('❌ api.ts - Syntax Error:', e.message);
}
"

echo "Testing PasswordReset component syntax..."
node -e "
try {
  require('@babel/parser').parseFileSync('src/pages/auth/PasswordReset.tsx', {
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'decorators-legacy']
  });
  console.log('✅ PasswordReset.tsx - Syntax OK');
} catch (e) {
  console.log('❌ PasswordReset.tsx - Syntax Error:', e.message);
}
"

echo "=== Syntax Check Complete ==="