import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAuthorizationComponent } from './purchase-authorization.component';

describe('PurchaseAuthorizationComponent', () => {
  let component: PurchaseAuthorizationComponent;
  let fixture: ComponentFixture<PurchaseAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
