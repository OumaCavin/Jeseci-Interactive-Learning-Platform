import React from 'react';

const SkillMap: React.FC = () => {
  const skills = [
    {
      category: "Frontend Development",
      items: ["HTML", "CSS", "JavaScript", "React", "TypeScript"]
    },
    {
      category: "Backend Development", 
      items: ["Python", "Django", "API Design", "Database Management"]
    },
    {
      category: "DevOps",
      items: ["Docker", "CI/CD", "Cloud Deployment", "Monitoring"]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Skill Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              {skill.category}
            </h3>
            <div className="space-y-2">
              {skill.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= 3 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMap;