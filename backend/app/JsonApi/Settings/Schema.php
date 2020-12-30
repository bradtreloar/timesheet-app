<?php

namespace App\JsonApi\Settings;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{

    /**
     * @var string
     */
    protected $resourceType = 'settings';

    /**
     * @param \App\Models\Setting $resource
     *      the domain record being serialized.
     * @return string
     */
    public function getId($resource)
    {
        return (string) $resource->getRouteKey();
    }

    /**
     * @param \App\Models\Setting $resource
     *      the domain record being serialized.
     * @return array
     */
    public function getAttributes($resource)
    {
        return [
            'created-at' => $resource->created_at->toISO8601String(),
            'updated-at' => $resource->updated_at->toISO8601String(),
            'name' => $resource->name,
            'value' => $resource->value,
        ];
    }
}
