import { AppComponent } from './app.component';
import { render } from '@testing-library/angular';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    const { fixture } = await render(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', async () => {
    expect(component).toBeTruthy();
  });

  it('should have title property', async () => {
    expect(component.title).toBe('nat-builder');
  });
});
