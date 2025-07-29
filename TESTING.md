# Testing Setup Guide

This project is configured with Jest and @testing-library/angular for comprehensive testing.

## Configuration Files

- `jest.config.ts` - Main Jest configuration
- `jest.preset.js` - Jest preset for Nx workspace
- `src/test-setup.ts` - Test setup for Angular and Jest DOM
- `tsconfig.spec.json` - TypeScript configuration for tests
- `project.json` - Contains the test target configuration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test File Naming

Tests should be named with `.spec.ts` or `.test.ts` extension:

- `component.spec.ts`
- `service.spec.ts`
- `utility.test.ts`

## Writing Tests

### Component Tests

For simple components without complex dependencies:

```typescript
import { render, screen } from "@testing-library/angular";
import { MyComponent } from "./my.component";

describe("MyComponent", () => {
  it("should render", async () => {
    await render(MyComponent);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

For components with dependencies, create mock components:

```typescript
import { render, screen } from "@testing-library/angular";
import { Component } from "@angular/core";
import { MyComponent } from "./my.component";

// Mock problematic dependencies
@Component({
  selector: "app-dependency",
  template: "<div>Mock Dependency</div>",
  standalone: true,
})
class MockDependencyComponent {}

describe("MyComponent", () => {
  it("should render", async () => {
    await render(MyComponent, {
      imports: [MockDependencyComponent],
    });
    expect(screen.getByText("Mock Dependency")).toBeInTheDocument();
  });
});
```

### Service Tests

```typescript
import { TestBed } from "@angular/core/testing";
import { MyService } from "./my.service";

describe("MyService", () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService],
    });
    service = TestBed.inject(MyService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
```

### Utility Function Tests

```typescript
import { myUtilityFunction } from "./my-utility";

describe("myUtilityFunction", () => {
  it("should handle valid input", () => {
    const result = myUtilityFunction("test");
    expect(result).toBe("expected result");
  });

  it("should handle edge cases", () => {
    const result = myUtilityFunction(null);
    expect(result).toBeNull();
  });
});
```

## Testing Utilities

### @testing-library/angular

- `render()` - Render components for testing
- `screen` - Query elements from the rendered component
- `fireEvent` - Simulate user interactions
- `waitFor` - Wait for async operations

### Jest DOM Matchers

- `toBeInTheDocument()` - Check if element exists
- `toHaveTextContent()` - Check element text
- `toHaveClass()` - Check CSS classes
- `toBeVisible()` - Check element visibility

## Mocking

### Mocking Components

```typescript
@Component({
  selector: "app-mock",
  template: "<div>Mock Content</div>",
  standalone: true,
})
class MockComponent {}
```

### Mocking Services

```typescript
const mockService = {
  getData: jest.fn().mockReturnValue("mock data"),
  saveData: jest.fn().mockResolvedValue(true),
};
```

### Mocking Browser APIs

```typescript
beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
    },
    writable: true,
  });
});
```

## Common Patterns

### Testing Async Operations

```typescript
it("should handle async operations", async () => {
  const { fixture } = await render(MyComponent);

  // Wait for async operations
  await waitFor(() => {
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
it("should handle button clicks", async () => {
  await render(MyComponent);

  const button = screen.getByRole("button");
  fireEvent.click(button);

  expect(screen.getByText("Clicked")).toBeInTheDocument();
});
```

### Testing Form Submissions

```typescript
it("should handle form submission", async () => {
  await render(MyComponent);

  const form = screen.getByRole("form");
  fireEvent.submit(form);

  expect(screen.getByText("Submitted")).toBeInTheDocument();
});
```

## Troubleshooting

### ng-zorro-antd Dependencies

If you encounter issues with ng-zorro-antd components:

1. Install the package: `npm install ng-zorro-antd`
2. Or mock the components in your tests
3. Or test the component class directly without rendering

### Canvas/PDF Dependencies

For components that use canvas or PDF libraries:

1. Mock the dependencies
2. Test the component logic separately from rendering
3. Use unit tests instead of integration tests

### Module Resolution

If you get module resolution errors:

1. Check the `moduleNameMapper` in `jest.config.ts`
2. Ensure all dependencies are properly installed
3. Use relative imports instead of path aliases in tests if needed
