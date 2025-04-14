import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockComponent } from 'ng-mocks';

import { DetailWrapperComponent } from './detail-wrapper.component';
import { DetailViewComponent } from '@libs/detail-view';

describe('DetailWrapperComponent', () => {
    let component: DetailWrapperComponent;
    let fixture: ComponentFixture<DetailWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailWrapperComponent],
            declarations: [MockComponent(DetailViewComponent)],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DetailWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
