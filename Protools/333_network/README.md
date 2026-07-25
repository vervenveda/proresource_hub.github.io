333 Network Backend

A working FastAPI backend and shared browser client for:

HOLLO™ — trusted contacts, private messages, call invitations, presence, and WebRTC signaling

KANSEE™ — meeting rooms, invitations, waiting-room membership, room chat, and meeting signaling

Bazaar Art Live — posts, reels, comments, reactions, saves, follows, groups, events, notifications, and media uploads

333 Network Gateway — shared sign-in, 333-number resolution, and service routing

The frontend remains local-first. Members can continue using local features when the API is unavailable. Signing in through the floating 333 Network Connection button activates shared online identity and synchronization.

Included files

app/
  main.py          FastAPI routes and WebSocket endpoint
  models.py        SQLAlchemy database models
  security.py      scrypt password hashing and opaque sessions
  realtime.py      connected-user WebSocket manager
  schemas.py       validated request models
  config.py        environment configuration
  database.py      SQLite/PostgreSQL connection
static/
  333_Network_index.html
  HOLLO_index.html
  KANSEE_index.html
  Live_Social_Feed_index.html
  333_network_client.js
requirements.txt
Dockerfile
docker-compose.yml
.env.example
run.py
tests/test_api.py

Run locally with SQLite

python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python run.py

Open:

http://localhost:8000/app/333_Network_index.html

API documentation:

http://localhost:8000/docs

Run with PostgreSQL and Docker

Change both occurrences of change-this-password in docker-compose.yml, then run:

docker compose up --build

The API and integrated frontend will be available at http://localhost:8000.

Founder identity

To reserve the permanent Founder line for the first bootstrap account, set these before the database is initialized:

NETWORK333_FOUNDER_EMAIL=your-private-email@example.com
NETWORK333_FOUNDER_PASSWORD=use-a-long-private-password
NETWORK333_FOUNDER_NAME=Jennifer Kay Pearl
NETWORK333_FOUNDER_HANDLE=JenniferPearl

That account receives:

333-111-7777

The service routes remain reserved:

333-222-7777  HOLLO
333-333-7777  KANSEE
333-444-7777  Bazaar Art Live

Ordinary members receive randomized, unique internal 333 Network numbers.

GitHub Pages deployment

GitHub Pages can host the files in static/, but it cannot execute FastAPI. Deploy this backend to a Python-capable HTTPS host, then:

Upload the five static/ files to the same frontend repository folder.

Open any app.

Select the floating 333 · Local button.

Enter the deployed API base URL.

Create an account or sign in.

All four pages share the API address and session through the same browser origin.

Set NETWORK333_CORS_ORIGINS to the exact origins that may call the API. Paths are not origins. A typical value is:

NETWORK333_CORS_ORIGINS=https://vervenveda.github.io,https://artist1970.github.io,https://www.vervenveda.com

Realtime protocol

The browser opens /ws, then immediately sends:

{"type":"auth","token":"OPAQUE_ACCESS_TOKEN"}

Supported real-time events include:

message.created

call.invite, call.accepted, call.declined, call.cancelled, call.ended

webrtc.offer, webrtc.answer, webrtc.ice, call.hangup

meeting.invite, meeting.member, meeting.chat, meeting.signal

feed.post-created, feed.post-updated, feed.post-deleted

feed.reaction, feed.comment, feed.comment-deleted

notification, presence, and profile.updated

WebRTC media remains browser-to-browser where possible. A production deployment still needs a TURN service, and larger group conferences should use an SFU/media server. Do not place TURN credentials in public HTML.

Security included

Passwords are hashed with Python hashlib.scrypt and unique salts.

Browser sessions use long random opaque tokens; only SHA-256 token digests are stored.

Public profiles never include password hashes, salts, email addresses, or session tokens.

CORS uses an explicit origin list.

Uploads use an allowlist and configurable byte limit.

Direct messages, invitations, meetings, profile changes, private feed actions, and media uploads require authentication.

Blocking prevents messages, calls, and follows in either direction.

The old unsafe full-state merge route is not included.

The old query-string administrator key is not included.

Before a public launch, add email verification, password-reset mail, rate limiting, abuse detection, moderation queues, database migrations, object storage, backups, audit logging, a TURN service, and an SFU for larger KANSEE meetings.

Tests

pip install -r requirements-dev.txt
pytest -q

The integration tests cover registration, sign-in, number resolution, contacts, private messages, calls, meetings, room chat, groups, posts, reactions, comments, saves, events, notifications, and authenticated WebSocket signaling.
