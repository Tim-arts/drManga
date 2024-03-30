<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181209003332 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE commerce_order ADD updated_at DATETIME DEFAULT NULL, ADD confirmed_at DATETIME DEFAULT NULL, ADD locale VARCHAR(2) DEFAULT NULL');
        $this->addSql('ALTER TABLE reading_manga ADD sub_title VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE user_management_user ADD locked TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE user_management_user_settings ADD email_checked TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE commerce_order DROP updated_at, DROP confirmed_at, DROP locale');
        $this->addSql('ALTER TABLE reading_manga DROP sub_title');
        $this->addSql('ALTER TABLE user_management_user DROP locked');
        $this->addSql('ALTER TABLE user_management_user_settings DROP email_checked');
    }
}
