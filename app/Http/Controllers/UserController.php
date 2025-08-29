<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserIndexRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(UserIndexRequest $req): JsonResponse
    {
        $q = $req->q();
        $users = User::query()
            ->when($q !== '', fn ($qq) =>
                $qq->where(function ($w) use ($q) {
                    $w->where('username','like',$q.'%')
                      ->orWhere('name','like',$q.'%')
                      ->orWhere('email','like',$q.'%');
                })
            )
            ->limit(10)
            ->get(['id','username','name','email']);
    
        return response()->json($users, 200);
    }
}
