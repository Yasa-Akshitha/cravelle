package com.cravelle.chatbot;

import org.springframework.stereotype.Service;

@Service
public class StorePolicyService {

    public String getStorePoliciesSummary() {
        return """
            - Platform Name: Cravelle — AI-Powered Food Discovery & Delivery
            - Delivery Times: Hyperlocal food delivery in 20-35 minutes within 7km radius.
            - Delivery Fees: Flat ₹25-₹45 based on restaurant distance; free delivery promos on select orders.
            - Dietary & Hygiene: Tamper-proof packaging with verified pure vegetarian and non-vegetarian kitchen separation.
            - Order Cancellation: Orders can be cancelled if still in 'Order Placed' or 'Restaurant Confirmed' stage before kitchen preparation.
            - Payment Methods: Cash on Delivery (COD) and Razorpay / Online test payments.
            - Customer Care: Available 7 days a week at support@cravelle.com or via Cravelle AI concierge.
            """;
    }
}
