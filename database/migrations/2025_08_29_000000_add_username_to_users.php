<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $t) {
            $t->string('username')->nullable()->after('name');
        });

        DB::transaction(function () {
            foreach (DB::table('users')->select('id','name')->cursor() as $u) {
                $base = Str::slug((string)$u->name, '_') ?: "user{$u->id}";
                $h = $base; $i = 1;
                while (DB::table('users')->where('username',$h)->exists()) $h = $base.$i++;
                DB::table('users')->where('id',$u->id)->update(['username'=>strtolower($h)]);
            }
        });

        Schema::table('users', fn (Blueprint $t) => $t->unique('username'));
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $t) {
            $t->dropUnique(['username']);
            $t->dropColumn('username');
        });
    }
};
