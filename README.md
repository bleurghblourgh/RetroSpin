## Running RetroSpin Locally

RetroSpin is currently designed to run as a **local development web app**. Follow the steps below to set up and run the project on your PC.

## Requirements

- **Node.js (LTS)** – Download from https://nodejs.org  
- A command-line terminal (PowerShell, Command Prompt, or VS Code terminal)

## Installation & Running

Download the RetroSpin repository from GitHub (ZIP download or clone) and extract it into a folder such as `RetroSpin/`.

Open a terminal inside the folder that contains `package.json`.

Install the required dependencies:

`npm install`

Start the development server:

`npm run dev`

When the server starts, the terminal will output a local address, typically:

`http://localhost:5000`

Open this URL in your web browser to use RetroSpin.

## Notes

- This project uses `cross-env` to allow environment variables to work correctly on Windows.
- The local server listens on `localhost` instead of `0.0.0.0` to avoid Windows socket permission issues.
- RetroSpin currently runs in **local development mode only**.
- Public hosting and Firebase deployment are planned features.
- Standalone desktop builds (such as `.exe` installers) are not available at this time.

## Troubleshooting

If `npm` is not recognized as a command, ensure Node.js is installed correctly and restart your terminal.

If PowerShell blocks npm scripts (such as the `npm.ps1` error), open PowerShell as Administrator and run:

`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

Confirm by typing `Y` when prompted and pressing Enter.

If the server fails to start due to port or socket errors, confirm the server is configured to listen only on `localhost` and does not use unsupported socket options such as `reusePort`. The current setup is already Windows-compatible.
