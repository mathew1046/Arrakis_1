# WebSocket Integration Setup Guide

## Overview
This guide covers the WebSocket implementation for ProdSight, enabling real-time updates across the application. The implementation replaces polling-based refresh patterns with event-driven updates.

## Backend Changes

### 1. Dependencies Added
Updated `backend/requirements.txt`:
```
Flask-SocketIO==5.3.6
python-socketio==5.10.0
PyJWT==2.8.0
```

### 2. WebSocket Manager (`backend/websocket_manager.py`)
- **Connection Management**: Handles user authentication via JWT tokens
- **Room Management**: Users join role-specific and user-specific rooms
- **Event Broadcasting**: Broadcasts updates to relevant users based on roles
- **Event Types**: 
  - `task_update` - Task CRUD operations
  - `budget_update` - Budget modifications
  - `script_update` - Script changes
  - `vfx_update` - VFX pipeline updates
  - `asset_update` - Asset management updates

### 3. Flask App Integration (`backend/app.py`)
- Added Flask-SocketIO initialization
- Integrated WebSocket manager
- Updated app factory to return both app and socketio instances

### 4. Route Updates
**Tasks (`backend/routes/tasks.py`)**:
- Added WebSocket event emission for create, update, delete operations
- Events broadcast to task assignees and management roles

**Budget (`backend/routes/budget.py`)**:
- Added WebSocket events for budget category updates
- Events sent to producers and production managers

### 5. Authentication Enhancement (`backend/utils/auth.py`)
- Added `decode_jwt_token()` function for WebSocket authentication
- Supports JWT token validation for WebSocket connections

## Frontend Changes

### 1. Dependencies Required
Install in the frontend directory:
```bash
npm install socket.io-client
```

### 2. WebSocket Service (`prodsight/src/services/websocketService.ts`)
- **Connection Management**: Handles connection, reconnection, and disconnection
- **Event System**: Type-safe event subscription and emission
- **Auto-reconnection**: Exponential backoff strategy
- **Health Monitoring**: Ping/pong for connection health

### 3. WebSocket Provider (`prodsight/src/providers/WebSocketProvider.tsx`)
- **React Context**: Provides WebSocket functionality across the app
- **Auto-connection**: Connects when user is authenticated
- **Status Component**: Visual indicator of connection status
- **Event Subscription**: Easy-to-use hook for components

### 4. Hook Updates
**useTasks Hook**:
- Removed 30-second polling interval
- Added WebSocket event subscription for real-time task updates
- Automatic refresh on task_update events

**useBudget Hook**:
- Added WebSocket subscription for budget updates
- Real-time budget data synchronization

### 5. UI Integration
**Topbar Component**:
- Added WebSocketStatus component
- Shows connection state (Connected/Connecting/Disconnected)

## Installation Steps

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python app.py
   ```
   The server will now run with WebSocket support on `http://localhost:5000`

### Frontend Setup
1. Install dependencies:
   ```bash
   cd prodsight
   npm install socket.io-client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Connection Flow
1. User logs in and receives JWT token
2. WebSocket automatically connects using the JWT token
3. User joins role-specific rooms (producer, director, etc.)
4. Real-time events are received based on user permissions

### Event Broadcasting Rules
- **Task Updates**: Sent to assignee + management roles (Producer, Director, Production Manager)
- **Budget Updates**: Sent to Producer and Production Manager roles
- **Script Updates**: Sent to all roles except Distribution Manager
- **VFX Updates**: Sent to VFX team, Directors, and Producers
- **Asset Updates**: Sent to all connected users

### Removed Polling Patterns
The following polling intervals have been replaced with WebSocket events:
- **Tasks**: 30-second polling → Real-time events
- **Budget**: Manual refresh → Real-time events
- **Other modules**: Ready for WebSocket integration

## Benefits

1. **Real-time Updates**: Instant synchronization across all connected clients
2. **Reduced Server Load**: No more periodic polling requests
3. **Better UX**: Immediate feedback for user actions
4. **Scalability**: Event-driven architecture scales better than polling
5. **Role-based Broadcasting**: Efficient targeting of relevant users

## Troubleshooting

### Connection Issues
- Check JWT token validity
- Verify WebSocket server is running on port 5000
- Check browser console for connection errors

### Event Not Received
- Verify user has appropriate role permissions
- Check if user is in the correct room
- Ensure WebSocket connection is active

### Performance
- Monitor connection count in WebSocket manager
- Check for memory leaks in event subscriptions
- Use browser dev tools to monitor WebSocket traffic

## Future Enhancements

1. **Message Queuing**: For offline users
2. **Presence Indicators**: Show who's online
3. **Typing Indicators**: For collaborative editing
4. **File Upload Progress**: Real-time upload status
5. **System Notifications**: Server-wide announcements

## Security Considerations

1. **JWT Validation**: All WebSocket connections require valid JWT
2. **Role-based Access**: Events only sent to authorized users
3. **Rate Limiting**: Consider implementing connection rate limits
4. **Input Validation**: Validate all incoming WebSocket messages

## Testing

### Manual Testing
1. Open multiple browser tabs with different user roles
2. Perform actions (create/update tasks, modify budget)
3. Verify real-time updates appear in other tabs
4. Test connection recovery after network interruption

### Automated Testing
Consider implementing:
- WebSocket connection tests
- Event emission tests
- Role-based broadcasting tests
- Reconnection logic tests
