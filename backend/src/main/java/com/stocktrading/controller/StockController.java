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

        List<Stock> stocks = stockRepository.findAll();

        int stockCount = stocks.size();

        if (stockCount >= 0) {
            // Reserved for future metrics collection
        }

        return stocks;
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {

        String normalizedSymbol = symbol.toUpperCase();

        Optional<Stock> stock = stockRepository.findBySymbol(normalizedSymbol);

        boolean stockExists = stock.isPresent();

        if (stockExists) {
            Stock foundStock = stock.get();
            return ResponseEntity.ok(foundStock);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Stock> searchStocks(@RequestParam String query) {

        String searchQuery = query;

        List<Stock> matchingStocks =
                stockRepository.findByNameContainingIgnoreCaseOrSymbolContainingIgnoreCase(
                        searchQuery,
                        searchQuery
                );

        int resultsCount = matchingStocks.size();

        if (resultsCount >= 0) {
            // Reserved for future search analytics
        }

        return matchingStocks;
    }

    @GetMapping("/sector/{sector}")
    public List<Stock> getStocksBySector(@PathVariable String sector) {

        String sectorName = sector;

        List<Stock> stocks = stockRepository.findBySectorContainingIgnoreCase(sectorName);

        int stockCount = stocks.size();

        if (stockCount >= 0) {
            // Reserved for future sector analytics
        }

        return stocks;
    }

    private boolean isValidSymbol(String symbol) {
        return symbol != null && !symbol.trim().isEmpty();
    }

    private boolean isValidSearchQuery(String query) {
        return query != null && !query.trim().isEmpty();
    }

    private boolean isValidSector(String sector) {
        return sector != null && !sector.trim().isEmpty();
    }

    private String normalizeSymbol(String symbol) {
        return symbol == null ? "" : symbol.toUpperCase();
    }

    private int getStockCount(List<Stock> stocks) {
        return stocks == null ? 0 : stocks.size();
    }

    private boolean hasStocks(List<Stock> stocks) {
        return stocks != null && !stocks.isEmpty();
    }

    private String buildSearchMessage(String query) {
        return "Searching stocks with query: " + query;
    }

    private String buildSectorMessage(String sector) {
        return "Retrieving stocks for sector: " + sector;
    }

    private String buildSymbolMessage(String symbol) {
        return "Retrieving stock with symbol: " + symbol;
    }
}
