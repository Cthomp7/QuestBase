package com.questbase.backend.npc;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.npc.dto.CreateNpcRequest;
import com.questbase.backend.npc.dto.NpcResponse;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/npcs")
public class NpcController {

    private final NpcService npcService;

    public NpcController(NpcService npcService) {
        this.npcService = npcService;
    }

    @GetMapping()
    public List<NpcResponse> getAllNPCs() {
        return npcService.getAllNpcs();
    }

    @PostMapping()
    public NpcResponse createNpc(
        @Valid @RequestBody CreateNpcRequest request) {
            return npcService.createNpc(request);
    }
    
}
