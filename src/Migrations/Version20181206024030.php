<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181206024030 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE commerce_order (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, created_at DATETIME NOT NULL, total_price NUMERIC(10, 2) NOT NULL, currency VARCHAR(3) NOT NULL, payment_service VARCHAR(20) DEFAULT NULL, status SMALLINT NOT NULL, INDEX IDX_859B545DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commerce_order_detail (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, order_id INT NOT NULL, quantity INT NOT NULL, unit_price NUMERIC(10, 2) NOT NULL, INDEX IDX_7E790A8E4584665A (product_id), INDEX IDX_7E790A8E8D9F6D38 (order_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commerce_product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, visible TINYINT(1) NOT NULL, enabled TINYINT(1) NOT NULL, price NUMERIC(10, 2) DEFAULT NULL, pill_price NUMERIC(10, 2) DEFAULT NULL, discr VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commerce_pill_offer (id INT NOT NULL, color VARCHAR(20) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commerce_product_translation (id INT AUTO_INCREMENT NOT NULL, object_id INT DEFAULT NULL, locale VARCHAR(8) NOT NULL, field VARCHAR(32) NOT NULL, content LONGTEXT DEFAULT NULL, INDEX IDX_584C8A62232D562B (object_id), UNIQUE INDEX lookup_unique_idx (locale, object_id, field), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_author (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, slug VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(30) NOT NULL, slug VARCHAR(30) NOT NULL, updated_at DATETIME DEFAULT NULL, image_name VARCHAR(30) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_category_manga (category_id INT NOT NULL, manga_id INT NOT NULL, INDEX IDX_37A0B55912469DE2 (category_id), INDEX IDX_37A0B5597B6461 (manga_id), PRIMARY KEY(category_id, manga_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_category_translation (id INT AUTO_INCREMENT NOT NULL, object_id INT DEFAULT NULL, locale VARCHAR(8) NOT NULL, field VARCHAR(32) NOT NULL, content LONGTEXT DEFAULT NULL, INDEX IDX_37EE61DF232D562B (object_id), UNIQUE INDEX lookup_unique_idx (locale, object_id, field), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_manga (id INT NOT NULL, author_id INT NOT NULL, publisher_id INT NOT NULL, slug VARCHAR(100) NOT NULL, directory VARCHAR(30) NOT NULL, image_name VARCHAR(30) DEFAULT NULL, release_date DATE DEFAULT NULL, note NUMERIC(2, 1) NOT NULL, INDEX IDX_1A6B5D86F675F31B (author_id), INDEX IDX_1A6B5D8640C86FCE (publisher_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_manga_user (id INT AUTO_INCREMENT NOT NULL, manga_id INT NOT NULL, user_id INT NOT NULL, bookmark_id INT DEFAULT NULL, vote NUMERIC(2, 1) DEFAULT NULL, status SMALLINT NOT NULL, INDEX IDX_23D8EA057B6461 (manga_id), INDEX IDX_23D8EA05A76ED395 (user_id), INDEX IDX_23D8EA0592741D25 (bookmark_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_page (id INT NOT NULL, manga_id INT DEFAULT NULL, volume_id INT DEFAULT NULL, position INT NOT NULL, INDEX IDX_235CDE747B6461 (manga_id), INDEX IDX_235CDE748FD80EEA (volume_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_publisher (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_volume (id INT NOT NULL, manga_id INT NOT NULL, slug VARCHAR(100) NOT NULL, directory VARCHAR(30) NOT NULL, sub_title VARCHAR(50) NOT NULL, image_name VARCHAR(30) DEFAULT NULL, INDEX IDX_24248BB27B6461 (manga_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE slider_manga_slide (id INT AUTO_INCREMENT NOT NULL, manga_id INT NOT NULL, position INT NOT NULL, updated_at DATETIME DEFAULT NULL, image_name VARCHAR(30) DEFAULT NULL, UNIQUE INDEX UNIQ_9D7754FE7B6461 (manga_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE slider_manga_slide_translation (id INT AUTO_INCREMENT NOT NULL, object_id INT DEFAULT NULL, locale VARCHAR(8) NOT NULL, field VARCHAR(32) NOT NULL, content LONGTEXT DEFAULT NULL, INDEX IDX_A0405FB5232D562B (object_id), UNIQUE INDEX lookup_unique_idx (locale, object_id, field), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_management_user_settings (id INT AUTO_INCREMENT NOT NULL, subscribed_to_newsletter TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_management_user (id INT AUTO_INCREMENT NOT NULL, settings_id INT NOT NULL, username VARCHAR(180) NOT NULL, username_canonical VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, email_canonical VARCHAR(180) NOT NULL, enabled TINYINT(1) NOT NULL, salt VARCHAR(255) DEFAULT NULL, password VARCHAR(255) NOT NULL, last_login DATETIME DEFAULT NULL, confirmation_token VARCHAR(180) DEFAULT NULL, password_requested_at DATETIME DEFAULT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', pills NUMERIC(10, 2) NOT NULL, pills_bought NUMERIC(10, 2) NOT NULL, updated_at DATETIME DEFAULT NULL, avatar_name VARCHAR(30) DEFAULT NULL, securion_customer_id VARCHAR(255) DEFAULT NULL, birthdate DATE DEFAULT NULL, UNIQUE INDEX UNIQ_BA76DD292FC23A8 (username_canonical), UNIQUE INDEX UNIQ_BA76DD2A0D96FBF (email_canonical), UNIQUE INDEX UNIQ_BA76DD2C05FB297 (confirmation_token), UNIQUE INDEX UNIQ_BA76DD259949888 (settings_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reading_user_page (user_id INT NOT NULL, page_id INT NOT NULL, INDEX IDX_A5BCBE38A76ED395 (user_id), INDEX IDX_A5BCBE38C4663E4 (page_id), PRIMARY KEY(user_id, page_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE commerce_order ADD CONSTRAINT FK_859B545DA76ED395 FOREIGN KEY (user_id) REFERENCES user_management_user (id)');
        $this->addSql('ALTER TABLE commerce_order_detail ADD CONSTRAINT FK_7E790A8E4584665A FOREIGN KEY (product_id) REFERENCES commerce_product (id)');
        $this->addSql('ALTER TABLE commerce_order_detail ADD CONSTRAINT FK_7E790A8E8D9F6D38 FOREIGN KEY (order_id) REFERENCES commerce_order (id)');
        $this->addSql('ALTER TABLE commerce_pill_offer ADD CONSTRAINT FK_1FF761E9BF396750 FOREIGN KEY (id) REFERENCES commerce_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE commerce_product_translation ADD CONSTRAINT FK_584C8A62232D562B FOREIGN KEY (object_id) REFERENCES commerce_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_category_manga ADD CONSTRAINT FK_37A0B55912469DE2 FOREIGN KEY (category_id) REFERENCES reading_category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_category_manga ADD CONSTRAINT FK_37A0B5597B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_category_translation ADD CONSTRAINT FK_37EE61DF232D562B FOREIGN KEY (object_id) REFERENCES reading_category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_manga ADD CONSTRAINT FK_1A6B5D86F675F31B FOREIGN KEY (author_id) REFERENCES reading_author (id)');
        $this->addSql('ALTER TABLE reading_manga ADD CONSTRAINT FK_1A6B5D8640C86FCE FOREIGN KEY (publisher_id) REFERENCES reading_publisher (id)');
        $this->addSql('ALTER TABLE reading_manga ADD CONSTRAINT FK_1A6B5D86BF396750 FOREIGN KEY (id) REFERENCES commerce_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_manga_user ADD CONSTRAINT FK_23D8EA057B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id)');
        $this->addSql('ALTER TABLE reading_manga_user ADD CONSTRAINT FK_23D8EA05A76ED395 FOREIGN KEY (user_id) REFERENCES user_management_user (id)');
        $this->addSql('ALTER TABLE reading_manga_user ADD CONSTRAINT FK_23D8EA0592741D25 FOREIGN KEY (bookmark_id) REFERENCES reading_page (id)');
        $this->addSql('ALTER TABLE reading_page ADD CONSTRAINT FK_235CDE747B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id)');
        $this->addSql('ALTER TABLE reading_page ADD CONSTRAINT FK_235CDE748FD80EEA FOREIGN KEY (volume_id) REFERENCES reading_volume (id)');
        $this->addSql('ALTER TABLE reading_page ADD CONSTRAINT FK_235CDE74BF396750 FOREIGN KEY (id) REFERENCES commerce_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_volume ADD CONSTRAINT FK_24248BB27B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id)');
        $this->addSql('ALTER TABLE reading_volume ADD CONSTRAINT FK_24248BB2BF396750 FOREIGN KEY (id) REFERENCES commerce_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE slider_manga_slide ADD CONSTRAINT FK_9D7754FE7B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id)');
        $this->addSql('ALTER TABLE slider_manga_slide_translation ADD CONSTRAINT FK_A0405FB5232D562B FOREIGN KEY (object_id) REFERENCES slider_manga_slide (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_management_user ADD CONSTRAINT FK_BA76DD259949888 FOREIGN KEY (settings_id) REFERENCES user_management_user_settings (id)');
        $this->addSql('ALTER TABLE reading_user_page ADD CONSTRAINT FK_A5BCBE38A76ED395 FOREIGN KEY (user_id) REFERENCES user_management_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reading_user_page ADD CONSTRAINT FK_A5BCBE38C4663E4 FOREIGN KEY (page_id) REFERENCES reading_page (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE commerce_order_detail DROP FOREIGN KEY FK_7E790A8E8D9F6D38');
        $this->addSql('ALTER TABLE commerce_order_detail DROP FOREIGN KEY FK_7E790A8E4584665A');
        $this->addSql('ALTER TABLE commerce_pill_offer DROP FOREIGN KEY FK_1FF761E9BF396750');
        $this->addSql('ALTER TABLE commerce_product_translation DROP FOREIGN KEY FK_584C8A62232D562B');
        $this->addSql('ALTER TABLE reading_manga DROP FOREIGN KEY FK_1A6B5D86BF396750');
        $this->addSql('ALTER TABLE reading_page DROP FOREIGN KEY FK_235CDE74BF396750');
        $this->addSql('ALTER TABLE reading_volume DROP FOREIGN KEY FK_24248BB2BF396750');
        $this->addSql('ALTER TABLE reading_manga DROP FOREIGN KEY FK_1A6B5D86F675F31B');
        $this->addSql('ALTER TABLE reading_category_manga DROP FOREIGN KEY FK_37A0B55912469DE2');
        $this->addSql('ALTER TABLE reading_category_translation DROP FOREIGN KEY FK_37EE61DF232D562B');
        $this->addSql('ALTER TABLE reading_category_manga DROP FOREIGN KEY FK_37A0B5597B6461');
        $this->addSql('ALTER TABLE reading_manga_user DROP FOREIGN KEY FK_23D8EA057B6461');
        $this->addSql('ALTER TABLE reading_page DROP FOREIGN KEY FK_235CDE747B6461');
        $this->addSql('ALTER TABLE reading_volume DROP FOREIGN KEY FK_24248BB27B6461');
        $this->addSql('ALTER TABLE slider_manga_slide DROP FOREIGN KEY FK_9D7754FE7B6461');
        $this->addSql('ALTER TABLE reading_manga_user DROP FOREIGN KEY FK_23D8EA0592741D25');
        $this->addSql('ALTER TABLE reading_user_page DROP FOREIGN KEY FK_A5BCBE38C4663E4');
        $this->addSql('ALTER TABLE reading_manga DROP FOREIGN KEY FK_1A6B5D8640C86FCE');
        $this->addSql('ALTER TABLE reading_page DROP FOREIGN KEY FK_235CDE748FD80EEA');
        $this->addSql('ALTER TABLE slider_manga_slide_translation DROP FOREIGN KEY FK_A0405FB5232D562B');
        $this->addSql('ALTER TABLE user_management_user DROP FOREIGN KEY FK_BA76DD259949888');
        $this->addSql('ALTER TABLE commerce_order DROP FOREIGN KEY FK_859B545DA76ED395');
        $this->addSql('ALTER TABLE reading_manga_user DROP FOREIGN KEY FK_23D8EA05A76ED395');
        $this->addSql('ALTER TABLE reading_user_page DROP FOREIGN KEY FK_A5BCBE38A76ED395');
        $this->addSql('DROP TABLE commerce_order');
        $this->addSql('DROP TABLE commerce_order_detail');
        $this->addSql('DROP TABLE commerce_product');
        $this->addSql('DROP TABLE commerce_pill_offer');
        $this->addSql('DROP TABLE commerce_product_translation');
        $this->addSql('DROP TABLE reading_author');
        $this->addSql('DROP TABLE reading_category');
        $this->addSql('DROP TABLE reading_category_manga');
        $this->addSql('DROP TABLE reading_category_translation');
        $this->addSql('DROP TABLE reading_manga');
        $this->addSql('DROP TABLE reading_manga_user');
        $this->addSql('DROP TABLE reading_page');
        $this->addSql('DROP TABLE reading_publisher');
        $this->addSql('DROP TABLE reading_volume');
        $this->addSql('DROP TABLE slider_manga_slide');
        $this->addSql('DROP TABLE slider_manga_slide_translation');
        $this->addSql('DROP TABLE user_management_user_settings');
        $this->addSql('DROP TABLE user_management_user');
        $this->addSql('DROP TABLE reading_user_page');
    }
}
