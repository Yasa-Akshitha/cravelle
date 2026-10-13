package com.cravelle.service;

import com.cravelle.dto.NewsletterRequest;
import com.cravelle.entity.NewsletterSubscriber;
import com.cravelle.exception.BadRequestException;
import com.cravelle.repository.NewsletterSubscriberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NewsletterService {

    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

    public NewsletterService(NewsletterSubscriberRepository newsletterSubscriberRepository) {
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
    }

    @Transactional
    public void subscribe(NewsletterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (newsletterSubscriberRepository.existsByEmail(email)) {
            return; // Idempotent
        }
        NewsletterSubscriber subscriber = new NewsletterSubscriber(email);
        newsletterSubscriberRepository.save(subscriber);
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriber> getAllSubscribers() {
        return newsletterSubscriberRepository.findAll();
    }
}
