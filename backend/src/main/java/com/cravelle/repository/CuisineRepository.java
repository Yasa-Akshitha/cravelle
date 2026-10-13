package com.cravelle.repository;

import com.cravelle.entity.Cuisine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuisineRepository extends JpaRepository<Cuisine, Long> {
    Optional<Cuisine> findBySlug(String slug);
    List<Cuisine> findAllByOrderByDisplayOrderAsc();
}
