/**
 * progress/storage.ts
 *
 * 目的：
 * 進捗データの永続化を担当するモジュールです。
 * 進捗データのローカルへの保存と読み込みを行います。
 *
 * 主な機能：
 * - 進捗データのJSONファイルへの保存
 * - 進捗データのJSONファイルからの読み込み
 *
 * fyi:
 * Projectさえ読めれば、あとは芋蔓式に全部読めるのでProjectだけで良い
 *
 * TODO :
 * - mermaid import/export機能が欲しいかも
 * - csv import/export機能も欲しいかも
 * - json export機能は欲しい。みんながみんな.configを読めるわけじゃないかも。
 */

import { Config } from "@/core/config.ts";
import { console } from "@/core/logger.ts";
import {
  Milestone,
  ProgressData,
  ProjectBase,
  ProjectDetails,
  Task,
} from "./types.ts";

/**
 * 進捗データの永続化クラス
 */
export class ProgressStorage {
  private config: Config;
  private progressData: ProgressData | null = null;
  private storagePath: string;

  // IDベースの高速アクセスのためのマップ
  private projectMap: Map<string, ProjectDetails> = new Map();
  private milestoneMap: Map<string, Milestone> = new Map();
  private taskMap: Map<string, Task> = new Map();

  constructor(config: Config) {
    this.config = config;
    this.storagePath = `${
      Deno.env.get("HOME")
    }/.config/panopticon/progress.json`;
    // TODO : 一旦ここにでもいいけど、Backupは何かしら欲しいかもね。
    // TODO : リモートでも保存できるようにしたい
  }

  /**
   * 進捗データを読み込む
   * @returns 読み込んだ進捗データ
   */
  async load(): Promise<ProgressData> {
    try {
      // ファイルが存在するか確認
      try {
        await Deno.stat(this.storagePath);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // ファイルが存在しない場合は、空の進捗データを作成して保存
          this.progressData = this.createEmptyProgressData();
          await this.save();
          return this.progressData;
        }
        throw error;
      }

      // ファイルを読み込む
      const rawData = await Deno.readTextFile(this.storagePath);
      const loadedData = JSON.parse(rawData) as ProgressData;

      this.progressData = loadedData;

      // マップを初期化
      this.initializeMaps();

      return this.progressData;
    } catch (error) {
      console.error("進捗データの読み込みに失敗しました:", error);
      // エラーが発生した場合は、空の進捗データを作成
      this.progressData = this.createEmptyProgressData();
      return this.progressData;
    }
  }

  /**
   * マップを初期化
   */
  private initializeMaps(): void {
    this.projectMap.clear();
    this.milestoneMap.clear();
    this.taskMap.clear();

    if (!this.progressData) return;

    // プロジェクトマップを構築
    for (const projectId of this.progressData.projectIds) {
      const project = this.getProjectById(projectId);
      if (project) {
        this.projectMap.set(projectId, project);

        // マイルストーンマップを構築
        for (const milestoneId of project.milestoneIds) {
          const milestone = this.getMilestoneById(milestoneId);
          if (milestone) {
            this.milestoneMap.set(milestoneId, milestone);

            // タスクマップを構築
            for (const task of milestone.tasks) {
              this.taskMap.set(task.taskId, task);
            }
          }
        }
      }
    }
  }

  /**
   * 進捗データを保存する
   */
  async save(): Promise<void> {
    if (!this.progressData) {
      return;
    }

    try {
      // 保存ディレクトリが存在するか確認し、存在しない場合は作成
      const storageDir = this.storagePath.substring(
        0,
        this.storagePath.lastIndexOf("/"),
      );
      try {
        await Deno.stat(storageDir);
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          await Deno.mkdir(storageDir, { recursive: true });
        } else {
          throw error;
        }
      }

      // 進捗データをJSONとして保存
      await Deno.writeTextFile(
        this.storagePath,
        JSON.stringify(this.progressData, null, 2),
      );
    } catch (error) {
      console.error("進捗データの保存に失敗しました:", error);
    }
  }

  /**
   * 進捗データを取得する
   * @returns 進捗データ
   */
  getProgressData(): ProgressData {
    if (!this.progressData) {
      this.progressData = this.createEmptyProgressData();
      this.initializeMaps();
    }
    return this.progressData;
  }

  /**
   * 進捗データを設定する
   * @param progressData 進捗データ
   */
  setProgressData(progressData: ProgressData): void {
    this.progressData = progressData;
    this.initializeMaps();
  }

  /**
   * プロジェクトを追加する
   * @param project プロジェクト
   */
  addProject(project: ProjectDetails): void {
    if (!this.progressData) {
      this.progressData = this.createEmptyProgressData();
    }

    // プロジェクトマップに追加
    this.projectMap.set(project.projectId, project);

    // プロジェクト基本情報をリストに追加
    const projectBase: ProjectBase = {
      projectId: project.projectId,
      projectStatus: project.projectStatus,
      title: project.title,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
    this.progressData.projects.push(projectBase);

    // プロジェクトIDリストに追加（存在しない場合のみ）
    // TODO : ここ、addProjectはそもそも新規追加以外に呼び出されることはないはずだから
    // 存在しない場合のみ追加というより、存在していてはいけないと思われる。console.errorを吐く必要あるかも？
    if (!this.progressData.projectIds.includes(project.projectId)) {
      this.progressData.projectIds.push(project.projectId);
    }
  }

  /**
   * プロジェクトを更新する
   * @param project プロジェクト
   */
  updateProject(project: ProjectDetails): void {
    if (!this.progressData) {
      return;
    }

    // プロジェクトマップを更新
    this.projectMap.set(project.projectId, project);

    // プロジェクト基本情報を更新
    // FIXME : projects.findIndexで探すのは明らかに設計的に絶対おかしい。ここは議論しましょう。
    const index = this.progressData.projects.findIndex((p) =>
      p.projectId === project.projectId
    );
    if (index !== -1) {
      const projectBase: ProjectBase = {
        projectId: project.projectId,
        projectStatus: project.projectStatus,
        title: project.title,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
      this.progressData.projects[index] = projectBase;
    }
  }

  /**
   * プロジェクトを削除する
   * @param projectId プロジェクトID
   */
  deleteProject(projectId: string): void {
    if (!this.progressData) {
      return;
    }

    // プロジェクトを取得
    const project = this.getProjectById(projectId);
    if (project) {
      // プロジェクトのマイルストーンを削除
      for (const milestoneId of project.milestoneIds) {
        const milestone = this.getMilestoneById(milestoneId);
        if (milestone) {
          // マイルストーンのタスクを削除
          for (const task of milestone.tasks) {
            this.taskMap.delete(task.taskId);
          }
          this.milestoneMap.delete(milestoneId);
        }
      }
    }

    // プロジェクトマップから削除
    this.projectMap.delete(projectId);

    // プロジェクトIDリストから削除
    this.progressData.projectIds = this.progressData.projectIds.filter(
      (id) => id !== projectId,
    );
  }

  /**
   * マイルストーンを追加する
   * @param milestone マイルストーン
   */
  addMilestone(milestone: Milestone): void {
    this.milestoneMap.set(milestone.milestoneId, milestone);
  }

  /**
   * マイルストーンを更新する
   * @param milestone マイルストーン
   */
  updateMilestone(milestone: Milestone): void {
    this.milestoneMap.set(milestone.milestoneId, milestone);
  }

  /**
   * プロジェクトIDからプロジェクトを取得
   * @param projectId プロジェクトID
   * @returns プロジェクト
   */
  getProjectById(projectId: string): ProjectDetails | undefined {
    return this.projectMap.get(projectId);
  }

  /**
   * マイルストーンIDからマイルストーンを取得
   * @param milestoneId マイルストーンID
   * @returns マイルストーン
   */
  getMilestoneById(milestoneId: string): Milestone | undefined {
    return this.milestoneMap.get(milestoneId);
  }

  /**
   * タスクIDからタスクを取得
   * @param taskId タスクID
   * @returns タスク
   */
  getTaskById(taskId: string): Task | undefined {
    return this.taskMap.get(taskId);
  }

  /**
   * 空の進捗データを作成する
   * @returns 空の進捗データ
   */
  private createEmptyProgressData(): ProgressData {
    return {
      projects: [],
      projectIds: [],
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        totalPoints: 0,
        earnedPoints: 0,
        averagePointsPerHour: this.config.get("progress").pointsPerHour,
      },
    };
  }

  /**
   * 現在時刻のISO形式文字列を取得する
   * @returns ISO形式の日付文字列
   */
  static getCurrentISOString(): string {
    return new Date().toISOString();
  }

  /**
   * ISO形式の日付文字列からDateオブジェクトを作成する
   * @param isoString ISO形式の日付文字列
   * @returns Dateオブジェクト
   */
  static createDateFromISOString(isoString: string): Date {
    return new Date(isoString);
  }
}
