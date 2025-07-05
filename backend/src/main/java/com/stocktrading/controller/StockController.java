package com.stocktrading.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stocktrading.model.Stock;
import com.stocktrading.repository.StockRepository;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {
        Optional<Stock> stock = stockRepository.findBySymbol(symbol.toUpperCase());
        return stock.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Stock> searchStocks(@RequestParam String query) {
        return stockRepository.findByNameContainingIgnoreCaseOrSymbolContainingIgnoreCase(query, query);
    }

    @GetMapping("/sector/{sector}")
    public List<Stock> getStocksBySector(@PathVariable String sector) {
        return stockRepository.findBySectorContainingIgnoreCase(sector);
    }
}
