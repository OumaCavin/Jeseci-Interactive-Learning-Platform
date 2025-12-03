#!/bin/bash

# Jeseci Integration Test Runner Script
# Runs comprehensive integration tests for all enterprise features

set -e

echo "🚀 Jeseci Enterprise Integration Test Suite"
echo "============================================"
echo ""

# Function to print colored output
print_status() {
    if [ "$2" = "success" ]; then
        echo -e "✅ $1"
    elif [ "$2" = "error" ]; then
        echo -e "❌ $1"
    elif [ "$2" = "warning" ]; then
        echo -e "⚠️  $1"
    else
        echo -e "ℹ️  $1"
    fi
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_status "Node.js is not installed. Please install Node.js first." "error"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..." "info"
    npm install
fi

# Function to run individual test suites
run_test_suite() {
    local test_name=$1
    local command=$2
    
    print_status "Running $test_name tests..." "info"
    
    if eval $command; then
        print_status "$test_name tests passed" "success"
        return 0
    else
        print_status "$test_name tests failed" "error"
        return 1
    fi
}

# Parse command line arguments
ENVIRONMENT="development"
RUN_SPECIFIC=""
VERBOSE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--specific)
            RUN_SPECIFIC="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE="true"
            shift
            ;;
        -h|--help)
            echo "Jeseci Integration Test Runner"
            echo ""
            echo "Usage: ./run-integration-tests.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -e, --environment ENV    Set test environment (development|staging|production)"
            echo "  -s, --specific TEST      Run specific test suite"
            echo "  -v, --verbose            Enable verbose output"
            echo "  -h, --help               Show this help message"
            echo ""
            echo "Test Suites:"
            echo "  integration              Core interoperability tests"
            echo "  websocket                WebSocket intelligence tests"
            echo "  security                 Security intelligence tests"
            echo "  performance              Performance integration tests"
            echo "  enterprise               Enterprise feature tests"
            echo ""
            echo "Examples:"
            echo "  ./run-integration-tests.sh                    # Run all tests in development"
            echo "  ./run-integration-tests.sh -e staging         # Run all tests in staging"
            echo "  ./run-integration-tests.sh -s security        # Run only security tests"
            echo "  ./run-integration-tests.sh -v                 # Run with verbose output"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

print_status "Test Environment: $ENVIRONMENT" "info"
echo ""

# Results tracking
total_tests=0
passed_tests=0
failed_tests=0

# Function to execute tests with error handling
execute_test() {
    local test_description=$1
    local test_command=$2
    
    total_tests=$((total_tests + 1))
    
    if [ "$VERBOSE" = "true" ]; then
        print_status "Executing: $test_command" "info"
    fi
    
    if eval $test_command; then
        passed_tests=$((passed_tests + 1))
        if [ "$VERBOSE" != "true" ]; then
            print_status "$test_description" "success"
        fi
    else
        failed_tests=$((failed_tests + 1))
        if [ "$VERBOSE" != "true" ]; then
            print_status "$test_description" "error"
        fi
    fi
}

# Run specific test if requested
if [ -n "$RUN_SPECIFIC" ]; then
    case $RUN_SPECIFIC in
        integration)
            execute_test "Enterprise Integration Tests" "node tests/enterprise-integration-tests.js"
            ;;
        websocket)
            execute_test "WebSocket Intelligence Tests" "node tests/websocket-integration-tests.js"
            ;;
        security)
            execute_test "Security Intelligence Tests" "node tests/security-integration-tests.js"
            ;;
        performance)
            execute_test "Performance Integration Tests" "node tests/performance-integration-tests.js"
            ;;
        enterprise)
            execute_test "Enterprise Feature Tests" "node tests/enterprise-integration-tests.js"
            ;;
        *)
            print_status "Unknown test suite: $RUN_SPECIFIC" "error"
            echo "Available test suites: integration, websocket, security, performance, enterprise"
            exit 1
            ;;
    esac
else
    # Run comprehensive integration test suite
    print_status "Starting comprehensive integration test suite..." "info"
    
    # Check if development server is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "Development server detected at http://localhost:3000" "info"
    else
        print_status "Development server not detected. Some tests may fail." "warning"
        print_status "Start the development server with: npm start" "info"
    fi
    
    echo ""
    
    # Run main integration test suite
    execute_test "Master Integration Tests (Environment: $ENVIRONMENT)" \
        "node tests/master-integration-test-runner.js $ENVIRONMENT"
    
    # Run individual test suites for detailed analysis
    print_status "Running detailed test suite analysis..." "info"
    
    execute_test "Enterprise Feature Integration" \
        "node tests/enterprise-integration-tests.js"
    
    execute_test "WebSocket Intelligence Integration" \
        "node tests/websocket-integration-tests.js"
    
    execute_test "Security Intelligence Integration" \
        "node tests/security-integration-tests.js"
    
    execute_test "Performance Integration" \
        "node tests/performance-integration-tests.js"
fi

# Generate summary report
echo ""
echo "📊 INTEGRATION TEST SUMMARY"
echo "============================"
echo "Total Test Suites: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $failed_tests"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($passed_tests/$total_tests)*100}")%"
echo ""

if [ $failed_tests -eq 0 ]; then
    print_status "🎉 All integration tests passed successfully!" "success"
    print_status "System is ready for production deployment" "success"
    exit 0
else
    print_status "⚠️  Some integration tests failed" "error"
    print_status "Please review the test reports and address the issues" "warning"
    
    echo ""
    echo "📋 Next Steps:"
    echo "1. Review test failure details above"
    echo "2. Check test reports in ./test-reports/ directory"
    echo "3. Fix identified issues"
    echo "4. Re-run integration tests"
    echo ""
    
    exit 1
fi