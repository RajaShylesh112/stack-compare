-- Seed data for StackCompare
-- Created: 2025-09-27

-- Insert test users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2b$10$rOj7RHDhWJK0r7QN.y9LgOK7LX.k8QbFkZXJF9K6qH8k9Q7X1Y2Ze', 'user', 'Test', 'User', true, true),
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', '$2b$10$rOj7RHDhWJK0r7QN.y9LgOK7LX.k8QbFkZXJF9K6qH8k9Q7X1Y2Ze', 'admin', 'Admin', 'User', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', '$2b$10$rOj7RHDhWJK0r7QN.y9LgOK7LX.k8QbFkZXJF9K6qH8k9Q7X1Y2Ze', 'user', 'Jane', 'Developer', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample technology stacks
INSERT INTO technology_stacks (id, name, description, category, official_website, github_url, license, first_release_date, latest_version, popularity_score, learning_curve, community_size, job_market_demand) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'React', 'A JavaScript library for building user interfaces', 'Frontend Framework', 'https://reactjs.org', 'https://github.com/facebook/react', 'MIT', '2013-05-29', '18.2.0', 95, 'intermediate', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440001', 'Vue.js', 'The Progressive JavaScript Framework', 'Frontend Framework', 'https://vuejs.org', 'https://github.com/vuejs/vue', 'MIT', '2014-02-01', '3.3.0', 85, 'beginner', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440002', 'Angular', 'Platform for building mobile and desktop web applications', 'Frontend Framework', 'https://angular.io', 'https://github.com/angular/angular', 'MIT', '2010-10-20', '16.0.0', 80, 'advanced', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440003', 'Node.js', 'JavaScript runtime built on Chrome V8 JavaScript engine', 'Backend Runtime', 'https://nodejs.org', 'https://github.com/nodejs/node', 'MIT', '2009-05-27', '20.5.0', 90, 'intermediate', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440004', 'Express.js', 'Fast, unopinionated, minimalist web framework for Node.js', 'Backend Framework', 'https://expressjs.com', 'https://github.com/expressjs/express', 'MIT', '2010-01-02', '4.18.2', 85, 'beginner', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440005', 'PostgreSQL', 'The worlds most advanced open source relational database', 'Database', 'https://postgresql.org', 'https://github.com/postgres/postgres', 'PostgreSQL', '1996-07-08', '15.3', 88, 'intermediate', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440006', 'MongoDB', 'The database for modern applications', 'Database', 'https://mongodb.com', 'https://github.com/mongodb/mongo', 'SSPL', '2009-02-11', '7.0.0', 82, 'beginner', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440007', 'Python', 'Python is a programming language', 'Programming Language', 'https://python.org', 'https://github.com/python/cpython', 'PSF', '1991-02-20', '3.11.4', 92, 'beginner', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440008', 'Django', 'High-level Python web framework', 'Backend Framework', 'https://djangoproject.com', 'https://github.com/django/django', 'BSD', '2005-07-15', '4.2.3', 78, 'intermediate', 'large', 'high'),
('660e8400-e29b-41d4-a716-446655440009', 'TypeScript', 'Typed superset of JavaScript', 'Programming Language', 'https://typescriptlang.org', 'https://github.com/microsoft/TypeScript', 'Apache-2.0', '2012-10-01', '5.1.6', 87, 'intermediate', 'large', 'high')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user-stack relationships
INSERT INTO user_stacks (user_id, stack_id, experience_level, years_of_experience, is_favorite, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'intermediate', 2, true, 'Love using React for frontend development'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', 'intermediate', 3, true, 'Backend development with Node.js'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005', 'beginner', 1, false, 'Learning PostgreSQL for data management'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'advanced', 4, true, 'Vue.js expert, prefer it over React'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440007', 'expert', 6, true, 'Python developer with extensive experience')
ON CONFLICT (user_id, stack_id) DO NOTHING;

-- Insert sample comparison
INSERT INTO stack_comparisons (id, user_id, name, description, stack_ids, comparison_criteria, results, is_public) VALUES
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Frontend Framework Comparison', 'Comparing React vs Vue.js vs Angular', 
ARRAY['660e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002']::UUID[],
'{"criteria": ["learning_curve", "community_support", "job_opportunities", "performance"]}',
'{"winner": "React", "scores": {"React": 8.5, "Vue": 8.2, "Angular": 7.8}}',
true)
ON CONFLICT (id) DO NOTHING;
