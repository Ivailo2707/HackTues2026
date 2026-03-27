package com.cm.ecohub.dtos.village;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VillageDto {
    private Long id;
    private String name;
    private String location;
    private Integer population;

    private Double water;
    private Double energy;
    private Double food;
    private Double budget;

    private Double wasteRecycling;
    private Double greenEnergy;

    private Double infrastructure;
    private Double education;

    private Double overallScore;
    private String rating;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
