import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_ROOM_MEMBERS = 5;

export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  speedWpm: number;
  progressPercent: number;
  isHost: boolean;
  isReady: boolean;
  isCompleted: boolean;
  lastSeen: number;
}

export interface RoomData {
  code: string;
  createdAt: number;
  circuitId?: string;
  maxMembers: number;
  countdownStart: number | null;
  members: Map<string, RoomMember>;
}

// In-memory rooms cache surviving requests across the Node.js runtime
declare global {
  // eslint-disable-next-line no-var
  var __msk_typequest_rooms: Map<string, RoomData> | undefined;
}

if (!globalThis.__msk_typequest_rooms) {
  globalThis.__msk_typequest_rooms = new Map<string, RoomData>();
}

const rooms = globalThis.__msk_typequest_rooms;

// Prune inactive members who haven't sent a heartbeat/sync in 30 seconds
function cleanupRoom(room: RoomData) {
  const now = Date.now();
  for (const [memberId, member] of room.members.entries()) {
    if (now - member.lastSeen > 30000) {
      room.members.delete(memberId);
    }
  }

  // Check readiness after cleanup
  const membersList = Array.from(room.members.values());
  const allReady = membersList.length > 0 && membersList.every((m) => m.isReady);
  if (!allReady) {
    // If someone left or unreadied during countdown
    room.countdownStart = null;
  }
}

// Clean empty rooms older than 10 minutes
function cleanupOldRooms() {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    cleanupRoom(room);
    if (room.members.size === 0 && now - room.createdAt > 10 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}

// GET /api/typequest/room?room=MSK-600
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codeParam = searchParams.get('room');

    if (!codeParam) {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    const code = codeParam.trim().toUpperCase();
    cleanupOldRooms();

    const room = rooms.get(code);
    if (!room) {
      return NextResponse.json({
        success: true,
        exists: false,
        room: null,
        members: [],
      });
    }

    cleanupRoom(room);

    return NextResponse.json({
      success: true,
      exists: true,
      room: {
        code: room.code,
        circuitId: room.circuitId,
        createdAt: room.createdAt,
        maxMembers: room.maxMembers || MAX_ROOM_MEMBERS,
        countdownStart: room.countdownStart,
      },
      members: Array.from(room.members.values()),
    });
  } catch (err) {
    console.error('API /api/typequest/room GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/typequest/room
// Actions:
// - create: { action: 'create', roomCode, member, circuitId }
// - join: { action: 'join', roomCode, member }
// - ready: { action: 'ready', roomCode, memberId, isReady }
// - sync: { action: 'sync', roomCode, memberId, speedWpm, progressPercent, isReady?, isCompleted?, avatar?, color? }
// - leave: { action: 'leave', roomCode, memberId }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, roomCode } = body;

    if (!roomCode || typeof roomCode !== 'string') {
      return NextResponse.json({ error: 'Room code required' }, { status: 400 });
    }

    const code = roomCode.trim().toUpperCase();
    cleanupOldRooms();

    let room = rooms.get(code);

    if (action === 'create' || action === 'join') {
      const { member, circuitId } = body;
      if (!member || !member.id || !member.name) {
        return NextResponse.json({ error: 'Member details (id, name) required' }, { status: 400 });
      }

      if (!room) {
        room = {
          code,
          createdAt: Date.now(),
          circuitId: circuitId || 'monza',
          maxMembers: MAX_ROOM_MEMBERS,
          countdownStart: null,
          members: new Map<string, RoomMember>(),
        };
        rooms.set(code, room);
      }

      const existing = room.members.get(member.id);

      // ENFORCE MAX 5 MEMBERS LIMIT FOR NEW JOINERS
      if (!existing && room.members.size >= MAX_ROOM_MEMBERS) {
        return NextResponse.json(
          {
            success: false,
            error: `Room is full! Maximum ${MAX_ROOM_MEMBERS} racers allowed per classroom heat.`,
            isFull: true,
          },
          { status: 403 }
        );
      }

      const newMember: RoomMember = {
        id: member.id,
        name: member.name.trim(),
        avatar: member.avatar || '🏎️',
        color: member.color || '#ff6b00',
        speedWpm: member.speedWpm || 0,
        progressPercent: member.progressPercent || 0,
        isHost: member.isHost ?? (existing ? existing.isHost : room.members.size === 0),
        isReady: member.isReady ?? (existing ? existing.isReady : false),
        isCompleted: member.isCompleted ?? false,
        lastSeen: Date.now(),
      };

      room.members.set(member.id, newMember);
      cleanupRoom(room);

      return NextResponse.json({
        success: true,
        room: {
          code: room.code,
          circuitId: room.circuitId,
          maxMembers: room.maxMembers || MAX_ROOM_MEMBERS,
          countdownStart: room.countdownStart,
        },
        members: Array.from(room.members.values()),
      });
    }

    if (action === 'ready') {
      const { memberId, isReady } = body;
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }

      const member = room.members.get(memberId);
      if (member) {
        member.isReady = typeof isReady === 'boolean' ? isReady : true;
        member.lastSeen = Date.now();
      }

      // Check if all members are ready
      const allMembers = Array.from(room.members.values());
      const allReady = allMembers.length > 0 && allMembers.every((m) => m.isReady);
      if (allReady) {
        if (!room.countdownStart) {
          room.countdownStart = Date.now();
        }
      } else {
        room.countdownStart = null;
      }

      cleanupRoom(room);

      return NextResponse.json({
        success: true,
        countdownStart: room.countdownStart,
        members: Array.from(room.members.values()),
      });
    }

    if (action === 'sync') {
      const { memberId, speedWpm, progressPercent, isReady, isCompleted, avatar, color } = body;
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }

      const member = room.members.get(memberId);
      if (member) {
        if (typeof speedWpm === 'number') member.speedWpm = speedWpm;
        if (typeof progressPercent === 'number') member.progressPercent = progressPercent;
        if (typeof isReady === 'boolean') member.isReady = isReady;
        if (typeof isCompleted === 'boolean') member.isCompleted = isCompleted;
        if (avatar) member.avatar = avatar;
        if (color) member.color = color;
        member.lastSeen = Date.now();
      }

      // Check if all members are ready
      const allMembers = Array.from(room.members.values());
      const allReady = allMembers.length > 0 && allMembers.every((m) => m.isReady);
      if (allReady) {
        if (!room.countdownStart) {
          room.countdownStart = Date.now();
        }
      } else {
        room.countdownStart = null;
      }

      cleanupRoom(room);

      return NextResponse.json({
        success: true,
        countdownStart: room.countdownStart,
        members: Array.from(room.members.values()),
      });
    }

    if (action === 'leave') {
      const { memberId } = body;
      if (room && memberId) {
        room.members.delete(memberId);
        cleanupRoom(room);
        if (room.members.size === 0) {
          rooms.delete(code);
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('API /api/typequest/room POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
