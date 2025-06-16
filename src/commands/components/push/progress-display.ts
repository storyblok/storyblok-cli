import chalk from 'chalk';
import { konsola } from '../../../utils/konsola';

export type ProcessingEvent =
  | { type: 'start'; total: number }
  | { type: 'success'; name: string; resourceType: string; color: string }
  | { type: 'skip'; name: string; resourceType: string }
  | { type: 'error'; name: string; resourceType: string; error: unknown }
  | { type: 'complete'; summary: { updated: number; unchanged: number; failed: number } };

export class ProgressDisplay {
  public total = 0;
  private processed = 0;
  private updated = 0;
  private unchanged = 0;
  private failed = 0;
  private currentProgressLine = '';

  start(total: number) {
    this.total = total;
    this.processed = 0;
    this.updated = 0;
    this.unchanged = 0;
    this.failed = 0;
    console.log(`Processing ${total} resources...`);
    this.updateProgress();
  }

  handleEvent(event: ProcessingEvent) {
    switch (event.type) {
      case 'start':
        this.start(event.total);
        break;

      case 'success':
        this.processed++;
        this.updated++;
        this.clearProgress();
        console.log(`${chalk.green('✓')} ${this.capitalize(event.resourceType)}→ ${chalk.hex(event.color)(event.name)} - Updated`);
        this.updateProgress();
        break;

      case 'skip':
        this.processed++;
        this.unchanged++;
        this.updateProgress();
        break;

      case 'error':
        this.processed++;
        this.failed++;
        this.clearProgress();
        console.log(`${chalk.red('✗')} ${this.capitalize(event.resourceType)}→ ${chalk.red(event.name)} - Failed`);
        this.updateProgress();
        break;

      case 'complete': {
        this.clearProgress();
        const { updated, unchanged, failed } = event.summary;
        konsola.ok(`Completed: ${updated} updated, ${unchanged} unchanged, ${failed} failed`);

        // Show summary of skipped items when there are many
        if (unchanged > 5) {
          console.log(chalk.dim(`   (${unchanged} resources were already up-to-date)`));
        }
        break;
      }
    }
  }

  private updateProgress() {
    this.currentProgressLine = `[${this.processed}/${this.total}] ${this.updated} updated, ${this.unchanged} unchanged, ${this.failed} failed`;
    process.stdout.write(`\r${this.currentProgressLine}`);
  }

  clearProgress() {
    if (this.currentProgressLine) {
      process.stdout.write(`\r${' '.repeat(this.currentProgressLine.length)}\r`);
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Global display instance - single source of truth for terminal output
export const progressDisplay = new ProgressDisplay();
