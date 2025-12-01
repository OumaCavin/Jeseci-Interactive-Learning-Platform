import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate must be below 10%
  },
};

export default function() {
  // Test 1: Health Check
  let healthResponse = http.get('http://localhost:8000/api/health/');
  check(healthResponse, {
    'health status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'contains status field': (r) => JSON.parse(r.body).status === 'healthy',
  });

  sleep(1);

  // Test 2: Skill Map Endpoint
  let skillMapResponse = http.get('http://localhost:8000/api/skill_map/');
  check(skillMapResponse, {
    'skill map status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
    'contains concepts': (r) => {
      try {
        return JSON.parse(r.body).hasOwnProperty('concepts');
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // Test 3: Quiz Generation
  let quizResponse = http.get('http://localhost:8000/api/request_quiz/variables/');
  check(quizResponse, {
    'quiz generation status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'contains quiz data': (r) => {
      try {
        return JSON.parse(r.body).hasOwnProperty('quiz');
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // Test 4: Answer Submission
  let submitPayload = JSON.stringify({
    question_id: 'test_question_' + Math.floor(Math.random() * 1000),
    answer: 'A',
    question_type: 'multiple_choice'
  });
  
  let submitResponse = http.post('http://localhost:8000/api/submit_answer/', submitPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(submitResponse, {
    'answer submission status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'contains feedback': (r) => {
      try {
        return JSON.parse(r.body).hasOwnProperty('feedback');
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // Test 5: Jac Walker Access
  let jacPayload = JSON.stringify({
    action: 'health_check',
    user_id: '1'
  });
  
  let jacResponse = http.post('http://localhost:8000/api/jac/walker/orchestrator/', jacPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(jacResponse, {
    'jac walker status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
    'contains result': (r) => {
      try {
        return JSON.parse(r.body).hasOwnProperty('result');
      } catch {
        return false;
      }
    },
  });

  sleep(2);
}

export function handleSummary(data) {
  return {
    'tests/performance/results.json': JSON.stringify(data),
    'tests/performance/summary.html': htmlReport(data),
  };
}

function htmlReport(data) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>K6 Load Test Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .metric { margin: 10px 0; padding: 10px; border-left: 4px solid #007cba; }
      .success { border-left-color: #28a745; }
      .error { border-left-color: #dc3545; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    <h1>K6 Load Test Report</h1>
    <h2>Summary</h2>
    <div class="metric success">
      <strong>Total Requests:</strong> ${data.root_group.checks.length}
    </div>
    <div class="metric ${data.root_group.checks.every(c => c.passes > 0) ? 'success' : 'error'}">
      <strong>Checks Passed:</strong> ${data.root_group.checks.filter(c => c.passes > 0).length}/${data.root_group.checks.length}
    </div>
    
    <h2>Request Metrics</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Total Requests</td>
        <td>${data.root_group.checks.reduce((sum, check) => sum + (check.passes + check.fails), 0)}</td>
      </tr>
      <tr>
        <td>HTTP Status 2xx</td>
        <td>${data.root_group.checks.reduce((sum, check) => sum + check.passes, 0)}</td>
      </tr>
      <tr>
        <td>HTTP Status 4xx/5xx</td>
        <td>${data.root_group.checks.reduce((sum, check) => sum + check.fails, 0)}</td>
      </tr>
    </table>
    
    <h2>Performance Metrics</h2>
    <table>
      <tr>
        <th>Request Type</th>
        <th>Average (ms)</th>
        <th>Median (ms)</th>
        <th>95th Percentile (ms)</th>
        <th>Max (ms)</th>
      </tr>
      <tr>
        <td>Health Check</td>
        <td>${data.metrics.http_req_duration.avg.toFixed(2)}</td>
        <td>${data.metrics.http_req_duration.med.toFixed(2)}</td>
        <td>${data.metrics.http_req_duration['p(95)'].toFixed(2)}</td>
        <td>${data.metrics.http_req_duration.max.toFixed(2)}</td>
      </tr>
    </table>
    
    <h2>Virtual Users</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Peak Virtual Users</td>
        <td>${data.root_group.checks.reduce((max, check) => Math.max(max, check.checks.length), 0)}</td>
      </tr>
      <tr>
        <td>Total VUs</td>
        <td>${data.metrics.vus_max.value}</td>
      </tr>
    </table>
  </body>
  </html>
  `;
}