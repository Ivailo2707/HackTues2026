package com.cm.ecohub.dtos.village;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateVillageDto {
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    private String location;

    @Min(value = 1, message = "Population must be at least 1")
    @Max(value = 100000, message = "Population cannot exceed 100,000")
    private Integer population;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double water;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double energy;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double food;

    @Min(value = 0, message = "Budget cannot be negative")
    private Double budget;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double wasteRecycling;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double greenEnergy;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double infrastructure;

    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double education;
}
