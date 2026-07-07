# RiverFlow - Full Stack Q&A Platform

A modern, production-ready Q&A platform built with Next.js 14 and Appwrite. Inspired by Stack Overflow, this application allows developers to ask questions, share knowledge, and collaborate with a community.

## Features

### Core Functionality
- **User Authentication**: Sign up, login, and logout with email/password
- **Questions**: Ask questions with rich text markdown support, tags, and image attachments
- **Answers**: Provide detailed answers with markdown support
- **Voting System**: Upvote/downvote questions and answers with reputation tracking
- **Comments**: Add comments to questions and answers
- **Search**: Search questions by title and content
- **Tags**: Filter questions by tags
- **User Profiles**: View user profiles with reputation, questions asked, and answers given
- **Edit/Delete**: Edit and delete your own questions and answers
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark Theme**: Built-in dark mode support

### Technical Features
- **Next.js 14**: App Router with server and client components
- **Appwrite**: Backend-as-a-Service for authentication, database, and storage
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Beautiful animations
- **Zustand**: Lightweight state management
- **Markdown Support**: Rich text editing with @uiw/react-md-editor

## Prerequisites

- Node.js 16.14.0 or higher
- npm or yarn or pnpm
- An Appwrite account (free tier available)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 26-full-stack-qna-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Appwrite

1. Create an account at [appwrite.io](https://appwrite.io)
2. Create a new project
3. Go to your project settings and note down:
   - Project ID
   - API Endpoint
   - API Key (from API Keys section)

### 4. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your Appwrite credentials:

```env
NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application automatically sets up the required Appwrite database collections and storage buckets on first run via the middleware. The following collections are created:

- **questions**: Stores user questions with title, content, tags, and attachments
- **answers**: Stores answers to questions
- **comments**: Stores comments on questions and answers
- **votes**: Stores upvotes/downvotes
- **question-attachment**: Storage bucket for question images

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   ├── questions/         # Question-related pages
│   ├── users/             # User profile pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── magicui/          # UI components from magicui
│   ├── ui/               # Base UI components
│   ├── Answers.tsx       # Answers component
│   ├── Comments.tsx      # Comments component
│   ├── QuestionCard.tsx  # Question card component
│   ├── QuestionForm.tsx  # Question form component
│   └── ...
├── lib/                   # Utility functions
├── models/                # Appwrite models and configurations
│   ├── client/          # Client-side Appwrite config
│   └── server/          # Server-side Appwrite config
├── store/                # Zustand stores
│   └── Auth.ts          # Authentication store
└── utils/                # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

### POST /api/answer
Create a new answer.

### DELETE /api/answer
Delete an answer.

### PUT /api/answer
Update an answer.

### POST /api/vote
Handle voting on questions and answers.

## Authentication Flow

1. **Sign Up**: Users can create an account with name, email, and password
2. **Login**: Users authenticate with email and password
3. **Session Management**: Session is persisted using Zustand with localStorage
4. **Logout**: Users can log out, which clears the session

## Reputation System

Users earn reputation points through:
- +1 for posting an answer
- +1 for receiving an upvote on a question or answer
- -1 for receiving a downvote on a question or answer
- -1 when an answer is deleted

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## Troubleshooting

### Build Errors

If you encounter build errors related to Appwrite during static generation, the application includes error handling to gracefully handle database connection issues during build time.

### Appwrite Project Paused

If your Appwrite project is paused due to inactivity, restore it from the Appwrite console to resume operations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Appwrite](https://appwrite.io/)
- UI components from [magicui](https://magicui.design/)
- Inspired by [Stack Overflow](https://stackoverflow.com/)

## Support

For issues and questions, please open an issue on the GitHub repository.