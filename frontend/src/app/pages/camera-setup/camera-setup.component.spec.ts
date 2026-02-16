import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Mock DB calls for testing
import { FormsModule } from '@angular/forms'; // Required for testing ngModel

import { CameraSetupComponent } from './camera-setup.component';

describe('CameraSetupComponent', () => {
  let component: CameraSetupComponent;
  let fixture: ComponentFixture<CameraSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraSetupComponent ],
      imports: [ 
        HttpClientTestingModule, // Tells the test not to make real Python API calls
        FormsModule              // Tells the test how to handle our RTSP input boxes
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});