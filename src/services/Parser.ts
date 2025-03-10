import { Chart } from "../models/Chart.ts";

export interface Parser {
  parse(chartFile: string): Chart;
}
