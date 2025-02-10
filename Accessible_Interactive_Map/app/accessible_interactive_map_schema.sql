-- Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_disabled BOOLEAN DEFAULT FALSE
);

-- Accessibility Profiles Table
CREATE TABLE AccessibilityProfiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    mobility_type VARCHAR(50),
    wheelchair_width DECIMAL(5,2),
    requires_elevator BOOLEAN DEFAULT FALSE,
    requires_ramp BOOLEAN DEFAULT FALSE,
    hearing_impaired BOOLEAN DEFAULT FALSE,
    visual_impairment_level VARCHAR(50)
);

-- Locations Table
CREATE TABLE Locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    category VARCHAR(50)
);

-- Accessibility Features Table
CREATE TABLE AccessibilityFeatures (
    feature_id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES Locations(location_id),
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    elevator_available BOOLEAN DEFAULT FALSE,
    ramp_available BOOLEAN DEFAULT FALSE,
    braille_signage BOOLEAN DEFAULT FALSE,
    audio_guides BOOLEAN DEFAULT FALSE,
    sign_language_support BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT FALSE,
    accessible_parking_spots INTEGER DEFAULT 0
);

-- User Reviews Table
CREATE TABLE UserReviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    location_id INTEGER REFERENCES Locations(location_id),
    accessibility_rating INTEGER CHECK (accessibility_rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE Routes (
    route_id SERIAL PRIMARY KEY,
    start_location_id INTEGER REFERENCES Locations(location_id),
    end_location_id INTEGER REFERENCES Locations(location_id),
    total_distance DECIMAL(10,2),
    estimated_time INTEGER,
    accessibility_score DECIMAL(4,2)
);

-- Route Accessibility Details
CREATE TABLE RouteAccessibilityDetails (
    route_detail_id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES Routes(route_id),
    obstacle_type VARCHAR(100),
    obstacle_description TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5)
);
