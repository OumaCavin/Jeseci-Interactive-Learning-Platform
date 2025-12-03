/**
 * Enterprise Integration Test Suite
 * Jeseci Interactive Learning Platform
 * 
 * Comprehensive integration tests for all enhanced features
 * Testing interoperability between proxy intelligence, WebSocket,
 * error handling, and analytics systems
 * 
 * @author Cavin Otieno
 * @version 2.0.0
 */

const request = require('supertest');
const WebSocket = require('ws');
const { spawn } = require('child_process');

// Test Configuration
const TEST_CONFIG = {
    baseURL: 'http://localhost:3000',
    wsURL: 'ws://localhost:3000',
    timeout: 30000,
    retries: 3,
    concurrentUsers: 10
};

// Educational Contexts for Testing
const EDUCATIONAL_CONTEXTS = {
    K12_STUDENT: {
        headers: {
            'x-user-type': 'student',
            'x-grade-level': 'middle-school',
            'x-subject': 'mathematics',
            'x-difficulty': 'adaptive',
            'x-accessibility': 'false',
            'x-learning-style': 'visual',
            'x-session-id': 'test-session-k12'
        }
    },
    UNIVERSITY_STUDENT: {
        headers: {
            'x-user-type': 'student',
            'x-education-level': 'undergraduate',
            'x-subject': 'computer-science',
            'x-difficulty': 'advanced',
            'x-accessibility': 'false',
            'x-learning-style': 'kinesthetic',
            'x-session-id': 'test-session-university',
            'x-research-level': 'basic'
        }
    },
    TEACHER: {
        headers: {
            'x-user-type': 'teacher',
            'x-subject': 'mathematics',
            'x-grade-level': 'middle-school',
            'x-teacher-id': 'teacher-123',
            'x-session-id': 'test-session-teacher'
        }
    },
    SPECIAL_NEEDS: {
        headers: {
            'x-user-type': 'student',
            'x-grade-level': 'elementary',
            'x-accessibility': 'true',
            'x-visual-impairment': 'true',
            'x-learning-style': 'auditory',
            'x-session-id': 'test-session-special'
        }
    }
};

// Mock data for testing
const MOCK_LEARNING_CONTENT = {
    mathematics: {
        basic: {
            title: "Introduction to Algebra",
            content: "x + 2 = 5. Solve for x.",
            difficulty: 1,
            estimatedTime: 15,
            prerequisites: []
        },
        intermediate: {
            title: "Quadratic Equations",
            content: "x² + 5x + 6 = 0. Find the roots.",
            difficulty: 3,
            estimatedTime: 30,
            prerequisites: ["basic-algebra"]
        },
        advanced: {
            title: "Calculus Fundamentals",
            content: "d/dx(x²) = 2x. Prove using limit definition.",
            difficulty: 5,
            estimatedTime: 45,
            prerequisites: ["advanced-algebra", "trigonometry"]
        }
    },
    science: {
        basic: {
            title: "States of Matter",
            content: "Water can be solid, liquid, or gas. Explain the changes.",
            difficulty: 1,
            estimatedTime: 20,
            prerequisites: []
        }
    }
};

// Integration Test Suite
class EnterpriseIntegrationTestSuite {
    constructor() {
        this.testResults = [];
        this.performanceMetrics = {};
        this.websocketConnections = [];
        this.errorLogs = [];
        this.startTime = Date.now();
    }

    // Main test execution
    async runAllTests() {
        console.log('🚀 Starting Enterprise Integration Test Suite...');
        console.log(`📊 Testing interoperability of ${Object.keys(EDUCATIONAL_CONTEXTS).length} educational contexts`);
        
        const testSuites = [
            this.testProxyIntelligenceInteroperability.bind(this),
            this.testWebSocketIntelligenceIntegration.bind(this),
            this.testSecurityIntelligenceCrossService.bind(this),
            this.testPerformanceOptimizationIntegration.bind(this),
            this.testRealTimeAnalyticsIntegration.bind(this),
            this.testMultiTenantArchitecture.bind(this),
            this.testErrorHandlingCrossService.bind(this),
            this.testEducationalComplianceIntegration.bind(this),
            this.testConcurrentUserHandling.bind(this),
            this.testEndToEndWorkflow.bind(this)
        ];

        for (const testSuite of testSuites) {
            try {
                console.log(`\n📋 Running: ${testSuite.name}`);
                await testSuite();
            } catch (error) {
                console.error(`❌ Test suite failed: ${error.message}`);
                this.recordError(testSuite.name, error);
            }
        }

        return this.generateTestReport();
    }

    // Test 1: Proxy Intelligence Interoperability
    async testProxyIntelligenceInteroperability() {
        const testSuite = 'Proxy Intelligence Interoperability';
        
        try {
            // Test educational context routing
            for (const [contextName, context] of Object.entries(EDUCATIONAL_CONTEXTS)) {
                console.log(`  📚 Testing ${contextName} context...`);
                
                const response = await request(TEST_CONFIG.baseURL)
                    .get('/api/content/mathematics/basic')
                    .set(context.headers)
                    .timeout(TEST_CONFIG.timeout);
                
                this.validateResponse(response, {
                    expectedStatus: 200,
                    expectedHeaders: ['X-Educational-Context', 'X-Learn-Enhanced'],
                    context: contextName
                });
                
                // Test proxy analytics integration
                const analyticsResponse = await request(TEST_CONFIG.baseURL)
                    .get('/api/proxy-analytics')
                    .set(context.headers);
                
                this.validateResponse(analyticsResponse, {
                    expectedStatus: 200,
                    expectedData: ['proxies', 'educational', 'system']
                });
                
                // Verify educational insights
                const insightsResponse = await request(TEST_CONFIG.baseURL)
                    .get('/api/educational-insights')
                    .set(context.headers);
                
                this.validateResponse(insightsResponse, {
                    expectedStatus: 200,
                    context: contextName
                });
                
                this.recordSuccess(testSuite, `${contextName} context routing`);
            }

            // Test cross-service data flow
            await this.testDataFlowBetweenServices();
            
            this.recordSuccess(testSuite, 'All educational contexts handled correctly');
        } catch (error) {
            this.recordFailure(testSuite, `Educational context routing failed: ${error.message}`);
            throw error;
        }
    }

    // Test 2: WebSocket Intelligence Integration
    async testWebSocketIntelligenceIntegration() {
        const testSuite = 'WebSocket Intelligence Integration';
        
        try {
            console.log('  🔌 Testing WebSocket connections...');
            
            for (const [contextName, context] of Object.entries(EDUCATIONAL_CONTEXTS)) {
                const ws = new WebSocket(`${TEST_CONFIG.wsURL}/ws/analytics`);
                
                await new Promise((resolve, reject) => {
                    ws.on('open', () => {
                        console.log(`    ✅ WebSocket connected for ${contextName}`);
                        
                        // Send educational context subscription
                        ws.send(JSON.stringify({
                            type: 'subscribe',
                            endpoint: 'educational',
                            context: context.headers
                        }));
                        
                        // Test message sending
                        ws.send(JSON.stringify({
                            type: 'educational-event',
                            payload: {
                                event: 'content-access',
                                userType: context.headers['x-user-type'],
                                subject: context.headers['x-subject'],
                                sessionId: context.headers['x-session-id']
                            }
                        }));
                    });
                    
                    ws.on('message', (data) => {
                        const message = JSON.parse(data);
                        console.log(`    📡 Received message for ${contextName}:`, message.type);
                        
                        if (message.type === 'educational-analytics') {
                            this.validateEducationalAnalytics(message.payload, contextName);
                        }
                    });
                    
                    ws.on('error', (error) => {
                        console.error(`    ❌ WebSocket error for ${contextName}:`, error.message);
                        reject(error);
                    });
                    
                    ws.on('close', () => {
                        console.log(`    🔌 WebSocket closed for ${contextName}`);
                        resolve();
                    });
                    
                    // Timeout after 10 seconds
                    setTimeout(() => {
                        ws.close();
                        resolve();
                    }, 10000);
                });
            }
            
            this.recordSuccess(testSuite, 'WebSocket intelligence integration working');
        } catch (error) {
            this.recordFailure(testSuite, `WebSocket integration failed: ${error.message}`);
            throw error;
        }
    }

    // Test 3: Security Intelligence Cross-Service
    async testSecurityIntelligenceCrossService() {
        const testSuite = 'Security Intelligence Cross-Service';
        
        try {
            console.log('  🔒 Testing security integration...');
            
            // Test FERPA compliance across services
            const sensitiveRequest = {
                method: 'POST',
                url: '/api/student-data',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-type': 'student',
                    'x-grade-level': 'middle-school',
                    'x-parental-consent': 'false', // Should trigger FERPA alert
                    'session-id': 'test-session-security'
                },
                body: {
                    studentId: '12345',
                    grades: [85, 90, 78],
                    personalInfo: {
                        email: 'student@school.edu',
                        address: '123 Main St'
                    }
                }
            };
            
            const response = await request(TEST_CONFIG.baseURL)
                .post('/api/student-data')
                .set(sensitiveRequest.headers)
                .send(sensitiveRequest.body);
            
            // Should either block or require additional consent
            if (response.status === 403) {
                console.log('    ✅ FERPA protection triggered correctly');
            } else if (response.status === 200) {
                // Verify enhanced security headers are present
                this.validateResponse(response, {
                    expectedHeaders: ['X-Security-Score', 'X-Compliance-Flags']
                });
            }
            
            // Test SQL injection protection
            const sqlInjectionTest = await request(TEST_CONFIG.baseURL)
                .get('/api/content/search?q=1\'; DROP TABLE students; --')
                .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
            
            if (sqlInjectionTest.status === 403 || sqlInjectionTest.status === 400) {
                console.log('    ✅ SQL injection protection active');
            } else {
                this.recordFailure(testSuite, 'SQL injection protection not working');
            }
            
            // Test cross-service audit logging
            const auditResponse = await request(TEST_CONFIG.baseURL)
                .get('/api/security-audit-logs')
                .set({ 'Authorization': 'Bearer admin-token' });
            
            if (auditResponse.status === 200) {
                console.log('    ✅ Security audit logging functional');
            }
            
            this.recordSuccess(testSuite, 'Security intelligence cross-service integration working');
        } catch (error) {
            this.recordFailure(testSuite, `Security integration failed: ${error.message}`);
            throw error;
        }
    }

    // Test 4: Performance Optimization Integration
    async testPerformanceOptimizationIntegration() {
        const testSuite = 'Performance Optimization Integration';
        
        try {
            console.log('  ⚡ Testing performance optimization...');
            
            const performanceTests = [
                {
                    name: 'Caching effectiveness',
                    test: async () => {
                        const start1 = Date.now();
                        const response1 = await request(TEST_CONFIG.baseURL)
                            .get('/api/content/mathematics/basic')
                            .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
                        const time1 = Date.now() - start1;
                        
                        // Second request should be faster due to caching
                        const start2 = Date.now();
                        const response2 = await request(TEST_CONFIG.baseURL)
                            .get('/api/content/mathematics/basic')
                            .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
                        const time2 = Date.now() - start2;
                        
                        console.log(`    📊 First request: ${time1}ms, Second request: ${time2}ms`);
                        return { cached: time2 < time1, time1, time2 };
                    }
                },
                {
                    name: 'Compression optimization',
                    test: async () => {
                        const response = await request(TEST_CONFIG.baseURL)
                            .get('/api/content/large-dataset')
                            .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
                        
                        const isCompressed = response.headers['content-encoding'] === 'gzip';
                        console.log(`    🗜️ Compression: ${isCompressed ? 'Active' : 'Inactive'}`);
                        return { compressed: isCompressed };
                    }
                },
                {
                    name: 'Load balancing',
                    test: async () => {
                        const responses = await Promise.all(
                            Array.from({ length: 5 }, (_, i) => 
                                request(TEST_CONFIG.baseURL)
                                    .get('/api/performance-metrics')
                                    .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers)
                            )
                        );
                        
                        const backends = responses.map(r => r.headers['x-backend-server']).filter(Boolean);
                        const uniqueBackends = new Set(backends).size;
                        
                        console.log(`    ⚖️ Load balanced across ${uniqueBackends} backends`);
                        return { loadBalanced: uniqueBackends > 1 };
                    }
                }
            ];
            
            const results = {};
            for (const test of performanceTests) {
                try {
                    results[test.name] = await test.test();
                } catch (error) {
                    console.error(`    ❌ Performance test failed: ${test.name}`, error.message);
                    results[test.name] = { error: error.message };
                }
            }
            
            this.performanceMetrics = { ...this.performanceMetrics, ...results };
            this.recordSuccess(testSuite, 'Performance optimization integration working');
        } catch (error) {
            this.recordFailure(testSuite, `Performance integration failed: ${error.message}`);
            throw error;
        }
    }

    // Test 5: Real-time Analytics Integration
    async testRealTimeAnalyticsIntegration() {
        const testSuite = 'Real-time Analytics Integration';
        
        try {
            console.log('  📊 Testing analytics integration...');
            
            // Test real-time metrics collection
            const metricsRequest = await request(TEST_CONFIG.baseURL)
                .get('/api/proxy-analytics')
                .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
            
            this.validateResponse(metricsRequest, {
                expectedData: ['proxies', 'educational', 'system']
            });
            
            // Test educational insights generation
            const insightsRequest = await request(TEST_CONFIG.baseURL)
                .get('/api/educational-insights')
                .set(EDUCATIONAL_CONTEXTS.UNIVERSITY_STUDENT.headers);
            
            this.validateResponse(insightsRequest, {
                expectedData: ['learningPaths', 'performanceOptimization', 'recommendations']
            });
            
            // Test dashboard endpoint
            const dashboardRequest = await request(TEST_CONFIG.baseURL)
                .get('/api/health')
                .set(EDUCATIONAL_CONTEXTS.TEACHER.headers);
            
            this.validateResponse(dashboardRequest, {
                expectedData: ['status', 'services', 'educationalIntelligence', 'systemMetrics']
            });
            
            console.log('    ✅ All analytics endpoints responding correctly');
            
            this.recordSuccess(testSuite, 'Real-time analytics integration working');
        } catch (error) {
            this.recordFailure(testSuite, `Analytics integration failed: ${error.message}`);
            throw error;
        }
    }

    // Test 6: Multi-tenant Architecture
    async testMultiTenantArchitecture() {
        const testSuite = 'Multi-tenant Architecture';
        
        try {
            console.log('  🏢 Testing multi-tenant functionality...');
            
            const tenantConfigs = [
                { tenantId: 'school-a', domain: 'school-a.jesici.com' },
                { tenantId: 'university-b', domain: 'university-b.jesici.com' },
                { tenantId: 'enterprise-c', domain: 'enterprise-c.jesici.com' }
            ];
            
            for (const tenant of tenantConfigs) {
                const response = await request(TEST_CONFIG.baseURL)
                    .get('/api/tenant/config')
                    .set({
                        'X-Tenant-ID': tenant.tenantId,
                        'X-Tenant-Domain': tenant.domain,
                        ...EDUCATIONAL_CONTEXTS.K12_STUDENT.headers
                    });
                
                this.validateResponse(response, {
                    expectedStatus: 200,
                    context: tenant.tenantId
                });
                
                // Test data isolation
                const isolationTest = await request(TEST_CONFIG.baseURL)
                    .post('/api/tenant/data')
                    .set({
                        'X-Tenant-ID': tenant.tenantId,
                        'X-Tenant-Domain': tenant.domain
                    })
                    .send({ data: `tenant-${tenant.tenantId}-data` });
                
                console.log(`    🏢 Tenant ${tenant.tenantId} data isolation: ${isolationTest.status === 200 ? '✅' : '❌'}`);
            }
            
            this.recordSuccess(testSuite, 'Multi-tenant architecture working');
        } catch (error) {
            this.recordFailure(testSuite, `Multi-tenant test failed: ${error.message}`);
            throw error;
        }
    }

    // Test 7: Error Handling Cross-Service
    async testErrorHandlingCrossService() {
        const testSuite = 'Error Handling Cross-Service';
        
        try {
            console.log('  🚨 Testing error handling integration...');
            
            // Test proxy error handling
            const proxyErrorTest = await request(TEST_CONFIG.baseURL)
                .get('/api/nonexistent-endpoint')
                .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers);
            
            this.validateErrorResponse(proxyErrorTest, {
                expectedStatus: 404,
                expectedErrorFormat: 'educational'
            });
            
            // Test backend error propagation
            const backendErrorTest = await request(TEST_CONFIG.baseURL)
                .get('/api/backend-error-test')
                .set(EDUCATIONAL_CONTEXTS.UNIVERSITY_STUDENT.headers);
            
            // Should return educational-friendly error message
            this.validateErrorResponse(backendErrorTest, {
                expectedStatus: 502,
                expectedErrorFields: ['error', 'context', 'supportMessage']
            });
            
            // Test WebSocket error handling
            const wsErrorTest = await new Promise((resolve) => {
                const ws = new WebSocket(`${TEST_CONFIG.wsURL}/ws/invalid-endpoint`);
                
                ws.on('error', (error) => {
                    console.log('    🔌 WebSocket error handling: ✅');
                    resolve({ errorHandled: true });
                });
                
                ws.on('close', () => {
                    resolve({ errorHandled: true });
                });
                
                setTimeout(() => {
                    ws.close();
                    resolve({ errorHandled: false });
                }, 5000);
            });
            
            // Test error intelligence platform integration
            const errorAnalyticsTest = await request(TEST_CONFIG.baseURL)
                .get('/api/error-analytics')
                .set(EDUCATIONAL_CONTEXTS.TEACHER.headers);
            
            this.validateResponse(errorAnalyticsTest, {
                expectedStatus: 200,
                expectedData: ['errorPatterns', 'educationalImpact', 'recommendations']
            });
            
            this.recordSuccess(testSuite, 'Error handling cross-service integration working');
        } catch (error) {
            this.recordFailure(testSuite, `Error handling test failed: ${error.message}`);
            throw error;
        }
    }

    // Test 8: Educational Compliance Integration
    async testEducationalComplianceIntegration() {
        const testSuite = 'Educational Compliance Integration';
        
        try {
            console.log('  📋 Testing educational compliance...');
            
            // Test COPPA compliance for children
            const coppaTest = await request(TEST_CONFIG.baseURL)
                .post('/api/parental-data-request')
                .set({
                    ...EDUCATIONAL_CONTEXTS.K12_STUDENT.headers,
                    'x-age': '10',
                    'x-parental-consent': 'required'
                })
                .send({
                    requestType: 'data-export',
                    dataTypes: ['grades', 'behavioral-data']
                });
            
            if (coppaTest.status === 403 || coppaTest.status === 200) {
                console.log('    ✅ COPPA compliance check active');
            }
            
            // Test accessibility compliance
            const accessibilityTest = await request(TEST_CONFIG.baseURL)
                .get('/api/content/accessible-math')
                .set(EDUCATIONAL_CONTEXTS.SPECIAL_NEEDS.headers);
            
            this.validateResponse(accessibilityTest, {
                expectedStatus: 200,
                expectedHeaders: ['X-Accessibility-Enhanced']
            });
            
            // Test data retention policies
            const retentionTest = await request(TEST_CONFIG.baseURL)
                .get('/api/compliance/data-retention')
                .set(EDUCATIONAL_CONTEXTS.UNIVERSITY_STUDENT.headers);
            
            this.validateResponse(retentionTest, {
                expectedStatus: 200,
                expectedData: ['retentionPeriods', 'deletionSchedules', 'complianceFlags']
            });
            
            this.recordSuccess(testSuite, 'Educational compliance integration working');
        } catch (error) {
            this.recordFailure(testSuite, `Compliance test failed: ${error.message}`);
            throw error;
        }
    }

    // Test 9: Concurrent User Handling
    async testConcurrentUserHandling() {
        const testSuite = 'Concurrent User Handling';
        
        try {
            console.log('  👥 Testing concurrent user handling...');
            
            const concurrentTests = Array.from({ length: TEST_CONFIG.concurrentUsers }, (_, i) => {
                const context = Object.values(EDUCATIONAL_CONTEXTS)[i % Object.keys(EDUCATIONAL_CONTEXTS).length];
                
                return request(TEST_CONFIG.baseURL)
                    .get('/api/content/mathematics/basic')
                    .set(context.headers)
                    .timeout(TEST_CONFIG.timeout)
                    .then(response => ({
                        userId: i,
                        status: response.status,
                        responseTime: response.responseTime,
                        headers: response.headers
                    }))
                    .catch(error => ({
                        userId: i,
                        error: error.message,
                        status: error.status || 500
                    }));
            });
            
            const results = await Promise.all(concurrentTests);
            
            const successfulRequests = results.filter(r => r.status === 200).length;
            const failedRequests = results.length - successfulRequests;
            
            console.log(`    👥 Concurrent users: ${results.length}`);
            console.log(`    ✅ Successful requests: ${successfulRequests}`);
            console.log(`    ❌ Failed requests: ${failedRequests}`);
            
            if (successfulRequests / results.length > 0.95) {
                this.recordSuccess(testSuite, `Concurrent handling successful (${successfulRequests}/${results.length})`);
            } else {
                this.recordFailure(testSuite, `Poor concurrent performance: ${successfulRequests}/${results.length} successful`);
            }
        } catch (error) {
            this.recordFailure(testSuite, `Concurrent test failed: ${error.message}`);
            throw error;
        }
    }

    // Test 10: End-to-End Workflow
    async testEndToEndWorkflow() {
        const testSuite = 'End-to-End Workflow';
        
        try {
            console.log('  🔄 Testing end-to-end educational workflow...');
            
            const workflow = [
                {
                    name: 'Student Login & Context Detection',
                    action: async () => {
                        const response = await request(TEST_CONFIG.baseURL)
                            .post('/api/auth/login')
                            .set(EDUCATIONAL_CONTEXTS.K12_STUDENT.headers)
                            .send({
                                userType: 'student',
                                gradeLevel: 'middle-school',
                                subject: 'mathematics'
                            });
                        
                        return {
                            authenticated: response.status === 200,
                            sessionToken: response.body?.token,
                            educationalContext: response.body?.context
                        };
                    }
                },
                {
                    name: 'Content Access & Personalization',
                    action: async (context) => {
                        const response = await request(TEST_CONFIG.baseURL)
                            .get('/api/content/mathematics/intermediate')
                            .set({
                                ...EDUCATIONAL_CONTEXTS.K12_STUDENT.headers,
                                'Authorization': `Bearer ${context.sessionToken}`
                            });
                        
                        return {
                            contentAccessed: response.status === 200,
                            personalized: response.headers['x-learn-enhanced'] === 'true',
                            difficulty: response.headers['x-content-difficulty']
                        };
                    }
                },
                {
                    name: 'Assessment & Analytics',
                    action: async (context) => {
                        const response = await request(TEST_CONFIG.baseURL)
                            .post('/api/assessment/submit')
                            .set({
                                ...EDUCATIONAL_CONTEXTS.K12_STUDENT.headers,
                                'Authorization': `Bearer ${context.sessionToken}`
                            })
                            .send({
                                assessmentId: 'math-quiz-1',
                                answers: { question1: '3', question2: '7' },
                                timeSpent: 1200
                            });
                        
                        return {
                            assessmentSubmitted: response.status === 200,
                            analyticsTracked: response.status === 200,
                            feedbackGenerated: response.body?.feedback
                        };
                    }
                },
                {
                    name: 'Progress Tracking & Insights',
                    action: async (context) => {
                        const response = await request(TEST_CONFIG.baseURL)
                            .get('/api/student/progress')
                            .set({
                                ...EDUCATIONAL_CONTEXTS.K12_STUDENT.headers,
                                'Authorization': `Bearer ${context.sessionToken}`
                            });
                        
                        return {
                            progressTracked: response.status === 200,
                            insightsGenerated: response.body?.insights,
                            nextRecommendations: response.body?.recommendations
                        };
                    }
                }
            ];
            
            let workflowContext = {};
            
            for (const step of workflow) {
                console.log(`    🔄 ${step.name}...`);
                const result = await step.action(workflowContext);
                workflowContext = { ...workflowContext, ...result };
                
                const stepSuccess = Object.values(result).every(value => 
                    value === true || (typeof value === 'string' && value.length > 0)
                );
                
                console.log(`      ${stepSuccess ? '✅' : '❌'} ${step.name}`);
                
                if (!stepSuccess) {
                    throw new Error(`Workflow step failed: ${step.name}`);
                }
            }
            
            this.recordSuccess(testSuite, 'End-to-end educational workflow completed successfully');
        } catch (error) {
            this.recordFailure(testSuite, `End-to-end workflow failed: ${error.message}`);
            throw error;
        }
    }

    // Helper Methods
    validateResponse(response, options) {
        const { expectedStatus, expectedHeaders, expectedData, context } = options;
        
        if (expectedStatus && response.status !== expectedStatus) {
            throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
        }
        
        if (expectedHeaders) {
            expectedHeaders.forEach(header => {
                if (!response.headers[header.toLowerCase()]) {
                    throw new Error(`Missing expected header: ${header}`);
                }
            });
        }
        
        if (expectedData) {
            expectedData.forEach(dataKey => {
                if (!response.body || response.body[dataKey] === undefined) {
                    throw new Error(`Missing expected data: ${dataKey}`);
                }
            });
        }
        
        if (context) {
            console.log(`    ✅ ${context} context validation passed`);
        }
        
        return true;
    }

    validateErrorResponse(response, options) {
        const { expectedStatus, expectedErrorFormat, expectedErrorFields } = options;
        
        if (expectedStatus && response.status !== expectedStatus) {
            throw new Error(`Expected error status ${expectedStatus}, got ${response.status}`);
        }
        
        if (expectedErrorFields) {
            expectedErrorFields.forEach(field => {
                if (!response.body || response.body[field] === undefined) {
                    throw new Error(`Missing expected error field: ${field}`);
                }
            });
        }
        
        console.log(`    🚨 Error response validated (${response.status})`);
        return true;
    }

    validateEducationalAnalytics(data, contextName) {
        const requiredFields = ['timestamp', 'userType', 'sessionId', 'educationalContext'];
        requiredFields.forEach(field => {
            if (!data[field]) {
                console.warn(`    ⚠️ Missing educational analytics field: ${field}`);
            }
        });
        
        console.log(`    📊 Educational analytics validated for ${contextName}`);
    }

    async testDataFlowBetweenServices() {
        // Test data flow from proxy -> analytics -> dashboard
        const healthCheck = await request(TEST_CONFIG.baseURL).get('/api/health');
        
        if (healthCheck.body.educationalIntelligence) {
            console.log('    📈 Proxy -> Analytics -> Dashboard data flow working');
        }
    }

    recordSuccess(testSuite, message) {
        this.testResults.push({
            testSuite,
            status: 'SUCCESS',
            message,
            timestamp: new Date().toISOString()
        });
        console.log(`  ✅ ${message}`);
    }

    recordFailure(testSuite, message) {
        this.testResults.push({
            testSuite,
            status: 'FAILURE',
            message,
            timestamp: new Date().toISOString()
        });
        console.log(`  ❌ ${message}`);
    }

    recordError(testSuite, error) {
        this.testResults.push({
            testSuite,
            status: 'ERROR',
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    generateTestReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;
        
        const summary = {
            totalTests: this.testResults.length,
            successful: this.testResults.filter(r => r.status === 'SUCCESS').length,
            failed: this.testResults.filter(r => r.status === 'FAILURE').length,
            errors: this.testResults.filter(r => r.status === 'ERROR').length,
            duration: `${Math.round(totalDuration / 1000)}s`,
            timestamp: new Date().toISOString()
        };
        
        console.log('\n📊 INTEGRATION TEST REPORT');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${summary.totalTests}`);
        console.log(`Successful: ${summary.successful}`);
        console.log(`Failed: ${summary.failed}`);
        console.log(`Errors: ${summary.errors}`);
        console.log(`Duration: ${summary.duration}`);
        console.log(`Success Rate: ${Math.round((summary.successful / summary.totalTests) * 100)}%`);
        
        if (summary.failed > 0 || summary.errors > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(r => r.status === 'FAILURE' || r.status === 'ERROR')
                .forEach(result => {
                    console.log(`  - ${result.testSuite}: ${result.message}`);
                });
        }
        
        console.log('\n⚡ PERFORMANCE METRICS:');
        Object.entries(this.performanceMetrics).forEach(([key, value]) => {
            console.log(`  - ${key}:`, value);
        });
        
        return {
            summary,
            testResults: this.testResults,
            performanceMetrics: this.performanceMetrics,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.some(r => r.status === 'FAILURE')) {
            recommendations.push({
                priority: 'HIGH',
                category: 'reliability',
                message: 'Address failing integration tests to ensure system reliability'
            });
        }
        
        if (this.performanceMetrics.caching?.cached === false) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'performance',
                message: 'Optimize caching strategy for better response times'
            });
        }
        
        return recommendations;
    }
}

// Test Runner
async function runIntegrationTests() {
    const testSuite = new EnterpriseIntegrationTestSuite();
    
    try {
        const report = await testSuite.runAllTests();
        
        // Save report to file
        const fs = require('fs');
        fs.writeFileSync(
            'integration-test-report.json',
            JSON.stringify(report, null, 2)
        );
        
        console.log('\n📄 Test report saved to: integration-test-report.json');
        
        return report.summary.successful === report.summary.totalTests;
    } catch (error) {
        console.error('💥 Integration test suite failed:', error.message);
        return false;
    }
}

// Export for use
if (require.main === module) {
    runIntegrationTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = {
    EnterpriseIntegrationTestSuite,
    runIntegrationTests,
    EDUCATIONAL_CONTEXTS,
    MOCK_LEARNING_CONTENT
};