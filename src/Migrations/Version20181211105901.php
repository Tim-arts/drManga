<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181211105901 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reading_publisher ADD account_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE reading_publisher ADD CONSTRAINT FK_57DF91979B6B5FBA FOREIGN KEY (account_id) REFERENCES user_management_user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_57DF91979B6B5FBA ON reading_publisher (account_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE reading_publisher DROP FOREIGN KEY FK_57DF91979B6B5FBA');
        $this->addSql('DROP INDEX UNIQ_57DF91979B6B5FBA ON reading_publisher');
        $this->addSql('ALTER TABLE reading_publisher DROP account_id');
    }
}
