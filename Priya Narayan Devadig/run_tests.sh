#!/bin/bash

# Freelance Marketplace - Test Runner Script
# This script runs all backend and frontend tests with coverage

echo "=================================="
echo "Freelance Marketplace Test Suite"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall success
BACKEND_SUCCESS=0
FRONTEND_SUCCESS=0

# Backend Tests
echo -e "${YELLOW}Running Backend Tests...${NC}"
echo "-----------------------------------"

if command -v pytest &> /dev/null; then
    pytest --cov=. --cov-report=html --cov-report=term-missing
    BACKEND_SUCCESS=$?
    
    if [ $BACKEND_SUCCESS -eq 0 ]; then
        echo -e "${GREEN}✓ Backend tests passed${NC}"
    else
        echo -e "${RED}✗ Backend tests failed${NC}"
    fi
else
    echo -e "${RED}pytest not found. Please install: pip install -r requirements.txt${NC}"
    BACKEND_SUCCESS=1
fi

echo ""
echo "-----------------------------------"
echo ""

# Frontend Tests
echo -e "${YELLOW}Running Frontend Tests...${NC}"
echo "-----------------------------------"

if [ -d "frontend" ]; then
    cd frontend
    
    if [ -f "package.json" ]; then
        if command -v npm &> /dev/null; then
            npm test -- --coverage --watchAll=false
            FRONTEND_SUCCESS=$?
            
            if [ $FRONTEND_SUCCESS -eq 0 ]; then
                echo -e "${GREEN}✓ Frontend tests passed${NC}"
            else
                echo -e "${RED}✗ Frontend tests failed${NC}"
            fi
        else
            echo -e "${RED}npm not found. Please install Node.js${NC}"
            FRONTEND_SUCCESS=1
        fi
    else
        echo -e "${YELLOW}No package.json found in frontend directory${NC}"
    fi
    
    cd ..
else
    echo -e "${YELLOW}Frontend directory not found${NC}"
fi

echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="

if [ $BACKEND_SUCCESS -eq 0 ] && [ $FRONTEND_SUCCESS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Coverage reports generated:"
    echo "  Backend:  htmlcov/index.html"
    echo "  Frontend: frontend/coverage/lcov-report/index.html"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    [ $BACKEND_SUCCESS -ne 0 ] && echo -e "  ${RED}Backend tests failed${NC}"
    [ $FRONTEND_SUCCESS -ne 0 ] && echo -e "  ${RED}Frontend tests failed${NC}"
    exit 1
fi
