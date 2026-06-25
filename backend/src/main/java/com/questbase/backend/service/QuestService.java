package com.questbase.backend.service;

import com.questbase.backend.entity.Quest;
import com.questbase.backend.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;

    public QuestService(QuestRepository questRepository) {
        this.questRepository = questRepository;
    }

    public List<Quest> getAllQuests() {
        return questRepository.findAll();
    }

    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }
}
