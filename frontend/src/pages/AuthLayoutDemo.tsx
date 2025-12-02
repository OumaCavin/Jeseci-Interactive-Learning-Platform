import React from 'react';
import { Button, Card } from '../components/ui';

const AuthLayoutDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AuthLayout Demo</h1>
        <p className="text-gray-600">
          Your beautiful, responsive authentication layout is now ready!
        </p>
      </div>

      {/* Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">AuthLayout Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">✅ Professional Design</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Split-screen layout</li>
              <li>• Gradient backgrounds</li>
              <li>• Floating elements</li>
              <li>• JAC Learning Platform branding</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">✅ Responsive & Accessible</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Mobile-first design</li>
              <li>• Keyboard navigation</li>
              <li>• ARIA labels</li>
              <li>• Smooth animations</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">✅ User Experience</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Engaging animations</li>
              <li>• Clear visual hierarchy</li>
              <li>• Professional footer</li>
              <li>• Consistent styling</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">✅ Technical Excellence</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• TypeScript support</li>
              <li>• Framer Motion animations</li>
              <li>• CSS Grid layout</li>
              <li>• Tailwind CSS utilities</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Integration */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ AuthLayout component created</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ CSS styles added to App.css</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ Login page updated to use AuthLayout</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ SignUp page created with AuthLayout</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ UI Button component integrated</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">✅ Framer Motion dependency verified</span>
          </div>
        </div>
      </Card>

      {/* Usage Example */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm text-gray-800 overflow-x-auto">
{`import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui';

const MyAuthPage = () => {
  return (
    <AuthLayout>
      {/* Your auth form content */}
      <div className="text-center mb-6">
        <h1>Welcome</h1>
      </div>
      <form>
        {/* Form fields */}
      </form>
    </AuthLayout>
  );
};`}
          </pre>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="space-y-3">
          <p className="text-gray-700">
            Your AuthLayout is now fully integrated! Here are the next steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Test the login page to see the new AuthLayout in action</li>
            <li>Add routing for the SignUp page</li>
            <li>Customize branding colors if needed</li>
            <li>Add password reset functionality</li>
            <li>Integrate with your backend authentication API</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default AuthLayoutDemo;