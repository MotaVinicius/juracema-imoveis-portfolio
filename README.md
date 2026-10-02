# Juracema Mota Imóveis

A full-stack real estate management system developed for a real estate professional, focused on property management, public property listings and a modern web experience.

The project was designed and deployed as a real production application, including cloud infrastructure, HTTPS, database, object storage, CDN and automated deployment configuration.

## Live Demo

🌐 **Website:** https://juracemamotaimoveis.com.br

The production website contains the real property listings and customer-facing data. This repository contains the application's source code and infrastructure configuration without production customer or property data.

---

## About the Project

Juracema Mota Imóveis is a real estate platform developed to provide a modern website for property listings while also offering an administrative interface for managing properties and images.

The system includes a public website where visitors can browse available properties and view detailed information, as well as an authenticated administrative area for managing the property portfolio.

The project also integrates with external services used in the real estate workflow, including property feed generation for Chaves na Mão.

---

## Features

### Public website

- Property listing
- Property detail pages
- Friendly URLs with property slugs
- Responsive layout
- Property image gallery
- Featured properties
- SEO-friendly metadata
- Open Graph metadata for social sharing
- WhatsApp integration
- Contact information
- About page

### Administrative system

- Secure administrator authentication
- JWT-based authentication
- Property creation and editing
- Property availability management
- Property image upload
- Image deletion
- Main image selection
- Drag-and-drop image ordering
- Property highlighting
- Property information management

### Integrations

- Chaves na Mão XML property feed
- AWS S3 for image storage
- CloudFront for content delivery
- Google Maps integration
- WhatsApp links

---

## Technologies

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend

- HTML5
- CSS3
- JavaScript
- Nginx

### Cloud & Infrastructure

- AWS EC2
- AWS S3
- AWS CloudFront
- AWS Route 53
- Terraform
- Ansible
- Docker
- Docker Compose
- Let's Encrypt

---

## Architecture

The application follows a layered architecture with a Spring Boot REST API serving the business logic and a static frontend served by Nginx.


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
                  ┌────────────┐   ┌────────────┐   ┌────────────┐
                  │ PostgreSQL │   │    AWS S3  │   │  External  │
                  │            │   │   Images   │   │ Integrations│
                  └────────────┘   └────────────┘   └────────────┘