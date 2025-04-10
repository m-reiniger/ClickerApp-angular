import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockProvider } from 'ng-mocks';

import { DetailViewComponent } from './detail-view.component';

describe('DetailViewComponent', () => {
    let component: DetailViewComponent;
    let fixture: ComponentFixture<DetailViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailViewComponent],
            providers: [MockProvider(ActivatedRoute)],
        }).compileComponents();

        fixture = TestBed.createComponent(DetailViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
