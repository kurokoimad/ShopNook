import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyMembersPageComponent } from './only-members-page.component';

describe('OnlyMembersPageComponent', () => {
  let component: OnlyMembersPageComponent;
  let fixture: ComponentFixture<OnlyMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlyMembersPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
