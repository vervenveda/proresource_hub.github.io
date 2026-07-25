333 Network Deployment Checklist

1. Choose the public API hostname

Use one HTTPS API address for all three apps, for example:

https://api.yourdomain.com

Do not use the GitHub Pages URL for FastAPI; GitHub Pages only hosts the files in static/.

2. Configure environment variables

Copy .env.example to .env and set:

NETWORK333_DATABASE_URL

NETWORK333_PUBLIC_BASE_URL

NETWORK333_CORS_ORIGINS

NETWORK333_FOUNDER_EMAIL

NETWORK333_FOUNDER_PASSWORD

Use PostgreSQL for public deployment. Change every sample database password before launch.

3. Bootstrap the Founder account

The Founder variables must be set before the first database initialization. The bootstrap account receives 333-111-7777. If the database was already initialized without it, delete only the development database and restart, or create a controlled migration instead of editing the database by hand.

4. Deploy the API

Run:

uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers

For Docker:

docker compose up --build

Confirm:

GET /health
GET /docs

5. Deploy the integrated frontend

Upload all five files from static/ into the same public folder:

333_Network_index.html
333_network_client.js
HOLLO_index.html
KANSEE_index.html
Live_Social_Feed_index.html

Keeping them on one web origin lets the shared API URL and access session carry across the four pages.

6. Connect the frontend

Open 333_Network_index.html, select 333 · Local, enter the HTTPS API address, and sign in. The indicator changes to 333 · Online after authentication.

7. Configure realtime media infrastructure

The package contains authenticated signaling for WebRTC, but public calls also need:

A TURN server for NAT/firewall relay

Secure, short-lived TURN credentials issued by the backend

An SFU/media server for larger KANSEE rooms

Do not embed TURN passwords in HTML or JavaScript.

8. Production hardening before open registration

Add:

Email verification and password-reset delivery

Rate limiting and automated abuse controls

Moderator roles, queues, appeals, and audit logs

Database migrations and tested backups

Object storage and malware scanning for uploads

Privacy policy, terms, retention controls, and account deletion

Redis pub/sub before running multiple API workers

Health monitoring and error reporting that does not expose private content
