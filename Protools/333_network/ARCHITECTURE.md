333 Network Architecture

333_Network_index.html
        │
        ├── HOLLO_index.html
        ├── KANSEE_index.html
        └── Live_Social_Feed_index.html
                │
                └── 333_network_client.js
                        │
                        ├── HTTPS REST API
                        └── Authenticated WebSocket
                                │
                         FastAPI application
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
              Identity       Community     Communications
                 │              │              │
        users / sessions   posts / groups   DMs / calls
        contacts / blocks  events / media   meetings / signals
                 └──────────────┼──────────────┘
                                │
                         SQLite or PostgreSQL

Shared identity

Every member record has four distinct identifiers:

id — internal database identifier

networkId — immutable network identity

number333 — unique internal 333 Network number

handle — changeable public username

The permanent service routes are not assigned to ordinary users:

333-111-7777 — Founder line

333-222-7777 — HOLLO

333-333-7777 — KANSEE

333-444-7777 — Bazaar Art Live

Local-first behavior

The existing browser storage remains intact. A temporary API outage does not erase local contacts, drafts, rooms, posts, or backups. Network-created records receive remote identifiers and synchronize when the shared client is connected.

Realtime behavior

One authenticated WebSocket carries presence, notifications, messages, call invitations, KANSEE room events, feed events, and WebRTC signaling. The current in-process connection registry is appropriate for one API worker. Redis pub/sub is required before scaling to multiple workers or servers.

Media boundary

The API stores uploaded files in the configured media directory and records metadata in the database. Public deployment should replace local-disk media with object storage, access policies, malware scanning, thumbnails/transcoding, and lifecycle rules.
