<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoryModel extends Model
{
    protected $table         = 'categories';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['name', 'slug'];

    protected $useTimestamps = false;

    protected $validationRules = [
        'name' => 'required|max_length[100]',
        'slug' => 'required|max_length[100]|is_unique[categories.slug,id,{id}]',
    ];

    public function getAllWithCount(): array
    {
        $db = db_connect();
        return $db->table('categories c')
            ->select('c.id, c.name, c.slug, COUNT(pc.post_id) as post_count')
            ->join('post_categories pc', 'pc.category_id = c.id', 'left')
            ->groupBy('c.id')
            ->orderBy('c.name', 'ASC')
            ->get()
            ->getResultArray();
    }
}
