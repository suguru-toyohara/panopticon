/**
 * progress/types/commands.ts
 *
 * 目的：
 * イベントソーシングパターンにおけるコマンド型定義を提供します。
 * システムの状態を変更するリクエストを表すコマンドの型を定義し、
 * 意図的な状態変更を明示的に表現します。
 *
 * 主な型定義：
 * - コマンド基本型（Command）
 * - 各種コマンド型（ProjectCommand, MilestoneCommand, TaskCommand）
 * - コマンド種別（CommandType）
 *
 * TODO: 300行以上になってるので分割が必要。
 */

import { Status, TaskPriority } from "./models.ts";

/**
 * コマンド種別の列挙型
 */
export enum CommandType {
  // プロジェクト関連コマンド
  CREATE_PROJECT = "create_project",
  UPDATE_PROJECT = "update_project",
  DELETE_PROJECT = "delete_project",
  CHANGE_PROJECT_STATUS = "change_project_status",

  // マイルストーン関連コマンド
  CREATE_MILESTONE = "create_milestone",
  UPDATE_MILESTONE = "update_milestone",
  DELETE_MILESTONE = "delete_milestone",
  CHANGE_MILESTONE_STATUS = "change_milestone_status",
  ADD_MILESTONE_TO_PROJECT = "add_milestone_to_project",
  REMOVE_MILESTONE_FROM_PROJECT = "remove_milestone_from_project",
  ADD_MILESTONE_DEPENDENCY = "add_milestone_dependency",
  REMOVE_MILESTONE_DEPENDENCY = "remove_milestone_dependency",

  // タスク関連コマンド
  CREATE_TASK = "create_task",
  UPDATE_TASK = "update_task",
  DELETE_TASK = "delete_task",
  CHANGE_TASK_STATUS = "change_task_status",
  ADD_TASK_TO_MILESTONE = "add_task_to_milestone",
  REMOVE_TASK_FROM_MILESTONE = "remove_task_from_milestone",
  ADD_TASK_DEPENDENCY = "add_task_dependency",
  REMOVE_TASK_DEPENDENCY = "remove_task_dependency",
  START_TASK = "start_task",
  COMPLETE_TASK = "complete_task",
  BLOCK_TASK = "block_task",
  UNBLOCK_TASK = "unblock_task",
  LOG_TASK_TIME = "log_task_time",
}

/**
 * コマンド基本型
 */
export interface Command {
  id: string; // コマンドID（一意）
  type: CommandType; // コマンド種別
  timestamp: string; // コマンド発行時刻（ISO形式の日付文字列）
}

/**
 * プロジェクト作成コマンド
 */
export interface CreateProjectCommand extends Command {
  type: CommandType.CREATE_PROJECT;
  payload: {
    title: string;
    description?: string;
  };
}

/**
 * プロジェクト更新コマンド
 */
export interface UpdateProjectCommand extends Command {
  type: CommandType.UPDATE_PROJECT;
  payload: {
    projectId: string;
    title?: string;
    description?: string;
  };
}

/**
 * プロジェクト削除コマンド
 */
export interface DeleteProjectCommand extends Command {
  type: CommandType.DELETE_PROJECT;
  payload: {
    projectId: string;
  };
}

/**
 * プロジェクト状態変更コマンド
 */
export interface ChangeProjectStatusCommand extends Command {
  type: CommandType.CHANGE_PROJECT_STATUS;
  payload: {
    projectId: string;
    newStatus: Status;
  };
}

/**
 * マイルストーン作成コマンド
 */
export interface CreateMilestoneCommand extends Command {
  type: CommandType.CREATE_MILESTONE;
  payload: {
    title: string;
    description?: string;
    dueDate?: string;
  };
}

/**
 * マイルストーン更新コマンド
 */
export interface UpdateMilestoneCommand extends Command {
  type: CommandType.UPDATE_MILESTONE;
  payload: {
    milestoneId: string;
    title?: string;
    description?: string;
    dueDate?: string;
  };
}

/**
 * マイルストーン削除コマンド
 */
export interface DeleteMilestoneCommand extends Command {
  type: CommandType.DELETE_MILESTONE;
  payload: {
    milestoneId: string;
  };
}

/**
 * マイルストーン状態変更コマンド
 */
export interface ChangeMilestoneStatusCommand extends Command {
  type: CommandType.CHANGE_MILESTONE_STATUS;
  payload: {
    milestoneId: string;
    newStatus: Status;
  };
}

/**
 * マイルストーンをプロジェクトに追加コマンド
 */
export interface AddMilestoneToProjectCommand extends Command {
  type: CommandType.ADD_MILESTONE_TO_PROJECT;
  payload: {
    projectId: string;
    milestoneId: string;
  };
}

/**
 * マイルストーンをプロジェクトから削除コマンド
 */
export interface RemoveMilestoneFromProjectCommand extends Command {
  type: CommandType.REMOVE_MILESTONE_FROM_PROJECT;
  payload: {
    projectId: string;
    milestoneId: string;
  };
}

/**
 * マイルストーン依存関係追加コマンド
 */
export interface AddMilestoneDependencyCommand extends Command {
  type: CommandType.ADD_MILESTONE_DEPENDENCY;
  payload: {
    milestoneId: string;
    dependsOnMilestoneId: string;
  };
}

/**
 * マイルストーン依存関係削除コマンド
 */
export interface RemoveMilestoneDependencyCommand extends Command {
  type: CommandType.REMOVE_MILESTONE_DEPENDENCY;
  payload: {
    milestoneId: string;
    dependsOnMilestoneId: string;
  };
}

/**
 * タスク作成コマンド
 */
export interface CreateTaskCommand extends Command {
  type: CommandType.CREATE_TASK;
  payload: {
    title: string;
    description?: string;
    estimatedPoints: number;
    priority: TaskPriority;
    tags?: string[];
  };
}

/**
 * タスク更新コマンド
 */
export interface UpdateTaskCommand extends Command {
  type: CommandType.UPDATE_TASK;
  payload: {
    taskId: string;
    title?: string;
    description?: string;
    estimatedPoints?: number;
    priority?: TaskPriority;
    tags?: string[];
  };
}

/**
 * タスク削除コマンド
 */
export interface DeleteTaskCommand extends Command {
  type: CommandType.DELETE_TASK;
  payload: {
    taskId: string;
  };
}

/**
 * タスク状態変更コマンド
 */
export interface ChangeTaskStatusCommand extends Command {
  type: CommandType.CHANGE_TASK_STATUS;
  payload: {
    taskId: string;
    newStatus: Status;
  };
}

/**
 * タスクをマイルストーンに追加コマンド
 */
export interface AddTaskToMilestoneCommand extends Command {
  type: CommandType.ADD_TASK_TO_MILESTONE;
  payload: {
    milestoneId: string;
    taskId: string;
  };
}

/**
 * タスクをマイルストーンから削除コマンド
 */
export interface RemoveTaskFromMilestoneCommand extends Command {
  type: CommandType.REMOVE_TASK_FROM_MILESTONE;
  payload: {
    milestoneId: string;
    taskId: string;
  };
}

/**
 * タスク依存関係追加コマンド
 */
export interface AddTaskDependencyCommand extends Command {
  type: CommandType.ADD_TASK_DEPENDENCY;
  payload: {
    taskId: string;
    dependsOnTaskId: string;
  };
}

/**
 * タスク依存関係削除コマンド
 */
export interface RemoveTaskDependencyCommand extends Command {
  type: CommandType.REMOVE_TASK_DEPENDENCY;
  payload: {
    taskId: string;
    dependsOnTaskId: string;
  };
}

/**
 * タスク開始コマンド
 */
export interface StartTaskCommand extends Command {
  type: CommandType.START_TASK;
  payload: {
    taskId: string;
  };
}

/**
 * タスク完了コマンド
 */
export interface CompleteTaskCommand extends Command {
  type: CommandType.COMPLETE_TASK;
  payload: {
    taskId: string;
    elapsedTimeMinute?: number;
  };
}

/**
 * タスクブロックコマンド
 */
export interface BlockTaskCommand extends Command {
  type: CommandType.BLOCK_TASK;
  payload: {
    taskId: string;
    reason: string;
  };
}

/**
 * タスクブロック解除コマンド
 */
export interface UnblockTaskCommand extends Command {
  type: CommandType.UNBLOCK_TASK;
  payload: {
    taskId: string;
  };
}

/**
 * タスク時間記録コマンド
 */
export interface LogTaskTimeCommand extends Command {
  type: CommandType.LOG_TASK_TIME;
  payload: {
    taskId: string;
    timeMinutes: number;
    description?: string;
  };
}

/**
 * プロジェクト関連コマンド型
 */
export type ProjectCommand =
  | CreateProjectCommand
  | UpdateProjectCommand
  | DeleteProjectCommand
  | ChangeProjectStatusCommand;

/**
 * マイルストーン関連コマンド型
 */
export type MilestoneCommand =
  | CreateMilestoneCommand
  | UpdateMilestoneCommand
  | DeleteMilestoneCommand
  | ChangeMilestoneStatusCommand
  | AddMilestoneToProjectCommand
  | RemoveMilestoneFromProjectCommand
  | AddMilestoneDependencyCommand
  | RemoveMilestoneDependencyCommand;

/**
 * タスク関連コマンド型
 */
export type TaskCommand =
  | CreateTaskCommand
  | UpdateTaskCommand
  | DeleteTaskCommand
  | ChangeTaskStatusCommand
  | AddTaskToMilestoneCommand
  | RemoveTaskFromMilestoneCommand
  | AddTaskDependencyCommand
  | RemoveTaskDependencyCommand
  | StartTaskCommand
  | CompleteTaskCommand
  | BlockTaskCommand
  | UnblockTaskCommand
  | LogTaskTimeCommand;

/**
 * 全コマンド型
 */
export type ProgressCommand = ProjectCommand | MilestoneCommand | TaskCommand;
