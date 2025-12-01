import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 500 }, // Ramp up to 500 users quickly
    { duration: '3m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 1000 }, // Ramp up to 1000 users
    { duration: '5m', target: 1000 }, // Stay at 1000 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1s
    http_req_failed: ['rate<0.2'],     // Error rate must be below 20%
  },
};

export default function() {
  // Stress test with heavier operations
  
  // 1. Concurrent Quiz Generation (most intensive operation)
  let quizResponse = http.get('http://localhost:8000/api/request_quiz/variables/');
  check(quizResponse, {
    'quiz generation (stress) status is 200': (r) => r.status === 200,
    'quiz response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(0.5);

  // 2. Concurrent Answer Submissions
  let answerPayload = JSON.stringify({
    question_id: 'stress_test_' + Math.floor(Math.random() * 10000),
    answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    question_type: 'multiple_choice'
  });
  
  let answerResponse = http.post('http://localhost:8000/api/submit_answer/', answerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(answerResponse, {
    'answer submission (stress) status is 200': (r) => r.status === 200,
    'answer response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(0.5);

  // 3. Multiple Jac Walker Calls
  let jacPayload = JSON.stringify({
    action: 'health_check',
    user_id: String(Math.floor(Math.random() * 100) + 1)
  });
  
  let jacResponse = http.post('http://localhost:8000/api/jac/walker/orchestrator/', jacPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(jacResponse, {
    'jac walker (stress) status is 200': (r) => r.status === 200,
    'jac response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(0.5);

  // 4. Multiple Skill Map Requests
  let skillMapResponse = http.get('http://localhost:8000/api/skill_map/');
  check(skillMapResponse, {
    'skill map (stress) status is 200': (r) => r.status === 200,
    'skill map response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'tests/performance/stress-results.json': JSON.stringify(data),
    'tests/performance/stress-summary.html': htmlReport(data, 'Stress Test'),
  };
}

function htmlReport(data, title) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${title} Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .metric { margin: 10px 0; padding: 10px; border-left: 4px solid #007cba; }
      .success { border-left-color: #28a745; }
      .warning { border-left-color: #ffc107; }
      .error { border-left-color: #dc3545; }
      .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
  </head>
  <body>
    <h1>${title} Report</h1>
    <div class="summary">
      <h3>Test Summary</h3>
      <p><strong>Duration:</strong> ${data.root_group.checks.length} requests processed</p>
      <p><strong>Peak Load:</strong> ${data.metrics.vus_max.value} concurrent users</p>
      <p><strong>Success Rate:</strong> ${((data.root_group.checks.reduce((sum, check) => sum + check.passes, 0) / 
                                         data.root_group.checks.reduce((sum, check) => sum + (check.passes + check.fails), 0)) * 100).toFixed(2)}%</p>
    </div>
    
    <h3>Performance Metrics</h3>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Average Response Time</td>
        <td>${data.metrics.http_req_duration.avg.toFixed(2)}ms</td>
      </tr>
      <tr>
        <td>95th Percentile</td>
        <td>${data.metrics.http_req_duration['p(95)'].toFixed(2)}ms</td>
      </tr>
      <tr>
        <td>99th Percentile</td>
        <td>${data.metrics.http_req_duration['p(99)'].toFixed(2)}ms</td>
      </tr>
      <tr>
        <td>Maximum Response Time</td>
        <td>${data.metrics.http_req_duration.max.toFixed(2)}ms</td>
      </tr>
    </table>
    
    <h3>Throughput</h3>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Requests per Second</td>
        <td>${data.metrics.http_reqs.rate.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Total Requests</td>
        <td>${data.metrics.http_reqs.count}</td>
      </tr>
    </table>
  </body>
  </html>
  `;
}