<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about:finsight', function (): void {
    $this->info('FinSight AI backend API');
});
