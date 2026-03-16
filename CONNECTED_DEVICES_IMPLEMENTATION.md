# Connected Devices Feature Implementation

## Overview
This feature allows users to view and manage devices that are connected to their Medicare account. When users sign in, their device is automatically registered, and they can view all their connected devices, remove unwanted devices, and rename them for easier identification.

## Backend Implementation

### 1. Database Model (`models/User/connectedDevice.model.js`)
- **Schema**: Stores device information including name, type, browser info, IP address, and activity status
- **Features**:
  - Device fingerprinting for unique identification
  - Location tracking (optional)
  - Automatic cleanup of old devices (90+ days)
  - Activity status tracking

### 2. Controller (`controllers/User/connectedDevice.controller.js`)
- **Endpoints**:
  - `POST /register` - Automatically register/update current device
  - `GET /` - Get all connected devices for the user
  - `PUT /:deviceId/name` - Update device name
  - `DELETE /:deviceId` - Remove a specific device
  - `DELETE /inactive/cleanup` - Remove all inactive devices

### 3. Routes (`routes/User/connectedDevice.routes.js`)
- All routes require authentication via `verifyToken` middleware
- Base path: `/api/connected-devices`

## Frontend Implementation

### 1. API Utility (`utils/connectedDeviceAPI.js`)
- Axios-based API client for connected device operations
- Error handling and consistent response format
- Includes all CRUD operations

### 2. Custom Hook (`hooks/useConnectedDevices.js`)
- React hook for managing connected devices state
- Features:
  - Automatic device fetching
  - Real-time device operations (add, remove, update)
  - Device icon determination
  - Last active time formatting
  - Error handling with toast notifications

### 3. Settings Page Integration (`pages/User/Settings.jsx`)
- Added "Devices" tab to user settings
- Features:
  - Real-time device list display
  - Device type icons (mobile, tablet, laptop, desktop)
  - Inline device name editing
  - Remove device functionality
  - Cleanup inactive devices button
  - Current device highlighting

### 4. Authentication Integration (`store/Patient/authStore.js`)
- Automatic device registration on login
- Device registration on authentication check
- Silent error handling (doesn't break login if device registration fails)

## Device Features

### Device Detection
- **Browser Detection**: Chrome, Firefox, Safari, Edge
- **OS Detection**: Windows, macOS, Linux, iOS, Android
- **Device Type**: Mobile, Tablet, Laptop, Desktop, Smartwatch
- **Platform**: Mobile, tablet, desktop classification

### Security Features
- **Device Fingerprinting**: Unique identification based on user agent + IP + user ID
- **Current Device Protection**: Cannot remove the device you're currently using
- **Automatic Cleanup**: Removes devices inactive for 90+ days
- **Session Tracking**: Updates last active time automatically

### User Experience
- **Auto-Registration**: Devices are registered automatically when users sign in
- **Visual Indicators**: Different states (Current, Active, Inactive) with color coding
- **Inline Editing**: Rename devices directly in the interface
- **Confirmation Dialogs**: Prevent accidental device removal
- **Toast Notifications**: User feedback for all operations

## API Endpoints

### Register Device
```
POST /api/connected-devices/register
```
- Automatically called on login and auth check
- Updates existing device or creates new one
- Marks device as current and others as not current

### Get Devices
```
GET /api/connected-devices
```
- Returns all devices for the authenticated user
- Sorted by last active time (most recent first)
- Excludes sensitive information (IP, user agent)

### Update Device Name
```
PUT /api/connected-devices/:deviceId/name
Body: { "deviceName": "New Device Name" }
```

### Remove Device
```
DELETE /api/connected-devices/:deviceId
```
- Cannot remove current device
- Requires confirmation on frontend

### Cleanup Inactive Devices
```
DELETE /api/connected-devices/inactive/cleanup
```
- Removes all devices inactive for 30+ days
- Excludes current device

## Database Schema

```javascript
{
  userId: ObjectId,           // Reference to user
  deviceName: String,         // User-friendly device name
  deviceType: String,         // mobile, tablet, desktop, laptop, smartwatch, other
  deviceInfo: {
    userAgent: String,        // Full user agent string
    platform: String,         // mobile, tablet, desktop
    browser: String,          // Chrome, Firefox, Safari, Edge
    os: String,              // Windows, macOS, Linux, iOS, Android
    ipAddress: String        // User's IP address
  },
  isCurrentDevice: Boolean,   // Is this the currently active device
  lastActiveAt: Date,         // Last time device was used
  location: {                 // Optional location data
    city: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  deviceFingerprint: String,  // Unique device identifier
  timestamps: true            // createdAt, updatedAt
}
```

## Error Handling

### Backend
- All controllers include try-catch blocks
- Proper HTTP status codes
- Detailed error messages for development
- Generic error messages for production

### Frontend
- Toast notifications for user feedback
- Silent failures for non-critical operations (device registration)
- Loading states for all async operations
- Graceful fallbacks for missing data

## Security Considerations

1. **Device Fingerprinting**: Uses hash of user agent + IP + user ID
2. **Current Device Protection**: Prevents removal of active session device
3. **Authentication Required**: All endpoints require valid JWT token
4. **Data Sanitization**: Sensitive information filtered from API responses
5. **Automatic Cleanup**: Prevents accumulation of stale device records

## Future Enhancements

1. **Location Services**: Enhanced location tracking with user permission
2. **Device Notifications**: Alert users when new devices are added
3. **Session Management**: Force logout from specific devices
4. **Enhanced Security**: Two-factor authentication for new devices
5. **Device Analytics**: Usage patterns and security insights
6. **Push Notifications**: Device-specific notification settings

## Testing

To test the feature:

1. **Login**: Device should be automatically registered
2. **Settings Page**: Navigate to Settings > Devices tab
3. **View Devices**: See all connected devices with proper information
4. **Rename Device**: Click edit icon and change device name
5. **Remove Device**: Remove non-current devices (should show confirmation)
6. **Cleanup**: Test inactive device cleanup functionality

## Installation

1. Backend files are already integrated into the server
2. Frontend components are ready to use
3. Database models will create collections automatically
4. No additional dependencies required (all packages already installed)

The feature is production-ready and follows the existing codebase patterns and security practices.
