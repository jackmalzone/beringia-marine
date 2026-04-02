# Contributing to Vital Ice

Thank you for your interest in contributing to the Vital Ice website project! This guide will help you understand how to contribute effectively.

## 🤝 How to Contribute

### **Types of Contributions**

We welcome contributions in the following areas:

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests with code changes
- **Documentation**: Improve or add to our documentation
- **Design**: Provide design feedback or improvements
- **Testing**: Help test features and report issues

### **Before You Start**

1. **Read the Documentation**: Familiarize yourself with the project structure and guidelines
2. **Check Existing Issues**: Look for existing issues or discussions
3. **Follow the Code Style**: Ensure your code follows our standards
4. **Test Your Changes**: Make sure your changes work as expected

## 🚀 Getting Started

### **Development Setup**

1. **Fork the Repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/vital-ice.git
   cd vital-ice
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Add your environment variables
   # See docs/deployment/ENVIRONMENT.md for details
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Run Quality Checks**
   ```bash
   npm run lint
   npm run type-check
   npm run format:check
   ```

### **Project Structure**

```
vital-ice/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and data
│   └── types/           # TypeScript definitions
├── docs/                # Documentation
├── public/              # Static assets
└── scripts/             # Build and utility scripts
```

## 📝 Code Style Guidelines

### **TypeScript/JavaScript**

- Use TypeScript for all new code
- Prefer functional components over class components
- Use arrow functions for component definitions
- Use explicit return types for functions
- Use interfaces for component props

### **Naming Conventions**

- **PascalCase**: Components and types
- **camelCase**: Variables, functions, and methods
- **UPPER_CASE**: Constants
- **kebab-case**: File names and CSS classes

### **Component Structure**

```typescript
import { FC } from 'react';
import styles from './Component.module.css';

interface IComponentProps {
  title: string;
  onClick?: () => void;
}

export const Component: FC<IComponentProps> = ({ title, onClick }) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};
```

### **CSS/SCSS**

- Use CSS Modules for component-scoped styling
- Follow BEM naming convention within modules
- Keep selectors shallow (max 2 levels)
- Use CSS variables for theming

```css
/* Component.module.css */
.container {
  /* Base styles */
}

.container__header {
  /* Child element */
}

.container--active {
  /* Modifier */
}
```

## 🔄 Git Workflow

### **Branch Strategy**

- **main**: Production branch (protected)
- **develop**: Development branch
- **feature/description**: Feature branches
- **fix/description**: Bug fix branches
- **hotfix/description**: Critical fixes

### **Commit Messages**

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]
[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(auth): add Google OAuth login
fix(booking): resolve timezone issues
docs(readme): update installation steps
```

### **Pull Request Process**

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Write your code
   - Add tests if applicable
   - Update documentation

3. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Request review from maintainers

### **Pull Request Template**

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Local testing completed
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verified
- [ ] Performance impact assessed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors
- [ ] Accessibility standards met
```

## 🧪 Testing Guidelines

### **Testing Requirements**

- **Unit Tests**: For utility functions and hooks
- **Component Tests**: For React components
- **Integration Tests**: For page flows and user interactions
- **E2E Tests**: For critical user paths

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ComponentName.test.tsx
```

### **Test Examples**

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 📚 Documentation Guidelines

### **Documentation Standards**

- Write clear, concise documentation
- Include code examples where relevant
- Keep documentation up to date
- Use proper markdown formatting

### **Documentation Structure**

```
docs/
├── README.md              # Main documentation index
├── development/           # Development guides
├── deployment/            # Deployment documentation
├── api/                   # API documentation
├── troubleshooting/       # Bug fixes and issues
├── client/                # Client-specific documentation
└── content/               # Content and design docs
```

### **Adding Documentation**

1. **Choose the Right Location**: Place docs in appropriate directories
2. **Follow Naming Conventions**: Use kebab-case for file names
3. **Include Examples**: Provide code examples and screenshots
4. **Update Index**: Add new docs to the main README.md

## 🎨 Design Contributions

### **Design Guidelines**

- Follow the Vital Ice brand guidelines
- Maintain consistency with existing design
- Consider accessibility and usability
- Test on multiple devices and browsers

### **Design System**

- **Colors**: Use the defined color palette
- **Typography**: Follow the typography hierarchy
- **Spacing**: Use consistent spacing values
- **Animations**: Follow the animation guidelines

### **Design Review Process**

1. **Create Design Mockups**: Use Figma or similar tools
2. **Get Feedback**: Share with the team
3. **Implement Changes**: Code the approved design
4. **Test Implementation**: Verify across devices

## 🐛 Bug Reports

### **Reporting Bugs**

Use the GitHub issue template and include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, device information
- **Screenshots**: Visual evidence if applicable

### **Bug Report Template**

```markdown
## Bug Description

Brief description of the issue

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- OS: [e.g. macOS, Windows]
- Device: [e.g. Desktop, Mobile]

## Additional Information

Any other context, screenshots, or logs
```

## 💡 Feature Requests

### **Suggesting Features**

- **Clear Description**: Explain the feature clearly
- **Use Case**: Describe why it's needed
- **Implementation Ideas**: Suggest how it could be implemented
- **Priority**: Indicate the importance level

### **Feature Request Template**

```markdown
## Feature Description

Brief description of the requested feature

## Use Case

Why is this feature needed?

## Proposed Implementation

How could this be implemented?

## Priority

- [ ] High
- [ ] Medium
- [ ] Low

## Additional Information

Any other relevant details
```

## 🔒 Security

### **Security Guidelines**

- **Never commit secrets**: API keys, passwords, etc.
- **Use environment variables**: For sensitive configuration
- **Validate inputs**: Sanitize user inputs
- **Follow security best practices**: HTTPS, CSP, etc.

### **Reporting Security Issues**

- **Private Disclosure**: Report security issues privately
- **Detailed Information**: Provide detailed vulnerability information
- **Responsible Disclosure**: Allow time for fixes before public disclosure

## 📞 Getting Help

### **Communication Channels**

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Email**: For sensitive or private matters
- **Team Meetings**: For ongoing collaboration

### **Code Review Process**

1. **Submit PR**: Create pull request with changes
2. **Automated Checks**: CI/CD runs tests and checks
3. **Review Request**: Request review from maintainers
4. **Address Feedback**: Make requested changes
5. **Approval**: Get approval from maintainers
6. **Merge**: Changes merged to main branch

### **Review Guidelines**

- **Be Constructive**: Provide helpful, specific feedback
- **Focus on Code**: Review the code, not the person
- **Suggest Improvements**: Offer specific suggestions
- **Respect Time**: Be mindful of reviewers' time

## 🏆 Recognition

### **Contributor Recognition**

- **Contributors List**: Added to project contributors
- **Release Notes**: Mentioned in release notes
- **Documentation**: Credit in relevant documentation
- **Team Recognition**: Acknowledged in team communications

### **Contributor Levels**

- **First Time**: Welcome and guidance
- **Regular**: Trusted contributor status
- **Core**: Maintainer responsibilities
- **Lead**: Project leadership role

## 📋 Checklist for Contributors

### **Before Submitting**

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console errors
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Performance impact assessed
- [ ] Accessibility standards met

### **Pull Request Checklist**

- [ ] Clear description of changes
- [ ] Appropriate labels added
- [ ] Tests included/updated
- [ ] Documentation updated
- [ ] Screenshots included (if UI changes)
- [ ] Self-review completed
- [ ] Ready for review

## 🚀 Quick Start for New Contributors

1. **Fork and Clone**: Fork the repo and clone locally
2. **Setup Environment**: Install dependencies and configure environment
3. **Pick an Issue**: Choose a good first issue or bug fix
4. **Make Changes**: Implement your solution
5. **Test Thoroughly**: Ensure everything works
6. **Submit PR**: Create pull request with detailed description
7. **Get Feedback**: Respond to review comments
8. **Celebrate**: Your contribution is merged!

---

**Thank you for contributing to Vital Ice!** 🎉

Your contributions help make this project better for everyone. If you have any questions or need help getting started, don't hesitate to reach out.

**Maintained by**: Development Team  
**Last Updated**: December 2024  
**Next Review**: January 2025
