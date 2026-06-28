<?php

namespace App\Models;

use CodeIgniter\Model;

class ProjectModel extends Model
{
    protected $table         = 'projects';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = [
        'title', 'slug', 'description', 'long_description',
        'tech_stack', 'category', 'status',
        'live_url', 'github_url', 'image_url',
        'featured', 'sort_order',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $validationRules = [
        'title'       => 'required|max_length[255]',
        'slug'        => 'required|max_length[255]|is_unique[projects.slug,id,{id}]',
        'description' => 'required',
        'status'      => 'required|in_list[active,completed,archived]',
    ];

    public function getFeatured(): array
    {
        return $this->where('featured', 1)
                    ->orderBy('sort_order', 'ASC')
                    ->findAll();
    }

    public function getBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first();
    }

    public function getPublished(int $page = 1, int $perPage = 12): array
    {
        $offset = ($page - 1) * $perPage;
        $total  = $this->countAll();
        $items  = $this->orderBy('sort_order', 'ASC')->findAll($perPage, $offset);
        return compact('items', 'total');
    }
}
