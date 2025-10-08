# FormGrid

**Form Endpoint API Generator** - Create powerful API endpoints for your HTML forms. Generate secure, spam-protected form endpoints that work with any website or application. Built with Node.js, React, and TypeScript, featuring comprehensive file upload capabilities and multi-storage support.

## Features

### API Endpoint Generation
- **Instant API Creation** - Generate secure form endpoints in seconds
- **Unique Endpoint URLs** - Each form gets its own dedicated API endpoint
- **Multiple Submission Methods** - HTML forms, JavaScript, or direct API calls
- **Automatic Code Generation** - Get ready-to-use HTML and JavaScript snippets
- **Cross-Origin Support** - Works with any website or application

### File Upload System
- **Multiple Storage Options** - Local, MinIO, AWS S3, and Google Cloud Storage
- **File Type Restrictions** - Configure accepted file types per field
- **Multiple File Uploads** - Allow single or multiple files per field
- **File Size Limits** - Configurable file size restrictions
- **Secure File Serving** - Protected file access with proper URLs

### Dashboard & Management
- **Modern Dashboard** - Clean, responsive interface with comprehensive analytics
- **Submission Management** - View, filter, and manage form submissions
- **File Management** - Download and preview uploaded files
- **Form Analytics** - Track submission counts and form performance
- **Bulk Operations** - Mark submissions as spam, delete multiple submissions

### Developer Experience
- **Zero Backend Required** - No server setup needed for form handling
- **Universal Integration** - Works with any frontend framework or static site
- **Webhook Support** - Real-time notifications for new submissions
- **RESTful API** - Standard HTTP methods for form submissions
- **Rate Limiting** - Built-in protection against spam and abuse

### Authentication & Security
- **JWT Authentication** - Secure token-based authentication
- **Google OAuth** - Social login with Google
- **Password Reset** - Secure email-based password reset flow
- **Protected Routes** - Route-level authentication guards
- **Spam Protection** - Honeypot and reCAPTCHA integration

## Project Structure

```
├── backend/                    # Node.js + TypeScript API server
│   ├── src/
│   │   ├── auth/              # Authentication logic & routes
│   │   ├── user/              # User management
│   │   ├── form/              # Form creation and management
│   │   ├── submission/        # Form submission handling
│   │   ├── middleware/        # File upload and validation middleware
│   │   ├── config/            # Storage and application configuration
│   │   └── scripts/           # Utility scripts for maintenance
│   ├── prisma/                # Database schema and migrations
│   └── uploads/               # Local file storage (when using local storage)
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages (Dashboard, Form Builder)
│   │   ├── layouts/           # Layout components
│   │   ├── context/           # React context providers
│   │   └── lib/               # Utility libraries
│   └── public/                # Static assets
├── docker-compose.yml         # Multi-storage Docker configuration
├── STORAGE_SETUP.md          # Storage configuration guide
└── README.md                 # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- MySQL (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formgrid
   ```

2. **Set up environment variables**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the application**
   ```bash
   # Using Docker (recommended)
   docker-compose up

   # Or run locally
   # Backend
   cd backend && npm run dev

   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4001
   - MinIO Console: http://localhost:9001 (if using MinIO storage)

## Storage Configuration

FormGrid supports multiple storage options for file uploads:

### Local Storage (Default)
```bash
docker-compose up
```

### MinIO (S3-Compatible)
```bash
FILE_STORAGE_TYPE=minio docker-compose up
```

### AWS S3
```bash
FILE_STORAGE_TYPE=s3 AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx docker-compose up
```

### Google Cloud Storage
```bash
FILE_STORAGE_TYPE=gcs GCS_PROJECT_ID=xxx docker-compose up
```

For detailed storage setup instructions, see [STORAGE_SETUP.md](./STORAGE_SETUP.md).

## How It Works

1. **Create an Endpoint** - Generate a unique API endpoint for your form
2. **Configure Fields** - Set up form fields including file uploads with restrictions
3. **Get Your Code** - Copy the generated HTML/JavaScript form code
4. **Embed Anywhere** - Add the form to any website, static site, or application
5. **Collect Submissions** - View and manage submissions in your dashboard
6. **No Backend Needed** - FormGrid handles all the server-side processing

## API Usage

### HTML Form Integration
```html
<!-- Simple HTML form - just change the action URL -->
<form action="https://your-formgrid-instance.com/api/f/your-form-slug" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message" placeholder="Your Message" required></textarea>
    <input type="file" name="attachment" accept="image/*,.pdf">
    <button type="submit">Send Message</button>
</form>
```

### JavaScript Integration
```javascript
// Works with any frontend framework or vanilla JavaScript
const form = document.getElementById('myForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://your-formgrid-instance.com/api/f/your-form-slug', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting form');
        }
    } catch (error) {
        alert('Error submitting form');
    }
});
```

### Direct API Calls
```javascript
// Submit form data programmatically
const response = await fetch('https://your-formgrid-instance.com/api/f/your-form-slug', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello from my app!'
    })
});
```

## Environment Variables

### Required
```env
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=mysql://user:password@localhost:3306/formgrid
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=your-resend-api-key
```

### Optional
```env
# File Storage
FILE_STORAGE_TYPE=local
MAX_FILE_SIZE=10485760
MAX_FILES=10

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
```

## Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run cleanup      # Clean up old files
npm run setup:minio  # Setup MinIO bucket
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Management
```bash
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio
```

## Deployment

### Docker Production
```bash
# Build and start all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Setup storage (if needed)
docker-compose exec backend npm run setup:minio

# Cleanup old files
docker-compose exec backend npm run cleanup
```

### Manual Deployment
1. Build the frontend: `npm run build`
2. Build the backend: `npm run build`
3. Set up your database and environment variables
4. Start the backend server: `npm start`
5. Serve the frontend build files

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**FormGrid** - The Form Endpoint API Generator that creates powerful, secure API endpoints for your HTML forms. No backend required.