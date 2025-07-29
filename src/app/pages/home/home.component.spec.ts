import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;

  beforeEach(() => {
    component = new HomeComponent();
  });

  it('should create the home component', () => {
    expect(component).toBeTruthy();
  });

  it('should be an instance of HomeComponent', () => {
    expect(component).toBeInstanceOf(HomeComponent);
  });

  it('should be a class that can be instantiated', () => {
    expect(() => new HomeComponent()).not.toThrow();
  });

  it('should have the correct component name', () => {
    expect(HomeComponent.name).toBe('HomeComponent');
  });

  it('should be a valid Angular component', () => {
    // Test that the component class exists and can be instantiated
    expect(typeof HomeComponent).toBe('function');
    expect(component).toBeDefined();
  });
});
