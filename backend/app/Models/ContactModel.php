<?php

namespace App\Models;

use CodeIgniter\Model;

class ContactModel extends Model
{
    protected $table         = 'contact_messages';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'name', 'email', 'subject', 'message',
        'ip_address', 'read_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'name'    => 'required|max_length[255]',
        'email'   => 'required|valid_email',
        'subject' => 'required|max_length[255]',
        'message' => 'required|min_length[10]',
    ];

    public function markRead(int $id): bool
    {
        return $this->update($id, ['read_at' => date('Y-m-d H:i:s')]);
    }

    public function getUnread(): array
    {
        return $this->where('read_at', null)->orderBy('created_at', 'DESC')->findAll();
    }
}
