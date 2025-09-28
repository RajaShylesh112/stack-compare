-- Initial database schema for StackCompare
-- Created: 2025-09-27

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create refresh_tokens table for JWT token management
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technology stacks table
CREATE TABLE IF NOT EXISTS technology_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    official_website VARCHAR(255),
    github_url VARCHAR(255),
    license VARCHAR(100),
    first_release_date DATE,
    latest_version VARCHAR(50),
    popularity_score INTEGER DEFAULT 0,
    learning_curve VARCHAR(50) CHECK (learning_curve IN ('beginner', 'intermediate', 'advanced')),
    community_size VARCHAR(50) CHECK (community_size IN ('small', 'medium', 'large')),
    job_market_demand VARCHAR(50) CHECK (job_market_demand IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stacks table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stack_id UUID NOT NULL REFERENCES technology_stacks(id) ON DELETE CASCADE,
    experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, stack_id)
);

-- Create stack_comparisons table
CREATE TABLE IF NOT EXISTS stack_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stack_ids UUID[] NOT NULL, -- Array of stack IDs being compared
    comparison_criteria JSONB, -- Store comparison criteria as JSON
    results JSONB, -- Store comparison results as JSON
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_technology_stacks_category ON technology_stacks(category);
CREATE INDEX IF NOT EXISTS idx_technology_stacks_popularity ON technology_stacks(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_stacks_user_id ON user_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stacks_stack_id ON user_stacks(stack_id);
CREATE INDEX IF NOT EXISTS idx_stack_comparisons_user_id ON stack_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_stack_comparisons_public ON stack_comparisons(is_public) WHERE is_public = true;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technology_stacks_updated_at BEFORE UPDATE ON technology_stacks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stack_comparisons_updated_at BEFORE UPDATE ON stack_comparisons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
