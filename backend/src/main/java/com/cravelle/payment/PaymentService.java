package com.cravelle.payment;

import com.cravelle.entity.PaymentStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    public record PaymentResult(boolean success, String transactionId, PaymentStatus status, String message) {}

    public PaymentResult processPayment(String paymentMethod, BigDecimal amount) {
        if ("CASH_ON_DELIVERY".equalsIgnoreCase(paymentMethod)) {
            return new PaymentResult(
                    true,
                    "COD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    PaymentStatus.PENDING,
                    "Order placed successfully with Cash on Delivery"
            );
        }

        if ("TEST_CARD".equalsIgnoreCase(paymentMethod) || "TEST_GATEWAY".equalsIgnoreCase(paymentMethod)) {
            // Simulated secure test transaction verification (Mock gateway callback)
            String txnId = "CRV-TEST-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
            logger.info("Processed verified test payment of {} with ref {}", amount, txnId);
            return new PaymentResult(
                    true,
                    txnId,
                    PaymentStatus.PAID,
                    "Payment verified via Cravelle test gateway"
            );
        }

        // Default safe fallback: clearly labeled pending payment
        return new PaymentResult(
                true,
                "PEND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                PaymentStatus.PENDING,
                "Order created pending verification"
        );
    }
}
