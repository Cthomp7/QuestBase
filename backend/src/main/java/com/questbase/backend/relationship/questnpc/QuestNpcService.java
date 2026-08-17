package com.questbase.backend.relationship.questnpc;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.exception.InsufficientPermissionException;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.npc.Npc;
import com.questbase.backend.npc.NpcRepository;
import com.questbase.backend.quest.Quest;
import com.questbase.backend.quest.QuestRepository;
import com.questbase.backend.relationship.questnpc.dto.CreateQuestNpcRequest;
import com.questbase.backend.relationship.questnpc.dto.QuestNpcResponse;
import com.questbase.backend.relationship.questnpc.dto.UpdateQuestNpcRequest;

@Service
public class QuestNpcService {

    private final AuthService authService;
    private final NpcRepository npcRepository;
    private final QuestRepository questRepository;
    private final QuestNpcRepository questNpcRepository;

    public QuestNpcService(
        AuthService authService,
        NpcRepository npcRepository,
        QuestRepository questRepository,
        QuestNpcRepository questNpcRepository
    ) {
        this.authService = authService;
        this.npcRepository = npcRepository;
        this.questRepository = questRepository;
        this.questNpcRepository = questNpcRepository;
    }
    
    public QuestNpcResponse createQuestNpc (CreateQuestNpcRequest request) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository
            .findByIdAndCampaignUser(request.questId(), currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Quest"));

        Npc npc = npcRepository
            .findByIdAndCampaignUser(request.npcId(), currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("NPC"));

        if (!quest.getCampaign().getId().equals(npc.getCampaign().getId())) {
            throw new IllegalArgumentException(
                "Quest and NPC must belong to the same campaign"
            );
        }

        QuestNpc questNpc = new QuestNpc();
        questNpc.setQuest(quest);
        questNpc.setNpc(npc);
        questNpc.setRole(request.role());
        questNpc.setNotes(request.notes());

        QuestNpc savedQuestNpc = questNpcRepository.save(questNpc);

        return QuestNpcResponse.from(savedQuestNpc);
    }

    public QuestNpcResponse updateQuestNpc (
        Long id,
        UpdateQuestNpcRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        QuestNpc questNpc = questNpcRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("NPC Quest"));

        boolean ownsQuest =
            questNpc.getQuest().getCampaign().getUser().getId()
                .equals(currentUser.getId());

        boolean ownsNpc =
            questNpc.getNpc().getCampaign().getUser().getId()
                .equals(currentUser.getId());

        if (!ownsQuest || !ownsNpc) {
            throw new InsufficientPermissionException();
        }

        questNpc.setRole(request.role());
        questNpc.setNotes(request.notes());

        QuestNpc savedQuestNpc = questNpcRepository.save(questNpc);

        return QuestNpcResponse.from(savedQuestNpc);
    }

    public void deleteQuestNpc (Long id) {
        User currentUser = authService.getCurrentUser();

        QuestNpc questNpc = questNpcRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("NPC Quest"));

        boolean ownsQuest =
            questNpc.getQuest().getCampaign().getUser().getId()
                .equals(currentUser.getId());

        boolean ownsNpc =
            questNpc.getNpc().getCampaign().getUser().getId()
                .equals(currentUser.getId());

        if (!ownsQuest || !ownsNpc) {
            throw new InsufficientPermissionException();
        }

        questNpcRepository.delete(questNpc);
    }
}
