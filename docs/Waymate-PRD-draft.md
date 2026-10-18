# Waymate Product Requirements Document (PRD)

**Status:** Draft for review  
**Version:** 0.1  
**Date:** 5 October 2026  
**Product:** Waymate  
**Tagline:** Find someone going your way.

## 1. Product summary

Waymate is an adults-only travel discovery and connection platform. It helps people find verified travelers whose plans overlap, or local companions who can show them around. Users can review relevant profiles, request a connection, and chat after the request is accepted. They decide themselves whether and how to travel or explore together.

Waymate is not a dating service, taxi service, transport operator, booking service, or payment intermediary. Travelers and local companions arrange any transport and any local-companion fee directly with each other. Subscription plans are on hold and are outside this release scope.

## 2. Problem and opportunity

Travelers may want company for a journey or destination but lack friends or family with matching plans. Finding someone with a compatible destination, route, schedule, travel mode, and preferences is difficult. Visitors may also want to connect with a local who can help them explore.

Waymate organizes discovery around trip plans and gives users a controlled way to assess and contact potential companions.

## 3. Product goals

1. Help adults discover people with relevant, overlapping travel plans.
2. Make traveler and local-companion profiles understandable before a connection request.
3. Require identity verification before users can initiate or accept connections.
4. Let users control gender discovery preferences and live-location sharing.
5. Support communication and post-trip feedback without arranging transport or handling trip payments.

### Non-goals for this release

- Dating or romantic matching.
- Taxi, ride-hailing, transport, or seat-booking services.
- Setting, collecting, or distributing travel or guiding fees.
- Police or criminal-record screening.
- Subscription plans or paid feature tiers.
- Guaranteeing a person’s conduct or the safety of a trip.

## 4. Target users

- Adults seeking a companion for a journey.
- Adults seeking someone going to the same destination or along an overlapping route.
- Adults seeking company for a return journey.
- Travelers seeking a local companion for destination exploration.
- Local adults willing to show visitors around, with any fee discussed directly between the parties.

The product is intended for broad traveler groups, including students, tourists, and solo travelers. A specific launch geography has not yet been selected.

## 5. Core user journeys

### A. Create an account and verify

1. User registers an individual account and confirms they meet the adults-only eligibility requirement.
2. User creates a profile and completes government-ID verification.
3. Waymate stores verification status and displays a badge; other users cannot view the identity document.
4. User can create a trip and browse discoverable profiles. Verification is required before sending or accepting a connection request.

### B. Find a travel companion

1. User creates a trip with starting area, destination, date/time, route, travel mode, and desired companionship type.
2. User opens list or map discovery and applies search filters, including male-only or female-only results.
3. User reviews a profile card and relevant trip information.
4. User sends a connection request to a verified person.
5. Recipient accepts or declines. If accepted, in-app messaging becomes available.
6. Users make any travel arrangements themselves.

### C. Find a local companion

1. A local creates a discoverable profile marked **Local**, including area knowledge, languages, interests, and availability.
2. A traveler searches at the destination and reviews the Local profile card.
3. The traveler requests a connection; after acceptance, the parties discuss plans and any fee in Waymate chat.
4. Waymate does not quote, collect, or distribute that fee.

### D. Share live location for a trip

1. A user chooses to start live-location sharing for a trip.
2. User selects the connected companion and/or trusted contacts who can view it.
3. The app clearly indicates active sharing and allows the user to stop it at any time.
4. Sharing stops when the trip ends or the user stops it. Discovery does not expose live location.

### E. Rate after travel

1. After a trip, both connected travelers confirm whether the trip took place.
2. If both confirm, each can submit a rating for the other.
3. Users can report a review as abusive or misleading; support can review disputes.

## 6. Functional requirements

### 6.1 Accounts and profiles

- **FR-01:** The system shall provide one individual account per person.
- **FR-02:** The system shall restrict account creation and use to adults. Exact age threshold and age-check method are open decisions.
- **FR-03:** A profile shall support name, age, profile photo, languages, interests, short introduction, and verification status.
- **FR-04:** Users shall be able to edit, pause visibility, and request account deletion.

### 6.2 Identity verification

- **FR-05:** The system shall offer government-ID verification during profile creation.
- **FR-06:** A user shall complete verification before sending or accepting a connection request.
- **FR-07:** Other users shall see verification status only, not ID images or ID numbers.
- **FR-08:** The product shall explain the scope and limitations of verification. It shall not imply a criminal-record check or guarantee of safe behavior.
- **FR-09:** The product shall provide a support path for failed or disputed verification.

### 6.3 Trip listings and matching

- **FR-10:** Users shall be able to create, edit, pause, and delete trip listings.
- **FR-11:** A trip shall support starting area, destination, date/time, route or route segments, travel mode, companionship purpose (journey, destination, or both), and optional notes, interests, and language preferences.
- **FR-12:** Discovery shall support same-destination trips, return/opposite-direction trips, overlapping routes, and local companions at a destination.
- **FR-13:** Matching shall consider starting area, destination, timing, route, and travel mode.
- **FR-14:** Users shall be able to filter results for male-only or female-only profiles.
- **FR-15:** Users shall be able to view relevant trip details and approximate areas before requesting a connection.

### 6.4 Map and profile cards

- **FR-16:** The product shall provide map-based discovery of opted-in, discoverable profiles relevant to the user’s search.
- **FR-17:** Map markers shall represent planned starting areas, destinations, or route information, not a person’s live location.
- **FR-18:** Selecting a marker shall open a profile card with photo, display name, verification status, relevant trip details, travel mode, route overlap, languages, interests, and Local tag when applicable.
- **FR-19:** A user shall be able to initiate a connection request from a profile card.
- **FR-20:** The map and cards shall not expose precise home addresses, identity documents, or live location.

### 6.5 Local companion profiles

- **FR-21:** Users offering local companionship shall be identifiable by a distinct **Local** tag.
- **FR-22:** Local profiles shall support area knowledge, languages, interests, and availability.
- **FR-23:** Waymate shall not set, collect, or distribute local-companion fees. Users may discuss fees directly in chat.

### 6.6 Requests and messaging

- **FR-24:** A verified user shall be able to send a connection request to another verified user.
- **FR-25:** Recipients shall be able to accept or decline a request.
- **FR-26:** In-app messaging shall be available only after a request is accepted.
- **FR-27:** Users shall be able to block another user, report a user or message, cancel pending requests, and end a connection.
- **FR-28:** The product shall state that a connection is not a transport booking or commitment to meet.

### 6.7 Email notifications

- **FR-29:** The system shall send an email when a user receives a new connection request.
- **FR-30:** The system shall send an email when a user receives a new in-app message.
- **FR-31:** These emails shall avoid sensitive identity and precise-location details and direct users back to Waymate.
- **FR-32:** Users shall be able to manage email notification preferences.

### 6.8 Live location sharing

- **FR-33:** Live-location sharing shall be opt-in and separate from discovery.
- **FR-34:** A user shall choose which connected companion and/or trusted contacts receive location during a trip.
- **FR-35:** The interface shall visibly indicate active sharing and provide an immediate stop control.
- **FR-36:** Sharing shall end when stopped by the user or when the trip is ended.
- **FR-37:** The system shall not collect live location when sharing is off or expose it to non-selected users.

### 6.9 Ratings and moderation

- **FR-38:** Both travelers shall be able to rate each other after a trip they mutually confirm took place.
- **FR-39:** Users shall be able to report a rating as abusive or misleading.
- **FR-40:** Authorized support/admin users shall be able to review reports and take appropriate account or content action.
- **FR-41:** Ratings and verification shall not be described as guarantees of safety.

## 7. Safety, privacy, and operational requirements

- Collect only information needed for the service, explain why it is collected, restrict access, and define retention and deletion behavior before implementation.
- Protect government-ID documents and use a verification provider/process selected during architecture and vendor evaluation.
- Use approximate trip areas for discovery. Do not show exact addresses or live coordinates on the public map.
- Obtain clear permission before accessing location and make sharing state understandable and controllable.
- Provide reporting, blocking, moderation, and account-support workflows before public launch.
- Confirm applicable local requirements for paid guiding in each launch area.
- Do not represent government-ID verification as police clearance. A criminal-record check is not in scope without an authorized process.

## 8. Success measures

Initial product measures should include:

- Percentage of new accounts completing identity verification.
- Percentage of trip listings receiving at least one relevant result.
- Connection request acceptance rate.
- Time from trip creation to first accepted connection.
- Percentage of accepted connections that exchange at least one message.
- Percentage of trips mutually confirmed as completed.
- Rating completion rate after confirmed trips.
- Report rate and time to resolve reports.
- Location-sharing opt-in and stop rates, with privacy-preserving aggregate measurement.

Targets should be set after choosing the launch geography and collecting baseline usage data.

## 9. Dependencies and constraints

- Government-ID verification provider and supported documents are not selected.
- Map and routing/location-data provider is not selected.
- Email delivery provider is not selected.
- Local-guide requirements require location-specific review.
- The product depends on sufficient trip density within each launch area for useful matching.
- Subscription design and pricing are deferred.

## 10. Open decisions for PRD approval / later design

1. Exact adult age threshold and age-check process.
2. Which government IDs and verification method are supported.
3. Whether unverified users may browse profiles before verification (they cannot request or accept connections).
4. Whether gender filters contain only male/female options or require broader profile and inclusion choices.
5. Supported travel modes and how users enter route segments.
6. Whether locals may list paid services as well as informal companionship, and location-specific rules for that activity.
7. How a trip is mutually confirmed before ratings are enabled.
8. Location-sharing duration limits, trusted-contact setup, and what happens if a trip is not manually ended.
9. Review scale, visibility, and moderation/appeal policy.
10. Launch geography, language support, and customer-support coverage.

## 11. Release boundary

The first release should include accounts, adult eligibility, government-ID verification, trip listings, matching and filters, map discovery and cards, Local profiles, connection requests, post-acceptance chat, email notifications for requests and messages, block/report tools, mutually confirmed post-trip ratings, and opt-in live-location sharing.

Subscriptions, transport booking, fare collection, and police/criminal-record screening remain out of scope for this release.
