# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

rounded cards (16–24px), shadow elevation, accent green (#C9FF52) for primary actions, white surfaces, black navigation surfaces, and subtle dividers.
  - Layout: Left-aligned text, center-aligned key metrics (e.g., MFA status pill counts if displayed), edge-to-edge card layouts.
  - Accessibility: Keyboard navigable, proper aria-labels, high-contrast states for active elements.
- API contracts (frontend-facing):
  - Endpoints to be consumed (hypothetical but must be clearly defined in code structure):
    - GET /api/user/profile
    - PUT /api/user/profile (fields: name, email, phone, timezone)
    - POST /api/user/password/change
    - POST /api/user/mfa/toggle
    - GET /api/user/mfa/providers
    - POST /api/user/mfa/enroll (provider activate)
    - GET /api/user/notifications/preferences
    - PUT /api/user/notifications/preferences
    - GET /api/user/sso/linked
    - POST /api/user/sso/link
    - DELETE /api/user/sso/unlink
    - GET /api/user/sessions
    - POST /api/user/sessions/revoke
- Data handling patterns:
  - Use data ?? [] for arrays returned by fetch-like calls
  - Validate all API shapes with Array.isArray checks
  - Destructure with defaults: const { items = [], count = 0 } = response ?? {}
- Form validations:
  - Name: non-empty
  - Email: valid email format
  - Phone: optional, but if present, validated format
  - Timezone: from a curated list
  - Password: minimum length, complexity checks
- Security considerations:
  - Sensitive actions (password change, MFA enable/disable, unlink SSO, revoke session) require confirmation dialogs and possibly re-auth prompts
  - Do not leak sensitive data in UI; mask session IPs where necessary
- Data flow:
  - All mutations should optimistically update UI with rollback on error
  - Use loading states per section
  - Provide success/failure toast or inline messages

### Backend
- API endpoints (assumed, to be wired to actual services):
  - Profile: GET /api/user/profile, PUT /api/user/profile
  - Password: POST /api/user/password/change
  - MFA: GET /api/user/mfa/providers, POST /api/user/mfa/toggle, POST /api/user/mfa/enroll
  - Notifications: GET /api/user/notifications/preferences, PUT /api/user/notifications/preferences
  - SSO: GET /api/user/sso/linked, POST /api/user/sso/link, DELETE /api/user/sso/unlink
  - Sessions: GET /api/user/sessions, POST /api/user/sessions/revoke
- Data models:
  - UserProfile: id, name, email, phone, timezone
  - MFASettings: enabled, methods: [totp, sms, push, webauthn], selectedMethod
  - NotificationPreferences: email, inApp, push
  - SSOAccounts: array of linked providers with id, name, avatarUrl, linkedAt
  - Sessions: id, device, location, lastActive, ipAddress (masked)
- Security and validation:
  - All mutating operations require authentication and authorization checks
  - Validate input payloads on server side; return explicit error codes/messages

### Integration
- Data flow patterns:
  - On load: fetch profile, MFA providers, notification preferences, linked SSO accounts, and sessions in parallel (guard with data ?? [] and Array.isArray checks)
  - On update: call respective endpoints; update local state optimistically; handle errors with rollback
  - Re-auth flows for sensitive actions; token refresh handling if needed
- State management:
  - Centralized user context or local component state with careful isolation
  - Use React context for cross-component access to user data if needed
- Error handling:
  - Centralized error boundary for the settings area
  - User-friendly error messages with actionable guidance

## User Experience Flow
1. User lands on User Profile & Settings page.
2. ProfileForm loads with existing data; fields are editable with an edit mode toggle; user saves changes or cancels.
3. SecuritySettings shows MFA status and a Change Password action; user can enable/disable MFA and enroll methods; sensitive actions prompt re-auth when necessary.
4. NotificationPreferences presents per-channel toggles; user can enable/disable channels and save. A global toggle affects all channels.
5. ConnectedAccounts lists linked SSO providers with options to link new providers or unlink; sessions panel lists active sessions with ability to revoke a session after confirmation.
6. All actions give immediate visual feedback via toasts or inline messages; loading states are displayed per section; errors are surfaced with clear remediation steps.

## Technical Specifications

- Data Models (Schema Details)
  - UserProfile: id string, name string, email string, phone string | null, timezone string
  - MFASettings: enabled boolean, providers string[] (e.g., ["totp", "sms"]), enrolled boolean, defaultProvider string | null
  - NotificationPreferences: email boolean, inApp boolean, push boolean
  - SSOAccount: provider string, displayName string, avatarUrl string, linkedAt string (ISO)
  - Session: id string, device string, location string, lastActive string, ipAddress string | null, isActive boolean
- API Endpoints (Routes and Methods)
  - GET /api/user/profile
  - PUT /api/user/profile (payload: { name, email, phone, timezone })
  - POST /api/user/password/change (payload: { currentPassword, newPassword })
  - GET /api/user/mfa/providers
  - POST /api/user/mfa/toggle (payload: { enabled })
  - POST /api/user/mfa/enroll (payload: { provider, methodData })
  - GET /api/user/notifications/preferences
  - PUT /api/user/notifications/preferences (payload: { email, inApp, push })
  - GET /api/user/sso/linked
  - POST /api/user/sso/link (payload: { provider })
  - DELETE /api/user/sso/unlink (payload: { provider })
  - GET /api/user/sessions
  - POST /api/user/sessions/revoke (payload: { sessionId })
- Security
  - Ensure endpoints require proper authentication tokens/SSO session
  - Re-auth prompt for password change and MFA toggling
  - Audit logging for changes to profile, MFA, SSO, and sessions
- Validation
  - Client-side: use regex for email, phone (if enabled), verify timezone from allowed list
  - Server-side: strict validation with meaningful error messages
  - Use data ?? [] patterns for arrays; guard all array calls
- Validation Rules
  - Name: non-empty; trim whitespace
  - Email: valid email format
  - Phone: optional; if provided, match international format if supported
  - Timezone: must be from supported timezones list
  - Password: min length 8, must include a number or letter and a special char as per policy
  - MFA: must have at least one enabled method if enabling MFA
  - Notifications: at least one channel may be required depending on policy
- Accessibility
  - All interactive elements accessible via keyboard
  - ARIA labels and roles where appropriate
  - Focus management on dialogs and after actions

## Acceptance Criteria
- [ ] The User Profile form loads with existing data (guard against nulls) and saves updates correctly with optimistic UI and rollback on error.
- [ ] MFA can be enabled/disabled with proper re-auth prompts; at least one method is selected when MFA is on.
- [ ] Notification preferences persist per-channel and support a global toggle; UI reflects current state accurately even if API returns partially null data.
- [ ] Linked SSO accounts are displayed with correct provider info; linking a new provider and unlinking an existing one works with confirmations.
- [ ] Active sessions are listed with device/location/lastActive; revoking a session requires user confirmation and reflects immediately in the UI.
- [ ] All data fetches and mutations guard against null/undefined data using data ?? [] and Array.isArray checks; all arrays are initialized with proper useState defaults.
- [ ] UI adheres to the design system: cards, top navigation, color tokens, typography, spacing, and micro-interactions are consistent.
- [ ] All endpoints are properly named and documented; payloads validated client- and server-side; errors surfaced clearly.

## UI/UX Guidelines
Apply the project's design system:
---
Visual Style

Color Palette:
- Primary background: Soft light gray (#F5F6F8)
- Card backgrounds: Slightly darker gray (#E8E9EC) or white
- Accent: Lime green (#C9FF52) for primary actions and active states
- Surfaces: White (#FFFFFF) for cards/modal surfaces; Black surfaces (#18191A) for navigation/summary panels
- Text: Primary #232323; Secondary #6B6B6B; White on dark backgrounds
- Warnings/Errors: Red (#FF5E5E); Secondary statuses: Orange (#FFC85E), Sky blue (#6ECFFF)
- Relationships: Strong contrast between lime green and neutrals; black panels anchor sections

Typography & Layout:
- Font family: Inter, SF Pro, or Circular
- Weights: Regular body, Bold headings, Medium for labels/CTAs
- Hierarchy: Large bold headings, mid-weight subheads, lighter metadata
- Spacing: Generous padding/margins between sections (24–32px), consistent vertical rhythm
- Alignment: Left text; center-aligned key metrics; edge-to-edge card layouts

Key Design Elements

Card Design:
- Rounded corners 16–24px; mild shadows
- Minimal borders; shadow and spacing define separation
- Hover/active: subtle shadow or outline; accent green highlight for selected cards
- Visual hierarchy: Prominent title, metadata, icons/tags at bottom

Navigation:
- Top bar: Pill-shaped, black with white and accent green highlights for active items
- Sidebar: Minimal vertical icon stack; dividers
- Active states: High-contrast green/white on black; pill backgrounds for current section
- Collapsible/expandable: Not required, but structure supports modular expansion

Data Visualization:
- Not directly shown; summary panels may hint at bold numerals and labels
- Treatments: Accent colors for status; white/black surfaces for separation
- Patterns: Inline status pills or micro-charts as needed for quick-glance metrics

Interactive Elements:
- Buttons: Pill-shaped; filled with accent green or black, or outlined
- Form Elements: Soft rounded inputs with focus states
- Hover: Subtle shadows, color transitions
- Micro-interactions: Subtle icon motions for feedback

Design Philosophy:
- Modern, minimalist, enterprise-ready; high clarity and actionable elements
- Emphasize simplicity, whitespace, visual hierarchy
- Rounded shapes, high-contrast accents
- Frictionless navigation, quick scanning, clear status/feedback
- Modularity for scalable workflows

Mandatory Coding Standards — Runtime Safety
CRITICAL: Implement in all code:
1) Supabase-like results use data ?? [] patterns
2) Guard array methods: (items ?? []).map(...) or Array.isArray(items) ? items.map(...) : []
3) useState for arrays: useState<Type[]>([]) defaults
4) API response shapes validated: const list = Array.isArray(response?.data) ? response.data : []
5) Optional chaining for nested data
6) Destructuring with defaults: const { items = [], count = 0 } = response ?? {}

Project Context alignment:
- Target: OfficeInventory AI – but this prompt focuses on User Profile & Settings feature within a broader enterprise app. Ensure the code structure remains generic and pluggable for future integrations (e.g., AI layers, audit logs, multi-tenant contexts).

Generate the complete, detailed prompt now:
- Provide a ready-to-run, developer-facing specification that an AI coding tool can interpret to scaffold, implement, and test the feature end-to-end.
- Include explicit file/folder structure recommendations, component APIs, data-fetch hooks, test strategies (unit/integration), and a sample data model/typescript interfaces.
- Include example API mocks, error-handling patterns, and migration notes if data models change.
- Include a minimal but working example snippet for one component (e.g., ProfileForm) demonstrating runtime safety patterns and use of data ?? [] guards.

Notes:
- Ensure every code sample adheres to the runtime safety rules outlined above.
- Emphasize testability: unit tests for input validation, integration tests for API call flows, and snapshot tests for UI components where appropriate.
- Provide actionable steps, not just concepts, to enable a developer tool to generate the complete feature with minimal human intervention.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
