<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Machine-to-machine auth for the chatbot (chat logs) and the job finder
 * (job matches): they send the shared INGEST_KEY in the X-Ingest-Key header.
 */
class IngestKeyFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $expected = (string) env('INGEST_KEY', '');
        $given    = $request->getHeaderLine('X-Ingest-Key');

        if (strlen($expected) < 32 || ! hash_equals($expected, $given)) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Unauthorized'])
                ->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
