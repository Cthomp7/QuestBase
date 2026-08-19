CREATE TABLE campaign_members (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE campaign_members
ADD CONSTRAINT fk_campaign_members_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id)
ON DELETE CASCADE;

ALTER TABLE campaign_members
ADD CONSTRAINT fk_campaign_members_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE campaign_members
ADD CONSTRAINT uq_campaign_members_campaign_user
UNIQUE (campaign_id, user_id);

CREATE TABLE campaign_invites (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE campaign_invites
ADD CONSTRAINT fk_campaign_invites_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id)
ON DELETE CASCADE;

ALTER TABLE campaign_invites
ADD CONSTRAINT uq_campaign_invites_token_hash
UNIQUE (token_hash);