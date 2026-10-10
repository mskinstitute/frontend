# REST Architectural Principles and Statelessness

**Representational State Transfer (REST)** is an architectural style designed by Roy Fielding in 2000 for distributed hypermedia systems. REST governs how modern web services communicate over HTTP, enabling clients (web SPAs, mobile apps, IoT devices) and backend servers to interact reliably, securely, and scalably.

---

## 1. The Six Guiding Architectural Constraints of REST

To be considered a true RESTful system, an API architecture must satisfy six constraints:

```
┌─────────────────────────────────────────────────────────────┐
│                 SIX REST ARCHITECTURAL PILLARS              │
├─────────────────────────────────────────────────────────────┤
│ 1. Client-Server Separation (UI concerns decoupled from db) │
│ 2. Statelessness (Each request carries complete context)    │
│ 3. Cacheability (Responses explicitly declare caching rules)│
│ 4. Uniform Interface (Resource URIs, representations)      │
│ 5. Layered System (Proxies, gateways, CDNs transparent)     │
│ 6. Code on Demand (Optional: sending executable scripts)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. The Core Principle: Statelessness

Statelessness mandates that **no client session context is stored on the server between requests**. Every single incoming request must contain all the information necessary for the server to understand, authenticate, and process it.

### Stateful vs Stateless Comparison:

```
Stateful Architecture (Anti-pattern for scalable APIs):
Client ──► "Log me in" ──► Server creates session in memory (Session ID: 101)
Client ──► "Show my invoices" (Cookie: 101) ──► Server looks up memory for 101
* Problem: If Server A crashes or traffic is routed to Server B, session 101 is lost!

Stateless Architecture (RESTful):
Client ──► "Log me in" ──► Server issues signed cryptographic JWT token
Client ──► "Show my invoices" (Authorization: Bearer <JWT>)
* Benefit: ANY server instance can verify the signature and process the request independently!
```

---

## 3. Uniform Interface & Resource-Oriented URIs

In REST, everything is a **Resource**. Resources are identified by stable, noun-based URIs (never verbs or actions):

| Bad URI (RPC / Action-based) | Good RESTful URI (Resource-based) | HTTP Method |
| :--- | :--- | :--- |
| `/api/getInvoices` | `/api/v1/invoices/` | `GET` |
| `/api/createInvoice` | `/api/v1/invoices/` | `POST` |
| `/api/updateInvoice?id=4` | `/api/v1/invoices/4/` | `PUT` or `PATCH` |
| `/api/deleteInvoice/4` | `/api/v1/invoices/4/` | `DELETE` |

---

## 4. Richardson Maturity Model

The **Richardson Maturity Model** breaks down the progression towards true REST:
- **Level 0 (The Swamp of POX):** Single HTTP endpoint with raw RPC calls (e.g. SOAP or basic XML-RPC).
- **Level 1 (Resources):** Distinct URIs for individual resources (`/orders/123`), but uses single HTTP methods.
- **Level 2 (HTTP Verbs):** Uses standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) with meaningful HTTP status codes (`200`, `201`, `404`). Most production APIs operate here.
- **Level 3 (HATEOAS):** Hypermedia As The Engine Of Application State—responses include dynamic links guiding the client on valid subsequent actions.

---

## Practice Quiz

### Q1: What does the "Statelessness" constraint require in a RESTful API architecture?
- A) The server cannot have a database
- B) Every request from the client must contain all information necessary to understand and process the request; no client session state is retained on the server between requests
- C) The server must reboot after every request
- D) The client is forbidden from caching data
**Answer:** B
**Explanation:** Statelessness guarantees that each request carries full contextual and authentication metadata, allowing any server in a cluster to process requests independently without shared memory sessions.

### Q2: Why are noun-based URIs (/api/v1/orders/) preferred over verb-based URIs (/api/v1/createOrder/) in REST?
- A) Verbs are banned by the W3C
- B) REST is resource-oriented: nouns represent the entities being acted upon, while standard HTTP verbs (POST, GET, DELETE) define the operations
- C) Noun-based URIs run faster on Linux
- D) Verbs increase bundle sizes
**Answer:** B
**Explanation:** REST decouples resources (nouns in URIs) from actions (HTTP verbs like GET, POST, PUT, DELETE), providing a predictable and uniform interface.

### Q3: What is the highest level (Level 3) of the Richardson Maturity Model for REST APIs?
- A) Level 3: GraphQL integration
- B) Level 3: HATEOAS (Hypermedia As The Engine Of Application State)
- C) Level 3: WebSocket Streaming
- D) Level 3: Multi-threading
**Answer:** B
**Explanation:** Level 3 HATEOAS represents full REST maturity, where API responses supply hypermedia links guiding clients toward allowable next actions.

### Q4: How does the Client-Server Separation constraint benefit modern distributed applications?
- A) It prevents developers from editing HTML
- B) It allows user interfaces (mobile apps, React web SPAs) and backend databases to evolve, deploy, and scale independently across different technologies
- C) It eliminates the need for APIs
- D) It forces all servers to be hosted on AWS
**Answer:** B
**Explanation:** Separating concerns decouples user interface platforms from server-side data storage, allowing independent scaling, multi-client support, and autonomous deployments.

### Q5: What is a major scalability benefit of statelessness when deploying backend services behind a load balancer?
- A) The load balancer can distribute incoming requests across any available server node without configuring sticky sessions or synchronizing in-memory session caches
- B) The database runs 10x faster
- C) The load balancer can delete unused code
- D) Users do not need passwords
**Answer:** A
**Explanation:** Because no session state exists in server memory, requests can be routed to any available worker node without sticky session affinity or distributed session synchronization.
