package com.cravelle.chatbot;

import org.springframework.stereotype.Service;

@Service
public class StorePolicyService {

    public String getStorePoliciesSummary() {
        return """
            - Store Name: Cravelle Luxury Fashion
            - Shipping: Free delivery on all orders over ₹3,000. For orders under ₹3,000, standard express shipping is ₹150.
            - Delivery Times: Standard metro delivery takes 2-4 business days. Regional delivery takes 3-6 business days.
            - Returns & Exchanges: 14-day complimentary returns for unworn items in original packaging with tags intact.
            - Payment Methods: Cash on Delivery (COD) and major credit/debit cards supported.
            - Customer Care: Available 7 days a week at support@cravelle.com or via live chat.
            """;
    }
}
