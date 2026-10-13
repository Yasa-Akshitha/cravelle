-- ====================================================================
-- CRAVELLE — AI-Powered Food Discovery & Delivery Platform
-- Database Schema: schema.sql (MySQL 8.0)
-- ====================================================================

DROP TABLE IF EXISTS delivery_status_history;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS restaurant_reviews;
DROP TABLE IF EXISTS dishes;
DROP TABLE IF EXISTS dish_categories;
DROP TABLE IF EXISTS restaurant_hours;
DROP TABLE IF EXISTS restaurant_cuisines;
DROP TABLE IF EXISTS cuisines;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS user_visit_history;
DROP TABLE IF EXISTS saved_places;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS chatbot_messages;
DROP TABLE IF EXISTS chatbot_conversations;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Preferences
CREATE TABLE user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    is_pure_veg BOOLEAN DEFAULT FALSE,
    dietary_restrictions VARCHAR(255),
    favorite_cuisines VARCHAR(255),
    budget_per_meal DECIMAL(10,2) DEFAULT 350.00,
    spice_tolerance VARCHAR(50) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Saved Places
CREATE TABLE saved_places (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    place_type VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    address VARCHAR(255),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_places_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Visit History
CREATE TABLE user_visit_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    place_name VARCHAR(150) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visit_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Cuisines
CREATE TABLE cuisines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Restaurants
CREATE TABLE restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL DEFAULT 'Bangalore',
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    phone VARCHAR(30),
    rating DECIMAL(3,2) DEFAULT 4.5,
    total_reviews INT DEFAULT 0,
    price_range VARCHAR(20) DEFAULT '$$',
    delivery_time_minutes INT DEFAULT 30,
    delivery_fee DECIMAL(10,2) DEFAULT 40.00,
    minimum_order DECIMAL(10,2) DEFAULT 150.00,
    is_pure_veg BOOLEAN DEFAULT FALSE,
    is_open BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    banner_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Restaurant - Cuisine
CREATE TABLE restaurant_cuisines (
    restaurant_id BIGINT NOT NULL,
    cuisine_id BIGINT NOT NULL,
    PRIMARY KEY (restaurant_id, cuisine_id),
    CONSTRAINT fk_rc_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_rc_cuisine FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Restaurant Hours
CREATE TABLE restaurant_hours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    day_of_week INT NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_rh_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Dish Categories
CREATE TABLE dish_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    CONSTRAINT fk_dc_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Dishes
CREATE TABLE dishes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    category_id BIGINT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image_url VARCHAR(500),
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    is_spicy BOOLEAN DEFAULT FALSE,
    calories INT,
    preparation_time_minutes INT DEFAULT 20,
    rating DECIMAL(3,2) DEFAULT 4.5,
    total_orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dish_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    CONSTRAINT fk_dish_category FOREIGN KEY (category_id) REFERENCES dish_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Addresses
CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    street VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(80) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    is_default BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Carts
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    special_instructions VARCHAR(255),
    CONSTRAINT fk_ci_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_ci_dish FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Orders
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 40.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'ORDER_PLACED',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    delivery_address TEXT NOT NULL,
    delivery_instructions VARCHAR(255),
    rider_name VARCHAR(100) DEFAULT 'Vikram Singh (Demo Rider)',
    rider_phone VARCHAR(30) DEFAULT '+91 98765 43210',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Order Items
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    dish_id BIGINT,
    dish_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_dish FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Delivery Status History
CREATE TABLE delivery_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    note VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dsh_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Restaurant Reviews
CREATE TABLE restaurant_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rr_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_rr_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Chat Conversations
CREATE TABLE chat_conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    guest_session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_conversation FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
