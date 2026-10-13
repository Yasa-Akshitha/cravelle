package com.cravelle.config;

import com.cravelle.entity.*;
import com.cravelle.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initUsers();
        initCatalogIfEmpty();
    }

    private void initUsers() {
        // Ensure admin user exists with a fresh BCrypt encoded password
        Optional<User> adminOpt = userRepository.findByEmail("admin@cravelle.com");
        if (adminOpt.isEmpty()) {
            User admin = new User(
                    "Cravelle Administrator",
                    "admin@cravelle.com",
                    passwordEncoder.encode("Cravelle123!"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Created default administrator account: admin@cravelle.com");
        } else {
            User admin = adminOpt.get();
            admin.setPasswordHash(passwordEncoder.encode("Cravelle123!"));
            userRepository.save(admin);
        }

        // Ensure customer user exists
        Optional<User> customerOpt = userRepository.findByEmail("sophia@example.com");
        if (customerOpt.isEmpty()) {
            User customer = new User(
                    "Sophia Laurent",
                    "sophia@example.com",
                    passwordEncoder.encode("Cravelle123!"),
                    Role.CUSTOMER
            );
            userRepository.save(customer);
            logger.info("Created default customer account: sophia@example.com");
        } else {
            User customer = customerOpt.get();
            customer.setPasswordHash(passwordEncoder.encode("Cravelle123!"));
            userRepository.save(customer);
        }
    }

    private void initCatalogIfEmpty() {
        if (productRepository.count() > 0) {
            return;
        }

        logger.info("Catalog is empty. Seeding initial categories and luxury fashion items...");

        Category catDresses = categoryRepository.save(new Category(
                "Evening & Cocktail Dresses",
                "evening-cocktail-dresses",
                "Sophisticated silhouettes crafted from luxurious silks, chiffons, and satins.",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
        ));

        Category catBlazers = categoryRepository.save(new Category(
                "Tailored Blazers & Coats",
                "tailored-blazers-coats",
                "Sharp tailoring meets contemporary elegance with premium wools and structured fits.",
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
        ));

        Category catBlouses = categoryRepository.save(new Category(
                "Silk Blouses & Knitwear",
                "silk-blouses-knitwear",
                "Fluid tops and sumptuous cashmere knits in timeless earthy neutrals.",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
        ));

        Category catTrousers = categoryRepository.save(new Category(
                "Trousers & Pleated Skirts",
                "trousers-pleated-skirts",
                "Wide-leg trousers, tailored culottes, and gracefully pleated midi skirts.",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
        ));

        Category catAccessories = categoryRepository.save(new Category(
                "Artisanal Handbags & Accessories",
                "handbags-accessories",
                "Handcrafted leather bags, gold accent jewelry, and Italian silk scarves.",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
        ));

        // Product 1
        Product p1 = productRepository.save(new Product(
                catDresses,
                "Aurelia Silk Bias-Cut Slip Dress",
                "aurelia-silk-bias-cut-slip-dress",
                "Handcrafted from 100% mulberry silk with an effortless drape. Featuring delicate adjustable straps and a flattering cowl neckline, this evening piece transitions seamlessly from gallery receptions to dinner under starlight.",
                new BigDecimal("2899.00"),
                new BigDecimal("3499.00"),
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85"
        ));
        productImageRepository.save(new ProductImage(p1, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85", 1));
        productImageRepository.save(new ProductImage(p1, "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", 2));
        productVariantRepository.save(new ProductVariant(p1, "S", "Blush Rose", 24));
        productVariantRepository.save(new ProductVariant(p1, "M", "Blush Rose", 20));
        productVariantRepository.save(new ProductVariant(p1, "S", "Champagne Ivory", 18));

        // Product 2
        Product p2 = productRepository.save(new Product(
                catBlazers,
                "Verona Double-Breasted Wool Blazer",
                "verona-double-breasted-wool-blazer",
                "Sculpted in fine camel-tone virgin wool with horn buttons and peaked lapels. An essential statement layering piece that elevates business attire and weekend casual alike.",
                new BigDecimal("4250.00"),
                new BigDecimal("4999.00"),
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85"
        ));
        productImageRepository.save(new ProductImage(p2, "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85", 1));
        productVariantRepository.save(new ProductVariant(p2, "S", "Camel Taupe", 12));
        productVariantRepository.save(new ProductVariant(p2, "M", "Camel Taupe", 16));
        productVariantRepository.save(new ProductVariant(p2, "M", "Onyx Black", 10));

        // Product 3
        Product p3 = productRepository.save(new Product(
                catBlouses,
                "Céleste Pleated Georgette Blouse",
                "celeste-pleated-georgette-blouse",
                "Airy ivory georgette with micro-pleats along the shoulders and a refined tie-neck collar. Delicate mother-of-pearl buttons bring refined craftsmanship to the forefront.",
                new BigDecimal("1899.00"),
                new BigDecimal("2299.00"),
                "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=85"
        ));
        productImageRepository.save(new ProductImage(p3, "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=85", 1));
        productVariantRepository.save(new ProductVariant(p3, "S", "Pearl White", 30));
        productVariantRepository.save(new ProductVariant(p3, "M", "Pearl White", 22));

        // Product 4
        Product p4 = productRepository.save(new Product(
                catTrousers,
                "Palazzo Pleated Wide-Leg Trouser",
                "palazzo-pleated-wide-leg-trouser",
                "High-waisted fluid crepe trousers featuring deep front pleats and side slash pockets. Tailored for an elongated silhouette and effortless movement.",
                new BigDecimal("2150.00"),
                new BigDecimal("2699.00"),
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
        ));
        productImageRepository.save(new ProductImage(p4, "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85", 1));
        productVariantRepository.save(new ProductVariant(p4, "S", "Ivory Cream", 20));
        productVariantRepository.save(new ProductVariant(p4, "M", "Ivory Cream", 25));

        // Product 5
        Product p5 = productRepository.save(new Product(
                catAccessories,
                "The Etoile Leather Tote with Gold Hardware",
                "etoile-leather-tote-gold-hardware",
                "Italian calfskin leather tote meticulously finished with hand-painted edges, gold-embossed Cravelle insignia, and custom brass hardware.",
                new BigDecimal("3890.00"),
                new BigDecimal("4500.00"),
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85"
        ));
        productImageRepository.save(new ProductImage(p5, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85", 1));
        productVariantRepository.save(new ProductVariant(p5, "One Size", "Caramel Tan", 30));

        logger.info("Successfully seeded Cravelle fashion products!");
    }
}
