<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateChatLogs extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id'         => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'created_at' => ['type' => 'DATETIME'], // UTC
            'session_id' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true],
            'ip'         => ['type' => 'VARCHAR', 'constraint' => 45],
            'country'    => ['type' => 'CHAR', 'constraint' => 2, 'null' => true], // ISO 3166-1 alpha-2
            'site'       => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
            'page'       => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'user_agent' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'message'    => ['type' => 'TEXT'],
            'reply'      => ['type' => 'TEXT', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addKey('created_at');
        $this->forge->addKey('ip');
        $this->forge->addKey('country');
        $this->forge->addKey('session_id');
        $this->forge->createTable('chat_logs', true, ['ENGINE' => 'InnoDB']);
    }

    public function down(): void
    {
        $this->forge->dropTable('chat_logs', true);
    }
}
