MYSQL kodlarını adımları takip ederek yazın.

-- İlk olarak 'opinify' adlı veritabanını oluşturuyoruz ("İsterseniz değiştirebilirsiniz ancak server.js den database: 'opinify' kısmını değiştirin")
CREATE DATABASE opinify;

-- 'opinify' veritabanına geçiş yapıyoruz
USE opinify;

-- 'users' tablosunu oluşturuyoruz, name ile passwordu istrediğiniz gibi atayın.
CREATE TABLE users (
    name VARCHAR(255) NOT NULL,        -- Kullanıcı adı
    password VARCHAR(255) NOT NULL     -- Kullanıcı şifresi
);

-- 'notes' tablosunu oluşturuyoruz
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Her bir not için otomatik artan bir ID
    title TEXT NOT NULL,               -- Not başlığı
    contents TEXT NOT NULL,            -- Not içeriği
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Notun oluşturulma tarihi ve saati
);
