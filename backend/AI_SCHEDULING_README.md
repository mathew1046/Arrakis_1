# AI-Assisted Film Production Scheduling System

## Overview
This Flask-based system provides AI-powered scheduling optimization for film production, automatically grouping scenes by location proximity and sorting by time of day to minimize setup costs and maximize efficiency.

## Features

### 🤖 AI Optimization Logic
- **Location Clustering**: Groups scenes with similar locations (e.g., "Radio Station Control Room" and "Radio Station Parking Area")
- **Time-based Sorting**: Within each location cluster, sorts by DAY → DUSK → NIGHT
- **Similarity Detection**: Uses keyword extraction and Jaccard similarity to identify related locations

### 🚀 API Endpoints

#### 1. `/api/ai/sort_schedule` (POST)
**Purpose**: Full schedule optimization with file saving

**Response Example**:
```json
{
  "status": "success",
  "message": "Schedule optimized successfully",
  "total_scenes": 9,
  "sorted_scenes": [
    {
      "scene_number": 9,
      "scene_title": "EXT. RADIO STATION - PARKING AREA - DUSK",
      "location": "Radio Station Parking Area",
      "time_of_day": "DUSK",
      "actors": ["Maya"],
      "extras": []
    }
  ],
  "saved_file": "optimized_schedule.json"
}
```

#### 2. `/api/ai/preview_schedule` (GET)
**Purpose**: Quick preview of top 5 optimized scenes

**Response Example**:
```json
{
  "status": "success",
  "message": "Schedule preview generated",
  "total_scenes_available": 9,
  "preview_count": 5,
  "preview_scenes": [
    {
      "scene_number": 9,
      "scene_title": "EXT. RADIO STATION - PARKING AREA - DUSK",
      "location": "Radio Station Parking Area",
      "time_of_day": "DUSK",
      "estimated_duration": "1 minute",
      "actor_count": 1,
      "extras_count": 0
    }
  ]
}
```

#### 3. `/api/ai/schedule_analysis` (GET)
**Purpose**: Analyze current schedule and show optimization potential

**Response Example**:
```json
{
  "status": "success",
  "analysis": {
    "total_scenes": 9,
    "unique_locations": 9,
    "location_clusters_identified": 6,
    "time_distribution": {
      "DAY": 6,
      "DUSK": 1,
      "NIGHT": 2
    },
    "busiest_actors": {
      "Maya": 6,
      "Maya Chen": 1
    },
    "optimization_potential": {
      "can_group_locations": true,
      "location_savings": 3
    }
  }
}
```

## 🏗️ Architecture

### File Structure
```
backend/
├── routes/
│   └── ai_routes.py          # AI scheduling endpoints
├── data/
│   ├── production_schedule.json    # Input: Detailed production data
│   ├── shooting_schedule.json      # Input: Alternative schedule format
│   └── optimized_schedule.json     # Output: AI-optimized schedule
├── app.py                    # Main Flask application
└── requirements.txt          # Dependencies
```

### Core Classes

#### `ScheduleOptimizer`
- **Location Clustering**: `cluster_locations()` groups similar locations
- **Similarity Calculation**: `calculate_location_similarity()` uses keyword matching
- **Time Sorting**: `sort_scenes_within_cluster()` orders by time of day
- **Main Optimization**: `optimize_schedule()` orchestrates the full process

## 🧪 Testing

### Run Logic Tests
```bash
python test_ai_logic.py
```

### Run Demo Optimization
```bash
python demo_optimization.py
```

### Test API Endpoints
```bash
# Start Flask server
python run.py

# Test endpoints
python test_ai_endpoints.py
```

## 📊 Optimization Benefits

### Before Optimization (Original Order)
```
1. Scene 1: Abandoned Radio Station (NIGHT)
2. Scene 2: Radio Station Control Room (NIGHT)  
3. Scene 3: Maya's Apartment - Living Room (DAY)
4. Scene 4: University Campus Quad (DAY)
5. Scene 5: Professor Rhodes' Office (DAY)
```

### After Optimization (AI-Sorted)
```
1. Scene 9: Radio Station Parking Area (DUSK)
2. Scene 1: Abandoned Radio Station (NIGHT)
3. Scene 2: Radio Station Control Room (NIGHT)
4. Scene 3: Maya's Apartment - Living Room (DAY)
5. Scene 8: Maya's Car (DAY)
```

### Key Improvements
- **Location Grouping**: Radio Station scenes clustered together
- **Time Progression**: Natural DAY → DUSK → NIGHT flow within locations
- **Setup Efficiency**: Reduced location changes save time and money
- **Actor Scheduling**: Maya's scenes grouped for better call sheet management

## 🔧 Configuration

### Dependencies
- Flask 2.3.3
- Flask-CORS 4.0.0
- Python 3.11+
- Standard libraries only (no external AI APIs)

### Environment Setup
```bash
pip install -r requirements.txt
python run.py
```

## 🚀 Usage Examples

### Basic Optimization
```bash
curl -X POST http://localhost:5000/api/ai/sort_schedule
```

### Quick Preview
```bash
curl http://localhost:5000/api/ai/preview_schedule
```

### Schedule Analysis
```bash
curl http://localhost:5000/api/ai/schedule_analysis
```

## 🎯 Future Enhancements

- **Actor Availability**: Consider actor schedules in optimization
- **Weather Constraints**: Factor in weather requirements for outdoor scenes
- **Equipment Sharing**: Optimize based on shared equipment needs
- **Budget Optimization**: Include cost factors in scheduling decisions
- **ML Learning**: Learn from past productions to improve clustering

## 📝 Error Handling

The system includes comprehensive error handling for:
- Missing JSON files
- Malformed JSON data
- Empty scene lists
- File I/O errors
- Invalid optimization parameters

All endpoints return structured JSON responses with clear error messages and appropriate HTTP status codes.
