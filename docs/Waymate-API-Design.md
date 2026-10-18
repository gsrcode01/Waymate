# Waymate API Design

**Status:** Draft for discussion  
**Version:** 0.1  
**Date:** 12 October 2026  
**Scope:** Responsive website, modular-monolith API, MongoDB Atlas

> This is a proposed API contract, not an implementation. It uses REST/JSON for normal operations and proposes WebSockets for live chat and foreground location updates. Open decisions are listed at the end.

## 1. API conventions

- Base path: `/api/v1`
- Transport: HTTPS only; JSON request and response bodies unless an endpoint redirects to an identity provider or returns a file upload URL.
- IDs: opaque string identifiers (MongoDB ObjectId values represented as hex strings).
- Timestamps: ISO 8601/RFC 3339 UTC timestamps.
- Trip coordinates: GeoJSON convention, `[longitude, latitude]`.
- Lists: cursor pagination using `limit` and `cursor`; maximum page size should be capped by the API.
- Authentication: proposed secure, HTTP-only session cookie for the browser. The session and CSRF approach must be confirmed before implementation.

### Error response

```json
{
  "error": {
    "code": "IDENTITY_VERIFICATION_REQUIRED",
    "message": "Complete identity verification before sending a request.",
    "requestId": "req_opaque_id"
  }
}
```

Errors should use standard HTTP status codes and stable machine-readable `code` values. Do not include identity documents, OTPs, password data, or precise location in error messages or logs.

## 2. Signup, login, and session

### Email/password signup

`POST /api/v1/auth/signup/email`

```json
{
  "email": "person@example.com",
  "password": "user-entered-secret",
  "phoneNumber": "+91...",
  "displayName": "Asha"
}
```

The website validates the confirm-password field before submission; the API receives only one password. The API creates a pending signup and returns an opaque `signupId`. It must not enable connection requests until phone OTP verification and required identity verification are complete.

### Send or resend signup phone OTP

`POST /api/v1/auth/signup/phone-otp`

```json
{ "signupId": "signup_id" }
```

Response: `202 Accepted` with the OTP expiry time and masked destination. Enforce resend cooldowns and attempt limits.

### Verify signup phone OTP

`POST /api/v1/auth/signup/phone-otp/verify`

```json
{ "signupId": "signup_id", "code": "123456" }
```

On success, mark the phone as verified and establish a session or return the next onboarding step. OTP codes must be stored only as hashes and expire quickly.

### Google signup/sign-in

- `GET /api/v1/auth/google/start` — start the Google OAuth redirect with state protection.
- `GET /api/v1/auth/google/callback` — handle the provider callback, validate state, link or create the account, and continue signup phone verification if it has not been completed.

Account linking rules must prevent accidentally linking accounts solely because email strings match. The user should explicitly authenticate the existing account before adding another login method.

### Email/password login

`POST /api/v1/auth/login/password`

```json
{ "email": "person@example.com", "password": "user-entered-secret" }
```

Phone OTP is not required for each login. Successful login creates/refreshes the browser session.

### Session and password recovery

- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/session`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`

Password reset tokens must be single-use, short-lived, and delivered through a verified email address. Email verification itself has not yet been defined as a signup requirement.

## 3. Account, profile, and media

- `GET /api/v1/me` — current user profile and onboarding/verification states.
- `PATCH /api/v1/me` — update editable profile fields and preferences.
- `GET /api/v1/users/{userId}` — view a permitted public profile projection only.
- `PATCH /api/v1/me/discovery-preferences` — update male-only/female-only discovery choice and other approved filters.
- `POST /api/v1/media/upload-url` — request a short-lived S3 upload URL for an allowed profile image.
- `POST /api/v1/media/{assetId}/complete` — confirm upload and attach the image to the profile.
- `DELETE /api/v1/media/{assetId}` — remove a profile image.

S3 object keys are persisted; image bytes are not stored in MongoDB. Upload URLs must be short-lived, scoped to a user and object key, and restricted by allowed media type and size. Public profile responses must never include authentication details or government-ID data.

## 4. Identity verification

- `POST /api/v1/identity-verifications/digilocker/start` — create a verification attempt and return the redirect URL/state.
- `GET /api/v1/identity-verifications/digilocker/callback` — receive the provider callback, validate state, and record the result.
- `GET /api/v1/identity-verifications/status` — return `not_started`, `pending`, `verified`, `failed`, or `needs_review` plus a safe reason code.
- `POST /api/v1/identity-verifications/manual-review` — **not finalized**; only add after defining an approved manual-review process and secure document handling.

Store provider reference, result, timestamps, and audit data—not raw ID images or ID numbers wherever possible. DigiLocker direct access depends on API Setu requester approval and its integration process. A third-party provider must be evaluated and approved before use. Phone OTP confirms control of a number; it does not verify government identity.

## 5. Trips and route preview

### Create and manage trips

- `POST /api/v1/trips`
- `GET /api/v1/trips/{tripId}`
- `PATCH /api/v1/trips/{tripId}`
- `POST /api/v1/trips/{tripId}/pause`
- `POST /api/v1/trips/{tripId}/resume`
- `DELETE /api/v1/trips/{tripId}`

Example create body:

```json
{
  "tripType": "traveler",
  "start": {
    "placeId": "provider_place_id",
    "label": "Mysuru",
    "point": { "type": "Point", "coordinates": [76.6394, 12.2958] }
  },
  "destination": {
    "placeId": "provider_place_id",
    "label": "Mangaluru",
    "point": { "type": "Point", "coordinates": [74.8560, 12.9141] }
  },
  "departureAt": "2026-11-10T08:30:00+05:30",
  "travelMode": "bus",
  "companionshipFor": ["journey", "destination"],
  "route": {
    "type": "LineString",
    "coordinates": [[76.6394, 12.2958], [74.8560, 12.9141]]
  },
  "languages": ["en", "kn"],
  "notes": "Interested in exploring local food spots."
}
```

The example coordinates and trip are illustrative. Supported travel modes and the exact route representation remain to be finalized. Locals should use `tripType: "local"` or the agreed local-profile model and must receive a visible Local tag in discovery.

### Route preview

`POST /api/v1/routes/preview`

The API calls openrouteservice server-side and returns a route summary/geometry for the website map. Keep the provider key on the backend. The website can use MapLibre to render the map. Do not assume the public OSM community tile service is a production tile-hosting commitment; make the tile URL/provider configurable and display required attribution.

## 6. Map discovery and search

`GET /api/v1/discovery/map`

Suggested query parameters:

- `bbox` — current map viewport.
- `originPlaceId`, `destinationPlaceId` or approximate coordinates/radius.
- `departureFrom`, `departureTo`.
- `travelMode`.
- `genderPreference=male|female`.
- `companionshipFor=journey|destination|both`.
- `routeId` or route corridor parameters where available.
- `limit`, `cursor`.

The response contains map markers and profile-card summaries for discoverable trips only. Markers represent planned starting areas, destinations, or route information. They must not expose live coordinates, precise addresses, identity documents, or private contact details. Apply verification, visibility, block, and gender-filter rules server-side; do not rely on the browser to hide results.

Example result item:

```json
{
  "tripId": "trip_id",
  "profile": {
    "userId": "user_id",
    "displayName": "Asha",
    "photoUrl": "short_lived_or_public_image_url",
    "identityStatus": "verified",
    "localTag": false,
    "languages": ["en", "kn"]
  },
  "tripSummary": {
    "startLabel": "Mysuru area",
    "destinationLabel": "Mangaluru",
    "departureAt": "2026-11-10T08:30:00+05:30",
    "travelMode": "bus",
    "routeOverlap": "partial"
  },
  "marker": { "type": "Point", "coordinates": [74.8560, 12.9141] }
}
```

Do not return exact home or pickup coordinates for map cards unless a separate, explicit arrangement flow is later approved.

## 7. Connection requests

- `POST /api/v1/connection-requests`
- `GET /api/v1/connection-requests?direction=incoming|outgoing&status=pending|accepted|declined`
- `POST /api/v1/connection-requests/{requestId}/accept`
- `POST /api/v1/connection-requests/{requestId}/decline`
- `POST /api/v1/connection-requests/{requestId}/cancel`

Example request body:

```json
{
  "recipientUserId": "user_id",
  "senderTripId": "trip_id",
  "recipientTripId": "trip_id",
  "message": "Our routes and dates look similar. Would you like to connect?"
}
```

The API must enforce: authenticated user; verified phone and government-ID status; no self-requests; trip visibility and eligibility; block rules; valid recipient; and no duplicate pending request for the same trip pairing. Accepting creates one conversation for that connection. A new incoming request queues the corresponding email notification.

## 8. Conversations and messages

- `GET /api/v1/conversations`
- `GET /api/v1/conversations/{conversationId}/messages?limit=&cursor=`
- `POST /api/v1/conversations/{conversationId}/messages`
- `POST /api/v1/conversations/{conversationId}/read`

Example message:

```json
{ "body": "Would 9 AM at the bus station work?", "clientMessageId": "uuid" }
```

Only conversation participants may read or send messages. New messages queue an email notification, subject to user notification preferences. Email should link to Waymate and omit sensitive identity and precise-location details.

### Proposed WebSocket events

Use an authenticated WebSocket connection at `/api/v1/realtime` for near-real-time chat and location updates. This is a proposal; transport selection can be confirmed before implementation.

Client events:

- `conversation.join` with `conversationId`.
- `conversation.typing` with `conversationId` and `isTyping`.
- `location.subscribe` with a share ID, only for an authorized recipient.

Server events:

- `message.created` with the new message.
- `conversation.read` with participant and timestamp.
- `location.updated` with the latest permitted point and timestamp.
- `location.status` with `active`, `paused`, `stale`, or `ended`.

Every subscription must verify the authenticated user’s membership/recipient permission on the server. Never trust IDs supplied by the browser alone.

## 9. Foreground-only website location sharing

- `POST /api/v1/location-shares` — create a share for a trip and explicitly selected recipients.
- `GET /api/v1/location-shares/{shareId}` — return current status and latest permitted location.
- `PUT /api/v1/location-shares/{shareId}/position` — submit a new point while the Waymate page is active.
- `POST /api/v1/location-shares/{shareId}/pause`
- `POST /api/v1/location-shares/{shareId}/resume`
- `POST /api/v1/location-shares/{shareId}/end`

Example position body:

```json
{
  "point": { "type": "Point", "coordinates": [74.8560, 12.9141] },
  "accuracyMeters": 25,
  "capturedAt": "2026-11-10T09:12:00+05:30"
}
```

The website requests location permission only when the user starts sharing. The browser sends points while the page is active. If the tab becomes hidden, the client should attempt to pause; because a browser can freeze without allowing a final request, recipients must see a point as stale when updates stop. Do not promise tracking when the website is backgrounded or closed.

Only the owner and selected recipients may read a share. Keep a latest point for live display and short-lived samples for support/incident review. The exact retention duration is still open. No endpoint exposes a user’s location through ordinary discovery.

## 10. Trip confirmation and ratings

- `POST /api/v1/connections/{connectionId}/trip-confirmation` — submit the current user’s confirmation (`occurred: true|false`).
- `GET /api/v1/connections/{connectionId}/trip-confirmation` — show the two users’ confirmation states to the participants.
- `POST /api/v1/connections/{connectionId}/ratings` — create a rating only when policy prerequisites are met.
- `GET /api/v1/users/{userId}/ratings` — retrieve permitted public rating summaries.
- `POST /api/v1/ratings/{ratingId}/report` — report a rating.

Example rating body:

```json
{ "score": 5, "tags": ["communicative", "on_time"], "comment": "Clear communication before the trip." }
```

The API must enforce one rating per author per connection and should not reveal a rating until the agreed publication rule is met. Rating scale, free-text rules, mutual-confirmation behavior, dispute flow, and moderation actions remain to be finalized.

## 11. Blocks, reports, and notification preferences

- `POST /api/v1/blocks` and `DELETE /api/v1/blocks/{userId}`.
- `POST /api/v1/reports` for a user, message, trip, or rating.
- `GET /api/v1/me/notification-preferences`.
- `PATCH /api/v1/me/notification-preferences`.

Email event types in this release are only `connection_request_received` and `message_received`. The notification outbox is an internal backend collection, not a public endpoint.

## 12. Security and operational rules

- Validate authentication and authorization at every endpoint; apply ownership and participant checks at the data boundary.
- Require government-ID verification before sending or accepting a request. Do not describe phone OTP as ID verification or government verification as a criminal-record check.
- Rate-limit signup, OTP send/verify, login, password reset, request creation, message send, and location updates.
- Use CSRF protections for cookie-authenticated state-changing requests and strict allowed origins for CORS.
- Redact passwords, OTP codes, OAuth tokens, ID data, and precise coordinates from logs.
- Apply request-size limits, schema validation, and safe text handling.
- Use idempotency keys for operations where retrying could create duplicates (such as request creation or message send).
- Return only necessary fields in discovery/profile responses.

## 13. Not in this API release

- Subscription billing.
- Taxi booking, fare quotation, fare collection, or payment distribution.
- Background location tracking while the website is hidden or closed.
- Police/criminal-record screening.
- User-facing APIs for storing government-ID images.

## 14. Open API decisions

1. Confirm browser session cookies and CSRF strategy for the Vercel website and ECS API.
2. Confirm Google OAuth account linking and whether a Google-only account may later set a password.
3. Decide whether a location-sharing recipient can be an off-platform trusted contact. If so, define invitation and expiring-link endpoints.
4. Set exact retention duration for location samples and incident reports.
5. Set rate limits and acceptable location update frequency.
6. Finalize trip modes, route representation, match windows, and map response fields.
7. Define confirmation, rating visibility, scale, and dispute policy.
8. Confirm DigiLocker direct requester approval, third-party fallback, and manual-review flow before publishing verification endpoints.
9. Select email and SMS providers and define delivery/retry behavior.

## 15. Suggested implementation order

1. Signup, OTP verification, login, session, and profile.
2. DigiLocker verification status and provider callback.
3. Trip create/update and map discovery.
4. Connection requests and conversations/messages.
5. Email outbox and notification preferences.
6. Foreground location-share sessions and recipient authorization.
7. Mutual trip confirmation, ratings, reports, and moderation.
