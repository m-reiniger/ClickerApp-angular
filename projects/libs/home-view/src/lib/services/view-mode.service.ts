import { Injectable } from '@angular/core';

export type ViewMode = 'list' | 'tile';

@Injectable({
    providedIn: 'root',
})
export class ViewModeService {
    private readonly VIEW_MODE_KEY = 'view-mode';

    public getViewMode(): ViewMode {
        return this.detectUserPreferedViewMode() ?? 'list';
    }

    public saveViewMode(viewMode: ViewMode): void {
        localStorage.setItem(this.VIEW_MODE_KEY, viewMode);
    }

    private detectUserPreferedViewMode(): ViewMode | undefined {
        const viewMode = localStorage.getItem(this.VIEW_MODE_KEY);
        if (viewMode === 'list' || viewMode === 'tile') {
            return viewMode;
        }
        return undefined;
    }
}
