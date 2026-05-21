import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GridTranslateService {
  private translateService = inject(TranslateService);

  traslateColumns(translationKeyPrefix: string, columns: any[]) {
    if (columns && Array.isArray(columns)) {
      columns.forEach(column => {
        if (column.dataField) {
          const key = `${translationKeyPrefix}.${column.dataField}`;
          const translatedText = this.translateService.instant(key);
          if (translatedText && translatedText !== key) {
            column.caption = translatedText;
          }
        }
      });
    }
  }

  // Doğru yazım için alias
  translateColumns(translationKeyPrefix: string, columns: any[]) {
    this.traslateColumns(translationKeyPrefix, columns);
  }
}
