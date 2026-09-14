<?php
namespace models;

class Task_Model {
    public function add_task($db, $title, $priority, $rank, $user_id) {
        $date = floor(microtime(true) * 1000);
        $query = "INSERT INTO tasks (title, priority, rank, date, status, user_id) VALUES (:title, :priority, :rank, :date, :status, :user_id)";

        $params = [
            [
                "name" => ":title",
                "value" => $title,
                "type" => "s"
            ],
            [
                "name" => ":priority",
                "value" => $priority,
                "type" => "s"
            ],
            [
                "name" => ":rank",
                "value" => $rank,
                "type" => "i"
            ],
            [
                "name" => ":date",
                "value" => $date,
                "type" => "i"
            ],
            [
                "name" => ":status",
                "value" => "active",
                "type" => "s"
            ],
            [
                "name" => ":user_id",
                "value" => $user_id,
                "type" => "i"
            ]
        ];

        try {
            return $db->make_query("insert", $query, $params);
        }
        catch(\Exception $e) {
            return false;
        }
    }

    public function get_tasks($db, $user_id) {
        $query = "SELECT * FROM tasks WHERE user_id = :user_id";
        $params = [
            [
                "name" => ":user_id",
                "value" => $user_id,
                "type" => "i"
            ]
        ];

        try {
            return $db->make_query("select", $query, $params);
        }
        catch(\Exception $e) {
            return false;
        }
    }

    public function update_ranks($db, $data) {
        $ids_fill = [];
        $query = "UPDATE tasks SET rank = CASE id";
        $index = 1;
        $params = [];

        foreach($data as $key => $value) {
            $ids_fill[] = ":id{$index}";
            $query .= " WHEN :id{$index} THEN :rank{$index}";

            $params[] = [
                "name" => ":id{$index}",
                "value" => $key,
                "type" => "i"
            ];
            $params[] = [
                "name" => ":rank{$index}",
                "value" => $value,
                "type" => "i"
            ];
            $index++;
        }

        $query .= " END WHERE id IN (" . implode(', ', $ids_fill) .")";

        try {
            return $db->make_query("update", $query, $params);
        }
        catch(\Exception $e) {
            return false;
        }
    }

    public function update_task_status($db, $task_id, $status, $rank) {
        $query = "UPDATE tasks SET status = :status, rank = :rank WHERE id = :id";
        $params = [
            [
                "name" => ":status",
                "value" => $status,
                "type" => "s"
            ],
            [
                "name" => ":rank",
                "value" => $rank,
                "type" => "i"
            ],
            [
                "name" => ":id",
                "value" => $task_id,
                "type" => "i"
            ]
        ];

        try {
            return $db->make_query("update", $query, $params);
        }
        catch(\Exception $e) {
            return false;
        }
    }

    public function delete_task($db, $task_id) {
        $query = "DELETE FROM tasks WHERE id = :id";
        $params = [
            [
                "name" => ":id",
                "value" => $task_id,
                "type" => "i"
            ]
        ];

        try {
            $db->make_query("delete", $query, $params);
            return true;
        }
        catch(\Exception $e) {
            return false;
        }
    }

    public function get_task_stats($db, $user_id) {
        $query = "SELECT status FROM tasks WHERE user_id = :user_id";

        $params = [
            [
                "name" => ":user_id",
                "value" => $user_id,
                "type" => "i"
            ]
        ];

        try {
            return $db->make_query("select", $query, $params);
        }
        catch(\Exception $e) {
            return false;
        }
    }
}