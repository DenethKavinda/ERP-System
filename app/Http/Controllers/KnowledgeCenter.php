<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KnowledgeCenter extends Controller
{
    public function viewKnowledgeCenter()
    {
        return inertia('Users/KnowledgeCenter');
    }
}
