<?php

namespace App\Models;

use CodeIgniter\Model;

class PostModel extends Model
{
    protected $table         = 'posts';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useSoftDeletes = true;

    protected $allowedFields = [
        'title', 'slug', 'excerpt', 'content',
        'cover_image', 'status', 'featured',
        'read_time', 'view_count',
        'published_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $validationRules = [
        'title'   => 'required|max_length[255]',
        'slug'    => 'required|max_length[255]|is_unique[posts.slug,id,{id}]',
        'content' => 'required',
        'status'  => 'required|in_list[draft,published]',
    ];

    public function getPublished(int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;
        $total  = $this->where('status', 'published')->countAllResults(false);
        $items  = $this->where('status', 'published')
                       ->orderBy('published_at', 'DESC')
                       ->findAll($perPage, $offset);
        return compact('items', 'total');
    }

    public function getBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->where('status', 'published')->first();
    }

    public function getFeatured(int $limit = 3): array
    {
        return $this->where('status', 'published')
                    ->where('featured', 1)
                    ->orderBy('published_at', 'DESC')
                    ->findAll($limit);
    }

    public function incrementViews(int $id): void
    {
        $this->set('view_count', 'view_count + 1', false)
             ->where('id', $id)
             ->update();
    }

    public function getRelated(int $postId, int $limit = 3): array
    {
        // Get categories for the given post then find others in those categories
        $db = db_connect();

        $categoryIds = $db->table('post_categories')
            ->where('post_id', $postId)
            ->get()
            ->getResultArray();

        if (empty($categoryIds)) {
            return $this->where('status', 'published')
                        ->where('id !=', $postId)
                        ->orderBy('published_at', 'DESC')
                        ->findAll($limit);
        }

        $ids = array_column($categoryIds, 'category_id');
        $relatedPostIds = $db->table('post_categories')
            ->whereIn('category_id', $ids)
            ->where('post_id !=', $postId)
            ->distinct()
            ->get()
            ->getResultArray();

        if (empty($relatedPostIds)) {
            return [];
        }

        return $this->whereIn('id', array_column($relatedPostIds, 'post_id'))
                    ->where('status', 'published')
                    ->findAll($limit);
    }
}
