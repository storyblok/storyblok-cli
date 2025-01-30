import { Spinner } from '@topcli/spinner';
import chalk from 'chalk';
import { colorPalette } from '../../../constants';
import { isVitest } from '../../../utils';
import type { RegionCode } from '../../../constants';
import type { SpaceComponentInternalTag } from '../constants';
import { upsertComponentInternalTag } from './actions';

export async function handleTags(space: string, password: string, region: RegionCode, spaceData: SpaceComponentInternalTag[]) {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
  };
  await Promise.all(spaceData.map(async (tag) => {
    const consolidatedSpinner = new Spinner({
      verbose: !isVitest,
    });
    consolidatedSpinner.start('Upserting tags...');
    try {
      await upsertComponentInternalTag(space, tag, password, region);
      consolidatedSpinner.succeed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Completed in ${consolidatedSpinner.elapsedTime.toFixed(2)}ms`);
    }
    catch (error) {
      consolidatedSpinner.failed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Failed`);
      results.failed.push({ name: tag.name, error });
    }
  }));
  return results;
}
