/**
 * progress/manager.ts
 *
 * 目的：
 * 進捗データの管理を担当するモジュールです。
 * プロジェクト、マイルストーン、タスクの作成、更新、削除などの
 * 操作を提供します。
 *
 * 主な機能：
 * - プロジェクト、マイルストーン、タスクの管理
 * - 進捗状況の追跡
 * - 進捗イベントの発行
 */

import { EventEmitter } from "@/core/events.ts";
import { console } from "@/core/logger.ts";
import {
  Milestone,
  ProgressData,
  ProgressEventType,
  Project,
  Status,
  Task,
  TaskPriority,
} from "./types.ts";
import { ProgressStorage } from "./storage.ts";

/**
 * 進捗管理クラス
 */
export class ProgressManager {
  private events: EventEmitter;
  private storage: ProgressStorage;

  constructor(events: EventEmitter, storage: ProgressStorage) {
    this.events = events;
    this.storage = storage;
  }

  /**
   * 進捗管理を初期化
   */
  async initialize(): Promise<void> {
    console.debug("進捗管理を初期化中...");
    // 必要な初期化処理があればここに追加
    console.debug("進捗管理の初期化が完了しました");
  }

  /**
   * 新しいプロジェクトを作成
   * @param title プロジェクト名
   * @param description プロジェクトの説明
   * @returns 作成されたプロジェクト
   *
   * TODO: projectの変更履歴について
   * - 例えばこのデータ型だと、いつ完了したのか、いつ着手したのかわからない。
   * - updateAtを拡張すべきかも。
   */
  createProject(title: string, description?: string): Project {
    const projectId = crypto.randomUUID();
    const now = ProgressStorage.getCurrentISOString();

    const project: Project = {
      projectId,
      projectStatus: Status.NOT_STARTED,
      title,
      description,
      milestones: [],
      createdAt: now,
      updatedAt: now,
    };

    this.storage.addProject(project);
    this.storage.save();

    this.events.emit(ProgressEventType.PROJECT_CREATED, {
      type: ProgressEventType.PROJECT_CREATED,
      project,
    });

    return project;
  }

  /**
   * プロジェクトにマイルストーンを追加
   * @param projectId プロジェクトID
   * @param title マイルストーン名
   * @param description マイルストーンの説明
   * @param dueDate 期限
   * @returns 作成されたマイルストーン
   */
  addMilestone(
    parentProjectId: string,
    title: string,
    description?: string,
    dueDate?: string,
  ): Milestone | null {
    const progressData = this.storage.getProgressData();
    const project = progressData.projects.find((p) =>
      p.projectId === parentProjectId
    );

    if (!project) {
      console.error(`プロジェクトが見つかりません: ${parentProjectId}`);
      return null;
    }

    const milestoneId = crypto.randomUUID();

    const milestone: Milestone = {
      milestoneId,
      milestoneStatus: Status.NOT_STARTED,
      title,
      description,
      dueDate,
      tasks: [],
      dependencyMilestone: [],
    };

    project.milestones.push(milestone);
    project.updatedAt = ProgressStorage.getCurrentISOString();

    this.storage.updateProject(project);
    this.storage.save();

    this.events.emit(ProgressEventType.MILESTONE_CREATED, {
      type: ProgressEventType.MILESTONE_CREATED,
      milestone,
      parentProjectId,
    });

    return milestone;
  }

  /**
   * マイルストーンにタスクを追加
   * @param projectId プロジェクトID
   * @param milestoneId マイルストーンID
   * @param title タスク名
   * @param description タスクの説明
   * @param estimatedPoints 見積もりポイント
   * @param priority タスクの優先度
   * @returns 作成されたタスク
   */
  addTask(
    projectId: string,
    milestoneId: string,
    title: string,
    description?: string,
    estimatedPoints: number = 1,
    priority: TaskPriority = TaskPriority.MUST,
  ): Task | null {
    const progressData = this.storage.getProgressData();
    const project = progressData.projects.find((p) =>
      p.projectId === projectId
    );
    /**
     * FIXME : これ、考慮もれしてて申し訳ないんだけど
     * Array<Milestone>で保存しているから個のmilestoneが変更された時、
     * 親のProjectのmilestoneリストに変更が伝播しないってことよね。
     *
     * 二つの修正方法があって、
     * 1. 参照渡しをしたい
     * 2. Reduxライクに状態管理する
     *
     * どっちかを議論したい。
     */
    if (!project) {
      console.error(`プロジェクトが見つかりません: ${projectId}`);
      return null;
    }

    const milestone = project.milestones.find(
      (m) => m.milestoneId === milestoneId,
    );

    if (!milestone) {
      console.error(`マイルストーンが見つかりません: ${milestoneId}`);
      return null;
    }

    const taskId = crypto.randomUUID();

    const task: Task = {
      taskId,
      title,
      description,
      status: Status.NOT_STARTED,
      priority,
      estimatedPoints,
    };

    milestone.tasks.push(task);
    project.updatedAt = ProgressStorage.getCurrentISOString();

    this.storage.updateProject(project);
    this.storage.save();

    this.events.emit(ProgressEventType.TASK_CREATED, {
      type: ProgressEventType.TASK_CREATED,
      task,
      projectId,
    });

    return task;
  }

  /**
   * タスクの状態を更新
   * @param projectId プロジェクトID
   * @param milestoneId マイルストーンID
   * @param taskId タスクID
   * @param status 新しい状態
   * @returns 更新されたタスク
   */
  updateTaskStatus(
    projectId: string,
    milestoneId: string,
    taskId: string,
    status: Status,
  ): Task | null {
    const progressData = this.storage.getProgressData();
    const project = progressData.projects.find((p) =>
      p.projectId === projectId
    );

    if (!project) {
      console.error(`プロジェクトが見つかりません: ${projectId}`);
      return null;
    }

    const milestone = project.milestones.find(
      (m) => m.milestoneId === milestoneId,
    );

    if (!milestone) {
      console.error(`マイルストーンが見つかりません: ${milestoneId}`);
      return null;
    }

    const task = milestone.tasks.find((t) => t.taskId === taskId);

    if (!task) {
      console.error(`タスクが見つかりません: ${taskId}`);
      return null;
    }

    const oldStatus = task.status;
    task.status = status;

    // タスクが開始された場合は開始時間を記録
    if (oldStatus === Status.NOT_STARTED && status === Status.IN_PROGRESS) {
      task.startTime = ProgressStorage.getCurrentISOString();
    }

    // タスクが完了した場合は終了時間を記録
    if (status === Status.COMPLETED) {
      task.endTime = ProgressStorage.getCurrentISOString();
      // 実際のポイントを記録（現時点では見積もりと同じ）
      task.actualPoints = task.estimatedPoints;
    }

    project.updatedAt = ProgressStorage.getCurrentISOString();

    this.storage.updateProject(project);
    this.storage.save();

    // タスクの状態に応じたイベントを発行
    if (status === Status.IN_PROGRESS) {
      this.events.emit(ProgressEventType.TASK_STARTED, {
        type: ProgressEventType.TASK_STARTED,
        task,
        projectId,
      });
    } else if (status === Status.COMPLETED) {
      this.events.emit(ProgressEventType.TASK_COMPLETED, {
        type: ProgressEventType.TASK_COMPLETED,
        task,
        projectId,
      });
    } else {
      this.events.emit(ProgressEventType.TASK_UPDATED, {
        type: ProgressEventType.TASK_UPDATED,
        task,
        projectId,
      });
    }

    // マイルストーンの状態を更新
    this.updateMilestoneStatus(projectId, milestoneId);

    return task;
  }

  /**
   * マイルストーンの状態を更新
   * @param projectId プロジェクトID
   * @param milestoneId マイルストーンID
   * @returns 更新されたマイルストーン
   */
  private updateMilestoneStatus(
    projectId: string,
    milestoneId: string,
  ): Milestone | null {
    const progressData = this.storage.getProgressData();
    const project = progressData.projects.find((p) =>
      p.projectId === projectId
    );

    if (!project) {
      return null;
    }

    const milestone = project.milestones.find(
      (m) => m.milestoneId === milestoneId,
    );

    if (!milestone) {
      return null;
    }

    // タスクがない場合は未着手
    if (milestone.tasks.length === 0) {
      milestone.milestoneStatus = Status.NOT_STARTED;
      return milestone;
    }

    // すべてのタスクが完了している場合は完了
    if (milestone.tasks.every((t) => t.status === Status.COMPLETED)) {
      milestone.milestoneStatus = Status.COMPLETED;
      milestone.completedDate = ProgressStorage.getCurrentISOString();

      this.events.emit(ProgressEventType.MILESTONE_COMPLETED, {
        type: ProgressEventType.MILESTONE_COMPLETED,
        milestone,
        projectId,
      });
    } // 一部のタスクが進行中の場合は進行中
    else if (milestone.tasks.some((t) => t.status === Status.IN_PROGRESS)) {
      milestone.milestoneStatus = Status.IN_PROGRESS;
    } // 一部のタスクがブロック中の場合はブロック中
    else if (milestone.tasks.some((t) => t.status === Status.BLOCKED)) {
      milestone.milestoneStatus = Status.BLOCKED;
    } // それ以外の場合は未着手
    else {
      milestone.milestoneStatus = Status.NOT_STARTED;
    }

    this.storage.updateProject(project);
    this.storage.save();

    this.events.emit(ProgressEventType.MILESTONE_UPDATED, {
      type: ProgressEventType.MILESTONE_UPDATED,
      milestone,
      projectId,
    });

    // プロジェクトの状態も更新
    this.updateProjectStatus(projectId);

    return milestone;
  }

  /**
   * プロジェクトの状態を更新
   * @param projectId プロジェクトID
   * @returns 更新されたプロジェクト
   */
  private updateProjectStatus(projectId: string): Project | null {
    const progressData = this.storage.getProgressData();
    const project = progressData.projects.find((p) =>
      p.projectId === projectId
    );

    if (!project) {
      return null;
    }

    // マイルストーンがない場合は未着手
    if (project.milestones.length === 0) {
      project.projectStatus = Status.NOT_STARTED;
      return project;
    }

    // すべてのマイルストーンが完了している場合は完了
    if (
      project.milestones.every((m) => m.milestoneStatus === Status.COMPLETED)
    ) {
      project.projectStatus = Status.COMPLETED;
    } // 一部のマイルストーンが進行中の場合は進行中
    else if (
      project.milestones.some((m) => m.milestoneStatus === Status.IN_PROGRESS)
    ) {
      project.projectStatus = Status.IN_PROGRESS;
    } // 一部のマイルストーンがブロック中の場合はブロック中
    else if (
      project.milestones.some((m) => m.milestoneStatus === Status.BLOCKED)
    ) {
      project.projectStatus = Status.BLOCKED;
    } // それ以外の場合は未着手
    else {
      project.projectStatus = Status.NOT_STARTED;
    }

    project.updatedAt = ProgressStorage.getCurrentISOString();
    this.storage.updateProject(project);
    this.storage.save();

    this.events.emit(ProgressEventType.PROJECT_UPDATED, {
      type: ProgressEventType.PROJECT_UPDATED,
      project,
    });

    return project;
  }

  /**
   * 進捗統計を更新
   */
  updateStatistics(): void {
    const progressData = this.storage.getProgressData();
    let totalTasks = 0;
    let completedTasks = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    // プロジェクト、マイルストーン、タスクを走査して統計を計算
    for (const project of progressData.projects) {
      for (const milestone of project.milestones) {
        for (const task of milestone.tasks) {
          totalTasks++;
          totalPoints += task.estimatedPoints;

          if (task.status === Status.COMPLETED) {
            completedTasks++;
            earnedPoints += task.actualPoints || task.estimatedPoints;
          }
        }
      }
    }

    // 統計を更新
    progressData.statistics.totalTasks = totalTasks;
    progressData.statistics.completedTasks = completedTasks;
    progressData.statistics.totalPoints = totalPoints;
    progressData.statistics.earnedPoints = earnedPoints;

    // 平均ポイント/時間の計算（完了したタスクがある場合のみ）
    if (completedTasks > 0) {
      let totalHours = 0;

      for (const project of progressData.projects) {
        for (const milestone of project.milestones) {
          for (const task of milestone.tasks) {
            if (
              task.status === Status.COMPLETED &&
              task.startTime &&
              task.endTime
            ) {
              const startDate = ProgressStorage.createDateFromISOString(
                task.startTime,
              );
              const endDate = ProgressStorage.createDateFromISOString(
                task.endTime,
              );
              const hours = (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60);
              totalHours += hours;
            }
          }
        }
      }

      if (totalHours > 0) {
        progressData.statistics.averagePointsPerHour = earnedPoints /
          totalHours;
      }
    }

    this.storage.setProgressData(progressData);
    this.storage.save();

    this.events.emit(ProgressEventType.PROGRESS_UPDATED, {
      type: ProgressEventType.PROGRESS_UPDATED,
      progressData,
    });
  }

  /**
   * 進捗データを取得
   * @returns 進捗データ
   */
  getProgressData(): ProgressData {
    return this.storage.getProgressData();
  }

  /**
   * プロジェクトを取得
   * @param projectId プロジェクトID
   * @returns プロジェクト
   */
  getProject(projectId: string): Project | null {
    const progressData = this.storage.getProgressData();
    return progressData.projects.find((p) => p.projectId === projectId) || null;
  }

  /**
   * マイルストーンを取得
   * @param projectId プロジェクトID
   * @param milestoneId マイルストーンID
   * @returns マイルストーン
   */
  getMilestone(projectId: string, milestoneId: string): Milestone | null {
    const project = this.getProject(projectId);
    if (!project) return null;
    return (
      project.milestones.find((m) => m.milestoneId === milestoneId) || null
    );
  }

  /**
   * タスクを取得
   * @param projectId プロジェクトID
   * @param milestoneId マイルストーンID
   * @param taskId タスクID
   * @returns タスク
   */
  getTask(
    projectId: string,
    milestoneId: string,
    taskId: string,
  ): Task | null {
    const milestone = this.getMilestone(projectId, milestoneId);
    if (!milestone) return null;
    return milestone.tasks.find((t) => t.taskId === taskId) || null;
  }
}
