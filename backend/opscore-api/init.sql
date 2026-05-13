-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    resolved_at TIMESTAMP,
    updated_by VARCHAR(255),
    resolved_by VARCHAR(255)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP NOT NULL,
    FOREIGN KEY (incident_id) REFERENCES incidents(id)
);

-- Create incident_comments table
CREATE TABLE IF NOT EXISTS incident_comments (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT NOT NULL,
    comment VARCHAR(1000),
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id)
);
