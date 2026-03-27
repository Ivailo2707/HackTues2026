package com.cm.ecohub.dtos.village;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateVillageDto {
    @NotBlank(message = "Village name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    private String location;

    @NotNull(message = "Population is required")
    @Min(value = 1, message = "Population must be at least 1")
    @Max(value = 100000, message = "Population cannot exceed 100,000")
    private Integer population;

    @NotNull(message = "Water resources are required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double water;

    @NotNull(message = "Energy resources are required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double energy;

    @NotNull(message = "Food resources are required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double food;

    @NotNull(message = "Budget is required")
    @Min(value = 0, message = "Budget cannot be negative")
    private Double budget;

    @NotNull(message = "Waste recycling is required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double wasteRecycling;

    @NotNull(message = "Green energy is required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double greenEnergy;

    @NotNull(message = "Infrastructure is required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double infrastructure;

    @NotNull(message = "Education is required")
    @Min(value = 0, message = "Value must be between 0 and 100")
    @Max(value = 100, message = "Value must be between 0 and 100")
    private Double education;
}
