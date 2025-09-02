import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[] | null | undefined, searchText: string, fields?: (keyof T)[]): T[] {
    if (!items || !searchText) return items ?? [];
    const txt = searchText.toLowerCase().trim();

    // If no fields passed, fallback to stringifying (safer to pass fields)
    if (!fields || fields.length === 0) {
      return items.filter(item => JSON.stringify(item).toLowerCase().includes(txt));
    }

    return items.filter(item =>
      fields.some(field => {
        const v = (item as any)[field];
        return v !== null && v !== undefined && String(v).toLowerCase().includes(txt);
      })
    );
  }
}
