# AyuTrace - Blockchain-based Ayurvedic Herb Traceability System

## Overview

AyuTrace is a comprehensive blockchain-based traceability system designed for the Smart India Hackathon 2025. The application tracks the complete journey of Ayurvedic herbs from collection points (farmers/wild collectors) through processing, quality testing, manufacturing, to final consumer products. The system ensures transparency, authenticity, and quality assurance throughout the entire supply chain using geo-tagging, blockchain technology, and QR code-based product verification.

The platform serves multiple stakeholders including collectors, processors, laboratories, manufacturers, and consumers, providing each with specialized interfaces and functionality tailored to their role in the supply chain.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design system variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the stack for consistency and type safety
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **API Design**: RESTful endpoints following conventional HTTP methods and status codes
- **Development Server**: Custom Vite integration for hot module replacement in development

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Drizzle ORM with comprehensive schema design
- **Database Provider**: Neon Database (serverless PostgreSQL) for scalability and performance
- **Schema Management**: Drizzle Kit for database migrations and schema versioning
- **Connection**: Neon serverless driver for optimized database connections

### Database Schema Design
The system uses a comprehensive relational schema including:
- **Users**: Role-based stakeholder management (collector, processor, laboratory, manufacturer, consumer)
- **Herb Species**: Master data for botanical information and harvesting guidelines
- **Collections**: Geo-tagged harvest events with quality metrics and blockchain integration
- **Batches**: Processing units combining multiple collections with status tracking
- **Processing Steps**: Detailed processing history with environmental conditions
- **Quality Tests**: Laboratory results with pass/fail criteria and compliance data
- **Products**: Final manufactured goods with QR codes and traceability links
- **Blockchain Transactions**: Immutable audit trail of all supply chain events

### Authentication and Authorization
- **Role-based Access**: Five distinct user roles with appropriate permissions and UI access
- **Session Management**: Express sessions with PostgreSQL storage for persistence
- **Route Protection**: Role-based route guards preventing unauthorized access to sensitive operations

### Blockchain Integration
- **Simulator**: Custom blockchain simulator for development and demonstration purposes
- **Transaction Recording**: All critical supply chain events recorded as blockchain transactions
- **Immutable Audit Trail**: Complete provenance tracking from collection to consumer
- **Smart Contracts**: Simulated validation rules for quality gates and compliance checks

### Mobile-First Design
- **Responsive Layout**: Mobile-optimized interface with bottom navigation for easy thumb access
- **Progressive Web App**: Service worker ready for offline functionality in rural areas
- **Touch-Optimized**: Large touch targets and gesture-friendly interactions
- **Offline Support**: Local storage and sync capabilities for areas with poor connectivity

## External Dependencies

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection and query execution
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect support
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

### Frontend Framework and UI
- **react**: Core React library for component-based UI development
- **@tanstack/react-query**: Server state management, caching, and synchronization
- **wouter**: Lightweight routing library for single-page application navigation
- **@radix-ui/***: Comprehensive suite of accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

### Backend and API
- **express**: Web framework for Node.js providing HTTP server capabilities
- **tsx**: TypeScript execution engine for running TypeScript files directly
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **zod**: TypeScript-first schema validation library

### Development and Build Tools
- **vite**: Fast build tool and development server with hot module replacement
- **@vitejs/plugin-react**: Vite plugin for React support and JSX transformation
- **typescript**: Static type checking and modern JavaScript features
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development tools and error handling

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library for date manipulation
- **nanoid**: URL-safe unique ID generator for creating resource identifiers
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for integrating with schema libraries

### QR Code and Camera Integration
- **cmdk**: Command menu component for search and navigation interfaces
- Browser-native camera APIs for QR code scanning functionality
- Canvas API for QR code generation and image processing

### Geo-location and Mapping
- Browser Geolocation API for GPS coordinate capture
- Custom geo-fencing logic for validating collection locations
- Location-based validation and harvesting zone compliance