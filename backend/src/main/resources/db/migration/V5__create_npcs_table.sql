CREATE TABLE npcs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    role VARCHAR(150),
    race VARCHAR(150),
    occupation VARCHAR(150),
    personality TEXT,
    appearance TEXT,
    notes TEXT,
    campaign_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE npcs
ADD CONSTRAINT fk_npcs_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id);