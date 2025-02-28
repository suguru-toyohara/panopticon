/**
 * progress/chart.ts
 *
 * 目的：
 * mermaid形式の工程表（フローチャート）を生成するための機能を提供します。
 * プロジェクト、マイルストーン、タスクの関係を有向非巡回グラフ（DAG）として
 * 視覚化します。
 *
 * 主な機能：
 * - mermaid形式のフローチャート生成
 * - プロジェクト、マイルストーン、タスクの依存関係の視覚化
 */

import { Milestone, Project, Status, Task } from "./types.ts";

/**
 * チャートジェネレータークラス
 * mermaid形式のチャートを生成する
 */
export class ChartGenerator {
  /**
   * プロジェクトのフローチャートを生成
   * @param project プロジェクト
   * @returns mermaid形式のフローチャート文字列
   */
  generateProjectFlowchart(project: Project): string {
    let mermaid = "```mermaid\nflowchart TD\n";

    // プロジェクトノードを追加
    const projectNodeId = `p_${project.projectId}`;
    mermaid += `  ${projectNodeId}["${project.title}"]\n`;

    // マイルストーンノードを追加
    for (const milestone of project.milestones) {
      const milestoneNodeId = `m_${milestone.milestoneId}`;
      const style = this.getMilestoneNodeStyle(milestone);
      mermaid += `  ${milestoneNodeId}["${milestone.title}"${style}]\n`;

      // プロジェクトとマイルストーンの関係
      mermaid += `  ${projectNodeId} --> ${milestoneNodeId}\n`;

      // マイルストーン間の依存関係
      if (
        milestone.dependencyMilestone &&
        milestone.dependencyMilestone.length > 0
      ) {
        for (const depMilestone of milestone.dependencyMilestone) {
          const depMilestoneNodeId = `m_${depMilestone.milestoneId}`;
          mermaid += `  ${depMilestoneNodeId} --> ${milestoneNodeId}\n`;
        }
      }

      // タスクノードを追加
      for (const task of milestone.tasks) {
        const taskNodeId = `t_${task.taskId}`;
        const style = this.getTaskNodeStyle(task);
        mermaid += `  ${taskNodeId}["${task.title}"${style}]\n`;

        // マイルストーンとタスクの関係
        mermaid += `  ${milestoneNodeId} --> ${taskNodeId}\n`;

        // タスク間の依存関係
        if (task.dependencyTask && task.dependencyTask.length > 0) {
          for (const depTask of task.dependencyTask) {
            const depTaskNodeId = `t_${depTask.taskId}`;
            mermaid += `  ${depTaskNodeId} --> ${taskNodeId}\n`;
          }
        }
      }
    }

    mermaid += "```";
    return mermaid;
  }

  /**
   * マイルストーンノードのスタイルを取得
   * @param milestone マイルストーン
   * @returns スタイル文字列
   */
  private getMilestoneNodeStyle(milestone: Milestone): string {
    switch (milestone.milestoneStatus) {
      case Status.COMPLETED:
        return ":::done";
      case Status.IN_PROGRESS:
        return ":::active";
      case Status.BLOCKED:
        return ":::blocked";
      default:
        return "";
    }
  }

  /**
   * タスクノードのスタイルを取得
   * @param task タスク
   * @returns スタイル文字列
   */
  private getTaskNodeStyle(task: Task): string {
    switch (task.status) {
      case Status.COMPLETED:
        return ":::done";
      case Status.IN_PROGRESS:
        return ":::active";
      case Status.BLOCKED:
        return ":::blocked";
      default:
        return "";
    }
  }

  /**
   * mermaidのクラス定義を生成
   * @returns クラス定義文字列
   */
  private generateClassDefs(): string {
    return `
  classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
  classDef done fill:#d4edda,stroke:#28a745,stroke-width:1px;
  classDef active fill:#cce5ff,stroke:#007bff,stroke-width:1px;
  classDef blocked fill:#f8d7da,stroke:#dc3545,stroke-width:1px;
    `;
  }
}
