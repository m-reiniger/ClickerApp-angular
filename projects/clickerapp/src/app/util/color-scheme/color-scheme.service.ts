import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorSchemeService {
    private readonly COLOR_SCHEME_KEY = 'color-scheme';

    public setUpColorScheme(): void {
        let colorScheme = this.detectUserPreferedColorScheme();
        if (colorScheme === undefined || colorScheme === 'system') {
            colorScheme = this.detectSystemColorScheme();
        }

        if (colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    public getUserPreferedColorScheme(): string {
        return this.detectUserPreferedColorScheme() ?? this.detectSystemColorScheme();
    }

    public saveUserPreferedColorScheme(colorScheme: 'dark' | 'light' | 'system'): void {
        localStorage.setItem(this.COLOR_SCHEME_KEY, colorScheme);
    }

    private detectUserPreferedColorScheme(): string | undefined {
        const colorScheme = localStorage.getItem(this.COLOR_SCHEME_KEY);
        if (colorScheme) {
            return colorScheme;
        }
        return undefined;
    }

    private detectSystemColorScheme(): string {
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        return colorScheme;
    }
}
