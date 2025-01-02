# Product Requirements Document (PRD)

## Gun Club Scoring Web Application

---

### **Version 1.1**

**Last Updated:** April 27, 2024  
**Author:** StackBlitz Team

---

## Table of Contents

1. [Objective](#objective)
2. [Background](#background)
3. [Scope](#scope)
4. [Definitions and Acronyms](#definitions-and-acronyms)
5. [Core Features](#core-features)
    - [5.1. Club Management](#51-club-management)
    - [5.2. Score Tracking](#52-score-tracking)
    - [5.3. My Guns](#53-my-guns)
    - [5.4. Statistics and Analytics](#54-statistics-and-analytics)
    - [5.5. Dashboard Features](#55-dashboard-features)
    - [5.6. Competition Management](#56-competition-management)
    - [5.7. Field Management](#57-field-management)
6. [Technical Requirements](#technical-requirements)
    - [6.1. Data Storage](#61-data-storage)
    - [6.2. Performance](#62-performance)
    - [6.3. Security](#63-security)
7. [Non-Functional Requirements](#non-functional-requirements)
    - [7.1. Performance](#71-performance)
    - [7.2. Security](#72-security)
    - [7.3. Usability](#73-usability)
    - [7.4. Scalability](#74-scalability)
8. [User Stories](#user-stories)
9. [Wireframes and UI Mockups](#wireframes-and-ui-mockups)
10. [Roadmap](#roadmap)
11. [Dependencies](#dependencies)
12. [Assumptions](#assumptions)
13. [Constraints](#constraints)
14. [Acceptance Criteria](#acceptance-criteria)
15. [Appendix](#appendix)

---

## Objective

Develop a modern, responsive web application for a gun club to efficiently track shooters' scores, handicaps, and statistics across various shooting disciplines, with robust field management capabilities.

---

## Background

Gun clubs require reliable systems to manage and analyze shooters' performance data. Traditional methods using spreadsheets or manual record-keeping are prone to errors and inefficiencies. A dedicated web application will streamline score tracking, provide insightful statistics, and enhance the overall management of club activities, including comprehensive field management for various shooting games.

---

## Scope

**In Scope:**
- Development of a web-based application for desktop and mobile browsers
- Implementation of core features for game scoring, field management, and statistical reporting
- Club management features
- Responsive and intuitive user interface design

**Out of Scope:**
- Mobile application development
- Offline functionality
- External system integrations
- Advanced analytics beyond specified statistics

---

## Definitions and Acronyms

- **PRD:** Product Requirements Document
- **UI:** User Interface
- **MVP:** Minimum Viable Product

---

## Core Features

### 5.1. Club Management
- Edit club name and address
- Configure available game types (Skeet, Trap, etc.)
- View club statistics and performance metrics

### 5.2. Score Tracking

#### Score Entry
- Support for multiple shooting disciplines:
  - Skeet (25 shots)
  - Doubles Skeet (25 shots)
  - Trap (25 shots)
  - 5-Stand (25 shots)
- Gun Configuration Integration:
  - Select from saved gun configurations
  - Automatically filters guns by selected gauge
  - Primary gun auto-selected when gauge matches
- Bird-by-bird score recording:
  - Visual station layout showing current position
  - Hit/Miss buttons for each shot
  - Option shot tracking for Skeet
  - Starting station selection for Trap and 5-Stand
  - Starting station remains visible during scoring
  - Progress indicator showing shots remaining
  - Undo functionality for correcting mistakes

#### Score Display
- List view of recent scores showing:
  - Date and time
  - Game type
  - Gauge used
  - Starting station (for Trap and 5-Stand)
  - Total score
  - Visual representation of hits/misses
- Filtering and search capabilities
- Score details view with:
  - Shot-by-shot breakdown
  - Station performance analysis
  - Notes and conditions

#### Score Data
- **Required fields:**
  - Game type
  - Gauge
  - Date/time
  - Individual bird results
  - Total score
  - Shooter ID
- **Optional fields:**
  - Starting station (Trap/5-Stand)
  - Weather conditions
  - Notes

### 5.3. My Guns

#### Gun Management
- Add, edit, and delete personal guns
- Set primary gun configuration
- Primary gun auto-selected during score entry
- **Required gun attributes:**
  - Name (for identification)
  - Brand (from predefined list or custom entry)
  - Gauge (12, 20, 28, .410)

#### Optional Gun Details
- **Choke Options:**
  - Cylinder (Cyl): No constriction; widest spread
  - Skeet (Skt): Slightly tighter than Cylinder
  - Improved Cylinder (IC): Mild constriction
  - Light Modified (LM): Between IC and Modified
  - Modified (Mod): Medium constriction
  - Improved Modified (IM): Tighter than Modified
  - Full (F): High constriction
  - Extra Full (XF/SF): Extreme constriction
- Model (from predefined list based on brand or custom entry)
- Physical characteristics:
  - Barrel length (18-36 inches)
  - Action type (Break Action, Semi-Auto, Pump, Bolt Action, Lever Action)
  - Stock type (Standard, Pistol Grip, Adjustable)
  - Stock material (Wood, Synthetic)
  - Weight
  - Sights (Bead, Ribbed, Red Dot, Scope)
  - Finish (Blued, Stainless, Camo)
- Notes field for additional information

#### Gun Selection
- Predefined list of major brands:
  - Remington
  - Mossberg
  - Beretta
  - Benelli
  - Browning
  - Winchester
  - CZ-USA
  - Stoeger
  - Savage Arms
  - Franchi
- Dynamic model selection based on chosen brand
- Option to add custom brands and models
- Quick selection of primary gun during score entry

#### Gun Display
- Card-based layout showing:
  - Gun name and brand
  - Basic specifications
  - Key attributes
  - Custom notes
  - Primary gun indicator
  - Quick actions for edit/delete/set primary
- Search and filter capabilities
- Quick access to frequently used guns

### 5.4. Statistics and Analytics
- **Individual shooter statistics:**
  - Average scores by game type
  - Performance by gun
  - Improvement trends
  - Streak tracking
- **Club-wide statistics:**
  - Overall averages
  - Top performers
  - Most active shooters

### 5.5. Dashboard Features

#### Organization Leaderboard
- Comprehensive view of shooter achievements
- Hierarchical organization:
  - Game type sections with clear headers
  - Gauge subsections within each game
  - Individual shooter entries with achievements
- **Filterable by:**
  - Game type (Skeet, Doubles Skeet, Trap, 5-Stand)
  - Gauge (12, 20, 28, .410)
  - All games/gauges combined view
- **Filter behavior:**
  - Synchronized game and gauge filters
  - Empty sections automatically hidden
  - Clear visual feedback for active filters
- **Display metrics:**
  - Number of straights (perfect rounds) in large purple numbers
  - Longest streak
  - Shooter name and achievements
- **Sorting:**
  - Primary organization by game type (Skeet, Doubles Skeet, Trap, 5-Stand)
  - Secondary organization by gauge (12, 20, 28, .410)
  - Primary sort by longest streak
  - Secondary sort by number of straights
- **Visual elements:**
  - Trophy/medal icons for top performers
  - Prominent display of achievement numbers
  - Interactive filters with clear visual feedback
  - Hover states for enhanced user interaction
  - Clear section headers and gauge labels
  - Consistent spacing and typography
  - Responsive layout adapting to filter selections

#### Quick Stats
- Total shooters
- Recent games
- Straights today
- Club average

### 5.6. Competition Management
- Create and manage competitions
- Track scores in real-time
- Generate leaderboards
- Support for different competition formats

### 5.7. Field Management

#### Field Configuration and Management
- **Define and Manage Fields:**
  - Unique names or IDs for each field
  - Supported games: Skeet, Doubles Skeet, Trap, 5-Stand, and Sporting Clays
  - Configuration parameters based on supported games:
    - **5-Stand:**
      - Placement and configuration of up to **9 trap machines** and **5 shooting stands**
    - **Trap:**
      - Placement of **trap houses**
      - **Adjustable angles** for trap machines
      - **Wobble Trap** capability
    - **Skeet/Doubles Skeet:**
      - Standard field setup without additional configuration
    - **Sporting Clays:**
      - Customizable setup for each shooting station
      - Ensure **non-overlapping** with Skeet, Trap, or 5-Stand configurations
- **Game Combination Restrictions:**
  - **Sporting Clays** fields **cannot overlap** with **Skeet**, **Trap**, or **5-Stand** fields due to physical constraints
- **Dynamic Management:**
  - **Create:** Add new fields with specified configurations
  - **Edit:** Modify existing field configurations and details
  - **Remove:** Delete fields from the system

#### Maintenance and Availability Management
- **Specify Maintenance Periods:**
  - Input dates when fields are under maintenance (e.g., "Field 1 is under maintenance on 2024-12-27")
- **Maintenance Notes:**
  - Add descriptive notes or tags for each maintenance entry to track field usage history and maintenance activities
- **Field Availability Status:**
  - **Available:** Field is open for use
  - **Under Maintenance:** Field is temporarily unavailable
- **Automatic Updates:**
  - Change field status based on maintenance schedules

#### Integration with Shooter Scores
- **Link Fields to Game Sessions:**
  - Example: "Shooter X played Trap on Field 2"
- **Session Tracking:**
  - Track which shooters participated in which games on specific fields

#### Data Storage
- **Flat File Management:**
  - Use **JSON** or **CSV** for storing field setup data
  - Include field characteristics, supported games, configurations, maintenance schedules, and availability
- **Example JSON Structure:**
  ```json
  {
    "field_id": "Field1",
    "name": "North Range",
    "games_supported": ["Skeet", "Trap", "5-Stand"],
    "configurations": {
      "5-Stand": {
        "stands": 5,
        "machines": [
          {"id": 1, "location": "northwest corner"},
          {"id": 2, "location": "center", "angle": 30},
          {"id": 3, "location": "southeast corner", "angle": 45},
          {"id": 4, "location": "southwest corner", "angle": 60},
          {"id": 5, "location": "northeast corner", "angle": 75},
          {"id": 6, "location": "east center", "angle": 90},
          {"id": 7, "location": "west center", "angle": 105},
          {"id": 8, "location": "north center", "angle": 120},
          {"id": 9, "location": "south center", "angle": 135}
        ]
      },
      "Trap": {
        "trap_house_location": "center",
        "wobble_trap": true,
        "arc_angle": 45
      }
    },
    "maintenance_schedule": [
      {
        "date": "2024-12-27",
        "note": "Routine trap machine service"
      },
      {
        "date": "2025-01-15",
        "note": "Shooting stand maintenance"
      }
    ],
    "availability": "available"
  }
  ```

#### User Interface
- **Management Tools:**
  - Dropdowns or drag-and-drop tools for defining game configurations
  - Forms for setting maintenance schedules and availability
  - Overview dashboard displaying field statuses and usage history
- **User Experience:**
  - **Responsive Design:** Accessible and functional on both desktop and mobile devices
  - **Intuitive Navigation:** Easy movement between different sections such as field configurations, maintenance schedules, and integration with shooter scores

---

## Technical Requirements

### 6.1. Data Storage
- **Secure storage of user data**
- **Score history persistence**
- **Real-time updates**
- **Flat File Management:**
  - Initially use **JSON** or **CSV** files
  - Structured format to include shooters, scores, and field configurations

### 6.2. Performance
- Fast score entry interface
- Responsive design for mobile use
- Efficient data loading and caching

### 6.3. Security
- Data encryption
- Secure API endpoints
- Input validation and sanitization
- Error handling and logging
- Regular security updates

---

## Non-Functional Requirements

### 7.1. Performance
- Page load times under 2 seconds
- Smooth real-time updates
- Efficient data aggregation for statistics
- Efficient data operations

### 7.2. Security
- HTTPS encryption
- Secure session management
- Data backup and recovery

### 7.3. Usability
- Intuitive interface design
- Mobile-responsive layout
- Clear visual hierarchy for statistics
- Interactive filtering capabilities
- Accessibility compliance

### 7.4. Scalability
- Support for growing user base
- Efficient resource utilization
- Modular architecture

---

## User Stories

1. **As a Club Manager,** I want to:
   - Configure my club's basic information
   - Set available game types
   - View club-wide statistics
   - Manage and configure shooting fields

2. **As a Shooter,** I want to:
   - Record my shooting scores
   - Track my performance statistics
   - Manage my gun configurations
   - View which fields I have used for different games

---

## Wireframes and UI Mockups

Key screens include:
1. Dashboard
2. Score Entry
3. Shooter Management
4. Statistics and Reports
5. User Profile
6. **Field Management**
    - Field Management Dashboard
    - Field Configuration Page
    - Maintenance Scheduling Interface

---

## Roadmap

1. **MVP Release**
   - Basic score tracking
   - Club management integration
   - Core statistics
   - Essential UI components

2. **Phase 2**
   - Competition management
   - Advanced statistics
   - Field management functionality

3. **Phase 3**
   - Mobile app
   - Offline support
   - Advanced analytics

4. **Future Enhancements**
   - Integration with shooting club management systems
   - Social features and shooter networking
   - Competition scheduling and registration

---

## Dependencies

- React and related libraries
- Node.js runtime
- Development tools and IDE support

---

## Assumptions

- Users have modern web browsers
- Stable internet connection
- Basic technical proficiency

---

## Constraints

- Development timeline
- Technical complexity
- Resource availability

---

## Acceptance Criteria

1. **Core Functionality**
   - Score tracking is accurate
   - Club management functions properly
   - Statistics calculations are correct
   - Field management allows creation, editing, and deletion of fields with proper configurations
   - Maintenance scheduling and field availability are accurately tracked

2. **Performance**
   - Meets load time requirements
   - Handles concurrent users
   - Maintains data integrity

3. **User Experience**
   - Intuitive navigation
   - Responsive design
   - Clear error handling

---

## Appendix

### Data Structures

#### Club Information
```json
{
  "club": {
    "name": "Springfield Gun Club",
    "address": "123 Range Road",
    "availableGames": ["Skeet", "Trap", "5-Stand"]
  }
}
```

#### Score Entry
```json
{
  "score_id": "score123",
  "game": "Trap",
  "gauge": "12",
  "date": "2024-04-27T10:00:00Z",
  "starting_stand": 3,
  "total_score": 24,
  "birds": ["hit", "miss", "hit"],
  "field_id": "Field2"
}
```

#### Field Configuration
```json
{
  "field_id": "Field1",
  "name": "North Range",
  "games_supported": ["Skeet", "Trap", "5-Stand"],
  "configurations": {
    "5-Stand": {
      "stands": 5,
      "machines": [
        {"id": 1, "location": "northwest corner"},
        {"id": 2, "location": "center", "angle": 30},
        {"id": 3, "location": "southeast corner", "angle": 45},
        {"id": 4, "location": "southwest corner", "angle": 60},
        {"id": 5, "location": "northeast corner", "angle": 75},
        {"id": 6, "location": "east center", "angle": 90},
        {"id": 7, "location": "west center", "angle": 105},
        {"id": 8, "location": "north center", "angle": 120},
        {"id": 9, "location": "south center", "angle": 135}
      ]
    },
    "Trap": {
      "trap_house_location": "center",
      "wobble_trap": true,
      "arc_angle": 45
    }
  },
  "maintenance_schedule": [
    {
      "date": "2024-12-27",
      "note": "Routine trap machine service"
    },
    {
      "date": "2025-01-15",
      "note": "Shooting stand maintenance"
    }
  ],
  "availability": "available"
}
```

### Wireframe Descriptions

#### Field Management Dashboard
- **Overview:**
  - List of all fields with statuses (Available, Under Maintenance)
  - Quick actions to add, edit, or delete fields
- **Visual Indicators:**
  - Color-coded status indicators
  - Icons representing supported games

#### Field Configuration Page
- **Forms:**
  - Input field name and ID
  - Select supported games with checkboxes
  - Configure game-specific parameters (e.g., number of stands, machine placements)
- **Interactive Elements:**
  - Drag-and-drop interface for placing trap machines and shooting stands (for 5-Stand)
  - Dropdowns for adjustable angles and wobble trap options

#### Maintenance Scheduling Interface
- **Calendar View:**
  - Visual representation of scheduled maintenance periods
  - Ability to add, edit, or remove maintenance entries
- **Forms:**
  - Input date and time for maintenance
  - Add notes or tags for maintenance activities

#### Integration with Shooter Scores
- **Linking Interface:**
  - Assign game sessions to specific fields
  - Display linked fields in shooter score entries