import { TestBed } from '@angular/core/testing';
import { ThemeService, ThemeType } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default theme', () => {
    expect(service.currentTheme).toBe(ThemeType.default);
  });

  it('should have ThemeType enum values', () => {
    expect(ThemeType.dark).toBe('dark');
    expect(ThemeType.default).toBe('default');
    expect(ThemeType.system).toBe('auto');
  });
});
