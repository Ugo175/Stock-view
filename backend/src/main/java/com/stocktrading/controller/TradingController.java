package com.stocktrading.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stocktrading.dto.ApiResponse;
import com.stocktrading.dto.TradeRequest;
import com.stocktrading.model.Portfolio;
import com.stocktrading.model.Stock;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;
import com.stocktrading.repository.PortfolioRepository;
import com.stocktrading.repository.StockRepository;
import com.stocktrading.repository.TransactionRepository;
import com.stocktrading.repository.UserRepository;
import com.stocktrading.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/trading")
public class TradingController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/buy")
    public ResponseEntity<?> buyStock(@Valid @RequestBody TradeRequest tradeRequest, 
                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<User> userOpt = userRepository.findById(userPrincipal.getId());
        Optional<Stock> stockOpt = stockRepository.findBySymbol(tradeRequest.getStockSymbol());

        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found"));
        }

        if (!stockOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Stock not found"));
        }

        User user = userOpt.get();
        Stock stock = stockOpt.get();
        
        double totalCost = stock.getPrice() * tradeRequest.getQuantity();

        if (user.getBalance() < totalCost) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Insufficient balance"));
        }

        // Update user balance
        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);

        // Update portfolio
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndStockSymbol(
            user.getId(), stock.getSymbol());
        
        Portfolio portfolio;
        if (portfolioOpt.isPresent()) {
            portfolio = portfolioOpt.get();
            double newAveragePrice = ((portfolio.getAveragePrice() * portfolio.getQuantity()) + totalCost) / 
                                   (portfolio.getQuantity() + tradeRequest.getQuantity());
            portfolio.setAveragePrice(newAveragePrice);
            portfolio.setQuantity(portfolio.getQuantity() + tradeRequest.getQuantity());
        } else {
            portfolio = new Portfolio();
            portfolio.setUserId(user.getId());
            portfolio.setStockSymbol(stock.getSymbol());
            portfolio.setQuantity(tradeRequest.getQuantity());
            portfolio.setAveragePrice(stock.getPrice());
        }
        portfolioRepository.save(portfolio);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setStockSymbol(stock.getSymbol());
        transaction.setType("BUY");
        transaction.setQuantity(tradeRequest.getQuantity());
        transaction.setPrice(stock.getPrice());
        transaction.setTotalAmount(totalCost);
        transactionRepository.save(transaction);

        return ResponseEntity.ok(new ApiResponse(true, "Stock purchased successfully"));
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(@Valid @RequestBody TradeRequest tradeRequest, 
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Optional<User> userOpt = userRepository.findById(userPrincipal.getId());
        Optional<Stock> stockOpt = stockRepository.findBySymbol(tradeRequest.getStockSymbol());

        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found"));
        }

        if (!stockOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Stock not found"));
        }

        User user = userOpt.get();
        Stock stock = stockOpt.get();

        Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndStockSymbol(
            user.getId(), stock.getSymbol());

        if (!portfolioOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "You don't own this stock"));
        }

        Portfolio portfolio = portfolioOpt.get();

        if (portfolio.getQuantity() < tradeRequest.getQuantity()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Insufficient shares"));
        }

        double totalRevenue = stock.getPrice() * tradeRequest.getQuantity();

        // Update user balance
        user.setBalance(user.getBalance() + totalRevenue);
        userRepository.save(user);

        // Update portfolio
        portfolio.setQuantity(portfolio.getQuantity() - tradeRequest.getQuantity());
        if (portfolio.getQuantity() == 0) {
            portfolioRepository.deleteByUserIdAndStockSymbol(user.getId(), stock.getSymbol());
        } else {
            portfolioRepository.save(portfolio);
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setStockSymbol(stock.getSymbol());
        transaction.setType("SELL");
        transaction.setQuantity(tradeRequest.getQuantity());
        transaction.setPrice(stock.getPrice());
        transaction.setTotalAmount(totalRevenue);
        transactionRepository.save(transaction);

        return ResponseEntity.ok(new ApiResponse(true, "Stock sold successfully"));
    }
}
