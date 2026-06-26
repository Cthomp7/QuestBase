ALTER TABLE quests
ADD COLUMN campaign_id BIGINT;

ALTER TABLE quests
ADD CONSTRAINT fk_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id);