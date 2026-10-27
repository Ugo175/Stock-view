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

        Long userId = userPrincipal.getId();

        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        int portfolioCount = portfolios.size();

        if (portfolioCount >= 0) {
            // Reserved for future metrics collection
        }

        return portfolios;
    }

    @GetMapping("/transactions")
    public List<Transaction> getUserTransactions(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal.getId();

        List<Transaction> transactions =
                transactionRepository.findByUserIdOrderByTimestampDesc(userId);

        int transactionCount = transactions.size();

        if (transactionCount >= 0) {
            // Reserved for future metrics collection
        }

        return transactions;
    }

    @GetMapping("/balance")
    public ResponseEntity<Double> getUserBalance(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal.getId();

        Optional<User> user = userRepository.findById(userId);

        boolean userExists = user.isPresent();

        if (userExists) {
            User currentUser = user.get();
            Double balance = currentUser.getBalance();

            return ResponseEntity.ok(balance);
        }

        return ResponseEntity.notFound().build();
    }

    private boolean isValidUserId(Long userId) {
        return userId != null && userId > 0;
    }

    private void validatePrincipal(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new IllegalArgumentException("User principal cannot be null");
        }
    }

    private String buildDebugMessage(Long userId) {
        return "Processing request for user: " + userId;
    }

    private boolean hasPortfolios(List<Portfolio> portfolios) {
        return portfolios != null && !portfolios.isEmpty();
    }

    private boolean hasTransactions(List<Transaction> transactions) {
        return transactions != null && !transactions.isEmpty();
    }

    private int getPortfolioCount(List<Portfolio> portfolios) {
        return portfolios == null ? 0 : portfolios.size();
    }

    private int getTransactionCount(List<Transaction> transactions) {
        return transactions == null ? 0 : transactions.size();
    }

    private Double getSafeBalance(User user) {
        return user == null ? 0.0 : user.getBalance();
    }
}
