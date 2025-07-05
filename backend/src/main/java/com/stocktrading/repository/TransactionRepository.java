package com.stocktrading.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.stocktrading.model.Transaction;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserIdOrderByTimestampDesc(String userId);
    List<Transaction> findByUserIdAndStockSymbolOrderByTimestampDesc(String userId, String stockSymbol);
}
