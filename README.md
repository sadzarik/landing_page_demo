# Apila Website (Demo Version)

This is a **Demo Version** of the Apila Marketing Agency website, created for portfolio purposes.

> [!WARNING]
> **Demo Limitations**: This version is designed for demonstration only. 
> - Contact forms are disabled or mocked.
> - Chat functionality utilizes placeholders.
> - Backend services (e.g., video compression, image optimization) are removed.
> - Webhooks are replaced with placeholders (`YOUR_WEBHOOK_URL_HERE`) for security.

## Project Description

Apila is a full-cycle digital agency specializing in marketing strategy, web design, and AI automation. This website showcases a modern, responsive design with high-end animations and user experience.

### Technology Stack
- **HTML5**: Semantic structure.
- **CSS / Tailwind CSS**: Responsive validation and styling.
- **JavaScript**: Interactive elements, dynamic content loading, and UI logic.
- **React**: Used for specific interactive components (embedded via CDN).

## How to Run Locally

Since this is a static website, you can view it directly in your browser or serve it locally.

### Option 1: Live Server (Recommended)
If you have Node.js installed:

1. Install a simple static server (e.g., `serve`):
   ```bash
   npx serve .
   ```
2. Open the provided URL (usually `http://localhost:3000`).

### Option 2: Direct File Access
You can open `index.html` directly in your browser. Note that some modern browser security policies (CORS) might block specific assets (like SVGs or JSON) when loading via `file://`.

## Author
**Nazar Sadovskyi**  
*Aspiring Fachinformatiker (Germany)*
- [GitHub Profile](https://github.com/sadzarik)

## Deploying this Demo

To publish this demo to a new GitHub repository, follow these steps in your terminal inside this folder:

1.  **Detach from old repo:**
    ```powershell
    Remove-Item .git -Recurse -Force
    ```

2.  **Initialize new repo:**
    ```bash
    git init
    git add .
    git commit -m "Initial demo release"
    ```

3.  **Push to new GitHub Repo:**
    - Create a new empty repository on GitHub.
    - Run the following (replace `URL` with your new repo URL):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

4.  **Activate GitHub Pages:**
    - Go to Repo Settings -> Pages.
    - Select source: `Deploy from a branch` -> `main` -> `/ (root)`.
    - Save. Your demo will be live!
