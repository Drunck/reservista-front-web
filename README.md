# Getting Started

## Prerequisites

Before you can start the development or production server, make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Optionally, you can also install package managers like [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [Bun](https://bun.sh/).

### Installing Node.js and npm

To install Node.js and npm, follow these steps:

1. Download the Node.js installer from [nodejs.org](https://nodejs.org/).
2. Run the installer, which will also install npm.

To verify the installation, run these commands in your terminal:

```bash
node -v
npm -v
```

## Install Packages

Ensure all necessary packages are installed:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development version

To start the development server, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Production version

To run the production version of the application, follow these steps:

1. Build the project:

    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    # or
    bun build
    ```

2. Start the production server:
    ```bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    # or
    bun start
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
