# StudyShare - Educational Document Sharing Platform

## Architecture

### System Architecture
The application follows a **microservices architecture** pattern with the following components:
- **Frontend**: React-based single-page application
- **Backend Services**: Dual backend approach with Node.js and Python Flask
- **Database**: PostgreSQL via Supabase
- **Cache Layer**: Redis for session management and caching
- **Background Processing**: Celery workers for asynchronous tasks
- **Container Orchestration**: Kubernetes with Docker containerization

### AWS Deployment Architecture
The application is deployed on AWS EC2 with a self-managed Kubernetes cluster, incorporating essential AWS integrations:

#### Core Infrastructure Components
- **AWS EC2 Instances**: Self-managed Kubernetes cluster nodes
- **AWS Cloud Controller Manager (CCM)**: Enables Kubernetes to interact with AWS APIs for:
  - Automatic external IP assignment to LoadBalancer services
  - Node lifecycle management and labeling with AWS metadata
  - Integration with AWS networking and security groups
- **AWS Load Balancer Controller**: Manages AWS Application Load Balancers (ALB) and Network Load Balancers (NLB) for Kubernetes ingress and services
- **NGINX Ingress Controller**: Application-level routing and SSL termination

#### Service Communication Flow
1. **External Traffic** → AWS Load Balancer (ALB/NLB)
2. **Load Balancer** → NGINX Ingress Controller
3. **Ingress** → Kubernetes Services → Application Pods
4. **Inter-Pod Communication** managed by Kubernetes networking with AWS VPC integration

### Deployment Infrastructure
- **Containerization**: Docker and Docker Compose
- **Orchestration**: Kubernetes (manually installed on AWS EC2)
- **Cloud Integration**: AWS Cloud Controller Manager for external IP exposure
- **Load Balancing**: AWS Load Balancer Controller with NGINX Ingress
- **CI/CD**: Jenkins pipeline
- **Monitoring**: Prometheus and Grafana stack
- **Cloud Platform**: AWS EC2 with ELB integration

## Technology Stack

### Frontend Technologies

#### Core Framework & Language
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | Main UI framework |
| TypeScript | 5.8.3 | Type-safe development |
| Vite | 7.0.4 | Build tool and dev server |

#### Styling & UI Components
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.1.11 | Utility-first CSS framework |
| Material-UI (MUI) | 7.2.0 | React component library |
| Emotion | 11.14.0 | CSS-in-JS styling |

#### State Management & Routing
| Technology | Version | Purpose |
|------------|---------|---------|
| Redux Toolkit | 2.8.2 | State management |
| React Redux | 9.2.0 | React-Redux integration |
| Redux Persist | 6.0.0 | State persistence |
| React Router DOM | 7.6.3 | Client-side routing |

#### Additional Frontend Libraries
- **React Markdown 10.1.0**: Markdown content rendering
- **Google OAuth 0.12.2**: Social authentication
- **Stripe.js 7.9.0**: Payment processing integration
- **UUID 11.1.0**: Unique identifier generation

### Backend Technologies

#### Node.js Backend Service
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.1.0 | Web application framework |
| Node.js | Latest | JavaScript runtime |

#### Python Flask Backend Service
| Technology | Version | Purpose |
|------------|---------|---------|
| Flask | Latest | Lightweight web framework |
| Celery | Latest | Distributed task queue |
| Gunicorn | Latest | WSGI HTTP server |

#### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2**: Token-based authentication
- **Passport.js 0.7.0**: Authentication middleware
- **Google OAuth 2.0**: Social login integration
- **bcrypt 6.0.0**: Password hashing and security

#### Database & Storage Solutions
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service platform |
| PostgreSQL | Primary relational database |
| Redis 5.8.2 | Caching and session management |

#### AI & Machine Learning Integration
- **Google Generative AI (Gemini) 1.16.0**: AI-powered content analysis and generation

#### File Processing Capabilities
| Technology | Purpose |
|------------|---------|
| Multer 2.0.2 | File upload handling |
| Sharp 0.34.3 | Image processing and optimization |
| pdf2image | PDF to image conversion |
| docx2pdf | Word document to PDF conversion |

#### External Services Integration
- **Stripe 18.5.0**: Payment gateway and subscription management
- **Nodemailer 7.0.6**: Email service integration
- **Node-cron 4.2.1**: Task scheduling and automation

### DevOps & Infrastructure

#### Containerization & Orchestration
| Technology | Purpose |
|------------|---------|
| Docker | Application containerization |
| Docker Compose | Multi-container development |
| Kubernetes | Production orchestration (manually installed) |
| AWS Cloud Controller Manager | External IP exposure and cloud integration |
| AWS Load Balancer Controller | AWS ELB integration for load balancing |
| NGINX Ingress | Application-level routing and traffic management |

#### CI/CD Pipeline
- **Jenkins**: Continuous integration and deployment
- **Git**: Version control and collaboration
- **WSL**: Windows development environment

#### Monitoring & Observability
| Technology | Purpose |
|------------|---------|
| Prometheus | Metrics collection and monitoring |
| Grafana | Data visualization and dashboards |
| prometheus_flask_exporter | Flask application metrics |
| prom-client 15.1.3 | Node.js application metrics |

#### Testing Frameworks
| Technology | Purpose |
|------------|---------|
| Vitest | Frontend unit testing |
| Jest 30.1.3 | Backend JavaScript testing |
| Testing Library | React component testing |
| Supertest 7.1.4 | HTTP endpoint testing |

## Key Features & Capabilities

### Document Management
- **File Upload & Processing**: Support for multiple document formats (PDF, DOCX, images)
- **Format Conversion**: Automated conversion between document formats
- **Image Optimization**: Automatic image processing and optimization

### AI-Powered Features
- **Content Analysis**: AI-driven document analysis using Google Gemini
- **Smart Recommendations**: Intelligent content suggestions
- **Automated Tagging**: AI-powered document categorization

### User Management & Authentication
- **Multi-factor Authentication**: JWT tokens with session management
- **Social Login**: Google OAuth integration
- **Role-based Access Control**: Comprehensive user permission system

### Payment & Subscription
- **Stripe Integration**: Secure payment processing
- **Subscription Management**: Flexible pricing and billing options
- **Transaction History**: Comprehensive payment tracking

### Performance & Scalability
- **Caching Strategy**: Redis-based caching for improved performance
- **Background Processing**: Asynchronous task handling with Celery
- **Load Balancing**: AWS Load Balancer Controller + NGINX Ingress for traffic distribution
- **External Connectivity**: AWS Cloud Controller Manager for automatic external IP assignment
- **Horizontal Scaling**: Kubernetes-based auto-scaling with AWS integration
- **High Availability**: Multi-AZ deployment capability through AWS infrastructure

### Monitoring & Analytics
- **Real-time Monitoring**: Prometheus metrics collection
- **Performance Dashboards**: Grafana visualization
- **Application Metrics**: Comprehensive logging and monitoring

## Development Environment

### Prerequisites
- Docker and Docker Compose
- Node.js (Latest LTS)
- Python 3.x
- Redis server
- PostgreSQL (or Supabase account)

### Local Development Setup
1. **Clone Repository**
   ```bash
   git clone https://github.com/longtoZ/Study-Share.git
   cd StudyShare
   ```

2. **Environment Configuration**
   - Configure environment variables for each service
   - Set up database connections
   - Configure external API keys (Google, Stripe, etc.)

3. **Container Deployment**
   ```bash
   docker-compose up -d
   ```

### Production Deployment
The application is deployed on AWS EC2 with manually installed Kubernetes, featuring:
- **Infrastructure**: AWS EC2 instances with self-managed Kubernetes cluster
- **Cloud Integration**: AWS Cloud Controller Manager for seamless AWS service integration
- **Load Balancing**: AWS Load Balancer Controller + NGINX Ingress for traffic distribution
- **External Access**: Automatic external IP provisioning through AWS CCM
- **Container Registry**: Docker Hub integration
- **Monitoring Stack**: Prometheus and Grafana deployment
- **CI/CD Pipeline**: Jenkins-based automated deployment

## Project Structure

```
StudyShare/
├── frontend/                 # React TypeScript application
├── backend/
│   ├── node/                # Express.js API server
│   └── flask/               # Python Flask service
├── database/                # Database schema and migrations
├── k8s/                     # Kubernetes deployment configurations
├── grafana/                 # Monitoring dashboards
├── wsl/                     # Development scripts
├── docker-compose.yaml      # Local development orchestration
└── Jenkinsfile             # CI/CD pipeline configuration
```

## Performance Characteristics

### Scalability Features
- **Microservices Architecture**: Independent service scaling
- **Container Orchestration**: Self-managed Kubernetes on AWS EC2
- **Cloud-Native Integration**: AWS Cloud Controller Manager for seamless scaling
- **Load Distribution**: AWS Load Balancer Controller + NGINX Ingress traffic management
- **Caching Strategy**: Multi-layer caching with Redis
- **Auto-Scaling**: Kubernetes HPA with AWS infrastructure integration

### Security Measures
- **Authentication**: Multi-layer security with JWT and OAuth
- **Data Encryption**: Secure data transmission and storage
- **Access Control**: Role-based permission system
- **Monitoring**: Comprehensive security monitoring and logging

## Contributing

This project follows modern development practices with comprehensive testing, continuous integration, and automated deployment pipelines. The microservices architecture ensures maintainability and allows for independent development and deployment of different components.

## License

This project is part of an educational platform initiative focused on improving student access to academic resources through modern web technologies and AI-powered features.

---

**Built with modern technologies for scalable, maintainable, and high-performance educational content sharing.**
