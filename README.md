This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). and Bun

## Getting Started

1.  Clone the repository.
2.  Install Bun if you haven't already.
3.  Use Bun to install the required dependencies.
4.  Set up your environment variables as described above.
5.  Start the application.

## Environment Variables

This project utilizes Supabase as its backend service. To ensure proper functionality, you will need to set up the necessary environment variables.

Please create a `.env` file in the root of the project and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

```

## Preview Project

```bash

npm  run  dev

# or

yarn  dev

# or

pnpm  dev

# or

bun  dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployed on Vercel

[Live Demo] Please visit : [fe-genovation-next.vercel.app](https://fe-genovation-next.vercel.app)

## Technologies Used

This project is built with the following technologies:

- **Motion**: For animations and transitions.
- **Tailwind CSS**: For utility-first CSS styling.
- **Shadcn/UI**: For UI components.
- **React Hook Form**: For managing form state and validation.
- **Supabase Client**: For interacting with the Supabase backend.
- **React Toastify**: For displaying notifications and alerts.
