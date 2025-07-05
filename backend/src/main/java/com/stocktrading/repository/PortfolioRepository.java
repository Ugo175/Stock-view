package com.stocktrading.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.stocktrading.model.Portfolio;

@Repository
public interface PortfolioRepository extends MongoRepository<Portfolio, String> {
    List<Portfolio> findByUserId(String userId);
    Optional<Portfolio> findByUserIdAndStockSymbol(String userId, String stockSymbol);
    void deleteByUserIdAndStockSymbol(String userId, String stockSymbol);
}
