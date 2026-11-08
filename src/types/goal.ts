/* =========================================================
   THE SLAYLIST SUITE
   Reading Goals
   ========================================================= */

export type GoalPeriod =
  | "monthly"
  | "quarterly"
  | "annual"
  | "custom";

export type GoalMetric =
  | "books"
  | "pages"
  | "minutes";

export interface ReadingGoal {
  id: string;

  name: string;

  period: GoalPeriod;

  metric: GoalMetric;

  target: number;

  startDate: string;

  endDate: string;

  completed: boolean;

  createdAt: string;

  updatedAt: string;
}