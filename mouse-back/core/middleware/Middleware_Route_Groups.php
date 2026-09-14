<?php
namespace middleware;

class Middleware_Route_Groups {
    public $GROUPS = [
        "secure_routes" => [
            "/example_route",
            "/api/logout",
            "/api/get_stats",
            "/api/create_task",
            "/api/get_tasks",
            "/api/update_ranks",
            "/api/update_status",
            "/api/delete_task"
        ],
    ];

    public $GLOBAL_BYPASS_ROUTES = [
        "/example_route"
    ];
}