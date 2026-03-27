package com.cm.ecohub.repositories;

import com.cm.ecohub.entities.User;
import com.cm.ecohub.entities.Village;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VillageRepository extends JpaRepository<Village, Long> {
    List<Village> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByNameAndUser(String name, User user);
}