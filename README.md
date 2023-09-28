# SyncTube 📹✨

SyncTube is a collaborative platform designed to streamline the workflow between YouTubers and their editors. This platform simplifies video tracking, editing, approval, and uploading, making content creation a breeze.

## Features 🚀

- **Video Tracking**: Keep an organized record of all your videos, including their status and progress.
- **Approval Workflow**: YouTubers can seamlessly approve videos for direct uploading to YouTube.
- **Collaborative Editing**: Multiple team members can collaborate on a single project, ensuring efficient content creation.
- **Invitations**: Admins can invite team members to their projects, maintaining control over access.
- **Discussion and Feedback**: Easily communicate and provide feedback on video changes using comments.

## Tech Stack

- `NextJS`
- `NextAuth`
- `tRPC`
- `Shadcn`

## Installation 🛠️

1. Clone this repository to your local machine.
2. Install the necessary dependencies using `pnpm install`.
3. Configure your environment variables, including API keys and database settings.

Required `.env` variables are

```js
DATABASE_URL=
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_YOUTUBE_REDIRECT_URI='http://localhost:3000/api/auth/callback/youtube'
GOOGLE_EDITOR_REDIRECT_URI='http://localhost:3000/api/auth/callback/editor'

# Uploads
UPLOAD_DIR=uploads
```

4. Run the application using `pnpm dev`.

## Usage 📝

1. Log in as `YOUTUBER` or `EDITOR` to your SyncTube account.
2. Create a new project or join an existing one.
3. Add videos to your project, specifying their details and status.
4. Collaborate effectively with your team members, review, and discuss changes using the built-in comment feature.
5. Once a video is approved, it can be seamlessly uploaded directly to YouTube.

## Contributing 🤝

We welcome contributions from the community! If you'd like to contribute to SyncTube, please follow these guidelines:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Commit your changes with descriptive messages.
- Push your changes to your fork.
- Submit a pull request, explaining the purpose and changes made.

## License 📜

SyncTube is licensed under the [MIT License](LICENSE).

## Credits 🙌

- [YouTube Data API](https://developers.google.com/youtube/registering_an_application) for enabling seamless YouTube integration.
- [Node.js](https://nodejs.org/) for powering the backend development.
- [NextJS](https://nextjs.org/) for creating the user-friendly frontend interface.
- [tRPC](https://trpc.io/) for End-to-end typesafe APIs
- [NextAuth](https://next-auth.js.org/) for managing authentication
- [shadcn/ui](https://ui.shadcn.com/) for providing beautiful ui components

---

Happy Collaborating with SyncTube! 🎉
