package com.cm.ecohub.controllers;

import com.cm.ecohub.constants.ApiPaths;
import com.cm.ecohub.dtos.village.CreateVillageDto;
import com.cm.ecohub.dtos.village.UpdateVillageDto;
import com.cm.ecohub.dtos.village.VillageDto;
import com.cm.ecohub.services.VillageService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
public class VillageController {
    private final VillageService villageService;

    @PostMapping(ApiPaths.VILLAGES)
    public ResponseEntity<VillageDto> createVillage(@Valid @RequestBody CreateVillageDto request) {
        VillageDto response = villageService.createVillage(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(ApiPaths.VILLAGES)
    public ResponseEntity<List<VillageDto>> getUserVillages() {
        List<VillageDto> villages = villageService.getUserVillages();
        return ResponseEntity.ok(villages);
    }

    @GetMapping(ApiPaths.VILLAGE_BY_ID)
    public ResponseEntity<VillageDto> getVillage(@PathVariable Long id) {
        VillageDto village = villageService.getVillageById(id);
        return ResponseEntity.ok(village);
    }

    @PutMapping(ApiPaths.VILLAGE_BY_ID)
    public ResponseEntity<VillageDto> updateVillage(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVillageDto request) {
        VillageDto updated = villageService.updateVillage(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping(ApiPaths.VILLAGE_BY_ID)
    public ResponseEntity<Void> deleteVillage(@PathVariable Long id) {
        villageService.deleteVillage(id);
        return ResponseEntity.noContent().build();
    }
}
