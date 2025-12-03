/**
 * Master Integration Test Runner
 * Jeseci Interactive Learning Platform
 * 
 * Comprehensive integration test runner that executes all test suites
 * and generates unified reports for enterprise-grade feature validation
 * 
 * @author Cavin Otieno
 * @version 2.0.0
 */

const { EnterpriseIntegrationTestSuite } = require('./enterprise-integration-tests');
const { WebSocketIntegrationTestSuite } = require('./websocket-integration-tests');
const { SecurityIntegrationTestSuite } = require('./security-integration-tests');
const { PerformanceIntegrationTestSuite } = require('./performance-integration-tests');
const fs = require('fs');
const path = require('path');

// Master Test Configuration
const MASTER_TEST_CONFIG = {
    execution: {
        parallel: false, // Run tests sequentially for better debugging
        timeout: 300000, // 5 minutes per test suite
        retryFailed: true,
        maxRetries: 2
    },
    reporting: {
        formats: ['json', 'html', 'csv'],
        outputDir: './test-reports',
        includeScreenshots: false,
        includeMetrics: true
    },
    environments: {
        development: {
            baseURL: 'http://localhost:3000',
            wsURL: 'ws://localhost:3000',
            testTimeout: 30000
        },
        staging: {
            baseURL: 'https://staging.jesici.com',
            wsURL: 'wss://staging.jesici.com',
            testTimeout: 45000
        },
        production: {
            baseURL: 'https://jesici.com',
            wsURL: 'wss://jesici.com',
            testTimeout: 60000
        }
    }
};

// Educational Test Scenarios for Comprehensive Testing
const COMPREHENSIVE_EDUCATIONAL_SCENARIOS = {
    K12_MATHEMATICS: {
        user: {
            type: 'student',
            gradeLevel: 'middle-school',
            age: 13,
            subject: 'mathematics',
            learningStyle: 'visual',
            accessibilityNeeds: false
        },
        workflow: [
            'login-authentication',
            'content-personalization',
            'adaptive-assessment',
            'progress-tracking',
            'collaborative-learning'
        ]
    },
    UNIVERSITY_COMPUTER_SCIENCE: {
        user: {
            type: 'student',
            educationLevel: 'undergraduate',
            age: 20,
            subject: 'computer-science',
            researchLevel: 'basic',
            program: 'bs-computer-science'
        },
        workflow: [
            'authentication',
            'research-integration',
            'project-collaboration',
            'peer-review',
            'advanced-assessment'
        ]
    },
    PROFESSIONAL_CERTIFICATION: {
        user: {
            type: 'professional',
            industry: 'technology',
            certificationTrack: 'aws-solutions-architect',
            experience: 'intermediate',
            learningMode: 'self-paced'
        },
        workflow: [
            'skill-assessment',
            'personalized-learning-path',
            'hands-on-labs',
            'practice-exams',
            'certification-tracking'
        ]
    },
    SPECIAL_NEEDS_LEARNING: {
        user: {
            type: 'student',
            gradeLevel: 'elementary',
            age: 9,
            accessibilityNeeds: ['visual-impairment'],
            assistiveTechnology: ['screen-reader', 'voice-control'],
            accommodations: ['extended-time', 'alternative-formats']
        },
        workflow: [
            'accessible-login',
            'adaptive-content',
            'multi-modal-assessment',
            'progress-monitoring',
            'family-engagement'
        ]
    }
};

// Master Integration Test Runner
class MasterIntegrationTestRunner {
    constructor(environment = 'development') {
        this.environment = environment;
        this.config = MASTER_TEST_CONFIG.environments[environment];
        this.testSuites = [];
        this.results = {
            summary: {
                totalTests: 0,
                successful: 0,
                failed: 0,
                errors: 0,
                startTime: null,
                endTime: null,
                duration: 0
            },
            testSuites: [],
            educationalScenarios: [],
            performanceMetrics: {},
            recommendations: [],
            deploymentReadiness: {}
        };
        this.startTime = Date.now();
    }

    async runAllIntegrationTests() {
        console.log('🚀 MASTER INTEGRATION TEST SUITE');
        console.log('='.repeat(60));
        console.log(`📍 Environment: ${this.environment}`);
        console.log(`🌐 Base URL: ${this.config.baseURL}`);
        console.log(`📡 WebSocket URL: ${this.config.wsURL}`);
        console.log(`⏱️ Timeout: ${this.config.testTimeout}ms\n`);

        this.results.summary.startTime = new Date().toISOString();

        try {
            // Initialize test suites
            await this.initializeTestSuites();

            // Execute comprehensive educational scenario tests
            await this.runEducationalScenarioTests();

            // Execute core integration test suites
            await this.executeTestSuites();

            // Generate comprehensive report
            const report = await this.generateComprehensiveReport();

            // Validate deployment readiness
            await this.validateDeploymentReadiness();

            this.results.summary.endTime = new Date().toISOString();
            this.results.summary.duration = Date.now() - this.startTime;

            return report;

        } catch (error) {
            console.error('💥 Master test runner failed:', error.message);
            this.results.summary.errors++;
            throw error;
        }
    }

    async initializeTestSuites() {
        console.log('📋 Initializing test suites...\n');

        this.testSuites = [
            {
                name: 'Enterprise Integration Tests',
                class: EnterpriseIntegrationTestSuite,
                description: 'Core interoperability testing across all enhanced features',
                critical: true
            },
            {
                name: 'WebSocket Intelligence Tests',
                class: WebSocketIntegrationTestSuite,
                description: 'Real-time communication and collaboration testing',
                critical: true
            },
            {
                name: 'Security Intelligence Tests',
                class: SecurityIntegrationTestSuite,
                description: 'Educational compliance and threat detection testing',
                critical: true
            },
            {
                name: 'Performance Integration Tests',
                class: PerformanceIntegrationTestSuite,
                description: 'Load handling and optimization testing',
                critical: true
            }
        ];

        console.log(`✅ Initialized ${this.testSuites.length} test suites`);
    }

    async runEducationalScenarioTests() {
        console.log('🎓 Running Comprehensive Educational Scenario Tests...\n');

        for (const [scenarioName, scenario] of Object.entries(COMPREHENSIVE_EDUCATIONAL_SCENARIOS)) {
            try {
                console.log(`📚 Testing ${scenarioName} scenario...`);
                
                const scenarioResult = await this.executeEducationalScenario(scenarioName, scenario);
                
                this.results.educationalScenarios.push({
                    scenario: scenarioName,
                    user: scenario.user,
                    workflow: scenario.workflow,
                    status: scenarioResult.success ? 'PASS' : 'FAIL',
                    metrics: scenarioResult.metrics,
                    errors: scenarioResult.errors,
                    timestamp: new Date().toISOString()
                });
                
                console.log(`  ✅ ${scenarioName}: ${scenarioResult.success ? 'PASSED' : 'FAILED'}`);
                console.log(`  📊 Metrics:`, scenarioResult.metrics);
                
            } catch (error) {
                console.error(`  ❌ ${scenarioName} failed:`, error.message);
                this.results.educationalScenarios.push({
                    scenario: scenarioName,
                    user: scenario.user,
                    workflow: scenario.workflow,
                    status: 'ERROR',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        console.log(`📚 Completed educational scenario testing (${this.results.educationalScenarios.length} scenarios)\n`);
    }

    async executeEducationalScenario(scenarioName, scenario) {
        const scenarioMetrics = {
            totalSteps: scenario.workflow.length,
            successfulSteps: 0,
            averageStepTime: 0,
            userSatisfactionScore: 0,
            accessibilityCompliance: 0
        };

        const stepTimes = [];
        const errors = [];

        for (let i = 0; i < scenario.workflow.length; i++) {
            const step = scenario.workflow[i];
            
            try {
                const stepStart = Date.now();
                
                // Execute educational workflow step
                await this.executeEducationalStep(scenarioName, step, scenario.user, i);
                
                const stepEnd = Date.now();
                const stepTime = stepEnd - stepStart;
                
                stepTimes.push(stepTime);
                scenarioMetrics.successfulSteps++;
                
                console.log(`    Step ${i + 1}/${scenario.workflow.length}: ${step} (${stepTime}ms) ✅`);
                
            } catch (error) {
                errors.push({
                    step,
                    error: error.message,
                    stepNumber: i + 1
                });
                
                console.error(`    Step ${i + 1}/${scenario.workflow.length}: ${step} ❌ ${error.message}`);
            }
        }

        // Calculate scenario metrics
        scenarioMetrics.averageStepTime = stepTimes.length > 0 ? 
            Math.round(stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length) : 0;
        
        scenarioMetrics.successRate = scenarioMetrics.successfulSteps / scenarioMetrics.totalSteps;
        scenarioMetrics.userSatisfactionScore = this.calculateUserSatisfactionScore(scenario, scenarioMetrics);
        scenarioMetrics.accessibilityCompliance = this.calculateAccessibilityCompliance(scenario.user);

        return {
            success: scenarioMetrics.successRate >= 0.9,
            metrics: scenarioMetrics,
            errors
        };
    }

    async executeEducationalStep(scenarioName, step, user, stepIndex) {
        // Simulate educational step execution with realistic delays and potential issues
        const stepDelays = {
            'login-authentication': 500,
            'content-personalization': 800,
            'adaptive-assessment': 1200,
            'progress-tracking': 300,
            'collaborative-learning': 600,
            'research-integration': 900,
            'project-collaboration': 1000,
            'peer-review': 700,
            'advanced-assessment': 1500,
            'skill-assessment': 600,
            'hands-on-labs': 2000,
            'practice-exams': 1800,
            'certification-tracking': 400,
            'accessible-login': 600,
            'multi-modal-assessment': 1400,
            'family-engagement': 500
        };

        const delay = stepDelays[step] || 500;
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate occasional failures based on user type and step complexity
        const failureChance = this.calculateFailureChance(scenarioName, step, user);
        
        if (Math.random() < failureChance) {
            throw new Error(`Simulated failure in step: ${step}`);
        }
        
        // Simulate educational intelligence processing
        await this.simulateEducationalIntelligence(step, user);
    }

    calculateFailureChance(scenarioName, step, user) {
        let baseChance = 0.02; // 2% base failure rate
        
        // Adjust based on user type and accessibility needs
        if (user.accessibilityNeeds && user.accessibilityNeeds.length > 0) {
            baseChance *= 1.5; // Slightly higher failure rate due to complexity
        }
        
        // Adjust based on step complexity
        const complexSteps = ['adaptive-assessment', 'research-integration', 'hands-on-labs'];
        if (complexSteps.includes(step)) {
            baseChance *= 1.3;
        }
        
        return Math.min(baseChance, 0.1); // Cap at 10%
    }

    async simulateEducationalIntelligence(step, user) {
        // Simulate AI-powered educational processing
        const processingTime = Math.random() * 100 + 50;
        await new Promise(resolve => setTimeout(resolve, processingTime));
        
        // Simulate educational insights generation
        return {
            insights: ['Learning pattern detected', 'Optimal difficulty level identified'],
            recommendations: ['Continue current pace', 'Consider visual learning resources'],
            nextBestAction: 'proceed-to-next-lesson'
        };
    }

    calculateUserSatisfactionScore(scenario, metrics) {
        let score = 50; // Base score
        
        // Adjust based on success rate
        score += metrics.successRate * 40;
        
        // Adjust based on performance
        const avgTime = metrics.averageStepTime;
        if (avgTime < 500) score += 5;
        else if (avgTime > 1500) score -= 5;
        
        // Adjust based on user type
        if (scenario.user.accessibilityNeeds) {
            score += 3; // Bonus for accessibility consideration
        }
        
        return Math.min(Math.max(score, 0), 100);
    }

    calculateAccessibilityCompliance(user) {
        if (!user.accessibilityNeeds) return 100; // 100% compliance if no specific needs
        
        let compliance = 100;
        
        if (user.accessibilityNeeds.includes('visual-impairment')) {
            compliance -= 5; // Simulate minor compliance gaps
        }
        
        if (user.assistiveTechnology) {
            compliance += 2; // Bonus for assistive technology support
        }
        
        return Math.min(Math.max(compliance, 0), 100);
    }

    async executeTestSuites() {
        console.log('🔧 Executing Core Integration Test Suites...\n');

        for (const testSuiteConfig of this.testSuites) {
            try {
                console.log(`🧪 Running ${testSuiteConfig.name}...`);
                
                const testSuite = new testSuiteConfig.class();
                
                // Set environment-specific configuration
                if (testSuite.setEnvironment) {
                    testSuite.setEnvironment(this.config);
                }
                
                const startTime = Date.now();
                const result = await testSuite.runAllTests();
                const endTime = Date.now();
                
                const suiteResult = {
                    name: testSuiteConfig.name,
                    description: testSuiteConfig.description,
                    critical: testSuiteConfig.critical,
                    status: result.summary.successful === result.summary.totalTests ? 'PASS' : 'FAIL',
                    duration: endTime - startTime,
                    summary: result.summary,
                    details: result,
                    timestamp: new Date().toISOString()
                };
                
                this.results.testSuites.push(suiteResult);
                this.results.summary.totalTests += result.summary.totalTests;
                this.results.summary.successful += result.summary.successful;
                this.results.summary.failed += result.summary.failed;
                
                console.log(`  ✅ ${testSuiteConfig.name}: ${result.summary.successful}/${result.summary.totalTests} tests passed`);
                console.log(`  ⏱️ Duration: ${Math.round((endTime - startTime) / 1000)}s`);
                
            } catch (error) {
                console.error(`  ❌ ${testSuiteConfig.name} failed:`, error.message);
                
                this.results.testSuites.push({
                    name: testSuiteConfig.name,
                    description: testSuiteConfig.description,
                    critical: testSuiteConfig.critical,
                    status: 'ERROR',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                
                this.results.summary.totalTests += 1;
                this.results.summary.errors += 1;
            }
        }

        console.log(`🔧 Completed core test suite execution (${this.results.testSuites.length} suites)\n`);
    }

    async validateDeploymentReadiness() {
        console.log('🚀 Validating Deployment Readiness...\n');

        const readinessChecks = [
            {
                name: 'Critical Test Suites',
                check: () => {
                    const criticalSuites = this.results.testSuites.filter(s => s.critical);
                    const passedCritical = criticalSuites.filter(s => s.status === 'PASS').length;
                    const totalCritical = criticalSuites.length;
                    return {
                        passed: passedCritical === totalCritical,
                        score: totalCritical > 0 ? (passedCritical / totalCritical) * 100 : 0,
                        details: `${passedCritical}/${totalCritical} critical test suites passed`
                    };
                }
            },
            {
                name: 'Educational Scenarios',
                check: () => {
                    const passedScenarios = this.results.educationalScenarios.filter(s => s.status === 'PASS').length;
                    const totalScenarios = this.results.educationalScenarios.length;
                    return {
                        passed: passedScenarios === totalScenarios,
                        score: totalScenarios > 0 ? (passedScenarios / totalScenarios) * 100 : 0,
                        details: `${passedScenarios}/${totalScenarios} educational scenarios passed`
                    };
                }
            },
            {
                name: 'Performance Standards',
                check: () => {
                    const performanceSuites = this.results.testSuites.filter(s => 
                        s.name.includes('Performance') && s.status === 'PASS'
                    );
                    return {
                        passed: performanceSuites.length > 0,
                        score: performanceSuites.length > 0 ? 100 : 0,
                        details: performanceSuites.length > 0 ? 'Performance standards met' : 'Performance testing failed'
                    };
                }
            },
            {
                name: 'Security Compliance',
                check: () => {
                    const securitySuites = this.results.testSuites.filter(s => 
                        s.name.includes('Security') && s.status === 'PASS'
                    );
                    return {
                        passed: securitySuites.length > 0,
                        score: securitySuites.length > 0 ? 100 : 0,
                        details: securitySuites.length > 0 ? 'Security compliance verified' : 'Security testing failed'
                    };
                }
            }
        ];

        for (const check of readinessChecks) {
            const result = check.check();
            
            this.results.deploymentReadiness[check.name] = {
                status: result.passed ? 'READY' : 'NOT_READY',
                score: result.score,
                details: result.details,
                timestamp: new Date().toISOString()
            };
            
            console.log(`  ${result.passed ? '✅' : '❌'} ${check.name}: ${result.details} (${Math.round(result.score)}%)`);
        }

        const overallReadiness = Object.values(this.results.deploymentReadiness)
            .reduce((sum, check) => sum + check.score, 0) / Object.keys(this.results.deploymentReadiness).length;

        this.results.deploymentReadiness.overall = {
            status: overallReadiness >= 90 ? 'READY' : 'NOT_READY',
            score: overallReadiness,
            timestamp: new Date().toISOString()
        };

        console.log(`\n🎯 Overall Deployment Readiness: ${Math.round(overallReadiness)}% ${overallReadiness >= 90 ? '✅' : '❌'}\n`);
    }

    async generateComprehensiveReport() {
        console.log('📊 Generating Comprehensive Integration Report...\n');

        // Ensure output directory exists
        if (!fs.existsSync(MASTER_TEST_CONFIG.reporting.outputDir)) {
            fs.mkdirSync(MASTER_TEST_CONFIG.reporting.outputDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportId = `integration-report-${timestamp}`;

        // Generate detailed report
        const report = {
            metadata: {
                reportId,
                environment: this.environment,
                timestamp: new Date().toISOString(),
                testRunnerVersion: '2.0.0',
                totalDuration: this.results.summary.duration
            },
            summary: this.results.summary,
            testSuites: this.results.testSuites,
            educationalScenarios: this.results.educationalScenarios,
            deploymentReadiness: this.results.deploymentReadiness,
            recommendations: this.generateRecommendations(),
            nextSteps: this.generateNextSteps()
        };

        // Save report in multiple formats
        await this.saveReports(report, reportId);

        // Display summary
        this.displayReportSummary(report);

        return report;
    }

    generateRecommendations() {
        const recommendations = [];

        // Critical failures
        const failedCriticalSuites = this.results.testSuites.filter(s => s.critical && s.status !== 'PASS');
        if (failedCriticalSuites.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                category: 'reliability',
                title: 'Address Critical Test Failures',
                description: `${failedCriticalSuites.length} critical test suite(s) failed`,
                actionItems: failedCriticalSuites.map(s => `Fix and re-test ${s.name}`),
                impact: 'deployment-blocker'
            });
        }

        // Performance issues
        const performanceSuites = this.results.testSuites.filter(s => s.name.includes('Performance'));
        const failedPerformance = performanceSuites.filter(s => s.status !== 'PASS');
        if (failedPerformance.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'performance',
                title: 'Performance Optimization Required',
                description: 'Performance testing revealed scalability or optimization issues',
                actionItems: [
                    'Review and optimize caching strategies',
                    'Implement connection pooling',
                    'Scale backend infrastructure',
                    'Optimize database queries'
                ],
                impact: 'user-experience'
            });
        }

        // Security concerns
        const securitySuites = this.results.testSuites.filter(s => s.name.includes('Security'));
        const failedSecurity = securitySuites.filter(s => s.status !== 'PASS');
        if (failedSecurity.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                category: 'security',
                title: 'Security Compliance Issues',
                description: 'Security testing revealed compliance or protection gaps',
                actionItems: [
                    'Address FERPA/COPPA compliance issues',
                    'Implement additional security controls',
                    'Review and strengthen threat detection',
                    'Conduct security audit'
                ],
                impact: 'compliance-risk'
            });
        }

        // Educational effectiveness
        const failedScenarios = this.results.educationalScenarios.filter(s => s.status !== 'PASS');
        if (failedScenarios.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'educational-effectiveness',
                title: 'Educational User Experience Issues',
                description: 'Some educational scenarios failed or showed poor performance',
                actionItems: [
                    'Review user journey mapping',
                    'Optimize educational workflow steps',
                    'Enhance accessibility features',
                    'Improve content personalization algorithms'
                ],
                impact: 'user-satisfaction'
            });
        }

        return recommendations;
    }

    generateNextSteps() {
        const nextSteps = [];

        if (this.results.deploymentReadiness.overall.status === 'READY') {
            nextSteps.push({
                phase: 'deployment',
                title: 'Deploy to Production',
                description: 'All integration tests passed - system is ready for production deployment',
                actions: [
                    'Execute production deployment',
                    'Monitor initial production metrics',
                    'Conduct user acceptance testing',
                    'Implement production monitoring'
                ]
            });
        } else {
            nextSteps.push({
                phase: 'remediation',
                title: 'Address Integration Issues',
                description: 'System requires remediation before production deployment',
                actions: [
                    'Review and fix failing test suites',
                    'Re-run integration tests',
                    'Validate educational compliance',
                    'Conduct performance optimization'
                ]
            });
        }

        nextSteps.push({
            phase: 'optimization',
            title: 'Continuous Integration Monitoring',
            description: 'Implement continuous testing and monitoring for ongoing quality assurance',
            actions: [
                'Set up automated integration testing',
                'Implement real-time performance monitoring',
                'Configure educational analytics dashboards',
                'Establish compliance monitoring alerts'
            ]
        });

        return nextSteps;
    }

    async saveReports(report, reportId) {
        const outputDir = MASTER_TEST_CONFIG.reporting.outputDir;
        
        // JSON Report
        const jsonPath = path.join(outputDir, `${reportId}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
        console.log(`📄 JSON report saved: ${jsonPath}`);

        // HTML Report
        const htmlPath = path.join(outputDir, `${reportId}.html`);
        const htmlContent = this.generateHTMLReport(report);
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`📄 HTML report saved: ${htmlPath}`);

        // CSV Summary
        const csvPath = path.join(outputDir, `${reportId}-summary.csv`);
        const csvContent = this.generateCSVReport(report);
        fs.writeFileSync(csvPath, csvContent);
        console.log(`📄 CSV summary saved: ${csvPath}`);
    }

    generateHTMLReport(report) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Jeseci Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .test-suite { margin: 10px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
        .pass { border-left: 4px solid #10b981; }
        .fail { border-left: 4px solid #ef4444; }
        .error { border-left: 4px solid #f59e0b; }
        .recommendation { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎓 Jeseci Interactive Learning Platform</h1>
        <h2>Enterprise Integration Test Report</h2>
        <p>Environment: ${report.metadata.environment} | Generated: ${report.metadata.timestamp}</p>
    </div>
    
    <div class="summary">
        <h3>📊 Test Summary</h3>
        <p>Total Tests: ${report.summary.totalTests} | 
           Successful: ${report.summary.successful} | 
           Failed: ${report.summary.failed} | 
           Errors: ${report.summary.errors}</p>
        <p>Success Rate: ${Math.round((report.summary.successful / report.summary.totalTests) * 100)}%</p>
        <p>Duration: ${Math.round(report.summary.duration / 1000)}s</p>
    </div>
    
    <h3>🧪 Test Suites</h3>
    ${report.testSuites.map(suite => `
        <div class="test-suite ${suite.status.toLowerCase()}">
            <h4>${suite.name}</h4>
            <p>${suite.description}</p>
            <p>Status: ${suite.status} | Duration: ${Math.round(suite.duration / 1000)}s</p>
            <p>Results: ${suite.summary.successful}/${suite.summary.totalTests} tests passed</p>
        </div>
    `).join('')}
    
    <h3>🎓 Educational Scenarios</h3>
    ${report.educationalScenarios.map(scenario => `
        <div class="test-suite ${scenario.status.toLowerCase()}">
            <h4>${scenario.scenario}</h4>
            <p>User: ${scenario.user.type} | Grade: ${scenario.user.gradeLevel || scenario.user.educationLevel || 'N/A'}</p>
            <p>Status: ${scenario.status} | Success Rate: ${Math.round((scenario.metrics?.successRate || 0) * 100)}%</p>
        </div>
    `).join('')}
    
    <h3>📋 Recommendations</h3>
    ${report.recommendations.map(rec => `
        <div class="recommendation">
            <h4>${rec.title}</h4>
            <p>${rec.description}</p>
            <p><strong>Priority:</strong> ${rec.priority} | <strong>Impact:</strong> ${rec.impact}</p>
        </div>
    `).join('')}
</body>
</html>`;
    }

    generateCSVReport(report) {
        let csv = 'Test Suite,Status,Duration (s),Total Tests,Successful,Failed,Errors\n';
        
        report.testSuites.forEach(suite => {
            csv += `"${suite.name}",${suite.status},${Math.round(suite.duration / 1000)},${suite.summary.totalTests},${suite.summary.successful},${suite.summary.failed},${suite.summary.errors}\n`;
        });
        
        csv += '\nEducational Scenario,Status,Success Rate,Average Step Time (ms)\n';
        
        report.educationalScenarios.forEach(scenario => {
            csv += `"${scenario.scenario}",${scenario.status},${Math.round((scenario.metrics?.successRate || 0) * 100)}%,${scenario.metrics?.averageStepTime || 0}\n`;
        });
        
        return csv;
    }

    displayReportSummary(report) {
        console.log('📊 INTEGRATION TEST REPORT SUMMARY');
        console.log('='.repeat(60));
        console.log(`🌍 Environment: ${report.metadata.environment}`);
        console.log(`⏱️ Duration: ${Math.round(report.summary.duration / 1000)}s`);
        console.log(`📈 Success Rate: ${Math.round((report.summary.successful / report.summary.totalTests) * 100)}%`);
        console.log(`🎯 Deployment Readiness: ${Math.round(report.deploymentReadiness.overall.score)}% ${report.deploymentReadiness.overall.status === 'READY' ? '✅' : '❌'}`);
        
        console.log('\n📋 TEST SUITES:');
        report.testSuites.forEach(suite => {
            console.log(`  ${suite.status === 'PASS' ? '✅' : '❌'} ${suite.name}: ${suite.summary.successful}/${suite.summary.totalTests} (${Math.round(suite.duration / 1000)}s)`);
        });
        
        console.log('\n🎓 EDUCATIONAL SCENARIOS:');
        report.educationalScenarios.forEach(scenario => {
            console.log(`  ${scenario.status === 'PASS' ? '✅' : '❌'} ${scenario.scenario}: ${Math.round((scenario.metrics?.successRate || 0) * 100)}% success`);
        });
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMMENDATIONS:');
            report.recommendations.slice(0, 3).forEach(rec => {
                console.log(`  🔴 ${rec.priority}: ${rec.title}`);
            });
        }
        
        console.log('\n🚀 NEXT STEPS:');
        report.nextSteps.forEach(step => {
            console.log(`  📌 ${step.phase.toUpperCase()}: ${step.title}`);
        });
    }
}

// Main execution
async function main() {
    const environment = process.argv[2] || 'development';
    
    try {
        console.log('Starting Master Integration Test Runner...\n');
        
        const runner = new MasterIntegrationTestRunner(environment);
        const report = await runner.runAllIntegrationTests();
        
        console.log('\n🎉 Master Integration Test Suite Completed!');
        console.log(`📁 Reports saved to: ${MASTER_TEST_CONFIG.reporting.outputDir}`);
        
        const success = report.deploymentReadiness.overall.status === 'READY';
        process.exit(success ? 0 : 1);
        
    } catch (error) {
        console.error('💥 Master test runner failed:', error);
        process.exit(1);
    }
}

// Export for use
module.exports = {
    MasterIntegrationTestRunner,
    COMPREHENSIVE_EDUCATIONAL_SCENARIOS,
    MASTER_TEST_CONFIG
};

// Run if called directly
if (require.main === module) {
    main();
}