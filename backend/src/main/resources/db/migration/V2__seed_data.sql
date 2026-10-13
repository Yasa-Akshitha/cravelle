-- Flyway V2: Seed Initial Fashion Catalog Data

-- 1. Initial Users (password 'Cravelle123!')
-- BCrypt hash for 'Cravelle123!': $2a$10$wE9s4nQzZ5qf7Vw3F/Wf2ex0mKj1B0U8v8nK1r3K2v1t4l0g5h6e
INSERT INTO users (id, name, email, password_hash, role, enabled) VALUES
(1, 'Cravelle Administrator', 'admin@cravelle.com', '$2a$10$fV3.pCglT5LzJ54R1UaHwe4pU1Xm7c6Xp2tYpM9W4j2C7D6K4b8ee', 'ADMIN', TRUE),
(2, 'Sophia Laurent', 'sophia@example.com', '$2a$10$fV3.pCglT5LzJ54R1UaHwe4pU1Xm7c6Xp2tYpM9W4j2C7D6K4b8ee', 'CUSTOMER', TRUE);

-- 2. Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Evening & Cocktail Dresses', 'evening-cocktail-dresses', 'Sophisticated silhouettes crafted from luxurious silks, chiffons, and satins.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'),
(2, 'Tailored Blazers & Coats', 'tailored-blazers-coats', 'Sharp tailoring meets contemporary elegance with premium wools and structured fits.', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'),
(3, 'Silk Blouses & Knitwear', 'silk-blouses-knitwear', 'Fluid tops and sumptuous cashmere knits in timeless earthy neutrals.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'),
(4, 'Trousers & Pleated Skirts', 'trousers-pleated-skirts', 'Wide-leg trousers, tailored culottes, and gracefully pleated midi skirts.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'),
(5, 'Artisanal Handbags & Accessories', 'handbags-accessories', 'Handcrafted leather bags, gold accent jewelry, and Italian silk scarves.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80');

-- 3. Products
INSERT INTO products (id, category_id, name, slug, description, price, original_price, image_url, status) VALUES
(1, 1, 'Aurelia Silk Bias-Cut Slip Dress', 'aurelia-silk-bias-cut-slip-dress', 'Handcrafted from 100% mulberry silk with an effortless drape. Featuring delicate adjustable straps and a flattering cowl neckline, this evening piece transitions seamlessly from gallery receptions to dinner under starlight.', 2899.00, 3499.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(2, 2, 'Verona Double-Breasted Wool Blazer', 'verona-double-breasted-wool-blazer', 'Sculpted in fine camel-tone virgin wool with horn buttons and peaked lapels. An essential statement layering piece that elevates business attire and weekend casual alike.', 4250.00, 4999.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(3, 3, 'Céleste Pleated Georgette Blouse', 'celeste-pleated-georgette-blouse', 'Airy ivory georgette with micro-pleats along the shoulders and a refined tie-neck collar. Delicate mother-of-pearl buttons bring refined craftsmanship to the forefront.', 1899.00, 2299.00, 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(4, 4, 'Palazzo Pleated Wide-Leg Trouser', 'palazzo-pleated-wide-leg-trouser', 'High-waisted fluid crepe trousers featuring deep front pleats and side slash pockets. Tailored for an elongated silhouette and effortless movement.', 2150.00, 2699.00, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(5, 5, 'The Etoile Leather Tote with Gold Hardware', 'etoile-leather-tote-gold-hardware', 'Italian calfskin leather tote meticulously finished with hand-painted edges, gold-embossed Cravelle insignia, and custom brass hardware.', 3890.00, 4500.00, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(6, 1, 'Genevieve Floral Chiffon Maxi Gown', 'genevieve-floral-chiffon-maxi-gown', 'Romantic floor-length gown featuring ethereal botanic prints on sheer chiffon, a cinched waistline, and softly billowing poet sleeves.', 3450.00, 3999.00, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(7, 3, 'Seraphina Cashmere Turtleneck Sweater', 'seraphina-cashmere-turtleneck-sweater', 'Spun from ultra-soft Mongolian grade-A cashmere. Designed in a relaxed drop-shoulder cut in warm oats that pairs effortlessly with tailored trousers.', 2990.00, 3600.00, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(8, 2, 'Monceau Houndstooth Cropped Jacket', 'monceau-houndstooth-cropped-jacket', 'Classic Parisian houndstooth weave in black and cream with frayed edge trims and vintage gilded buttons. A modern twist on timeless couture.', 3190.00, 3750.00, 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(9, 4, 'Soleil Sunburst Pleated Satin Midi Skirt', 'soleil-sunburst-pleated-satin-midi-skirt', 'Luminous champagne satin skirt engineered with permanent knife pleats that catch the light with every stride. Comfortable concealed elastic waist.', 1790.00, 2199.00, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85', 'ACTIVE'),
(10, 5, 'Lumière Sculpted Gold Cuff Bracelet', 'lumiere-sculpted-gold-cuff-bracelet', 'Architectural wrist cuff cast in recycled brass and dipped in 18k yellow gold with an organic brushed satin finish. Nickel-free and hypoallergenic.', 1290.00, 1590.00, 'https://images.unsplash.com/photo-1611591475819-79b7b9148d8b?auto=format&fit=crop&w=1000&q=85', 'ACTIVE');

-- 4. Product Images
INSERT INTO product_images (id, product_id, image_url, display_order) VALUES
(1, 1, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85', 1),
(2, 1, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85', 2),
(3, 2, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85', 1),
(4, 2, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85', 2),
(5, 3, 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=85', 1),
(6, 4, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85', 1),
(7, 5, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85', 1),
(8, 6, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85', 1),
(9, 7, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85', 1),
(10, 8, 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=85', 1),
(11, 9, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85', 1),
(12, 10, 'https://images.unsplash.com/photo-1611591475819-79b7b9148d8b?auto=format&fit=crop&w=1000&q=85', 1);

-- 5. Product Variants
INSERT INTO product_variants (id, product_id, size, color, stock) VALUES
(1, 1, 'XS', 'Blush Rose', 15),
(2, 1, 'S', 'Blush Rose', 24),
(3, 1, 'M', 'Blush Rose', 20),
(4, 1, 'L', 'Blush Rose', 10),
(5, 1, 'S', 'Champagne Ivory', 18),
(6, 1, 'M', 'Champagne Ivory', 15),
(7, 2, 'S', 'Camel Taupe', 12),
(8, 2, 'M', 'Camel Taupe', 16),
(9, 2, 'L', 'Camel Taupe', 8),
(10, 2, 'S', 'Onyx Black', 14),
(11, 2, 'M', 'Onyx Black', 10),
(12, 3, 'XS', 'Pearl White', 25),
(13, 3, 'S', 'Pearl White', 30),
(14, 3, 'M', 'Pearl White', 22),
(15, 3, 'L', 'Pearl White', 15),
(16, 4, 'S', 'Ivory Cream', 20),
(17, 4, 'M', 'Ivory Cream', 25),
(18, 4, 'L', 'Ivory Cream', 12),
(19, 4, 'M', 'Mocha Brown', 18),
(20, 5, 'One Size', 'Caramel Tan', 30),
(21, 5, 'One Size', 'Espresso Dark', 20),
(22, 6, 'S', 'Dusty Rose Bloom', 10),
(23, 6, 'M', 'Dusty Rose Bloom', 14),
(24, 6, 'L', 'Dusty Rose Bloom', 8),
(25, 7, 'S', 'Warm Oat', 15),
(26, 7, 'M', 'Warm Oat', 18),
(27, 7, 'L', 'Warm Oat', 10),
(28, 8, 'S', 'Noir & Blanc', 12),
(29, 8, 'M', 'Noir & Blanc', 15),
(30, 9, 'S', 'Champagne Gold', 22),
(31, 9, 'M', 'Champagne Gold', 25),
(32, 9, 'L', 'Champagne Gold', 14),
(33, 10, 'One Size', '18K Yellow Gold', 40);

-- 6. Sample Reviews
INSERT INTO reviews (id, user_id, product_id, rating, comment) VALUES
(1, 2, 1, 5, 'The silk quality is unbelievable! Received compliments all evening at my dinner gala.'),
(2, 2, 2, 5, 'The tailoring on this blazer rivals bespoke couture houses. Perfectly structured.'),
(3, 2, 5, 5, 'Everyday luxury at its finest. The leather smells divine and the gold hardware is sturdy.');

-- 7. Newsletter Subscribers
INSERT INTO newsletter_subscribers (id, email, active) VALUES
(1, 'fashionista@cravelle.com', TRUE),
(2, 'editor@vogueeditorial.com', TRUE);
