# Medicare Application Structure

## Backend Structure
```
Backend/
├── controllers/           # Controller logic for different user types
│   ├── Admin/             # Admin-specific controllers
│   │   ├── Staff/         # Staff management controllers
│   │   │   ├── staffAuth.controller.js       # Staff authentication
│   │   │   └── staffManagement.controller.js # Staff CRUD operations
│   │   └── Team/          # Team management controllers
│   │       └── team.controller.js            # Team CRUD operations
│   ├── Doctor/            # Doctor-specific controllers
│   │   ├── auth.controller.js                # Doctor authentication
│   │   ├── profile.controller.js             # Doctor profile management
│   │   └── verification.controller.js        # Doctor verification logic
│   ├── Founder/           # Founder-specific controllers
│   │   ├── auth.controller.js                # Founder authentication
│   │   └── management.controller.js          # Founder management operations
│   ├── Hospital/          # Hospital-specific controllers
│   │   ├── appointment.controller.js         # Appointment management
│   │   └── prescription.controller.js        # Prescription management
│   ├── Medical/           # Medical-specific controllers
│   │   └── reports.controller.js             # Medical reports handling
│   └── User/              # User-specific controllers
│       ├── auth.controller.js                # User authentication
│       ├── notifications.controller.js       # User notifications
│       ├── profile.controller.js             # User profile management
│       └── reports.controller.js             # User reports management
├── DB/                    # Database connection and configuration
│   └── db.js              # MongoDB connection setup
├── middleware/            # Custom middleware functions
│   ├── Admin/             # Admin authentication middleware
│   │   ├── auth.middleware.js                # Admin auth validation
│   │   └── role.middleware.js                # Admin role validation
│   ├── Doctor/            # Doctor authentication middleware
│   │   └── auth.middleware.js                # Doctor auth validation
│   ├── Founder/           # Founder authentication middleware
│   │   └── auth.middleware.js                # Founder auth validation
│   ├── Hospital/          # Hospital authentication middleware
│   │   └── auth.middleware.js                # Hospital auth validation
│   ├── Medical/           # Medical middleware
│   │   └── validation.middleware.js          # Medical data validation
│   ├── User/              # User authentication middleware
│   │   ├── auth.middleware.js                # User auth validation
│   │   └── upload.middleware.js              # User file upload handling
│   └── multer.middleware.js # File upload middleware
├── models/                # Database models/schemas
│   ├── Admin/             # Admin-related models
│   │   ├── Staff.model.js                    # Staff user schema
│   │   └── Role.model.js                     # Admin roles schema
│   ├── Doctor/            # Doctor-related models
│   │   ├── Doctor.model.js                   # Doctor profile schema
│   │   └── Verification.model.js             # Doctor verification schema
│   ├── Founder/           # Founder-related models
│   │   └── Founder.model.js                  # Founder user schema
│   ├── Hospital/          # Hospital-related models
│   │   ├── Appointment.model.js              # Appointments schema
│   │   ├── Hospital.model.js                 # Hospital profile schema
│   │   └── Prescription.model.js             # Prescription schema
│   └── User/              # User-related models
│       ├── Notification.model.js             # Notifications schema
│       ├── Report.model.js                   # Medical reports schema
│       └── User.model.js                     # User profile schema
├── routes/                # API route definitions
│   ├── Admin/             # Admin routes including Staff
│   │   └── Staff/         # Staff-specific routes
│   │       ├── staffAuth.routes.js           # Staff auth endpoints
│   │       ├── staffManagement.routes.js     # Staff management endpoints
│   │       └── StaffWorks/                   # Staff work routes
│   │           └── doctorVerification.routes.js # Doctor verification routes
│   ├── Doctor/            # Doctor-specific routes
│   │   └── doctor.routes.js                  # Doctor API endpoints
│   ├── Founder/           # Founder-specific routes
│   │   └── founder.routes.js                 # Founder API endpoints
│   ├── Hospital/          # Hospital-related routes
│   │   └── hospital.routes.js                # Hospital API endpoints
│   ├── Medical/           # Medical-related routes
│   │   └── medical.routes.js                 # Medical API endpoints
│   └── User/              # User-related routes
│       ├── auth.routes.js                    # User authentication routes
│       ├── notifications.routes.js           # User notification routes
│       ├── reports.routes.js                 # User medical reports routes
│       └── user.routes.js                    # User profile routes
├── scripts/               # Utility scripts and automation
│   ├── dbSeed.js                             # Database seeding script
│   └── backup.js                             # Database backup script
├── services/              # External services integration
│   ├── emails/            # Email templates and services
│   │   ├── templates/                        # Email HTML templates
│   │   │   ├── verification.html             # Email verification template
│   │   │   ├── reset-password.html           # Password reset template
│   │   │   └── notification.html             # Notification template
│   │   └── email.service.js                  # Email sending service
│   └── s3.service.js      # AWS S3 integration for file uploads
├── UID/                   # Unique ID generation utilities
│   └── generator.js                          # UMID generation logic
├── utils/                 # Utility functions
│   ├── generateTokenAndsendcookie.js  # JWT token generation
│   ├── notifications.js               # Notification system
│   ├── passwordGenerator.js          # Password generation service
│   └── socket.js                     # WebSocket configuration
├── .gitignore             # Git ignore file
├── package.json           # Node.js dependencies
├── package-lock.json      # Dependency lock file
└── server.js              # Main application entry point
```

## Frontend Structure
```
Frontend/
├── dist/                  # Production build output
├── node_modules/          # Node.js dependencies
├── public/                # Static assets
│   ├── logo.png           # Application logo
│   ├── logo1.png          # Alternative logo 
│   ├── sitemap.xml        # Website sitemap for SEO
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── assets/            # Images, fonts, and other assets
│   │   ├── logo/          # Logo variants
│   │   │   ├── full-logo.png                 # Full size logo
│   │   │   └── icon-logo.png                 # Icon only logo
│   │   └── [various image files]
│   │       ├── Dashboard.png                 # Dashboard screenshot
│   │       ├── Email.mp4                     # Email animation
│   │       ├── Login.png                     # Login screen image
│   │       ├── FindHospital.png              # Hospital finder image
│   │       └── HealthRecords.png             # Health records image
│   ├── components/        # Reusable UI components
│   │   ├── common/                           # Shared components
│   │   │   ├── Button.jsx                    # Button component
│   │   │   ├── Card.jsx                      # Card component
│   │   │   ├── Footer.jsx                    # Footer component
│   │   │   ├── Header.jsx                    # Header component
│   │   │   ├── Input.jsx                     # Input field component
│   │   │   ├── Loading.jsx                   # Loading spinner
│   │   │   ├── Modal.jsx                     # Modal dialog component
│   │   │   └── Pagination.jsx                # Pagination component
│   │   ├── dashboard/                        # Dashboard components
│   │   │   ├── ChartComponent.jsx            # Data visualization charts
│   │   │   ├── StatsCard.jsx                 # Statistics card component
│   │   │   └── ActivityFeed.jsx              # Activity feed component
│   │   ├── doctor/                           # Doctor-specific components
│   │   │   ├── DoctorCard.jsx                # Doctor profile card
│   │   │   └── VerificationForm.jsx          # Doctor verification form
│   │   ├── prescription/                     # Prescription components
│   │   │   ├── DigitalPrescriptionCard.jsx   # Prescription card view
│   │   │   └── MedicationForm.jsx            # Medication entry form
│   │   └── reports/                          # Report components
│   │       ├── ReportCard.jsx                # Medical report card
│   │       └── ReportViewer.jsx              # Report viewing component
│   ├── pages/             # Application pages by user type
│   │   ├── Admin/         # Admin pages
│   │   │   ├── Staff/     # Staff management pages
│   │   │   │   ├── Dashboard/                # Staff dashboard
│   │   │   │   │   └── StaffDashboard.jsx    # Staff dashboard page
│   │   │   │   ├── DoctorVerification/       # Doctor verification
│   │   │   │   │   └── DoctorVerification.jsx # Doctor verification page
│   │   │   │   ├── ChangePassword.jsx        # Password change page
│   │   │   │   ├── ForgotPassword.jsx        # Password recovery page
│   │   │   │   └── StaffLogin.jsx            # Staff login page
│   │   │   └── Team/      # Team management
│   │   │       └── TeamManagement.jsx        # Team management page
│   │   ├── Doctor/        # Doctor pages
│   │   │   ├── Dashboard.jsx                 # Doctor dashboard
│   │   │   ├── Login.jsx                     # Doctor login
│   │   │   └── Signup.jsx                    # Doctor registration
│   │   ├── Founder/       # Founder pages
│   │   │   ├── FounderDashboard.jsx          # Founder dashboard
│   │   │   ├── FounderLogin.jsx              # Founder login
│   │   │   └── StaffDirectory/               # Staff directory
│   │   │       ├── AddStaffPage.jsx          # Add staff page
│   │   │       ├── EditStaffPage.jsx         # Edit staff page
│   │   │       └── StaffDirectoryPage.jsx    # Staff directory listing
│   │   ├── Hospital/      # Hospital pages
│   │   │   ├── FindPatient.jsx               # Patient search
│   │   │   └── HospitalDashboard.jsx         # Hospital dashboard
│   │   ├── Medical/       # Medical pages
│   │   │   └── MedicalDashboard.jsx          # Medical staff dashboard
│   │   ├── User/          # User pages
│   │   │   ├── AllDigitalPrescriptions.jsx   # Prescriptions list
│   │   │   ├── Dashboard.jsx                 # User dashboard
│   │   │   ├── DigitalPrescriptionDetail.jsx # Prescription detail
│   │   │   ├── ForgotPassword.jsx            # Password recovery
│   │   │   ├── Login.jsx                     # User login
│   │   │   ├── Notifications.jsx             # User notifications
│   │   │   ├── PrescriptionReminders.jsx     # Medication reminders
│   │   │   ├── Profile.jsx                   # User profile
│   │   │   ├── Reports.jsx                   # Medical reports
│   │   │   ├── ResetPassword.jsx             # Password reset
│   │   │   ├── Signup.jsx                    # User registration
│   │   │   ├── Upload.jsx                    # File upload
│   │   │   ├── UserDetails.jsx               # User details
│   │   │   └── VerifyEmail.jsx               # Email verification
│   │   ├── About.jsx                         # About page
│   │   ├── About2.jsx                        # Alternative about page
│   │   ├── Home.jsx                          # Homepage
│   │   ├── NotFound.jsx                      # 404 page
│   │   ├── Team.jsx                          # Team showcase page
│   │   ├── Test.jsx                          # Test page
│   │   ├── Test1.jsx                         # Additional test page
│   │   └── WorkingOnIt.jsx                   # Under construction page
│   ├── store/             # State management (Zustand stores)
│   │   ├── authStore.js           # Authentication state
│   │   ├── doctorStore.js         # Doctor state
│   │   ├── doctorVerificationStore.js # Doctor verification state
│   │   ├── founderStore.js        # Founder state
│   │   ├── staffStore.js          # Staff state
│   │   └── teamStore.js           # Team management state
│   ├── utils/             # Utility functions
│   │   ├── date.js                # Date formatting utilities
│   │   └── errorHandling.js       # Error handling utilities
│   ├── App.jsx            # Main application component with routing
│   ├── index.css          # Global CSS styles (Tailwind CSS)
│   └── main.jsx           # Application entry point
├── .gitignore             # Git ignore file
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Node.js dependencies
├── package-lock.json      # Dependency lock file
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project documentation
├── tailwind.config.js     # Tailwind CSS configuration
├── vercel.json            # Vercel deployment configuration
└── vite.config.js         # Vite build configuration
```

/dashboard/*                    (Protected Route + DashboardLayout)
├── index                      → Dashboard home
├── reports                    → Reports page  
├── upload                     → Upload page
├── profile                    → Profile page
├── notifications              → Notifications page
├── digital-prescriptions      → Digital prescriptions page
│   ├── reminders             → Prescription reminders
│   └── :id                   → Prescription detail

## Digital Prescriptions Module

The Digital Prescriptions module in Medicare provides a comprehensive electronic prescription management system for both healthcare providers and patients.

### Features

#### For Healthcare Providers (Doctors/Hospitals):
- **Create Digital Prescriptions**: Generate new electronic prescriptions with comprehensive medication details, dosage instructions, and patient information.
- **Patient Search**: Easily find patients using their UMID to access their medical history and create prescriptions.
- **Medication Management**: Add multiple medications with detailed information including name, dosage, frequency, duration, and special instructions.
- **Preview & PDF Generation**: Preview prescription before finalizing and generate downloadable PDF versions.
- **Cross-Provider Access**: View prescriptions issued by other doctors to the same patient, ensuring continuity of care.

#### For Patients:
- **Centralized Prescription Access**: View all prescriptions from various healthcare providers in one place.
- **Detailed Prescription View**: Access comprehensive information about each prescription, including doctor details, diagnosis, medications, and instructions.
- **Search & Filter**: Search prescriptions by doctor, hospital, or medication and filter by status (Active/Completed) or date.
- **Download & Print**: Easily download or print prescriptions for offline access.
- **Mobile-Friendly Design**: Responsive interface for accessing prescriptions on any device.

### Technical Implementation

#### Frontend Components:
1. **FindPatient.jsx**: Allows doctors to search for patients using UMID and view their medical history, reports, and existing prescriptions.
2. **DigitalPrescription.jsx**: Modal component for creating new prescriptions with medication, diagnosis, and instruction fields.
3. **AllDigitalPrescriptions.jsx**: Patient-facing page that displays all prescriptions with search, filter, and sort functionality.
4. **DigitalPrescriptionDetail.jsx**: Detailed view of a single prescription with complete information and download/print options.
5. **DigitalPrescriptionCard.jsx**: Reusable card component for displaying prescription summaries in grid or list views.

#### Backend Architecture:
1. **prescription.controller.js**: Handles CRUD operations for prescriptions, including:
   - Creating new prescriptions
   - Fetching prescriptions by patient ID
   - Fetching prescriptions by doctor ID
   - Generating PDF versions
2. **prescription.model.js**: MongoDB schema for prescriptions with fields for patient data, doctor information, medications, diagnosis, etc.
3. **hospital.routes.js**: API routes for hospital/doctor prescription operations.
4. **user.routes.js**: API routes for patient prescription access.

### Data Flow
1. Doctor searches for patient by UMID
2. Doctor creates prescription through the DigitalPrescription modal
3. Prescription is saved to database
4. Patient receives notification about new prescription
5. Patient can view prescription details and download/print as needed

### Future Enhancements
- Electronic signature integration
- Pharmacy integration for direct prescription fulfillment
- Medication reminder system
- Prescription renewal requests
- Interaction and allergy checking system 