package com.cm.ecohub.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "villages")
public class Village {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "population")
    private Integer population;

    @Column(name = "water")
    private Double water;

    @Column(name = "energy")
    private Double energy;

    @Column(name = "food")
    private Double food;

    @Column(name = "budget")
    private Double budget;

    @Column(name = "waste_recycling")
    private Double wasteRecycling;

    @Column(name = "green_energy")
    private Double greenEnergy;

    @Column(name = "infrastructure")
    private Double infrastructure;

    @Column(name = "education")
    private Double education;

    @Column(name = "overall_Score")
    private Double overallScore;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}