<?php

namespace App\Models;

use CodeIgniter\Model;

class SkillModel extends Model
{
    protected $table         = 'skills';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'name', 'category', 'level', 'sort_order',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'name'     => 'required|max_length[100]',
        'category' => 'required|max_length[100]',
        'level'    => 'required|integer|greater_than[0]|less_than_equal_to[100]',
    ];

    public function getGrouped(): array
    {
        $skills = $this->orderBy('category', 'ASC')->orderBy('sort_order', 'ASC')->findAll();

        $grouped = [];
        foreach ($skills as $skill) {
            $grouped[$skill['category']][] = $skill;
        }

        return $grouped;
    }
}
