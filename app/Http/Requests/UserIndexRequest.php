<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['sometimes', 'string', 'max:100'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $q = $this->query('q');
        $this->merge([
            'q' => is_string($q) ? trim($q) : $q,
        ]);
    }

    /** Convenience accessor */
    public function q(): string
    {
        return (string) ($this->validated()['q'] ?? '');
    }
}
