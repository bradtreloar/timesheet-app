<?php

use App\Events\TimesheetCompleted;
use App\Models\Timesheet;
use Illuminate\Support\Facades\Event;
use Sebdesign\SM\Event\TransitionEvent;

return [
    'timesheetState' => [
        'class' => App\Models\Timesheet::class,
        'property_path' => 'state',
        'metadata' => [
            'title' => 'Timesheet State',
        ],
        'states' => [
            Timesheet::STATE_DRAFT,
            Timesheet::STATE_COMPLETED,
        ],
        'transitions' => [
            'complete' => [
                'from' => [Timesheet::STATE_DRAFT],
                'to' => Timesheet::STATE_COMPLETED,
            ],
        ],
        'callbacks' => [
            'after' => [
                'on_complete' => [
                    'on' => 'complete',
                    'do' => function (TransitionEvent $transitionEvent) {
                        /**
                         * @var App\Models\Timesheet $timesheet
                         */
                        $timesheet = $transitionEvent->getStateMachine()->getObject();
                        $event = new TimesheetCompleted($timesheet);
                        Event::dispatch($event);
                    }
                ],
            ],
        ],
    ],
];
