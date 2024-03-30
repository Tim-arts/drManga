<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181212101525 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE slider_manga_slide DROP FOREIGN KEY FK_9D7754FE7B6461');
        $this->addSql('DROP INDEX UNIQ_9D7754FE7B6461 ON slider_manga_slide');
        $this->addSql('ALTER TABLE slider_manga_slide ADD url VARCHAR(255) NOT NULL, DROP manga_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE slider_manga_slide ADD manga_id INT NOT NULL, DROP url');
        $this->addSql('ALTER TABLE slider_manga_slide ADD CONSTRAINT FK_9D7754FE7B6461 FOREIGN KEY (manga_id) REFERENCES reading_manga (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9D7754FE7B6461 ON slider_manga_slide (manga_id)');
    }
}
