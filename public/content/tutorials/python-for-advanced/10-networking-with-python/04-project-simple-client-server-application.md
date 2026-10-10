---
id: python-advanced-project-simple-client-server-application
slug: project-simple-client-server-application
course: python-for-advanced
chapter: "10: Networking with Python"
topic: "10.4 Project: Simple Client-Server Application"
title: "Project: Simple Client-Server Application in Python"
description: "Master project: simple client-server application in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 9
order: 43
keywords:
  - python project simple client server application
  - python advanced
  - python project: simple client-server application
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Client-Server Application with Custom Protocol

In distributed systems, microservices frequently exchange structured commands across TCP sockets. While HTTP/REST and gRPC are popular high-level choices, constructing a custom socket protocol provides maximum speed, minimal serialization overhead, and complete control over network framing.

In this project, we will construct a production-ready **Remote Command Protocol (RCP) Client-Server Application**. It features a **Length-Prefixed Framing Protocol** that guarantees message boundary integrity, structured JSON payload routing, error recovery, and a typed client library.

---

## 1. Network Protocol Architecture

TCP streams do not preserve message boundaries. To prevent packet fragmentation and coalescing bugs, our protocol uses **Length-Prefixed Framing**:

```
                       The 4-Byte Length-Prefixed Frame
 ┌────────────────────────────────────┬────────────────────────────────────┐
 │  Header: 4 Bytes (Big-Endian UInt) │   Body: N Bytes (UTF-8 JSON Data)   │
 │         struct.pack("!I", N)       │        {"command": "...", ...}     │
 └────────────────────────────────────┴────────────────────────────────────┘
```

```
 Client Application                                            Server Daemon
        │                                                            │
 client.send_request("MATH", {"a": 10, "b": 20})                     │
        │                                                            │
        ├──► Packs 4-Byte Length Header + JSON Payload ────────────► │
        │                                                            │ Reads 4-byte header
        │                                                            │ Allocates buffer of size N
        │                                                            │ Dispatches Command Handler
        │                                                            │ Computes result: 30
        │ ◄── Packs 4-Byte Length Header + Response Payload ─────────┤
        │                                                            │
 Unpacks Header & Decodes JSON                                       │
 Returns 30 to caller                                                │
```

---

## 2. Low-Level Protocol Framing Helpers

```python
import json
import socket
import struct
from typing import Any, Dict

HEADER_FORMAT = "!I"  # 4-byte unsigned integer, big-endian network byte order
HEADER_SIZE = struct.calcsize(HEADER_FORMAT)

def send_framed_message(sock: socket.socket, payload: Dict[str, Any]) -> None:
    """Serializes a dictionary to JSON and sends it prefixed with a 4-byte length header."""
    json_bytes = json.dumps(payload).encode("utf-8")
    header = struct.pack(HEADER_FORMAT, len(json_bytes))
    # sendall guarantees the entire header + payload is sent
    sock.sendall(header + json_bytes)

def recv_exact_bytes(sock: socket.socket, num_bytes: int) -> bytes:
    """Reads exactly num_bytes from a TCP socket buffer, handling packet fragmentation."""
    buffer = bytearray()
    while len(buffer) < num_bytes:
        chunk = sock.recv(num_bytes - len(buffer))
        if not chunk:
            raise ConnectionError("Socket closed prematurely while waiting for bytes.")
        buffer.extend(chunk)
    return bytes(buffer)

def recv_framed_message(sock: socket.socket) -> Dict[str, Any]:
    """Reads the 4-byte header, then reads the exact body payload."""
    header_bytes = recv_exact_bytes(sock, HEADER_SIZE)
    (message_length,) = struct.unpack(HEADER_FORMAT, header_bytes)
    
    # Read the exact expected payload bytes
    body_bytes = recv_exact_bytes(sock, message_length)
    return json.loads(body_bytes.decode("utf-8"))
```

---

## 3. The Command Server Implementation

```python
import hashlib
import platform
import socket
import threading

class CommandServer:
    """A multithreaded command execution server using length-prefixed framing."""

    def __init__(self, host: str = "127.0.0.1", port: int = 55555) -> None:
        self.host = host
        self.port = port
        self.is_running = False

    def handle_command(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatches commands to specialized internal handlers."""
        cmd = request.get("command", "").upper()
        args = request.get("args", {})

        if cmd == "PING":
            return {"status": "SUCCESS", "result": "PONG"}

        elif cmd == "SYSTEM_INFO":
            return {
                "status": "SUCCESS",
                "result": {
                    "os": platform.system(),
                    "release": platform.release(),
                    "architecture": platform.machine()
                }
            }

        elif cmd == "CALC_HASH":
            text = args.get("text", "")
            sha256 = hashlib.sha256(text.encode("utf-8")).hexdigest()
            return {"status": "SUCCESS", "result": sha256}

        elif cmd == "ADD":
            a = args.get("a", 0)
            b = args.get("b", 0)
            return {"status": "SUCCESS", "result": a + b}

        return {"status": "ERROR", "message": f"Unknown command: '{cmd}'"}

    def _client_worker(self, client_sock: socket.socket, client_addr: tuple) -> None:
        print(f"[SERVER] Client connected: {client_addr}")
        with client_sock:
            while self.is_running:
                try:
                    request = recv_framed_message(client_sock)
                    response = self.handle_command(request)
                    send_framed_message(client_sock, response)
                except ConnectionError:
                    print(f"[SERVER] Client {client_addr} disconnected.")
                    break

    def start(self) -> None:
        self.is_running = True
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_sock:
            server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server_sock.bind((self.host, self.port))
            server_sock.listen(5)
            print(f"[SERVER] Command Server listening on {self.host}:{self.port}...")

            while self.is_running:
                client_sock, client_addr = server_sock.accept()
                thread = threading.Thread(
                    target=self._client_worker,
                    args=(client_sock, client_addr),
                    daemon=True
                )
                thread.start()
```

---

## 4. The Python Client SDK

```python
class CommandClient:
    """Client SDK providing high-level typed method calls over the custom TCP protocol."""

    def __init__(self, host: str = "127.0.0.1", port: int = 55555) -> None:
        self.host = host
        self.port = port
        self.sock: Optional[socket.socket] = None

    def connect(self) -> None:
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((self.host, self.port))

    def close(self) -> None:
        if self.sock:
            self.sock.close()
            self.sock = None

    def _execute(self, command: str, args: Dict[str, Any] = None) -> Any:
        if not self.sock:
            raise RuntimeError("Client is not connected to server.")
        request = {"command": command, "args": args or {}}
        send_framed_message(self.sock, request)
        response = recv_framed_message(self.sock)
        if response.get("status") != "SUCCESS":
            raise RuntimeError(f"Server error: {response.get('message')}")
        return response.get("result")

    # High-level typed API methods
    def ping(self) -> str:
        return self._execute("PING")

    def get_system_info(self) -> Dict[str, str]:
        return self._execute("SYSTEM_INFO")

    def compute_sha256(self, text: str) -> str:
        return self._execute("CALC_HASH", {"text": text})

    def add_numbers(self, a: float, b: float) -> float:
        return self._execute("ADD", {"a": a, "b": b})
```

---

## 5. Verification & End-to-End Test

```python
import time

def run_test():
    print("=====================================================")
    print("   TESTING CUSTOM PROTOCOL CLIENT-SERVER SYSTEM      ")
    print("=====================================================")

    # 1. Launch server in a background thread
    server = CommandServer(host="127.0.0.1", port=55555)
    server_thread = threading.Thread(target=server.start, daemon=True)
    server_thread.start()
    time.sleep(0.1)  # Allow server to bind and listen

    # 2. Connect client
    client = CommandClient(host="127.0.0.1", port=55555)
    client.connect()

    # 3. Test RPC operations
    print(f"Ping Response:        {client.ping()}")
    print(f"System Information:   {client.get_system_info()}")
    print(f"Remote Addition:      10 + 25 = {client.add_numbers(10, 25)}")
    
    sample_text = "Advanced Python Architecture"
    computed_hash = client.compute_sha256(sample_text)
    print(f"SHA-256 Digest:       {computed_hash}")

    # 4. Clean shutdown
    client.close()
    print("=====================================================")
    print("       ALL PROTOCOL TESTS COMPLETED CLEANLY!         ")
    print("=====================================================")

if __name__ == "__main__":
    run_test()
```

---

## 6. Key Architectural Takeaways

1. **Length-Prefixed Framing Solves Fragility**: By packing a fixed 4-byte header (`struct.pack("!I", length)`), the receiver knows precisely how many bytes to read, preventing packet boundary corruption.
2. **`recv_exact_bytes` Guarantee**: Reads in a loop until the requested byte count is satisfied, protecting against network packet fragmentation.
3. **Layered Separation**: The transport/framing layer is strictly decoupled from the application command dispatch logic.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Unbounded Buffer Reads
Calling `socket.recv(1024)` in an uncontrolled loop without checking for empty byte strings (`b""`) results in an infinite CPU-spinning loop when the peer closes the connection.

### 2. Lack of Authentication
Exposing raw socket listeners on public interfaces without authentication tokens or TLS encryption leaves systems vulnerable to unauthorized remote commands.

---

---

## 💻 Try It Yourself: Extension Challenge - JSON Protocol Framing

### Challenge
Implement a structured JSON protocol with a 4-byte big-endian message length prefix so client and server can reliably exchange arbitrary JSON objects over TCP streams.

### Complete Solution
```python
import json
import struct

def encode_message(payload_dict: dict) -> bytes:
    json_bytes = json.dumps(payload_dict).encode("utf-8")
    header = struct.pack("!I", len(json_bytes))  # 4-byte unsigned int
    return header + json_bytes

def decode_message(stream_bytes: bytes) -> dict:
    header = stream_bytes[:4]
    length = struct.unpack("!I", header)[0]
    payload_bytes = stream_bytes[4:4+length]
    return json.loads(payload_bytes.decode("utf-8"))

# Test framing
msg = {"action": "QUERY_STATUS", "auth_token": "msk_token_123"}
framed = encode_message(msg)
unframed = decode_message(framed)
print("Decoded framed payload:", unframed)
```

### Expected Output
```text
Decoded framed payload: {'action': 'QUERY_STATUS', 'auth_token': 'msk_token_123'}
```

---

## Practice Quiz

### 1.
Why is length-prefixed framing (`struct.pack("!I", length) + payload`) preferred over delimiter framing (e.g. `\n`) when transmitting binary or JSON payloads over TCP?
A. Big-endian integers run faster on modern CPUs.
B. Binary data or formatted JSON can naturally contain newline characters (`\n`), which would prematurely trigger delimiter detectors and corrupt the message.
C. Delimiters only work on HTTP servers.
D. Length prefixes compress data by 50%.

**Answer:** B

**Explanation:** If messages contain arbitrary payloads (such as formatted JSON, binary images, or serialized objects), delimiters like newlines can appear within the data, causing framing errors. Length prefixes avoid this completely.

---

### 2.
What does the format specifier `"!I"` represent in Python's `struct` module?
A. A 1-byte character in ASCII format.
B. A 4-byte unsigned integer stored in standard Network Byte Order (Big-Endian).
C. An infinite float.
D. A signed 64-bit integer.

**Answer:** B

**Explanation:** In `struct`, `!` specifies standard network byte order (big-endian), and `I` represents a 4-byte (32-bit) unsigned integer.

---

### 3.
Why must the `recv_exact_bytes` helper function read from the socket in a `while` loop rather than issuing a single `sock.recv(num_bytes)`?
A. To keep the CPU busy.
B. Because TCP makes no guarantee that all requested bytes will arrive in a single packet; `recv()` may return fewer bytes than requested due to network fragmentation.
C. Because Python limits socket reads to 1 byte at a time.
D. To encrypt the incoming stream.

**Answer:** B

**Explanation:** A single call to `sock.recv(N)` can return anywhere from 1 to $N$ bytes depending on MTU sizing and network buffering. Reading in a loop until $N$ bytes are collected guarantees complete message assembly.

---

### 4.
What occurs in `recv_exact_bytes` if `sock.recv()` returns an empty byte string `b""` before collecting all required bytes?
A. It retries indefinitely.
B. It raises a `ConnectionError` because the remote peer terminated the connection prematurely mid-message.
C. It inserts spaces to pad the buffer.
D. It returns `None`.

**Answer:** B

**Explanation:** Receiving empty bytes before the full length of a promised message arrives indicates an abnormal connection drop or disconnect, which raises a `ConnectionError`.

---

### 5.
What is the primary benefit of wrapping low-level socket protocol calls in a `CommandClient` SDK class?
A. It converts Python code to C.
B. It abstracts raw byte packing, socket connections, and JSON serialization away from consumers, providing a clean, typed Python API.
C. It eliminates the need for network cables.
D. It bypasses the operating system kernel.

**Answer:** B

**Explanation:** Providing an SDK hides socket lifecycle mechanics, protocol encoding, and framing details behind clean methods like `client.ping()` and `client.add_numbers()`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Regex Patterns and Groups** (11: Regular Expressions Advanced).

👉 **[Continue to Next Lesson: Regex Patterns and Groups →](/tutorials/python-for-advanced/regex-patterns-and-groups)**
