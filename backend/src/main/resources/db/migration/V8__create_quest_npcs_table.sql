CREATE TABLE quest_npcs (
    id BIGSERIAL PRIMARY KEY,
    quest_id BIGINT NOT NULL,
    npc_id BIGINT NOT NULL,
    role VARCHAR(100),
    notes TEXT
);

ALTER TABLE quest_npcs
ADD CONSTRAINT fk_quest_npcs_quest
FOREIGN KEY (quest_id)
REFERENCES quests(id)
ON DELETE CASCADE;

ALTER TABLE quest_npcs
ADD CONSTRAINT fk_quest_npcs_npc
FOREIGN KEY (npc_id)
REFERENCES npcs(id)
ON DELETE CASCADE;

ALTER TABLE quest_npcs
ADD CONSTRAINT uq_quest_npc
UNIQUE (quest_id, npc_id);