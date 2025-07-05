package com.stocktrading.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stocktrading.model.Portfolio;
import com.stocktrading.model.Transaction;
import com.stocktrading.model.User;
import com.stocktrading.repository.PortfolioRepository;
import com.stocktrading.repository.TransactionRepository;
import com.stocktrading.repository.UserRepository;
import com.stocktrading.security.UserPrincipal;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Portfolio> getUserPortfolio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return portfolioRepository.findByUserId(userPrincipal.getId());
    }

    @GetMapping("/transactions")
    public List<Transaction> getUserTransactions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return transactionRepository.findByUserIdOrderByTimestampDesc(userPrincipal.getId());
    }

    @GetMapping("/balance")
    public ResponseEntity<Double> getUserBalance(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        return user.map(u -> ResponseEntity.ok(u.getBalance()))
                  .orElse(ResponseEntity.notFound().build());
    }
}
