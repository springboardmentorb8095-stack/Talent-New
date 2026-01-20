# Notifications System - When They Are Triggered

Notifications are automatically created when certain events occur in the platform. Here's when each notification type is sent:

## Notification Triggers

### 1. **Proposal Received** 📩
- **When**: A freelancer submits a proposal for a project
- **Who Receives**: The project owner (client)
- **Signal**: `post_save` on Proposal model when `created=True`

### 2. **Proposal Accepted** ✅
- **When**: Client accepts a proposal
- **Who Receives**: The freelancer who submitted the proposal
- **Signal**: `post_save` on Proposal model when status changes to "accepted"

### 3. **Proposal Rejected** ❌
- **When**: Client rejects a proposal
- **Who Receives**: The freelancer who submitted the proposal
- **Signal**: `post_save` on Proposal model when status changes to "rejected"

### 4. **Contract Created** 📝
- **When**: A contract is automatically created from an accepted proposal
- **Who Receives**: Both client and freelancer
- **Signal**: `post_save` on Contract model when `created=True`

### 5. **Work Submitted** 📤
- **When**: Freelancer submits work (contract status changes to "submitted")
- **Who Receives**: The client
- **Signal**: `post_save` on Contract model when status changes to "submitted"

### 6. **Contract Completed** ✅
- **When**: Client marks contract as completed
- **Who Receives**: The freelancer
- **Signal**: `post_save` on Contract model when status changes to "completed"

## How to Access Notifications

Notifications are available via the API:
- **Get all notifications**: `GET /api/notifications/`
- **Mark as read**: `PATCH /api/notifications/{id}/mark_read/`
- **Mark all as read**: `POST /api/notifications/mark_all_read/`
- **Get unread count**: `GET /api/notifications/unread_count/`

## Implementation Details

Notifications are implemented using Django signals in `backend/core/notifications/signals.py`. The signals are automatically registered when the notifications app is loaded.

All notifications include:
- Title
- Message
- Type
- Related objects (project, proposal, contract)
- Read/unread status
- Timestamp
