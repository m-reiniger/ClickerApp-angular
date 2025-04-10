import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockComponent } from 'ng-mocks';

import { DetailComponent } from './detail.component';
import { DetailViewComponent } from '@libs/detail-view';

describe('DetailComponent', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailComponent],
            declarations: [MockComponent(DetailViewComponent)],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
