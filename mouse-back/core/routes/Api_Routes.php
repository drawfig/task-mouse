<?php
namespace routes;

class Api_Routes {
    public $ROUTES = [
        '/create_task' => ['class' => 'Task_Controller', 'method' => 'add_task', 'type' => 'POST'],
        '/get_tasks' => ['class' => 'Task_Controller', 'method' => 'get_tasks', 'type' => 'POST'],
        '/update_ranks' => ['class' => 'Task_Controller', 'method' => 'update_task_ranks', 'type' => 'POST'],
        '/update_status' => ['class' => 'Task_Controller', 'method' => 'update_task_status', 'type' => 'POST'],
        '/delete_task' => ['class' => 'Task_Controller', 'method' => 'delete_task', 'type' => 'POST'],
        '/create_user' => ['class' => 'User_Controller', 'method' => 'create_user', 'type' => 'POST'],
        '/login' => ['class' => 'User_Controller', 'method' => 'login_user', 'type' => 'POST'],
        '/logout' => ['class' => 'User_Controller', 'method' => 'logout_user', 'type' => 'POST'],
        '/refresh' => ['class' => 'User_Controller', 'method' => 'refresh_session', 'type' => 'POST'],
        '/reload' => ['class' => 'User_Controller', 'method' => 'kli_handshake', 'type' => 'POST'],
        '/get_stats' => ['class' => 'Task_Controller', 'method' => 'get_task_stats', 'type' => 'POST'],
        
    ];
}