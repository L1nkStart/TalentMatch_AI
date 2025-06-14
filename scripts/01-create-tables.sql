-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  department VARCHAR(100),
  education_level VARCHAR(100),
  hierarchical_level VARCHAR(100),
  skills TEXT[],
  executive_summary TEXT,
  relevance_score INTEGER DEFAULT 0,
  resume_url TEXT,
  processed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create email_processing_log table
CREATE TABLE IF NOT EXISTS email_processing_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_subject VARCHAR(500),
  sender_email VARCHAR(255),
  attachment_name VARCHAR(255),
  processing_status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  candidate_id UUID REFERENCES candidates(id),
  processed_at TIMESTAMP DEFAULT NOW()
);

-- Create email_configuration table
CREATE TABLE IF NOT EXISTS email_configuration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Configuración Principal',
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL DEFAULT 993,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  use_tls BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP,
  test_status VARCHAR(50),
  test_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_department ON candidates(department);
CREATE INDEX IF NOT EXISTS idx_candidates_education ON candidates(education_level);
CREATE INDEX IF NOT EXISTS idx_candidates_hierarchical ON candidates(hierarchical_level);
CREATE INDEX IF NOT EXISTS idx_candidates_relevance ON candidates(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_email_config_active ON email_configuration(is_active);
