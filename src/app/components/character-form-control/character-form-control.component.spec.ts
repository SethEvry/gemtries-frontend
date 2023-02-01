import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFormControlComponent } from './character-form-control.component';

describe('CharacterFormControlComponent', () => {
  let component: CharacterFormControlComponent;
  let fixture: ComponentFixture<CharacterFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterFormControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
