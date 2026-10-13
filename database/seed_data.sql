-- ====================================================================
-- CRAVELLE — AI-Powered Food Discovery & Delivery Platform
-- Migration: V2__seed_food_data.sql
-- ====================================================================

-- 1. Users Seed Data (BCrypt password: 'Cravelle123!')
-- BCrypt hash for 'Cravelle123!': $2a$10$oX1Lq7Jm1B.v7YyqG1O2v.qI.6K3E9B7rG5D9H3F1E5A7B9C1D3E
INSERT INTO users (id, name, email, password, phone, role, avatar_url, created_at) VALUES
(1, 'Cravelle Administrator', 'admin@cravelle.com', '$2a$10$w3a6e974e6c464c813a86uK5a96k1x.t1XhS0cWdYc6Y4zK4b2ZWy', '+91 98000 11111', 'ROLE_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', CURRENT_TIMESTAMP),
(2, 'Rahul Sharma (Student @ PES)', 'rahul@example.com', '$2a$10$w3a6e974e6c464c813a86uK5a96k1x.t1XhS0cWdYc6Y4zK4b2ZWy', '+91 98111 22222', 'ROLE_CUSTOMER', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', CURRENT_TIMESTAMP),
(3, 'Priya Nair (Techie @ Prestige Tech Park)', 'priya@example.com', '$2a$10$w3a6e974e6c464c813a86uK5a96k1x.t1XhS0cWdYc6Y4zK4b2ZWy', '+91 98222 33333', 'ROLE_CUSTOMER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', CURRENT_TIMESTAMP);

-- 2. User Preferences
INSERT INTO user_preferences (id, user_id, is_pure_veg, dietary_restrictions, favorite_cuisines, budget_per_meal, spice_tolerance, created_at) VALUES
(1, 2, FALSE, 'None', 'Biryani, North Indian, Burgers', 250.00, 'HIGH', CURRENT_TIMESTAMP),
(2, 3, TRUE, 'Vegetarian, Nut Allergy', 'South Indian, Healthy Bowls, Italian', 400.00, 'MEDIUM', CURRENT_TIMESTAMP);

-- 3. Saved Places
INSERT INTO saved_places (id, user_id, name, place_type, address, latitude, longitude, created_at) VALUES
(1, 2, 'PES University Campus', 'COLLEGE', '100 Feet Ring Road, BSK 3rd Stage, Bangalore', 12.9344, 77.5345, CURRENT_TIMESTAMP),
(2, 2, 'Gopalan Arcade Mall', 'MALL', 'Mysore Road, RR Nagar, Bangalore', 12.9352, 77.5186, CURRENT_TIMESTAMP),
(3, 3, 'Prestige Tech Cloud Office', 'OFFICE', 'Outer Ring Road, Marathahalli, Bangalore', 12.9432, 77.6961, CURRENT_TIMESTAMP),
(4, 3, 'Phoenix Marketcity Mall', 'MALL', 'Whitefield Main Road, Mahadevapura, Bangalore', 12.9959, 77.6964, CURRENT_TIMESTAMP),
(5, 3, 'Indiranagar 100ft Hub', 'NEIGHBOURHOOD', '100 Feet Road, HAL 2nd Stage, Bangalore', 12.9719, 77.6412, CURRENT_TIMESTAMP);

-- 4. User Visit History (Consented place check-ins)
INSERT INTO user_visit_history (id, user_id, place_name, latitude, longitude, visited_at) VALUES
(1, 2, 'PES University Library Block', 12.9344, 77.5345, CURRENT_TIMESTAMP),
(2, 2, 'Gopalan Arcade Cinema', 12.9352, 77.5186, CURRENT_TIMESTAMP),
(3, 3, 'Prestige Tech Park Tower 3', 12.9432, 77.6961, CURRENT_TIMESTAMP),
(4, 3, 'Phoenix Marketcity Courtyard', 12.9959, 77.6964, CURRENT_TIMESTAMP);

-- 5. Cuisines
INSERT INTO cuisines (id, name, slug, image_url, display_order) VALUES
(1, 'Biryani & Mughlai', 'biryani-mughlai', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', 1),
(2, 'South Indian', 'south-indian', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', 2),
(3, 'North Indian & Tandoor', 'north-indian-tandoor', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', 3),
(4, 'Italian & Woodfired', 'italian-woodfired', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', 4),
(5, 'Chinese & Asian Wok', 'chinese-asian-wok', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', 5),
(6, 'Healthy Bowls & Greens', 'healthy-bowls-greens', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', 6),
(7, 'Burgers & Street Food', 'burgers-street-food', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 7),
(8, 'Desserts & Artisan Cafe', 'desserts-artisan-cafe', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', 8);

-- 6. Restaurants
INSERT INTO restaurants (id, name, slug, description, address, city, latitude, longitude, phone, rating, total_reviews, price_range, delivery_time_minutes, delivery_fee, minimum_order, is_pure_veg, is_open, image_url, banner_url, featured, created_at) VALUES
(1, 'Meghana Foods (Koramangala Special)', 'meghana-foods-koramangala', 'Legendary Andhra style aromatic biryanis and spicy tandoori appetisers prepared with pure ghee and secret coastal spices.', 'Koramangala 5th Block, Jyoti Nivas College Rd', 'Bangalore', 12.9352, 77.6245, '+91 80 4110 5555', 4.7, 4280, '₹₹', 25, 35.00, 150.00, FALSE, TRUE, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80', TRUE, CURRENT_TIMESTAMP),

(2, 'Arogya Ahaara & Heritage Cafe', 'arogya-ahaara-heritage-cafe', 'Crisp golden ghee roast dosas, piping hot filter coffee, and melt-in-mouth idlis right opposite PES University campus.', '100ft Ring Road, Banashankari 3rd Stage (Opp. PES)', 'Bangalore', 12.9348, 77.5350, '+91 80 2672 1212', 4.8, 3120, '₹', 18, 25.00, 100.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80', TRUE, CURRENT_TIMESTAMP),

(3, 'Toscano Pizzeria & Trattoria', 'toscano-pizzeria-trattoria', 'Handcrafted sourdough pizzas baked in stone hearth ovens with imported San Marzano tomatoes, burrata, and fresh basil.', '100 Feet Road, Indiranagar', 'Bangalore', 12.9716, 77.6408, '+91 80 4123 9898', 4.6, 1890, '₹₹₹', 35, 50.00, 300.00, FALSE, TRUE, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', TRUE, CURRENT_TIMESTAMP),

(4, 'The Green Bowl Co. Organic Kitchen', 'the-green-bowl-co', 'Nutrient-packed Mediterranean grain bowls, detox cold-pressed juices, and superfood salads crafted for energetic workdays.', 'Sector 4, HSR Layout (Near Tech Hub)', 'Bangalore', 12.9121, 77.6446, '+91 80 4955 6789', 4.5, 940, '₹₹', 22, 30.00, 180.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', FALSE, CURRENT_TIMESTAMP),

(5, 'Bao & Wok Asian House', 'bao-wok-asian-house', 'Steaming hot handmade crystal dim sums, spicy Dan Dan noodles, and fluffy baos serving tech professionals across Prestige Tech Park.', 'Outer Ring Road, Marathahalli (Near Prestige Tech Park)', 'Bangalore', 12.9435, 77.6968, '+91 80 4141 3322', 4.4, 1560, '₹₹', 28, 40.00, 200.00, FALSE, TRUE, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80', FALSE, CURRENT_TIMESTAMP),

(6, 'Cafe L''Amour Artisanal Patisserie', 'cafe-lamour-patisserie', 'French flaky croissants, signature Belgian dark chocolate ganache tarts, and specialty roasted pour-over coffees.', 'Whitefield Main Rd (Beside Phoenix Marketcity)', 'Bangalore', 12.9962, 77.6969, '+91 80 4220 8877', 4.7, 2150, '₹₹', 20, 30.00, 150.00, FALSE, TRUE, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80', TRUE, CURRENT_TIMESTAMP),

(7, 'Punjab Grill & Tandoor Darbar', 'punjab-grill-tandoor-darbar', 'Slow-cooked rich Dal Makhani, buttery garlic naans, and succulent chargrilled paneer and chicken tandoori platters.', '80 Feet Road, Koramangala 4th Block', 'Bangalore', 12.9360, 77.6210, '+91 80 4099 2121', 4.5, 1780, '₹₹', 32, 45.00, 250.00, FALSE, TRUE, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', FALSE, CURRENT_TIMESTAMP),

(8, 'Udupi Grand Sagar', 'udupi-grand-sagar', 'Pure vegetarian South Indian comfort food: Benne Dosa, Bisi Bele Bath, Medu Vada, and wholesome traditional Thalis.', '12th Main Road, Indiranagar', 'Bangalore', 12.9730, 77.6420, '+91 80 2525 6677', 4.6, 2890, '₹', 22, 25.00, 120.00, TRUE, TRUE, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80', FALSE, CURRENT_TIMESTAMP);

-- 7. Restaurant Cuisines Junction
INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id) VALUES
(1, 1), (1, 3),
(2, 2),
(3, 4),
(4, 6),
(5, 5),
(6, 8),
(7, 3), (7, 1),
(8, 2);

-- 8. Restaurant Hours (Sample for Weekdays & Weekends)
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time, is_closed) VALUES
(1, 1, '11:00:00', '23:30:00', FALSE),
(1, 2, '11:00:00', '23:30:00', FALSE),
(1, 3, '11:00:00', '23:30:00', FALSE),
(1, 4, '11:00:00', '23:30:00', FALSE),
(1, 5, '11:00:00', '23:30:00', FALSE),
(1, 6, '11:00:00', '00:00:00', FALSE),
(1, 7, '11:00:00', '00:00:00', FALSE),
(2, 1, '06:30:00', '22:30:00', FALSE),
(2, 2, '06:30:00', '22:30:00', FALSE),
(2, 3, '06:30:00', '22:30:00', FALSE),
(2, 4, '06:30:00', '22:30:00', FALSE),
(2, 5, '06:30:00', '22:30:00', FALSE),
(2, 6, '06:30:00', '23:00:00', FALSE),
(2, 7, '06:30:00', '23:00:00', FALSE);

-- 9. Dish Categories
INSERT INTO dish_categories (id, restaurant_id, name, display_order) VALUES
(1, 1, 'Special Biryanis', 1),
(2, 1, 'Tandoori & Starters', 2),
(3, 2, 'Heritage Dosas', 1),
(4, 2, 'Morning Specials & Snacks', 2),
(5, 3, 'Artisanal Pizzas', 1),
(6, 3, 'Handmade Pastas', 2),
(7, 4, 'Nutrient Bowls', 1),
(8, 4, 'Fresh Squeezed Juices', 2),
(9, 5, 'Dim Sums & Baos', 1),
(10, 5, 'Wok Tossed Noodles', 2),
(11, 6, 'Gourmet Desserts', 1),
(12, 6, 'Coffee & Beverages', 2),
(13, 7, 'Royal Main Course', 1),
(14, 7, 'Tandoor Breads', 2),
(15, 8, 'South Indian Classics', 1);

-- 10. Dishes (Realistic Menu with Prices in INR ₹)
INSERT INTO dishes (id, restaurant_id, category_id, name, description, price, original_price, image_url, is_veg, is_available, is_spicy, calories, preparation_time_minutes, rating, total_orders, created_at) VALUES
-- Meghana Foods (Rest 1)
(1, 1, 1, 'Meghana Special Chicken Biryani', 'Fragrant basmati rice layered with fiery Andhra chicken boneless fry, boiled egg, spiced salan, and onion raita.', 310.00, 350.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 780, 20, 4.8, 1420, CURRENT_TIMESTAMP),
(2, 1, 1, 'Paneer Hyderabadi Dum Biryani', 'Fresh paneer cubes marinated in green herbs and saffron dum basmati rice. Served with spicy mirchi ka salan.', 260.00, 290.00, 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 650, 18, 4.6, 980, CURRENT_TIMESTAMP),
(3, 1, 2, 'Andhra Chilli Chicken Dry', 'Tender chicken bites wok-tossed with green chillies, curry leaves, ginger garlic, and traditional coastal spices.', 290.00, 320.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 480, 15, 4.7, 1150, CURRENT_TIMESTAMP),

-- Arogya Ahaara (Rest 2 - Near PES College)
(4, 2, 3, 'Crispy Ghee Roast Masala Dosa', 'Golden fermented rice-lentil crepe smeared with pure aromatic ghee, potato palya, paired with fresh coconut chutney and piping hot sambar.', 95.00, 110.00, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 380, 12, 4.9, 3200, CURRENT_TIMESTAMP),
(5, 2, 4, 'Thatte Idli with Red Chutney Podi (2 Pcs)', 'Pillowy soft oversized steamed rice cakes topped with melting butter and gun powder red podi.', 70.00, 85.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 260, 10, 4.8, 2800, CURRENT_TIMESTAMP),
(6, 2, 4, 'Authentic Filter Kaapi', 'Freshly brewed decoction with frothy whole milk served in traditional brass dabarah and tumbler.', 35.00, 40.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 90, 5, 4.9, 4500, CURRENT_TIMESTAMP),

-- Toscano (Rest 3 - Indiranagar)
(7, 3, 5, 'Classic Margherita Rustica Pizza', 'San Marzano plum tomato sauce, fior di latte mozzarella, extra virgin olive oil, and fresh garden sweet basil leaves.', 460.00, 520.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 720, 25, 4.7, 850, CURRENT_TIMESTAMP),
(8, 3, 6, 'Truffle Mushroom Fettuccine', 'Al dente ribbons of fresh egg pasta tossed in porcini mushroom velvet cream, white truffle oil, and shaved 24-month parmesan.', 490.00, 560.00, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 680, 20, 4.6, 620, CURRENT_TIMESTAMP),

-- The Green Bowl Co. (Rest 4 - HSR Layout)
(9, 4, 7, 'Mediterranean Falafel & Quinoa Bowl', 'Crispy herb falafels, organic tricolor quinoa, roasted spiced chickpeas, creamy hummus, pickled beetroot, and tahini drizzle.', 280.00, 320.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 420, 15, 4.6, 910, CURRENT_TIMESTAMP),
(10, 4, 8, 'Sun-Kissed Orange & Carrot Detox Elixir', 'Freshly cold-pressed Valencia oranges, organic carrots, fresh ginger knob, and turmeric root.', 130.00, 160.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 110, 8, 4.5, 430, CURRENT_TIMESTAMP),

-- Bao & Wok (Rest 5 - Near Prestige Tech Park)
(11, 5, 9, 'Truffle Edamame Crystal Dumplings (4 Pcs)', 'Translucent steamed wrappers filled with crushed edamame, water chestnuts, and a delicate hint of white truffle essence.', 295.00, 340.00, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 210, 15, 4.7, 720, CURRENT_TIMESTAMP),
(12, 5, 10, 'Fiery Sichuan Dan Dan Noodles', 'Springy egg noodles in a rich sesame-chilli broth topped with minced protein, scallions, bok choy, and toasted crushed peanuts.', 320.00, 370.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, TRUE, 560, 18, 4.5, 840, CURRENT_TIMESTAMP),

-- Cafe L'Amour (Rest 6 - Phoenix Marketcity)
(13, 6, 11, 'Belgian Dark Chocolate Ganache Tart', 'Valrhona 70% dark chocolate silk filling inside a buttery sablé pastry shell finished with gold dust flakes.', 210.00, 240.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 390, 10, 4.8, 1310, CURRENT_TIMESTAMP),
(14, 6, 12, 'Iced Spanish Latte', 'Double shot of artisan espresso shaken with condensed milk and chilled whole milk over crystal clear ice.', 180.00, 210.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 180, 5, 4.9, 1840, CURRENT_TIMESTAMP),

-- Punjab Grill (Rest 7)
(15, 7, 13, 'Dal Makhani Bukhara Style (Slow-Cooked 24 Hrs)', 'Whole black lentils simmered overnight with tomatoes, butter, and cream on slow charcoal embers.', 270.00, 310.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 490, 18, 4.7, 1640, CURRENT_TIMESTAMP),
(16, 7, 14, 'Butter Garlic Naan', 'Tandoor-baked leavened bread brushed with melted butter and toasted roasted garlic flakes.', 55.00, 65.00, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 220, 8, 4.8, 2900, CURRENT_TIMESTAMP),

-- Udupi Grand (Rest 8)
(17, 8, 15, 'Davangere Benne Dosa', 'Fluffy thick dosa roasted with generous dollops of fresh white unsalted butter, served with spicy potato mash and coconut chutney.', 110.00, 130.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 440, 14, 4.7, 1920, CURRENT_TIMESTAMP),
(18, 8, 15, 'Traditional Bisi Bele Bath with Boondi', 'Piping hot Karnataka spiced lentil and vegetable rice cooked with nutmeg, ghee, and crowned with crunchy savoury boondi.', 120.00, 140.00, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, FALSE, 410, 12, 4.6, 1450, CURRENT_TIMESTAMP);

-- 11. Addresses
INSERT INTO addresses (id, user_id, label, street, area, city, pincode, latitude, longitude, is_default) VALUES
(1, 2, 'Hostel / College', 'Room 304, Block C, PES Hostel', 'BSK 3rd Stage', 'Bangalore', '560085', 12.9344, 77.5345, TRUE),
(2, 3, 'Office Desk', 'Floor 4, Tower B, Prestige Tech Cloud', 'Outer Ring Road, Marathahalli', 'Bangalore', '560103', 12.9432, 77.6961, TRUE);

-- 12. Sample Order for Rahul (to demonstrate history & delivery tracking)
INSERT INTO orders (id, order_number, user_id, restaurant_id, total_amount, subtotal, delivery_fee, tax, discount, status, payment_method, payment_status, delivery_address, delivery_instructions, rider_name, rider_phone, created_at, updated_at) VALUES
(1, 'CRV-2026-8941', 2, 2, 200.00, 165.00, 25.00, 10.00, 0.00, 'OUT_FOR_DELIVERY', 'CASH_ON_DELIVERY', 'PENDING', 'Room 304, Block C, PES Hostel, BSK 3rd Stage, Bangalore - 560085', 'Please call upon reaching PES main gate.', 'Vikram Singh (Demo Delivery Partner)', '+91 98765 43210', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO order_items (id, order_id, dish_id, dish_name, quantity, unit_price, total_price) VALUES
(1, 1, 4, 'Crispy Ghee Roast Masala Dosa', 1, 95.00, 95.00),
(2, 1, 5, 'Thatte Idli with Red Chutney Podi (2 Pcs)', 1, 70.00, 70.00);

-- 13. Delivery Status History for Order 1
INSERT INTO delivery_status_history (id, order_id, status, note, timestamp) VALUES
(1, 1, 'ORDER_PLACED', 'Order placed by Rahul Sharma', CURRENT_TIMESTAMP),
(2, 1, 'RESTAURANT_CONFIRMED', 'Arogya Ahaara confirmed the order', CURRENT_TIMESTAMP),
(3, 1, 'BEING_PREPARED', 'Chef is preparing crisp ghee dosas & fresh idlis', CURRENT_TIMESTAMP),
(4, 1, 'READY_FOR_PICKUP', 'Food packaged with tamper-proof seal', CURRENT_TIMESTAMP),
(5, 1, 'OUT_FOR_DELIVERY', 'Delivery partner Vikram Singh is on the way to PES Hostel', CURRENT_TIMESTAMP);

-- 14. Newsletter Subscribers
INSERT INTO newsletter_subscribers (id, email, subscribed_at) VALUES
(1, 'foodie.club@cravelle.com', CURRENT_TIMESTAMP),
(2, 'tasting.journal@cravelle.com', CURRENT_TIMESTAMP);
