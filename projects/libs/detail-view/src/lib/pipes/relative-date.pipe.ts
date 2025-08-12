import { Pipe, PipeTransform } from '@angular/core';

import { formatRelative, FormatRelativeOptions } from 'date-fns';
import { enGB } from 'date-fns/locale';

@Pipe({
    name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
    public transform(value: Date): string {
        const options: FormatRelativeOptions = {
            locale: {
                ...enGB,
            },
        };
        return formatRelative(value, new Date(), options);
    }
}
