<?php

use App\Models\Timesheet;
use App\Services\TimesheetEventDispatcher;

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
                    'do' => [
                        TimesheetEventDispatcher::class,
                        'dispatchCompletedEvent'
                    ],
                ],
            ],
        ],
    ],
];
