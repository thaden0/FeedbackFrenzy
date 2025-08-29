<?php

namespace Tests\Unit;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedbackModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function feedback_has_default_status_of_new()
    {
        $feedback = Feedback::factory()->create();

        $this->assertEquals('new', $feedback->status);
    }

    /** @test */
    public function feedback_can_have_status_updated()
    {
        $feedback = Feedback::factory()->create(['status' => 'in_progress']);

        $this->assertEquals('in_progress', $feedback->status);
    }

    /** @test */
    public function feedback_can_be_assigned_to_user()
    {
        $assignee = User::factory()->create();
        $feedback = Feedback::factory()->create(['assignee_id' => $assignee->id]);

        $this->assertEquals($assignee->id, $feedback->assignee_id);
        $this->assertTrue($feedback->assignee->is($assignee));
    }

    /** @test */
    public function feedback_assignee_relationship_works()
    {
        $assignee = User::factory()->create();
        $feedback = Feedback::factory()->create(['assignee_id' => $assignee->id]);

        $this->assertInstanceOf(User::class, $feedback->assignee);
        $this->assertEquals($assignee->id, $feedback->assignee->id);
    }

    /** @test */
    public function user_can_have_assigned_feedback()
    {
        $assignee = User::factory()->create();
        $feedback = Feedback::factory()->create(['assignee_id' => $assignee->id]);

        $this->assertTrue($assignee->assignedFeedback->contains($feedback));
    }

    /** @test */
    public function feedback_without_assignee_has_null_assignee()
    {
        $feedback = Feedback::factory()->create(['assignee_id' => null]);

        $this->assertNull($feedback->assignee);
        $this->assertNull($feedback->assignee_id);
    }

    /** @test */
    public function status_can_be_up_to_30_characters()
    {
        $longStatus = str_repeat('a', 30);
        $feedback = Feedback::factory()->create(['status' => $longStatus]);

        $this->assertEquals($longStatus, $feedback->status);
    }
} 