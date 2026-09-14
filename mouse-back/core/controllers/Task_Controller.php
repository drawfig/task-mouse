<?php
namespace controllers;

class Task_Controller {
    public $REQUEST_DATA;
    public $RESP;
    public $DB;

    public function __construct($db, $sqlite, $request_data) {
        $this->REQUEST_DATA = $request_data;
        $this->DB = $db;
        if($db !== 1) {
            $this->RESP = new \utils\Response_Handler();
        }
    }

    public function add_task() {
        $data = $this->REQUEST_DATA["data"];
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->add_task($this->DB, $data['title'], $data['priority'], $data['rank'], $this->REQUEST_DATA['user_id']);

        if($resp) {
            $this->RESP->send(
                ["id" => $resp],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"]
            );
        }
        else {
            $this->RESP->send(
                ["response" => "Error adding task."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
                false
            );
        }
    }

    public function get_tasks() {
        $data = $this->REQUEST_DATA["data"];
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->get_tasks($this->DB, $this->REQUEST_DATA['user_id']);

        if($resp) {
            $this->RESP->send(
                $resp,
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"]
            );
        }
        else {
            $this->RESP->send(
                ["response" => "Error getting tasks."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
                false
            );
        }
    }

    public function update_task_ranks() {
        $data = $this->REQUEST_DATA["data"];
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->update_ranks($this->DB, $data['tasks']);

        if($resp) {
            $this->RESP->send(
                ["response" => "Ranks updated successfully."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
            );
        }
        else {
            $this->RESP->send(
                ["response" => "Error updating ranks."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
                false
            );
        }
    }

    public function update_task_status() {
        $data = $this->REQUEST_DATA["data"];
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->update_task_status($this->DB, $data['task_id'], $data['status'], $data['rank']);

        if($resp) {
            $this->RESP->send(
                ["response" => "Task status updated successfully."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"]
            );
        }
        else {
            $this->RESP->send(
                ["response" => "Error updating task status."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
                false
            );
        }
    }

    public function delete_task() {
        $data = $this->REQUEST_DATA["data"];
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->delete_task($this->DB, $data['task_id']);

        if($resp) {
            $this->RESP->send(
                ["response" => "Task deleted successfully."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
            );
        }
        else {
            $this->RESP->send(
                ["response" => "Error deleting task."],
                "Generic",
                $this->REQUEST_DATA['request_tag'],
                $user_data["key"],
                false
            );
        }
    }

    public function get_task_stats() {
        $model = new \models\Task_Model();
        $user_data = $this->REQUEST_DATA['middleware_data']['Authenticate'];

        $resp = $model->get_task_stats($this->DB, $this->REQUEST_DATA['user_id']);

        if(!$resp) {
            $this->RESP->send(["response" => "Error getting task stats."], "Generic", $this->REQUEST_DATA['request_tag'], $user_data["key"], false);
            die();
        }

        $total = sizeof($resp);
        $completed = 0;
        $active = 0;

        foreach($resp as $task) {
            if($task['status'] == "completed") {
                $completed++;
            }
            else {
                $active++;
            }
        }

        $this->RESP->send(
            [
                "total" => $total,
                "completed" => $completed,
                "active" => $active
            ],
            "Generic",
            $this->REQUEST_DATA['request_tag'],
            $user_data["key"],
        );
    }
}