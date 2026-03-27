CREATE TABLE IF NOT EXISTS villages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    population INTEGER NOT NULL CHECK (population > 0),
    water DOUBLE PRECISION NOT NULL CHECK (water >= 0 AND water <= 100),
    energy DOUBLE PRECISION NOT NULL CHECK (energy >= 0 AND energy <= 100),
    food DOUBLE PRECISION NOT NULL CHECK (food >= 0 AND food <= 100),
    budget DOUBLE PRECISION NOT NULL CHECK (budget >= 0),
    waste_recycling DOUBLE PRECISION NOT NULL CHECK (waste_recycling >= 0 AND waste_recycling <= 100),
    green_energy DOUBLE PRECISION NOT NULL CHECK (green_energy >= 0 AND green_energy <= 100),
    infrastructure DOUBLE PRECISION NOT NULL CHECK (infrastructure >= 0 AND infrastructure <= 100),
    education DOUBLE PRECISION NOT NULL CHECK (education >= 0 AND education <= 100),
    overall_score DOUBLE PRECISION NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_villages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_villages_updated_at
    BEFORE UPDATE ON villages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();