# GraphQL Queries, Mutations & Subscriptions in Modern JavaScript

While REST APIs require multiple round-trips to disparate endpoints (`/users/1`, `/users/1/orders`, `/users/1/posts`) leading to over-fetching or under-fetching, **GraphQL** allows clients to request **exactly the data they need in a single query**.

---

## 1. The Three Operations of GraphQL

1. **Query:** Read-only data retrieval (analogue to HTTP `GET`).
2. **Mutation:** Data writes, updates, and deletes (analogue to `POST`, `PUT`, `DELETE`).
3. **Subscription:** Real-time event streams powered by WebSockets.

---

## 2. Executing Queries with Native Fetch

GraphQL does not require heavy client libraries (like Apollo Client) for basic needs. All queries execute as standard HTTP `POST` requests to a single `/graphql` endpoint:

```javascript
async function fetchUserProfile(userId) {
  const query = `
    query GetUserWithOrders($id: ID!) {
      user(id: $id) {
        id
        name
        email
        orders(limit: 3) {
          id
          totalAmount
          status
        }
      }
    }
  `;

  const response = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      query,
      variables: { id: userId }
    })
  });

  const { data, errors } = await response.json();

  if (errors && errors.length > 0) {
    console.error('GraphQL Execution Errors:', errors);
    throw new Error(errors[0].message);
  }

  console.log('User Data:', data.user);
  return data.user;
}
```

```
Client Payload:
  POST /graphql
  { "query": "query { user(id: 42) { name email } }" }
       │
       ▼
Server Response:
  { "data": { "user": { "name": "Sarah", "email": "sarah@corp.com" } } }
```

---

## 3. Executing Mutations

Mutations modify server state and return the updated fields in the same operation:

```javascript
async function updateUserRole(userId, newRole) {
  const mutation = `
    mutation UpdateRole($id: ID!, $role: RoleEnum!) {
      updateUserRole(id: $id, role: $role) {
        id
        role
        updatedAt
      }
    }
  `;

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: mutation,
      variables: { id: userId, role: newRole }
    })
  });

  const { data } = await response.json();
  return data.updateUserRole;
}
```

---

## 4. Real-Time Subscriptions via WebSockets

Subscriptions use WebSockets (using protocols like `graphql-transport-ws`) to receive streaming updates when mutations occur on the server:

```javascript
// Protocol payload sent over WebSocket connection:
const subscriptionMessage = {
  id: 'sub_1',
  type: 'subscribe',
  payload: {
    query: `
      subscription OnNewMessage($channelId: ID!) {
        messageAdded(channelId: $channelId) {
          id
          sender
          content
          timestamp
        }
      }
    `,
    variables: { channelId: 'general_chat' }
  }
};

socket.send(JSON.stringify(subscriptionMessage));
```

---

## 5. Critical Gotcha: HTTP Status Codes in GraphQL

Unlike REST, **GraphQL almost always returns HTTP status 200 OK**, even when an error occurs in resolver execution! Always check the response body's `errors` array:

```javascript
// DANGER: response.ok will be true even if user was not found!
const { data, errors } = await res.json();
if (errors) {
  // Handle GraphQL level errors!
}
```

---

## Practice Quiz

### Q1: What HTTP method is conventionally used to dispatch GraphQL queries and mutations?
- A) GET
- B) POST
- C) PUT
- D) PATCH
**Answer:** B
**Explanation:** GraphQL operations are sent as HTTP `POST` requests with a JSON body containing `query` and `variables`.

### Q2: Why is response.ok === true NOT sufficient to verify success in a GraphQL request?
- A) GraphQL uses UDP
- B) GraphQL servers typically return HTTP 200 OK even when errors occur, returning failure details in an "errors" array in the JSON response
- C) response.ok only works in REST
- D) GraphQL is asynchronous
**Answer:** B
**Explanation:** GraphQL handles resolver errors at the application layer; the HTTP transport status remains 200 while errors are returned in `{ errors: [...] }`.

### Q3: What technology powers real-time GraphQL Subscriptions in the browser?
- A) LocalStorage
- B) WebSockets
- C) Web Workers
- D) CSS Animations
**Answer:** B
**Explanation:** Subscriptions maintain a persistent WebSocket connection to stream real-time updates from the GraphQL server.

### Q4: What problem in REST API design is directly resolved by GraphQL field selection?
- A) Memory leaks
- B) Over-fetching (receiving fields you don't need) and under-fetching (requiring multiple endpoints for related data)
- C) Cross-Origin Resource Sharing
- D) Cache invalidation
**Answer:** B
**Explanation:** In GraphQL, clients request only the specific fields they require in a single query, eliminating over-fetching and multi-endpoint under-fetching.

### Q5: How are dynamic parameters passed safely into a GraphQL query to prevent injection attacks?
- A) String concatenation
- B) The variables dictionary object paired with parameterized query variables ($variableName: Type)
- C) URL query parameters
- D) Cookies
**Answer:** B
**Explanation:** GraphQL queries define typed parameters (`$id: ID!`) which are safely supplied via the separate `variables` JSON dictionary.
