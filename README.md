# Juracema Mota Imóveis

Full-stack real estate management system developed for **Juracema Mota Imóveis**, a real estate agency based in Indaiatuba, São Paulo, Brazil.

The project includes a public real estate website, administrative management system, REST API, image storage on AWS S3, infrastructure as code and external property listing integration.

## 🌐 Live Website

**https://juracemamotaimoveis.com.br**

The production website contains the real property listings and business data.

This repository intentionally does **not** contain production property data, customer information or credentials.

---

## 📌 About the Project

The system was developed to provide a modern platform for managing and presenting real estate listings.

The application combines a public-facing website with a protected administrative environment where authorized users can manage properties, images and listing information.

The project was also designed with cloud deployment and infrastructure automation in mind, using AWS, Docker, Terraform and Ansible.

---

## ✨ Features

### Public Website

- Property listing page
- Property details page
- Property search and visualization
- Responsive design
- SEO-friendly property URLs
- Dynamic property metadata
- Open Graph metadata for social media sharing
- WhatsApp sharing
- Property image galleries
- Featured properties
- Friendly URLs

Example:

https://juracemamotaimoveis.com.br/imoveis/3/teste-casa-terrea-residencial-dona-lucilla
Administrative System
Administrator authentication
JWT-based authentication
Property creation
Property editing
Property deletion
Property availability management
Featured property management
Property image upload
Image deletion
Image ordering using drag and drop
Main image selection
Property owner contact information
Internal notes
Integrations
AWS S3 for property image storage
Chaves na Mão XML integration
WhatsApp integration
PostgreSQL database



🏗️ Architecture
                         ┌─────────────────────┐
                         │      Internet       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Nginx         │
                         │  HTTPS / Reverse    │
                         │       Proxy         │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                  ┌──────────────┐      ┌──────────────┐
                  │   Frontend   │      │ Spring Boot  │
                  │ HTML/CSS/JS  │      │     API      │
                  └──────────────┘      └──────┬───────┘
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                              ▼                ▼                ▼
                       ┌────────────┐   ┌────────────┐   ┌──────────────┐
                       │ PostgreSQL │   │   AWS S3   │   │   External   │
                       │  Database  │   │   Images   │   │ Integrations │
                       └────────────┘   └────────────┘   └──────────────┘



🛠️ Technologies

Backend
Java 21
Spring Boot
Spring Security
Spring Data JPA
Hibernate
JWT
PostgreSQL
Maven
Frontend
HTML5
CSS3
JavaScript
Responsive design
Infrastructure
AWS EC2
AWS S3
AWS CloudFront
AWS Route 53
Docker
Docker Compose
Terraform
Ansible
Nginx
Let's Encrypt
External Integration
Chaves na Mão XML
WhatsApp



📂 Project Structure
.
├── Back-End/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── Front-End/
│   ├── admin/
│   ├── imagens/
│   ├── *.html
│   ├── *.css
│   └── *.js
│
├── Infra/
│   ├── Ansible/
│   └── Terraform/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md



🔐 Security

The application implements several security mechanisms, including:

JWT authentication
Protected administrative endpoints
Environment-based configuration
Password hashing
CORS configuration
HTTPS
AWS IAM-based access to S3
Separation between public and administrative APIs

Sensitive information such as passwords, JWT secrets, AWS credentials and private keys are not stored in the repository.

Environment variables are used for sensitive configuration.



☁️ AWS Infrastructure

The production environment runs on AWS.

The infrastructure includes:

EC2 for application hosting
S3 for property image storage
CloudFront for image delivery
Route 53 for DNS
Elastic IP
Security Groups
IAM permissions
HTTPS with Let's Encrypt

The infrastructure is provisioned using Terraform and server configuration is automated using Ansible.



🐳 Docker

The application is containerized using Docker.

The production environment uses Docker Compose to run the main application components.

Typical services include:

Frontend / Nginx
        │
        ▼
Spring Boot API
        │
        ▼
PostgreSQL

Docker provides a consistent environment between development and deployment.



🌍 SEO and Friendly URLs

The website uses human-readable property URLs.

Instead of:

/imoveis.html?id=3

the system uses:

/imoveis/3/property-name

Property slugs are generated from the property title.

The backend also validates the slug and redirects incorrect URLs to the canonical property URL.

The property page dynamically generates:

<title>
Meta description
Canonical URL
Open Graph title
Open Graph description
Open Graph image
Open Graph URL

This allows property links to generate meaningful previews when shared through platforms such as WhatsApp.



🖼️ Image Management

Property images are stored in AWS S3 rather than inside the application repository.

The administrative system allows authorized users to:

Upload images
Delete images
Select the main image
Reorder images using drag and drop

The image order is persisted in the database.

The main image is also used when generating property previews and Open Graph metadata.



🔗 Chaves na Mão Integration

The system provides a public XML feed containing available properties for integration with the Chaves na Mão platform.

Endpoint:

https://juracemamotaimoveis.com.br/integracoes/chaves-na-mao/imoveis.xml

The XML is generated dynamically from the database.

Only properties marked as available are included in the feed.

The integration includes information such as:

Property reference
Transaction type
Property purpose
Property type
Price
Location
Description
Property area
Address
Property photos
Additional property information

The XML follows the format required by the external platform.



⚙️ Running Locally
Requirements

Before running the project locally, install:

Java 21
Maven
PostgreSQL
Docker
Docker Compose
Git

1. Clone the repository
git clone https://github.com/MotaVinicius/juracema-imoveis.git
cd juracema-imoveis


2. Configure environment variables
Create a .env file based on:
.env.example

Example:

DB_URL=jdbc:postgresql://localhost:5432/imoveis
DB_USER=postgres
DB_PASSWORD=your_password

ADMIN_NAME=Administrator
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password

JWT_SECRET=your_secure_secret

AWS_REGION=sa-east-1
S3_BUCKET_NAME=
S3_PUBLIC_URL=

Do not commit the .env file.


3. Start PostgreSQL
PostgreSQL can be run locally or through Docker.

Example:

docker compose up -d postgres


4. Run the backend
Navigate to:

Back-End/

Then run:

./mvnw spring-boot:run

On Windows:

.\mvnw.cmd spring-boot:run

The API will be available at:

http://localhost:8080


5. Run the frontend
The frontend can be served using any local HTTP server.

For example, using VS Code with Live Server:

http://localhost:5500

The frontend is configured to communicate with the backend API.



🚀 Infrastructure as Code

The Infra/ directory contains the infrastructure automation used by the project.


Terraform
Terraform is responsible for provisioning AWS infrastructure such as:

EC2
S3
Security Groups
IAM resources
Route 53 resources
Networking resources

Example workflow:

cd Infra/Terraform

terraform init
terraform plan
terraform apply

Production credentials and state files are intentionally excluded from this repository.


Ansible
Ansible is used to automate server configuration and application environment setup.

The playbooks can configure components such as:

Docker
Nginx
Application directories
System configuration
Deployment prerequisites



📦 Deployment

The production environment runs on an AWS EC2 instance.

The deployment architecture uses:

Internet
   │
   ▼
Nginx + HTTPS
   │
   ├── Frontend
   │
   └── Spring Boot API
           │
           ├── PostgreSQL
           │
           └── AWS S3

Infrastructure provisioning and server configuration are automated using Terraform and Ansible.



📁 Repository and Production Data

This repository is intended as a portfolio project.

For privacy and security reasons, it does not contain:

Production property data
Customer information
Property owner information
Production database
Uploaded production images
AWS credentials
Private SSH keys
JWT secrets
Production .env files
Terraform state files

The live website contains the actual production data:

https://juracemamotaimoveis.com.br



📚 Project Highlights

This project demonstrates practical experience with:

Full-stack application development
REST API development
Java and Spring Boot
Spring Security and JWT
PostgreSQL
Docker and Docker Compose
AWS cloud infrastructure
AWS S3
CloudFront
Infrastructure as Code
Terraform
Ansible
Nginx
HTTPS
DNS
SEO-friendly URLs
Open Graph metadata
External XML integrations
Image management
Responsive frontend development



👨‍💻 Author

Vinicius Mota

IT professional focused on infrastructure, cloud computing, DevOps and software development.

GitHub:

https://github.com/MotaVinicius