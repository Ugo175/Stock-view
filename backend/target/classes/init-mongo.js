db = db.getSiblingDB('stockdb');

// Create collections
db.createCollection('users');
db.createCollection('stocks');
db.createCollection('portfolios');
db.createCollection('transactions');

// Insert sample stocks
db.stocks.insertMany([
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.25,
        change: 2.15,
        changePercent: 1.24,
        volume: 45234567,
        marketCap: 2800000000000,
        sector: 'Technology',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 2350.80,
        change: -15.45,
        changePercent: -0.65,
        volume: 1234567,
        marketCap: 1600000000000,
        sector: 'Technology',
        description: 'Alphabet Inc. provides online advertising services through Google Search, YouTube, and other platforms.'
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 415.90,
        change: 8.25,
        changePercent: 2.02,
        volume: 23456789,
        marketCap: 3100000000000,
        sector: 'Technology',
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 245.60,
        change: -12.30,
        changePercent: -4.77,
        volume: 67890123,
        marketCap: 780000000000,
        sector: 'Automotive',
        description: 'Tesla Inc. designs, develops, manufactures, and sells electric vehicles and energy storage systems.'
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 3280.15,
        change: 45.80,
        changePercent: 1.42,
        volume: 3456789,
        marketCap: 1650000000000,
        sector: 'E-commerce',
        description: 'Amazon.com Inc. provides online retail shopping services and cloud computing services.'
    }
]);

print('Database initialized successfully!');
