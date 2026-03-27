package com.cm.ecohub.services;

import com.cm.ecohub.dtos.village.CreateVillageDto;
import com.cm.ecohub.dtos.village.UpdateVillageDto;
import com.cm.ecohub.dtos.village.VillageDto;
import com.cm.ecohub.entities.User;
import com.cm.ecohub.entities.Village;
import com.cm.ecohub.exceptions.DuplicateResourceException;
import com.cm.ecohub.exceptions.UserNotFoundException;
import com.cm.ecohub.exceptions.VillageNotFoundException;
import com.cm.ecohub.repositories.UserRepository;
import com.cm.ecohub.repositories.VillageRepository;
import com.cm.ecohub.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class VillageService {
    private final VillageRepository villageRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public VillageDto createVillage(CreateVillageDto request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(UserNotFoundException::new);

        if (villageRepository.existsByNameAndUser(request.getName(), currentUser)) {
            throw new DuplicateResourceException("You already have a village named: " + request.getName());
        }

        Village village = new Village();
        village.setName(request.getName());
        village.setLocation(request.getLocation());
        village.setPopulation(request.getPopulation());
        village.setWater(request.getWater());
        village.setEnergy(request.getEnergy());
        village.setFood(request.getFood());
        village.setBudget(request.getBudget());
        village.setWasteRecycling(request.getWasteRecycling());
        village.setGreenEnergy(request.getGreenEnergy());
        village.setInfrastructure(request.getInfrastructure());
        village.setEducation(request.getEducation());

        village.setOverallScore(calculateOverallScore(village));

        village.setUser(currentUser);

        Village savedVillage = villageRepository.save(village);
        return mapToResponse(savedVillage);
    }

    public List<VillageDto> getUserVillages() {
        Long currentUserId = securityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(UserNotFoundException::new);

        return villageRepository.findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VillageDto getVillageById(Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new VillageNotFoundException("Village with id " + id + " not found"));

        if (!village.getUser().getId().equals(currentUserId)) {
            throw new VillageNotFoundException("Village not found");
        }

        return mapToResponse(village);
    }

    @Transactional
    public VillageDto updateVillage(Long id, UpdateVillageDto request) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new VillageNotFoundException("Village with id " + id + " not found"));

        if (!village.getUser().getId().equals(currentUserId)) {
            throw new VillageNotFoundException("Village not found");
        }

        if (request.getName() != null) village.setName(request.getName());
        if (request.getLocation() != null) village.setLocation(request.getLocation());
        if (request.getPopulation() != null) village.setPopulation(request.getPopulation());
        if (request.getWater() != null) village.setWater(request.getWater());
        if (request.getEnergy() != null) village.setEnergy(request.getEnergy());
        if (request.getFood() != null) village.setFood(request.getFood());
        if (request.getBudget() != null) village.setBudget(request.getBudget());
        if (request.getWasteRecycling() != null) village.setWasteRecycling(request.getWasteRecycling());
        if (request.getGreenEnergy() != null) village.setGreenEnergy(request.getGreenEnergy());
        if (request.getInfrastructure() != null) village.setInfrastructure(request.getInfrastructure());
        if (request.getEducation() != null) village.setEducation(request.getEducation());

        village.setOverallScore(calculateOverallScore(village));

        Village updatedVillage = villageRepository.save(village);
        return mapToResponse(updatedVillage);
    }

    @Transactional
    public void deleteVillage(Long id) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new VillageNotFoundException("Village with id " + id + " not found"));

        if (!village.getUser().getId().equals(currentUserId)) {
            throw new VillageNotFoundException("Village not found");
        }

        villageRepository.delete(village);
    }

    private Double calculateOverallScore(Village village) {
        double sum = village.getWater() +
                village.getEnergy() +
                village.getFood() +
                village.getWasteRecycling() +
                village.getGreenEnergy() +
                village.getInfrastructure() +
                village.getEducation();

        return Math.round((sum / 7.0) * 100) / 100.0;
    }

    private VillageDto mapToResponse(Village village) {
        VillageDto response = new VillageDto();
        response.setId(village.getId());
        response.setName(village.getName());
        response.setLocation(village.getLocation());
        response.setPopulation(village.getPopulation());
        response.setWater(village.getWater());
        response.setEnergy(village.getEnergy());
        response.setFood(village.getFood());
        response.setBudget(village.getBudget());
        response.setWasteRecycling(village.getWasteRecycling());
        response.setGreenEnergy(village.getGreenEnergy());
        response.setInfrastructure(village.getInfrastructure());
        response.setEducation(village.getEducation());
        response.setOverallScore(village.getOverallScore());
        response.setCreatedAt(village.getCreatedAt());
        response.setUpdatedAt(village.getUpdatedAt());

        if (village.getOverallScore() >= 80) {
            response.setRating("Excellent");
        } else if (village.getOverallScore() >= 60) {
            response.setRating("Good");
        } else if (village.getOverallScore() >= 40) {
            response.setRating("Poor");
        } else {
            response.setRating("Critical");
        }

        return response;
    }
}
