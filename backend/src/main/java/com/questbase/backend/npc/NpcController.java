package com.questbase.backend.npc;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.npc.dto.CreateNpcRequest;
import com.questbase.backend.npc.dto.NpcQuestResponse;
import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.npc.dto.SaveNpcNotesRequest;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/npcs")
public class NpcController {

    private final NpcService npcService;

    public NpcController(NpcService npcService) {
        this.npcService = npcService;
    }

    @GetMapping("/{id}")
    public NpcResponse getNpcById(
        @PathVariable Long id
    ) {
        return npcService.getNpcById(id);
    }

    @GetMapping()
    public List<NpcResponse> getAllNpcs() {
        return npcService.getAllNpcs();
    }

    @PostMapping()
    public NpcResponse createNpc(
        @Valid @RequestBody CreateNpcRequest request) {
            return npcService.createNpc(request);
    }

    @PutMapping("/{id}")
    public NpcResponse putMethodName(
        @PathVariable Long id, 
        @RequestBody CreateNpcRequest request
    ) {
        return npcService.updateNpc(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteNpc(@PathVariable Long id) {
        npcService.deleteNpc(id);
    }

    @PatchMapping("/{id}/save-notes")
    public NpcResponse saveNpcNotesById(
        @PathVariable Long id,
        @RequestBody SaveNpcNotesRequest request
    ) {
        return npcService.saveNpcNotesById(
            id,
            request.notes()
        );
    }

    @GetMapping("/{id}/quests")
    public List<NpcQuestResponse> getQuestsByNpcId(
        @PathVariable Long id
    ) {
        return npcService.getQuestsByNpcId(id);
    }
    
}
