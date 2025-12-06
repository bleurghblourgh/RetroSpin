# RetroSpin
Running RetroSpin Locally

RetroSpin is currently a local development web app. To run it on your PC, follow these steps:

Requirements

Node.js (LTS) installed
Download from: https://nodejs.org

A terminal (PowerShell, Command Prompt, or VS Code terminal)

Setup & Run

Download or clone the repository

Download the ZIP from GitHub or clone the repo, then extract it to a folder:

RetroSpin/


Open a terminal in the project root

The terminal must be opened in the folder that contains:

package.json


Install dependencies

Run:

npm install


Run the development server

Start the app with:

npm run dev


Open the app in your browser

When the server starts, it will display a local address such as:

http://localhost:5000


Open that URL in your browser to use RetroSpin.

Windows Notes

Windows does not support NODE_ENV=... syntax directly.
This project uses cross-env to ensure environment variables work correctly across platforms.

The local server is configured to listen on localhost rather than 0.0.0.0 to avoid Windows socket permission issues.

Common Issues

npm is not recognized

Install Node.js (LTS), restart your terminal, then retry:

npm install


PowerShell script blocked (npm.ps1 error)

Run PowerShell as Administrator and execute:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser


Type Y when prompted.

App fails to start on Windows with a socket error

Ensure the server is listening on localhost only and not using reusePort or 0.0.0.0.
(The current configuration is already Windows-safe.)

Current Status

RetroSpin currently runs as a local development build only.
Firebase integration, hosting deployment, and packaged builds are planned for future releases.
