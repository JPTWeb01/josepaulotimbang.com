<?php

namespace App\Models;

use CodeIgniter\Model;

class ExperienceModel extends Model
{
    protected $table         = 'experiences';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'company', 'role', 'employment_type',
        'start_date', 'end_date', 'current',
        'description', 'tech_used', 'sort_order',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'company'    => 'required|max_length[255]',
        'role'       => 'required|max_length[255]',
        'start_date' => 'required',
    ];

    protected $casts = [
        'current' => 'boolean',
    ];

    public function getAll(): array
    {
        return $this->orderBy('current', 'DESC')
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }
}
