import twig from 'twig';

import { FormatDocumentContent } from './printer';

export function twigInterpolateFormat(
    printFormat: FormatDocumentContent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
) {
    if (!printFormat.twig) {
        throw new Error('twig processor expect twig property in format');
    }
    let template = twig.twig({
        data: printFormat.twig,
    });
    // Render molfile if exists
    let text = template.render(data);
    return text;
}
