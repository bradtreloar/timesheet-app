<?php

namespace App\Services;

use App\Models\Timesheet;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;

class TimesheetPDF
{
    /**
     * Creates the timesheet PDF if it doesn't exist, and returns the filename.
     */
    public static function create($timesheet)
    {
        $filename = "timesheet_{$timesheet->created_at->getTimestamp()}_{$timesheet->user->snakecase_name}.pdf";
        $storage = Storage::disk('temporary');

        if ($storage->missing($filename)) {
            $dompdf = new Dompdf();
            $dompdf->loadHtml(view('pdf.timesheet', [
                'timesheet' => $timesheet,
            ]));
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            $storage->put($filename, $dompdf->output());
        }

        return $storage->path($filename);
    }
}
