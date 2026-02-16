CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE IF NOT EXISTS users.users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT,
    password VARCHAR(255),
    password_changed_at TIMESTAMP,
    password_reset_expires TIMESTAMP,
    provider VARCHAR(100) DEFAULT 'local' NOT NULL,
    provider_id VARCHAR(255),
    status VARCHAR(255) DEFAULT 'pending' NOT NULL,
    is_email_verified BOOLEAN DEFAULT false NOT NULL,
    email_verified_at TIMESTAMP,
    current_balance INT DEFAULT 0 NOT NULL,
    last_login_at TIMESTAMP,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    account_locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    verification_token TEXT,
    verification_token_expiration TIMESTAMP
)