# Frontend Installation Guide

Follow these steps to set up the InsightGraph AI frontend on your new computer.

## 1. Prerequisites
Ensure you have the following installed on the new machine:
- **Node.js**: (Version 18 or higher recommended) - [Download here](https://nodejs.org/)
- **NPM**: Comes bundled with Node.js.

Verify installation by running:
```bash
node -v
npm -v
```

## 2. Transfer the Code
1. On your current machine, run the `pack_frontend.sh` script to create a `frontend_setup.zip` archive.
2. Transfer `frontend_setup.zip` to your new computer (via USB, cloud storage, etc.).
3. Extract the archive into a directory of your choice.

## 3. Install Dependencies
Open a terminal in the extracted directory and run:
```bash
npm install
```
This will install all necessary libraries like React, Vite, Framer Motion, Lucid React, etc.

## 4. Configure Backend Connection
By default, the frontend tries to connect to the backend at `http://localhost:8000`. If your backend is running on a different machine, you must update the API URL.

1. Open `src/services/api.js`.
2. Locate the `API_BASE_URL` constant.
3. Change `'http://localhost:8000'` to the IP address or hostname of the machine running the backend (e.g., `'http://192.168.1.10:8000'`).

## 5. Start the Application
Run the following command to start the development server:
```bash
npm run dev
```
The terminal will display a local URL (usually `http://localhost:5173`). Open this in your browser to view the application.

---

> [!TIP]
> If you encounter any "network error" issues in the browser, ensure that the machine running the backend has port `8000` open in its firewall and that both computers are on the same network.
