<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => 'sometimes|string|max:255',
            'category'     => 'sometimes|in:feature,bug,improvement,other',
            'description'  => 'sometimes|string',
            'status'       => 'sometimes|in:new,in_progress,done,cancelled',
            'assignee_id'  => 'sometimes|nullable|exists:users,id',
        ];
    }
}
