package com.stocktrading.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.stocktrading.model.Stock;

@Repository
public interface StockRepository extends MongoRepository<Stock, String> {
    Optional<Stock> findBySymbol(String symbol);
    List<Stock> findBySectorContainingIgnoreCase(String sector);
    List<Stock> findByNameContainingIgnoreCaseOrSymbolContainingIgnoreCase(String name, String symbol);
}
