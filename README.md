# studio.imuii.id - Template Uploader Platform

Platform untuk berbagi dan menemukan template portfolio dan CV terbaik untuk [imuii.id](https://imuii.id). Buat, upload, dan gunakan template berkualitas tinggi.

## Features

- 🔐 **Self-Registration** - Daftar sendiri tanpa perlu approval admin
- 📝 **Template Management** - Upload, edit, dan hapus template Anda
- 👀 **Browse Templates** - Lihat semua template dari semua uploader
- ✅ **Template Validation** - Validasi real-time saat membuat template
- 🎨 **Live Preview** - Preview template dengan dummy data
- 🔒 **JWT Authentication** - Secure authentication dengan JWT token

## Tech Stack

- **Framework:** Next.js 16.1.1
- **UI:** React 19.2.3, Tailwind CSS 4
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd imuii-template
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables

Buat file `.env.local` di root project:

```bash
# API Server URL
# Production: https://api.imuii.id/api/v1
# Development: http://localhost:8080/api/v1
NEXT_PUBLIC_API_SERVER_URL=https://api.imuii.id/api/v1
```

**Note:** 
- Untuk development, gunakan `http://localhost:8080/api/v1`
- Untuk production, gunakan `https://api.imuii.id/api/v1` (default jika env var tidak di-set)

4. Run development server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3015`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_SERVER_URL` | Base URL untuk imuii-server API (sudah include /api/v1) | Production: `https://api.imuii.id/api/v1`<br>Development: `http://localhost:8080/api/v1` |

## API Integration

Aplikasi ini terintegrasi dengan backend API di `api.imuii.id`. Endpoint yang digunakan:

### Authentication
- `POST /api/v1/template-uploaders/register` - Register uploader baru
- `POST /api/v1/template-uploaders/auth/login` - Login
- `GET /api/v1/template-uploaders/me` - Get profile
- `PUT /api/v1/template-uploaders/me` - Update profile

### Templates
- `GET /api/v1/template-uploaders/templates` - Get all templates
- `GET /api/v1/template-uploaders/templates/:id` - Get template by ID
- `POST /api/v1/template-uploaders/templates` - Create template
- `PUT /api/v1/template-uploaders/templates/:id` - Update template
- `DELETE /api/v1/template-uploaders/templates/:id` - Delete template

Lihat dokumentasi lengkap di [API-TEMPLATE-UPLOADER.md](../imuii-server/docs/API-TEMPLATE-UPLOADER.md)

## Project Structure

```
imuii-template/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.js       # Home page
│   │   ├── login/        # Login page
│   │   ├── register/     # Register page
│   │   ├── create/       # Create template page
│   │   ├── my-templates/ # My templates page
│   │   └── edit/         # Edit template page
│   ├── components/        # React components
│   │   ├── auth/         # Auth components
│   │   ├── layout/       # Layout components
│   │   ├── templates/    # Template components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom hooks
│   │   └── useAuth.js    # Auth hook
│   └── lib/              # Utilities
│       ├── api/          # API services
│       ├── api-client.js # Axios instance
│       └── ...           # Other utilities
└── public/               # Static files
```

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

## Support

Untuk pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository.
