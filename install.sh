#!/bin/bash

# AI Resume Builder Installation Script
# This script sets up the entire project automatically

set -e  # Exit on any error

echo "🚀 AI Resume Builder - Automated Installation"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js version check passed: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_status "npm version: $(npm -v)"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Root dependencies
    print_info "Installing root dependencies..."
    npm install
    
    # Frontend dependencies
    print_info "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    # Backend dependencies
    print_info "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    print_status "All dependencies installed successfully"
}

# Create environment files
create_env_files() {
    print_info "Setting up environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env 2>/dev/null || cp .env.example backend/.env
        print_status "Created backend/.env from example"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env 2>/dev/null || {
            cat > frontend/.env << EOF
# Frontend Environment Variables

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:3001
EOF
        }
        print_status "Created frontend/.env from example"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    
    mkdir -p backend/dist
    mkdir -p frontend/dist
    mkdir -p uploads
    mkdir -p logs
    
    print_status "Directories created"
}

# Make scripts executable
make_scripts_executable() {
    print_info "Making scripts executable..."
    
    chmod +x scripts/setup.js 2>/dev/null || true
    chmod +x scripts/dev.js 2>/dev/null || true
    chmod +x install.sh 2>/dev/null || true
    
    print_status "Scripts are now executable"
}

# Build TypeScript (optional, may fail if env vars not set)
build_typescript() {
    print_info "Attempting to build TypeScript..."
    
    cd backend
    if npm run build 2>/dev/null; then
        print_status "Backend TypeScript compiled successfully"
    else
        print_warning "Backend TypeScript compilation failed (this is normal if environment variables are not set yet)"
    fi
    cd ..
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. 🔧 Set up your Supabase project:"
    echo "   - Go to https://supabase.com and create a new project"
    echo "   - Copy your project URL and API keys"
    echo "   - Update backend/.env and frontend/.env with your credentials"
    echo ""
    echo "2. 🤖 Get your OpenAI API key:"
    echo "   - Go to https://platform.openai.com/api-keys"
    echo "   - Create a new API key"
    echo "   - Add it to backend/.env as OPENAI_API_KEY"
    echo ""
    echo "3. 🗄️  Set up your database:"
    echo "   - Copy the SQL from database/schema.sql"
    echo "   - Run it in your Supabase SQL Editor"
    echo ""
    echo "4. 🚀 Start the development servers:"
    echo "   npm run dev"
    echo ""
    echo "📚 For detailed setup instructions, see SETUP_GUIDE.md"
    echo ""
    echo "🌐 Your app will be available at:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:3001"
    echo ""
}

# Main installation process
main() {
    echo "Starting installation process..."
    echo ""
    
    check_node
    check_npm
    install_dependencies
    create_env_files
    create_directories
    make_scripts_executable
    build_typescript
    show_next_steps
}

# Run main function
main